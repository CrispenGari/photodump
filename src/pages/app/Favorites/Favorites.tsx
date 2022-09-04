import { onSnapshot, doc } from "firebase/firestore";
import React from "react";
import { Link } from "react-router-dom";
import { Footer, Header, Photo, PhotoViewer } from "../../../components";
import { db } from "../../../firebase";
import { withGlobalProps } from "../../../hoc";
import { GlobalPropsType, PhotoType } from "../../../types";
import "./Favorites.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  favorites: Array<PhotoType>;
  dontHideBlurInstead: boolean;
}
class Favorites extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { favorites: [], dontHideBlurInstead: false };
  }

  unsubscribe = () => {};

  componentDidMount() {
    const { user } = this.props.globalProps;
    this.unsubscribe = onSnapshot(
      doc(db, "users", user?.uid as any),
      async (querySnapshot) => {
        const photos = querySnapshot.data()?.photos as any;
        const favorites = photos?.filter((photo: PhotoType) => photo.favoured);
        const settings = querySnapshot.data()?.settings as any;
        this.setState((state) => ({
          ...state,
          favorites,
          dontHideBlurInstead: settings?.dontHideBlurInstead === "hide",
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
      state: { favorites, dontHideBlurInstead },
      props: {
        globalProps: { album },
      },
    } = this;
    return (
      <div className="favorites">
        <Header openModal={() => {}} />
        {album.current && <PhotoViewer />}
        <div className="favorites__main">
          <h1>
            <span>Favorites</span>
            <span>
              <strong>{favorites.length}</strong> picture(s)
            </span>
            <Link to={"/hidden"}>
              <strong>{favorites.filter((p) => p.hidden).length}</strong> hidden
            </Link>
          </h1>
          <div className="favorites__main__photos">
            {favorites
              .filter((p) => {
                if (dontHideBlurInstead) return !p.hidden;
                else return p;
              })
              .map((photo) => (
                <Photo key={photo.id} photo={photo} blur={photo?.hidden} />
              ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withGlobalProps(Favorites);
