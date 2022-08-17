import React from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { Image } from "semantic-ui-react";
import { withGlobalProps } from "../../hoc";
import { RecentType } from "../../types";
import { formatTimeStamp } from "../../utils";
import "./RecentItem.css";
interface PropsType {
  recent: RecentType;
}
interface StateType {}
class RecentItem extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      props: {
        recent: { id, url, timestamp },
      },
    } = this;

    return (
      <div className="recent__item">
        <MdOutlineFavorite className="recent__item__icon" />
        <Image
          className="recent__item__image"
          src={url}
          alt={id}
          loading="lazy"
        />
        <h1>{id.substring(0, 10)}</h1>
        <p>
          uploaded: <strong>{formatTimeStamp(timestamp)}</strong>
        </p>
      </div>
    );
  }
}

export default withGlobalProps(RecentItem);
