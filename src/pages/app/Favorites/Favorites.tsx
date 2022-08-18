import React from "react";
import { Header } from "../../../components";
import "./Favorites.css";
interface PropsType {}
interface StateType {}
class Favorites extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    // eslint-disable-next-line
    const {} = this;
    return (
      <div className="favorites">
        <Header openModal={() => {}} />
        <div className="favorites__main">
          <h1>Favorite</h1>
        </div>
      </div>
    );
  }
}

export default Favorites;
