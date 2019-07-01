import * as React from "react";

class Success extends React.PureComponent<{}> {
    render() {
        return (<>SUCCESS<br /><button onClick={this.onClose}>Close window</button></>)
    }

    private onClose = () => {
        window.close();
    }
}

export default Success;