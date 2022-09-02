import { onSnapshot, doc } from "firebase/firestore";
import React from "react";
import { setAlbumPhotos } from "../../actions";
import { db } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType, PhotoType } from "../../types";
import Photo from "../Photo/Photo";

import "./Recents.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  photos: Array<PhotoType>;
}
class Recents extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      photos: [],
    };
  }
  unsubscribe = () => {};

  componentDidMount() {
    const { dispatch } = this.props.globalProps;
    this.unsubscribe = onSnapshot(
      doc(db, "users", this.props.globalProps.user?.uid as any),
      async (querySnapshot) => {
        const limit = querySnapshot.data()?.settings?.recentLimit || 10;
        const photos = querySnapshot
          .data()
          ?.photos?.filter((photo: PhotoType) => !photo.hidden)
          ?.slice(0, limit);
        dispatch(
          setAlbumPhotos({
            album: "RECENT",
            photos,
          })
        );

        this.setState((state) => ({
          ...state,
          photos,
        }));
      }
    );
  }

  componentWillUnmount() {
    return this.unsubscribe();
  }
  render() {
    const {
      state: { photos },
    } = this;
    return (
      <div className="recents">
        <h1>Recent</h1>
        <div className="recents__container">
          {photos.length > 0
            ? photos.map((photo) => <Photo key={photo.id} photo={photo} />)
            : null}
        </div>
      </div>
    );
  }
}

export default withGlobalProps(Recents);
