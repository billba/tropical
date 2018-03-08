import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

import { AppStore, TelemetryAction, AppState } from './store';

export interface TropicalProps {
    store: AppStore;
}

export const App = (props: TropicalProps) =>
    <Provider store={ props.store }>
        <Topics/>
    </Provider>

export interface TopicsProps {
    actions: TelemetryAction[]
}

const _Topics = (props: TopicsProps) =>
    <div>{
        props.actions.map(action => <p>{ action.type }</p>)
    }</div>


export const Topics = connect(
    (state: AppState) => ({
        // passed down to TopicsProps
        actions: state.topical.actions
    })
)(_Topics);
