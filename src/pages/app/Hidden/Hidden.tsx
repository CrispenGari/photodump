import { onSnapshot, doc } from "firebase/firestore";
import React from "react";
import { setOpenHiddenPhotosAuthModal } from "../../../actions";
import {
  PhotoViewer,
  Photo,
  Footer,
  Header,
  HiddenPhotosAuthModal,
} from "../../../components";
import { db } from "../../../firebase";
import { withGlobalProps } from "../../../hoc";
import { GlobalPropsType, PhotoType } from "../../../types";
import "./Hidden.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  hidden: Array<PhotoType>;
  blur: boolean;
}
class Hidden extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      hidden: [],
      blur: false,
    };
  }
  unsubscribe = () => {};

  componentDidMount() {
    const {
      globalProps: { dispatch, openHiddenPhotos },
    } = this.props;
    this.unsubscribe = onSnapshot(
      doc(db, "users", this.props.globalProps.user?.uid as any),
      async (querySnapshot) => {
        const photos = querySnapshot.data()?.photos as any;
        const settings = querySnapshot.data()?.settings as any;

        const hidden: Array<PhotoType> = photos.filter(
          (photo: PhotoType) => photo.hidden
        );
        this.setState((state) => ({
          ...state,
          hidden,
          blur: settings?.blurHiddenPhotos === "blur",
        }));
      }
    );
    dispatch(setOpenHiddenPhotosAuthModal(true));
    this.setState((s) => ({ ...s, authenticated: !openHiddenPhotos }));
  }

  componentWillUnmount() {
    return () => {
      this.unsubscribe();
    };
  }
  render() {
    const {
      state: { hidden, blur },
      props: {
        globalProps: { album, openHiddenPhotos },
      },
    } = this;

    return (
      <div className="hidden">
        <Header openModal={() => {}} />
        {openHiddenPhotos && <HiddenPhotosAuthModal />}

        {album.current && <PhotoViewer />}
        <div className="hidden__main">
          <h1>
            <span>Hidden</span>
            <span>
              <strong>{hidden.length}</strong> picture(s)
            </span>
          </h1>
          <div className="hidden__main__photos">
            {hidden.map((photo) => (
              <Photo
                key={photo?.id}
                photo={photo}
                blur={openHiddenPhotos || blur}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withGlobalProps(Hidden);
