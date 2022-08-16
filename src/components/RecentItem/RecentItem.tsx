import React from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { Image } from "semantic-ui-react";
import { withGlobalProps } from "../../hoc";
import "./RecentItem.css";
interface PropsType {}
interface StateType {}
class RecentItem extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {} = this;
    return (
      <div className="recent__item">
        <MdOutlineFavorite className="album__item__icon" />
        <Image className="recent__item__image" src={"/1.jpg"} />
        <h1>1.jpg</h1>
        <p>
          uploaded: <strong>12/10/2022</strong>
        </p>
      </div>
    );
  }
}

export default withGlobalProps(RecentItem);
