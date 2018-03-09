// Reducers - perform state transformations

import { Reducer, AnyAction } from 'redux';

export enum TelemetryActionType {
    assignRootTopic = "assignRootTopic",
    initBegin = "init.begin",
    initEnd = "init.end",
    onReceiveBegin = "onReceive.begin",
    onReceiveEnd = "onReceive.end",
    nextBegin = "next.begin",
    nextEnd = "next.end",
}

export interface TopicInstance {
    instanceName: string,
    topicName: string,
    children: string[],
}

interface Activity {
    type: string,
    text: string,
}

export interface TelemetryAction extends AnyAction {
    type: TelemetryActionType,
    activity: Activity,
    instance: TopicInstance,
}

type TropicalActions = TelemetryAction | {
    type: 'pushAction',
    action: TelemetryAction,
} | {
    type: 'popAction'
}

export interface TopicalState {
    actions: TelemetryAction[],
    action: undefined | TelemetryAction,
    activity: undefined | Activity,
    instances: {
        [instanceName: string]: TopicInstance,
    },
    rootInstanceName: undefined | string,
}

export const topical = (
    state: TopicalState = {
        actions: [],
        action: undefined,
        activity: undefined,
        instances: {},
        rootInstanceName: undefined,
    },
    action: TropicalActions,
): TopicalState => {
    switch (action.type) {
        case 'pushAction':
            return {
                ... state,
                actions: [ ... state.actions, action.action ],
            }
        case 'popAction':
            return state.actions.length === 0
                ? state
                : {
                    ... topical(state, state.actions[0]),
                    action: state.actions[0],
                    actions: [ ... state.actions.slice(1)],
                }
        case TelemetryActionType.assignRootTopic:
            return {
                ... state,
                activity: action.activity,
                rootInstanceName: action.instance.instanceName,
            }
        case TelemetryActionType.initBegin:
        case TelemetryActionType.initEnd:
        case TelemetryActionType.onReceiveBegin:
        case TelemetryActionType.onReceiveEnd:
        case TelemetryActionType.nextBegin:
        case TelemetryActionType.nextEnd:
            return {
                ... state,
                activity: action.activity,
                instances: {
                    ... state.instances,
                    [action.instance.instanceName]: action.instance,
                }
            }
        default:
            return state;
    }
}

// export interface TopicalState {
//     actions: TelemetryAction[];
// }

// export const topical = (
//     state = {
//         actions: []
//     } as TopicalState,
//     action: TelemetryAction,
// ) => ({
//     actions: [ action, ... state.actions ]
// })

export interface AppState {
    topical: TopicalState,
}

// Epics - chain actions together with async operations

// import { applyMiddleware } from 'redux';
// import { Epic } from 'redux-observable';
// import { Observable } from 'rxjs';

// const sendMessageEpic: Epic<TopicActions, Topic> = (action$, store) =>
//     action$.ofType(TopicActionType.initBegin, TopicActionType.initBegin)
//     .map(action => {
//         return ({ type: 'Send_Message_Try', clientActivityId } as HistoryAction);
//     });

// Now we put it all together into a store with middleware

import { Store, createStore as reduxCreateStore, combineReducers } from 'redux';
// import { combineEpics, createEpicMiddleware } from 'redux-observable';

export const createStore = () =>
    reduxCreateStore(
        combineReducers<AppState>({
            topical: topical as Reducer<TopicalState>,
        }),
        // applyMiddleware(createEpicMiddleware(combineEpics(
        // )))
    );

export type AppStore = Store<AppState>;
