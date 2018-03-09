import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

import { AppStore, TelemetryAction, AppState, TopicalState, TopicInstance } from './store';

export interface TropicalProps {
    store: AppStore;
}

export const App = (props: TropicalProps) =>
    <Provider store={ props.store }>
        <Topics/>
    </Provider>;

const Instance = (props: TopicInstance) =>  
    <div>
        <p>Topic Name: { props.topicName }</p>   
        <p>Instance Name: { props.instanceName }</p>
    </div>

const Instances = (props: TopicalState) => {
    let instanceName = props.rootInstanceName;
    if (!instanceName)
        return <p>No Root yet</p>;
    
    const instances: TopicInstance[] = [];

    do {
        console.log("an instance");
        const instance: TopicInstance = props.instances[instanceName];
        instances.push(instance);
        instanceName = instance.children.length ? instance.children[0] : undefined;
    } while (instanceName);

    console.log("instances", instances);

    return (
        <div>{
            instances.map(instance => <Instance { ... instance } />)
        }</div>
    );
}

interface QueueProps {
    action: undefined | TelemetryAction,
    count: number,
    onNext: () => void,
} 

const Queue = (props: QueueProps) => 
    <div>
        <p>Current Action { props.action ? props.action.type : "n/a" }</p>
        <p>{ props.count
                ? (<span><a href="#noop" onClick={ props.onNext }>next</a> of { props.count }</span>)
                : <span>(no more actions right now)</span>
        }</p>
    </div>;

const _Topics = (
    props: TopicalState & {
        onNext: () => void,
    }
) =>
    <div>
        <Queue action={ props.action } count={ props.actions.length } onNext={ props.onNext }/>
        <p>Message: { props.activity ? props.activity.text : 'n/a'}</p>
        <Instances { ... props }/>
    </div>;

export const Topics = connect(
    (state: AppState) => ({
        // passed down to TopicsProps
        ... state.topical  
    }), {
        onNext: () => ({ type: 'popAction' }),
    }
)(_Topics);
