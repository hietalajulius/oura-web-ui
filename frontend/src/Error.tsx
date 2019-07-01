import * as React from "react";

class Error extends React.PureComponent<{}> {
    render() {
        return (<>ERROR <br /><button onClick={this.onClose}>Close window</button></>)
    }

    private onClose = () => {
        window.close();
    }
}

export default Error;