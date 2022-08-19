import React from "react";
import {
  Footer,
  Header,
  ProfileCard,
  ProfileLogoutButton,
} from "../../../components";
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
        <Header openModal={() => {}} />
        <div className="profile__main">
          <ProfileCard readonly={false} />
          <ProfileLogoutButton />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Profile;
