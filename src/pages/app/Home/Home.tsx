import React from "react";
import { Header, Albums, Recents, UploadForm } from "../../../components";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "./Home.css";
interface PropsType {}
interface StateType {
  openModal: true | false;
}
class Home extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      openModal: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(value: boolean) {
    this.setState((state) => ({
      ...state,
      openModal: value,
    }));
  }

  render() {
    const { state, toggleModal } = this;
    return (
      <div className="home">
        <Header />
        {state.openModal && <UploadForm closeForm={() => toggleModal(false)} />}
        <div
          className="home__button"
          title="upload photos"
          onClick={() => toggleModal(true)}
        >
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
