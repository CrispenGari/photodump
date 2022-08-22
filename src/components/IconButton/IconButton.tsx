import React from "react";
import { IconType } from "react-icons";
import "./IconButton.css";
interface PropsType {
  Icon: IconType;
  title: string;
  onClick?: () => void;
  classes?: string;
  disabled?: boolean;
}
interface StateType {}
class IconButton extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      props: { title, onClick, Icon, classes, disabled },
    } = this;
    return (
      <div
        className={`icon__button ${classes} ${
          disabled ? "icon__button--disabled" : ""
        }`}
        title={title}
        onClick={() => {
          if (disabled) {
            return;
          }
          if (typeof onClick !== "undefined") onClick();
        }}
      >
        <Icon className="icon__button__icon" />
      </div>
    );
  }
}

export default IconButton;
