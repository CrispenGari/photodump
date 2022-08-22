import React from "react";
import {
  Header,
  Albums,
  Recents,
  UploadForm,
  Footer,
  PhotoViewer,
} from "../../../components";
import { withGlobalProps } from "../../../hoc";
import { GlobalPropsType } from "../../../types";
import "./Home.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
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
    const {
      state,
      toggleModal,
      props: {
        globalProps: { album },
      },
    } = this;
    console.log(album);
    return (
      <div className="home">
        <Header openModal={() => toggleModal(true)} />
        {state.openModal && <UploadForm closeForm={() => toggleModal(false)} />}
        {album.current && <PhotoViewer />}
        <div className="home__main">
          <Albums />
          <Recents />
        </div>
        <Footer />
      </div>
    );
  }
}

export default withGlobalProps(Home);
