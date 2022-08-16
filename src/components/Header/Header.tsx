import { signOut } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType } from "../../types";
import HeaderButton from "../HeaderButton/HeaderButton";
import "./Header.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {}
class Header extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      props: { globalProps },
    } = this;
    return (
      <div className="app__header">
        <div className="app__header__left">
          <Link to="/">Home</Link>
          <div className="">
            <HeaderButton
              iconName="home"
              title="home"
              onClick={() => {
                globalProps.navigate("/");
              }}
            />
          </div>
        </div>
        <div className="app__header__right">
          <HeaderButton
            iconName="log out"
            title="sign out"
            onClick={async () => {
              await signOut(auth);
              await globalProps.navigate("/");
            }}
          />
          <HeaderButton
            iconName="settings"
            title="settings"
            onClick={() => {}}
          />
          <HeaderButton iconName="user" title="profile" onClick={() => {}} />
        </div>
      </div>
    );
  }
}

export default withGlobalProps(Header);
