import * as React from 'react';
import axios from "axios";
import { DailySleepStats } from "../../types";
// import { Modal } from "./OuraLoginModal";


interface State {
  loggedIntoOura: boolean;
  data?: DailySleepStats;
}

class App extends React.PureComponent<{}, State> {
  state = { loggedIntoOura: false, data: undefined }

  componentDidMount = async () => {
    const ping = await axios.get("/oura/ping");
    const status = ping.data.message;
    this.setState({ loggedIntoOura: status })
  }
  render() {
    return (<>
      <img src="https://pbs.twimg.com/profile_images/572202942992642048/5JMjszkb_400x400.png" />
      <br />
      <button onClick={this.ouraAuthenticate}>PING</button>
      {!this.state.loggedIntoOura && <button onClick={this.loginOura}>CONNECT OURA</button>}
      {this.state.loggedIntoOura && <button onClick={this.logoutOura}>DISCONNECT OURA</button>}
      {this.state.loggedIntoOura && <button onClick={this.fetchData}>GET SOME DATA</button>}
      {(this.state.loggedIntoOura && this.state.data) && this.renderStats()}
    </>)
  }

  private ouraAuthenticate = async () => {
    const ping = await axios.get("/oura/ping");
    console.log(ping.data.message);
    console.log("state", this.state);
  }

  private loginOura = () => {
    window.open("http://localhost:3000/oura/login", "OuraLogin", "width=500,height=700");
    // Fetch status from backend inetad of this
    this.setState({ loggedIntoOura: true, data: undefined })
  }

  private logoutOura = () => {
    window.open("http://localhost:3000/oura/logout", "OuraLogin", "width=500,height=700");
    // Fetch status from backend inetad of this
    this.setState({ loggedIntoOura: false, data: undefined })
  }

  private fetchData = async () => {
    const stats = await axios.get("/oura/stats");
    this.setState({ data: stats.data as DailySleepStats });
  }

  private renderStats = () => {
    return (
      <div>
        Hours: {this.state.data.hours}
        <br />
        Minutes: {this.state.data.minutes}
      </div>)

  }
}

export default App;
