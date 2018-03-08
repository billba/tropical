// Reducers - perform state transformations

import { Reducer, AnyAction } from 'redux';

export enum TopicActionType {
    initBegin = "init.begin",
    initEnd = "init.end",
}

interface TopicInstance {
    instanceName: string,
    parentInstanceName: string,
    className: string,
    topicName: string,
    children: string[],
}

interface Activity {
    type: string,
    text: string,
}

export interface TelemetryAction extends AnyAction {
    type: TopicActionType,
    activity: Activity,
    instance: TopicInstance,
}

// export interface TopicalState {
//     instances: {
//         [instanceName: string]: TopicInstance;
//     },
//     rootInstanceName: undefined | string;
// }

// export const topical = (
//     state = {
//         instances: {},
//         rootInstanceName: undefined,
//     },
//     action: TelemetryAction,
// ) => {
//     switch (action.type) {
//         default:
//             return {
//                 instances: {},
//                 rootInstanceName: undefined,
//             }
//     }
// }

export interface TopicalState {
    actions: TelemetryAction[];
}

export const topical = (
    state = {
        actions: []
    } as TopicalState,
    action: TelemetryAction,
) => ({
    actions: [ action, ... state.actions ]
})

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
