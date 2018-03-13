import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

import { AppStore, TelemetryAction, AppState, TopicalState, TopicInstance, TopicInstances } from './store';

interface Activity {
    type: string,
    text: string,
}

export interface TropicalProps {
    store: AppStore;
}

export const App = (props: TropicalProps) =>
    <Provider store={ props.store }>
        <Topics/>
    </Provider>;

const Instance = (props: {
    activity: Activity,
    action: TelemetryAction,
    instance: TopicInstance,
}) =>  
    <div style={{ border: 'solid', width: '250px', maxWidth: '250px' }}>
        { props.action.instance === props.instance &&
            <div>
                { props.activity.type === 'message'
                    ? <p>Message: { props.activity.text }</p> 
                    : <p>Non-Message Activity</p>
                }
                <p>Action: { props.action.type }</p>             
            </div>
        }
        <p><b>{ props.instance.topicName }</b></p>   
    </div>

const InstanceTree = (props: {
    activity: Activity,
    action: TelemetryAction,
    title: string,
    instanceTree: TopicInstance[],
}) => {
    return (
        <div style={{ float: 'left' }}>
            <h3>{ props.title }</h3>
            {
                props.instanceTree.map(instance => <Instance activity={ props.activity } action={ props.action } instance={ instance } />)
            }
        </div>
    );
}

const instanceTree = (
    root: TopicInstance,
    instances: TopicInstances,
) => {
    const instanceTree: TopicInstance[] = [];
    let instance: undefined | TopicInstance = root;
    
    do {
        instanceTree.push(instance);
        instance = instance.children.length ? instances[instance!.children[0]] : undefined;
    } while (instance);

    return instanceTree;
}

const Instances = (props: {
    activity: Activity,
    action: TelemetryAction,
    root: undefined | TopicInstance[],
    other: TopicInstance[][],
}) => 
    <div>
        <div/>
        { props.root ? <InstanceTree activity={ props.activity } action={ props.action } title="Root" instanceTree={ props.root }/> : <p>No Root yet</p>}
        { props.other.map(otherRoot => <InstanceTree activity={ props.activity } action={ props.action } title="Other" instanceTree={ otherRoot }/>) }
        <div style={{ float: 'none' }}/>
    </div>;


interface QueueProps {
    action: undefined | TelemetryAction,
    count: number,
    onNext: () => void,
} 

const Queue = (props: QueueProps) => 
    <div>
        <p>{ props.count
                ? (<span><a href="#noop" onClick={ props.onNext }>next</a> of { props.count }</span>)
                : <span>(no more actions right now)</span>
        }</p>
    </div>;

const _Topics = (
    props: TopicalState & {
        onNext: () => void,
    }
) => {
    const instanceNames = Object
        .keys(props.instances);

    const orphans = instanceNames
        .filter(instanceName => instanceNames
            .every(_instanceName => _instanceName === instanceName ||
                props.instances[_instanceName].children.indexOf(instanceName) === -1
            )
        )
        .map(orphan => props.instances[orphan]);

    const instanceTrees = orphans
        .map(orphan => instanceTree(orphan, props.instances));

    const root = instanceTrees.find(instanceTree => instanceTree[0].instanceName === props.rootInstanceName);
    const others = instanceTrees.filter(instanceTree => instanceTree !== root);

    return (
        <div>
            <Queue action={ props.action } count={ props.actions.length } onNext={ props.onNext }/>
            { root || others.length
                ? <Instances activity={ props.activity! } action={ props.action! } root={ root } other={ others }/>
                : undefined
            }
        </div>
    );
}

export const Topics = connect(
    (state: AppState) => ({
        // passed down to TopicsProps
        ... state.topical  
    }), {
        onNext: () => ({ type: 'popAction' }),
    }
)(_Topics);

