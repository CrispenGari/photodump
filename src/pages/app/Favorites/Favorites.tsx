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
}
class Favorites extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { favorites: [] };
  }

  unsubscribe = () => {};

  componentDidMount() {
    const { user } = this.props.globalProps;
    this.unsubscribe = onSnapshot(
      doc(db, "users", user?.uid as any),
      async (querySnapshot) => {
        const photos = querySnapshot.data()?.photos as any;
        const favorites = photos?.filter((photo: PhotoType) => photo.favoured);
        this.setState((state) => ({
          ...state,
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
      state: { favorites },
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
              .filter((p) => !p.hidden)
              .map((photo) => (
                <Photo key={photo.id} photo={photo} />
              ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withGlobalProps(Favorites);
