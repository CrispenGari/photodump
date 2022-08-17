import React from "react";
import { Header } from "../../../components";
import "./Profile.css";
interface PropsType {}
interface StateType {}
class Profile extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    // eslint-disable-next-line
    const {} = this;
    return (
      <div className="profile">
        <div className="profile__main">
          <Header openModal={() => {}} />
        </div>
      </div>
    );
  }
}

export default Profile;
