import * as React from "react";
import axios from "axios";
import { DailySleepStats } from "../../types";
import { connect } from "react-redux";
import { setOuraLoggedIn, RootState } from "./reducers";
import Select from "react-select";
import _ from "lodash";

interface State {
  data?: DailySleepStats[];
  daysWindow: number;
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
    data: undefined,
    daysWindow: 1
  };

  componentDidMount = async () => {
    this.ouraAuthenticateStatus();
  };

  render() {
    console.log("Stats", this.state.data);
    const options = _.range(1, 8).map(value => ({ value, label: value }));
    console.log("opts", options);
    return (
      <>
        <img src="https://thehub-io.imgix.net/files/5a97d9eac81dbc075fdd1788/logo_upload-a809350753dff7795e80d338fcf7d7d7.jpeg" />
        <br />
        {!this.props.loggedIntoOura && <button onClick={this.loginOura}>CONNECT OURA</button>}
        {this.props.loggedIntoOura && <button onClick={this.logoutOura}>DISCONNECT OURA</button>}
        {this.props.loggedIntoOura && <button onClick={this.fetchData}>GET SOME DATA</button>}
        {this.props.loggedIntoOura && (
          <Select options={options} onChange={this.onDateInputChange} />
        )}
        {this.props.loggedIntoOura && this.state.data && this.renderStats()}
      </>
    );
  }

  private onDateInputChange = value => {
    this.setState({ daysWindow: value.value });
  };

  private ouraAuthenticateStatus = async () => {
    const res = await axios.get("/oura/loginstatus");
    const loginStatus = res.data.authenticated as boolean;
    this.props.setOuraLoggedIn(loginStatus);
  };

  private loginOura = (): Promise<void> => {
    return new Promise(resolve => {
      const authorizerUrl = "http://localhost:3000/oura/login";

      const popup = window.open(authorizerUrl, "Connect oura", "width=500,height=700")!;
      (window as any).ouraCallback = () => {
        this.ouraAuthenticateStatus();
        popup.close();
        resolve();
      };
    });
  };

  private logoutOura = (): Promise<void> => {
    return new Promise(resolve => {
      const authorizerUrl = "http://localhost:3000/oura/logout";

      const popup = window.open(authorizerUrl, "Disconnect oura", "width=500,height=700")!;
      (window as any).ouraCallback = () => {
        this.ouraAuthenticateStatus();
        popup.close();
        resolve();
      };
    });
  };

  private fetchData = async () => {
    const stats = await axios.get(`/oura/stats?days=${this.state.daysWindow}`);
    this.setState({
      data: stats.data as DailySleepStats[]
    });
  };

  private renderStats = () => {
    console.log("dates", this.state.data.map(data => data.date));
    const listItems = this.state.data
      .slice()
      .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
      .map(day => (
        <li>
          On {day.date} you slept: {day.hours} hours and {day.minutes} minutes
        </li>
      ));
    return (
      <div>
        <ul>{listItems}</ul>
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
