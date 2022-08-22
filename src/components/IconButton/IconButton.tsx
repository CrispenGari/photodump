import React from "react";
import { IconType } from "react-icons";
import "./IconButton.css";
interface PropsType {
  Icon: IconType;
  title: string;
  onClick?: () => void;
}
interface StateType {}
class IconButton extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      props: { title, onClick, Icon },
    } = this;
    return (
      <div className="icon__button" title={title} onClick={onClick}>
        <Icon className="icon__button__icon" />
      </div>
    );
  }
}

export default IconButton;
