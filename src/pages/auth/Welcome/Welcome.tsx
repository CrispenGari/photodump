import React from "react";
import { Button, Image } from "semantic-ui-react";
import { withRouter } from "../../../hoc";
import { RouterType } from "../../../types";
import "./Welcome.css";
interface PropsType {
  router: RouterType;
}
interface StateType {}
class Welcome extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      router: { navigate },
    } = this.props;
    return (
      <div className="welcome">
        <div className="welcome__card">
          <div className="welcome__card__content">
            <Image floated="right" size="mini" src="/logo512.png" />
            <h1>Photo Dump</h1>
            <p>Crispen's Photos</p>
            <p>You can see Crispen's public photos in his cloud gallery </p>
          </div>
          <div>
            <div className="ui two buttons">
              <Button basic color="green">
                Open
              </Button>
              <Button
                basic
                color="blue"
                onClick={() =>
                  navigate({
                    pathname: "/auth/sign-in",
                  })
                }
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Welcome);
