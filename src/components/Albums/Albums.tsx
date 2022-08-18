import React from "react";
import { Album } from "../../components";
import { MdOutlineFavorite } from "react-icons/md";
import { IoMdPhotos } from "react-icons/io";
import "./Albums.css";
import { PhotoType, GlobalPropsType } from "../../types";
import { onSnapshot, doc } from "firebase/firestore";

import { db } from "../../firebase";
import { withGlobalProps } from "../../hoc";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  favorites: Array<PhotoType>;
  all: Array<PhotoType>;
}
class Albums extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      favorites: [],
      all: [],
    };
  }

  unsubscribe = () => {};

  componentDidMount() {
    this.unsubscribe = onSnapshot(
      doc(db, "users", this.props.globalProps.user?.uid as any),
      async (querySnapshot) => {
        const photos = querySnapshot.data()?.photos as any;
        const favorites = photos?.filter((photo: PhotoType) => photo.favoured);
        this.setState((state) => ({
          ...state,
          all: photos,
          favorites,
        }));
      }
    );
  }

  componentWillUnmount() {
    return () => {
      this.unsubscribe();
    };
  }
  render() {
    const {
      state: { favorites, all },
      props: {
        globalProps: { navigate },
      },
    } = this;

    return (
      <div className="albums">
        <h1>Albums</h1>
        <div className="albums__container">
          <Album
            Icon={IoMdPhotos}
            onClick={() => navigate("/all")}
            itemsCount={all.length}
            title="All Photos"
            coverUrl={all.length === 0 ? "/1.jpg" : all[0].url}
          />
          <Album
            Icon={MdOutlineFavorite}
            onClick={() => navigate("/favorites")}
            itemsCount={favorites.length}
            title="Favorites"
            coverUrl={favorites.length === 0 ? "/1.jpg" : favorites[0].url}
          />
        </div>
      </div>
    );
  }
}

export default withGlobalProps(Albums);
