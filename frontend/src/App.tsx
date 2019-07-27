import * as React from "react";
import axios from "axios";
import { DailySleepStats } from "../../types";
import { connect } from "react-redux";
import { setOuraLoggedIn, RootState } from "./reducers";

interface State {
  data?: DailySleepStats;
}

interface ReduxProps {
  loggedIntoOura: boolean;
}

interface DispatchProps {
  setOuraLoggedIn: typeof setOuraLoggedIn;
}


type Props = ReduxProps & DispatchProps;

class App extends React.PureComponent<Props, State> {
  state = {
    data: undefined
  };

  componentDidMount = async () => {
    this.ouraAuthenticateStatus()
  };

  render() {
    return (
      <>
        <img src="https://pbs.twimg.com/profile_images/572202942992642048/5JMjszkb_400x400.png" />
        <br />
        {!this.props.loggedIntoOura && <button onClick={this.loginOura}>CONNECT OURA</button>}
        {this.props.loggedIntoOura && (
          <button onClick={this.logoutOura}>DISCONNECT OURA</button>
        )}
        {this.props.loggedIntoOura && <button onClick={this.fetchData}>GET SOME DATA</button>}
        {this.props.loggedIntoOura && this.state.data && this.renderStats()}
      </>
    );
  }

  private ouraAuthenticateStatus = async () => {
    const res = await axios.get("/oura/ping");
    const loginStatus = res.data.message as boolean;
    this.props.setOuraLoggedIn(loginStatus);
  };

  private loginOura = (): Promise<void> => {
    return new Promise(resolve => {
      const authorizerUrl = "http://localhost:3000/oura/login";

      const popup = window.open(authorizerUrl, "Connect oura", "width=500,height=700")!;
      (window as any).ouraCallback = () => {
        this.ouraAuthenticateStatus()
        popup.close();
        resolve();
      }
    });
  };

  private logoutOura = (): Promise<void> => {
    return new Promise(resolve => {
      const authorizerUrl = "http://localhost:3000/oura/logout";

      const popup = window.open(authorizerUrl, "Disconnect oura", "width=500,height=700")!;
      (window as any).ouraCallback = () => {
        this.ouraAuthenticateStatus()
        popup.close();
        resolve();
      }
    });
  };

  private fetchData = async () => {
    const stats = await axios.get("/oura/stats");
    this.setState({
      data: stats.data as DailySleepStats
    });
  };

  private renderStats = () => {
    return (
      <div>
        You slept: {this.state.data.hours} hours and {this.state.data.minutes} minutes
      </div>
    );
  };
}

const mapStateToProps = (state: RootState) => ({
  loggedIntoOura: state.loggedIntoOura
});

export default connect(
  mapStateToProps,
  { setOuraLoggedIn }
)(App);
