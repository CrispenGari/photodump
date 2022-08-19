import { signOut } from "firebase/auth";
import React from "react";
import { Button } from "semantic-ui-react";
import { auth } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType } from "../../types";
import "./ProfileLogoutButton.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {}
class ProfileLogoutButton extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      props: {
        globalProps: { navigate },
      },
    } = this;
    return (
      <div className="profile__logout__button">
        <h1>Sign Out</h1>
        <Button
          primary
          onClick={async () => {
            await signOut(auth);
            navigate("/");
          }}
        >
          SIGN OUT
        </Button>
      </div>
    );
  }
}

export default withGlobalProps(ProfileLogoutButton);
