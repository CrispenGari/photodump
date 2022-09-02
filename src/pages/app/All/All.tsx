import { onSnapshot, doc } from "firebase/firestore";
import React from "react";
import { Link } from "react-router-dom";
import { Footer, Header, Photo, PhotoViewer } from "../../../components";
import { db } from "../../../firebase";
import { withGlobalProps } from "../../../hoc";
import { GlobalPropsType, PhotoType } from "../../../types";
import "./All.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  all: Array<PhotoType>;
}
class All extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { all: [] };
  }
  unsubscribe = () => {};

  componentDidMount() {
    this.unsubscribe = onSnapshot(
      doc(db, "users", this.props.globalProps.user?.uid as any),
      async (querySnapshot) => {
        const photos = querySnapshot.data()?.photos as any;
        this.setState((state) => ({
          ...state,
          all: photos,
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
      state: { all },
      props: {
        globalProps: { album },
      },
    } = this;
    return (
      <div className="all">
        <Header openModal={() => {}} />
        {album.current && <PhotoViewer />}
        <div className="all__main">
          <h1>
            <span>All</span>
            <span>
              <strong>{all.length}</strong> picture(s)
            </span>
            <Link to={"/hidden"}>
              <strong>{all.filter((p) => p.hidden).length}</strong> hidden
            </Link>
          </h1>
          <div className="all__main__photos">
            {all
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

export default withGlobalProps(All);
