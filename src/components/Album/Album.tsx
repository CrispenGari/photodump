import React from "react";
import { Image } from "semantic-ui-react";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType } from "../../types";
import "./Album.css";
import { IconType } from "react-icons";
interface PropsType {
  globalProps: GlobalPropsType;
  Icon: IconType;
  title: string;
  itemsCount: number;
  onClick: () => void;
  coverUrl: string;
}
interface StateType {}
class Album extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      props: { Icon, coverUrl, itemsCount, title, onClick },
    } = this;
    return (
      <div className="album__item" title={title} onClick={onClick}>
        {title.toLowerCase() !== "hidden" && (
          <Icon className="album__item__icon" />
        )}
        {title.toLowerCase() === "hidden" ? (
          <div className="album__item__hidden">
            <Image className="album__item__cover" src={coverUrl} alt={title} />
            <Icon className="album__item__icon" />
          </div>
        ) : (
          <Image className="album__item__cover" src={coverUrl} alt={title} />
        )}

        <h1>{title}</h1>
        <p>{itemsCount} item(s)</p>
      </div>
    );
  }
}

export default withGlobalProps(Album);
