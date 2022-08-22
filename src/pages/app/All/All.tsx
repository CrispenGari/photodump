import { onSnapshot, doc } from "firebase/firestore";
import React from "react";
import { Footer, Header, Photo } from "../../../components";
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
    } = this;
    return (
      <div className="all">
        <Header openModal={() => {}} />
        <div className="all__main">
          <h1>All</h1>
          <div className="all__main__photos">
            {all.map((photo) => (
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
