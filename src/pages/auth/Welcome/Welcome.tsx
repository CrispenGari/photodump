import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
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
        <Card className="welcome__card">
          <Card.Content className="welcome__card__content">
            <Image floated="right" size="mini" src="/logo512.png" />
            <Card.Header>Photo Dump</Card.Header>
            <Card.Meta>Crispen's Photos</Card.Meta>
            <Card.Description>
              You can see Crispen's public photos in his cloud gallery{" "}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
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
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export default withRouter(Welcome);
