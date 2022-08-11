import { signOut } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { withRouter } from "../../hoc";
import { RouterType } from "../../types";
import HeaderButton from "../HeaderButton/HeaderButton";
import "./Header.css";
interface PropsType {
  router: RouterType;
}
interface StateType {}
class Header extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      props: { router },
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
                router.navigate("/");
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
              await router.navigate("/");
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

export default withRouter(Header);
