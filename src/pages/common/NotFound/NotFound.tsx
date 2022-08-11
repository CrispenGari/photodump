import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { withRouter } from "../../../hoc";
import { RouterType } from "../../../types";
import "./NotFound.css";
interface PropsType {
  router: RouterType;
}
interface StateType {}
class NotFound extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      props: {
        router: { location },
      },
    } = this;
    return (
      <div className="not__found">
        <div className="not__found__card">
          <h1>
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </h1>
          <p>
            Route <span>"{location.pathname}"</span> not found{" "}
          </p>
          <div className="not__found__search__path">
            <Icon name="blind" className="not__found__card__icon" />
          </div>

          <div className="not__found__navs">
            <Link to={"/"}>HOME</Link>
            <Link to={"/auth/sign-up"}>Sign Up</Link>
            <Link to={"/auth/sign-in"}>Sign In</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(NotFound);
