import React from "react";
import { Album } from "../../components";
import { MdOutlineFavorite } from "react-icons/md";
import { IoMdPhotos } from "react-icons/io";
import "./Albums.css";
import { AllPicturesType, FavoriteType, GlobalPropsType } from "../../types";
import {
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import { db } from "../../firebase";
import { withGlobalProps } from "../../hoc";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  favorites: Array<FavoriteType>;
  all: Array<AllPicturesType>;
}
class Albums extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      favorites: [],
      all: [],
    };
  }

  allQuery = query(
    collection(db, "allPictures"),
    orderBy("timestamp", "desc"),
    where("uid", "==", this.props.globalProps.user.uid)
  );

  favoriteQuery = query(
    collection(db, "favorites"),
    orderBy("timestamp", "desc"),
    where("uid", "==", this.props.globalProps.user.uid)
  );
  unsubscribe_1 = () => {};
  unsubscribe_2 = () => {};

  componentDidMount() {
    this.unsubscribe_1 = onSnapshot(this.allQuery, async (querySnapshot) => {
      this.setState((state) => ({
        ...state,
        all: querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any,
      }));
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    });
    this.unsubscribe_2 = onSnapshot(
      this.favoriteQuery,
      async (querySnapshot) => {
        this.setState((state) => ({
          ...state,
          favorites: querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as any,
        }));
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
    );
  }

  componentWillUnmount() {
    return () => {
      this.unsubscribe_1();
      this.unsubscribe_2();
    };
  }
  render() {
    const {
      state: { favorites, all },
    } = this;

    return (
      <div className="albums">
        <h1>Albums</h1>
        <div className="albums__container">
          <Album
            Icon={IoMdPhotos}
            onClick={() => {}}
            itemsCount={all.length}
            title="All Photos"
            coverUrl={all.length === 0 ? "/1.jpg" : all[0].url}
          />
          <Album
            Icon={MdOutlineFavorite}
            onClick={() => {}}
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
