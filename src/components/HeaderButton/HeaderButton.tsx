import React from "react";
import { Icon } from "semantic-ui-react";
import { withRouter } from "../../hoc";
import { RouterType } from "../../types";
import "./HeaderButton.css";

interface PropsType {
  iconName: string;
  router: RouterType;
  title: string;
  onClick: () => void;
}
interface StateType {}
class HeaderButton extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      props: { iconName, title, onClick },
    } = this;
    return (
      <div title={title} className="header__button" onClick={onClick}>
        <Icon name={iconName as any} className="header__button__icon" />
        <p>{title}</p>
      </div>
    );
  }
}

export default withRouter(HeaderButton);
