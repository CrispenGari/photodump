import React from "react";
import { Header } from "../../../components";

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
      </div>
    );
  }
}

export default Home;
