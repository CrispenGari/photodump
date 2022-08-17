import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType } from "../../types";
import HeaderButton from "../HeaderButton/HeaderButton";
import "./Header.css";
interface PropsType {
  globalProps: GlobalPropsType;
  openModal: () => void;
}
interface StateType {}
class Header extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      props: {
        globalProps: { navigate, location },
        openModal,
      },
    } = this;

    return (
      <div className="app__header">
        <div className="app__header__left">
          <img
            src="/logo-white.png"
            alt="logo"
            onClick={() => {
              navigate("/");
            }}
          />
          <div className="">
            <HeaderButton
              iconName="home"
              title="home"
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
        </div>
        <div className="app__header__right">
          {location.pathname === "/" ? (
            <HeaderButton
              iconName="cloud upload"
              title="upload"
              onClick={openModal}
            />
          ) : null}
          <HeaderButton
            iconName="log out"
            title="signout"
            onClick={async () => {
              await signOut(auth);
              await navigate("/");
            }}
          />
          <HeaderButton
            iconName="settings"
            title="settings"
            onClick={() => {
              navigate("/settings");
            }}
          />
          <HeaderButton
            iconName="user"
            title="profile"
            onClick={() => {
              navigate("/profile");
            }}
          />
        </div>
      </div>
    );
  }
}

export default withGlobalProps(Header);
