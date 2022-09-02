import React from "react";
import { Album } from "../../components";
import { MdOutlineFavorite } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import "./Albums.css";
import { PhotoType, GlobalPropsType } from "../../types";
import { onSnapshot, doc } from "firebase/firestore";

import { db } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { setAlbumPhotos } from "../../actions";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  favorites: Array<PhotoType>;
  all: Array<PhotoType>;
  hidden: Array<PhotoType>;
}
class Albums extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      favorites: [],
      all: [],
      hidden: [],
    };
  }

  unsubscribe = () => {};

  componentDidMount() {
    const { dispatch } = this.props.globalProps;
    this.unsubscribe = onSnapshot(
      doc(db, "users", this.props.globalProps.user?.uid as any),
      async (querySnapshot) => {
        const photos = querySnapshot.data()?.photos as any;
        const favorites = photos?.filter((photo: PhotoType) => photo.favoured);
        const hidden = photos?.filter((photo: PhotoType) => photo.hidden);
        dispatch(
          setAlbumPhotos({
            album: "ALL",
            photos,
          })
        );
        dispatch(
          setAlbumPhotos({
            album: "FAVORITES",
            photos: favorites,
          })
        );
        dispatch(
          setAlbumPhotos({
            album: "HIDDEN",
            photos: hidden,
          })
        );
        this.setState((state) => ({
          ...state,
          all: photos,
          favorites,
          hidden,
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
      state: { favorites, all, hidden },
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
          <Album
            Icon={FaRegEyeSlash}
            onClick={() => navigate("/hidden")}
            itemsCount={hidden.length}
            title="Hidden"
            coverUrl={hidden.length === 0 ? "/1.jpg" : hidden[0].url}
          />
        </div>
      </div>
    );
  }
}

export default withGlobalProps(Albums);
