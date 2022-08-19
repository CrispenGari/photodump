import React from "react";
import { Button } from "semantic-ui-react";
import { AuthFooter } from "../../../components";
import { withGlobalProps } from "../../../hoc";
import { GlobalPropsType } from "../../../types";
import "./Welcome.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {}
class Welcome extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }

  render() {
    const { globalProps } = this.props;
    return (
      <div className="welcome">
        <div className="welcome__wrapper">
          <div className="welcome__card">
            <div className="welcome__card__content">
              <img alt="logo" src="/logo.png" />
              <h1>Photo Dump</h1>
              <p>
                A <strong>free</strong> cloud storage for storing photos.
              </p>
            </div>
            <div>
              <Button
                primary
                onClick={() =>
                  globalProps.navigate({
                    pathname: "/auth/sign-in",
                  })
                }
              >
                GETTING STARTED
              </Button>
            </div>
          </div>
        </div>
        <AuthFooter />
      </div>
    );
  }
}
export default withGlobalProps(Welcome);
