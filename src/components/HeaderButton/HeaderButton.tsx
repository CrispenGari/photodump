import React from "react";
import { Icon } from "semantic-ui-react";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType } from "../../types";
import "./HeaderButton.css";

interface PropsType {
  iconName: string;
  globalProps: GlobalPropsType;
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

export default withGlobalProps(HeaderButton);
