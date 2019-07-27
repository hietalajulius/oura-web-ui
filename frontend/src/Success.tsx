import * as React from "react";

const Success: React.SFC<{}> = ({ }) => {

  const loginListener = () => {
    if (window.opener) {
      window.opener.ouraCallback();
    }
  };
  window.addEventListener("load", loginListener);
  return (<div/>)
}

export default Success;