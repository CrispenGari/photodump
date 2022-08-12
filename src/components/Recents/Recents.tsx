import React from "react";
import RecentItem from "../RecentItem/RecentItem";
import "./Recents.css";
interface PropsType {}
interface StateType {}
class Recents extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {} = this;
    return (
      <div className="recents">
        <h1>Recent</h1>
        <div className="recents__container">
          <RecentItem />
          <RecentItem />
          <RecentItem />
          <RecentItem />
          <RecentItem />
          <RecentItem />
        </div>
      </div>
    );
  }
}

export default Recents;
