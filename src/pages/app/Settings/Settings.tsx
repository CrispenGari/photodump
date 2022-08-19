import React from "react";
import {
  ChangeEmailCard,
  ChangePasswordCard,
  DeleteAccountSetting,
  Footer,
  ForgotPassword,
  Header,
  ProfileCard,
  ProfileLogoutButton,
  RecentLimitSetting,
} from "../../../components";
import { withGlobalProps } from "../../../hoc";
import { GlobalPropsType } from "../../../types";
import "./Settings.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {}
class Settings extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    // eslint-disable-next-line
    const {} = this;
    return (
      <div className="settings">
        <Header openModal={() => {}} />
        <div className="settings__main">
          <ProfileCard readonly={true} />
          <ChangeEmailCard />
          <ChangePasswordCard />
          <ForgotPassword />
          <RecentLimitSetting />
          <DeleteAccountSetting />

          <ProfileLogoutButton />
        </div>
        <Footer />
      </div>
    );
  }
}

export default withGlobalProps(Settings);
