import React from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { BiPhotoAlbum } from "react-icons/bi";
import { ImHistory } from "react-icons/im";
import { Image } from "semantic-ui-react";
import { withGlobalProps } from "../../hoc";
import { PhotoType } from "../../types";

import { formatTimeStamp } from "../../utils";
import "./RecentItem.css";
interface PropsType {
  photo: PhotoType;
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
        photo: { id, url, timestamp, favoured },
      },
    } = this;

    return (
      <div className="recent__item">
        {favoured ? (
          <MdOutlineFavorite className="recent__item__icon" />
        ) : (
          <BiPhotoAlbum className="recent__item__icon" />
        )}
        <ImHistory className="recent__item__icon--down" />

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
