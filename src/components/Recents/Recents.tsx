import {
  collection,
  limit,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import React from "react";
import { db } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType, RecentType } from "../../types";
import RecentItem from "../RecentItem/RecentItem";
import "./Recents.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  recents: Array<RecentType>;
}
class Recents extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      recents: [],
    };
  }
  q = query(
    collection(db, "allPictures"),
    orderBy("timestamp", "desc"),
    limit(10),
    where("uid", "==", this.props.globalProps.user.uid)
  );

  unsubscribe = () => {};

  componentDidMount() {
    this.unsubscribe = onSnapshot(this.q, async (querySnapshot) => {
      this.setState((state) => ({
        ...state,
        recents: querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any,
      }));
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    });
  }

  componentWillUnmount() {
    return this.unsubscribe();
  }
  render() {
    const {
      state: { recents },
    } = this;

    return (
      <div className="recents">
        <h1>Recent</h1>
        <div className="recents__container">
          {recents.map((recent) => (
            <RecentItem key={recent.id} recent={recent} />
          ))}
        </div>
      </div>
    );
  }
}

export default withGlobalProps(Recents);
