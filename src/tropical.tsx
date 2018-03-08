import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface TropicalProps {

}

const Tropical = (props: TropicalProps) =>
    <div>
        Hey
    </div>;

export const tropical = (id: string, props: TropicalProps = {}) => {
    ReactDOM.render(React.createElement(Tropical, props), document.getElementById(id));
}
