import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App, TropicalProps } from './App';
import { createStore } from './store';

export const store = createStore();

ReactDOM.render(
    React.createElement(App, { store }),
    document.getElementById('tropical')
);

let ws: undefined | WebSocket;

ws = new WebSocket('ws://localhost:8080/client');

ws.onopen = () => {
    console.log("client connected");
    if (ws)
        ws.onmessage = action => store.dispatch({
            type: 'pushAction',
            action: JSON.parse(action.data)
        });
}

