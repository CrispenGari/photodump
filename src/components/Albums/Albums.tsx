import React from "react";
import { Album } from "../../components";
import { MdOutlineFavorite } from "react-icons/md";
import { IoMdPhotos } from "react-icons/io";
import "./Albums.css";
interface PropsType {}
interface StateType {}
class Albums extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {} = this;
    return (
      <div className="albums">
        <h1>Albums</h1>
        <div className="albums__container">
          <Album
            Icon={IoMdPhotos}
            onClick={() => {}}
            itemsCount={133}
            title="All Photos"
            coverUrl="/1.jpg"
          />
          <Album
            Icon={MdOutlineFavorite}
            onClick={() => {}}
            itemsCount={10}
            title="Favorites"
            coverUrl="/1.jpg"
          />
        </div>
      </div>
    );
  }
}

export default Albums;
