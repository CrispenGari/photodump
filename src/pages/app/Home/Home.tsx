import React from "react";
import { Header, Albums, Recents } from "../../../components";

import { AiOutlineCloudUpload } from "react-icons/ai";
import "./Home.css";
interface PropsType {}
interface StateType {}
class Home extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {} = this;
    return (
      <div className="home">
        <Header />
        <div className="home__button" title="upload photos">
          <AiOutlineCloudUpload className="home__button__icon" />
        </div>
        <div className="home__main">
          <Albums />
          <Recents />
        </div>
      </div>
    );
  }
}

export default Home;
