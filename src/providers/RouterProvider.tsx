import React from "react";
import { BrowserRouter } from "react-router-dom";
interface PropsType {
  children: any;
}
interface StateType {}
class RouterProvider extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const { children } = this.props;
    return <BrowserRouter>{children}</BrowserRouter>;
  }
}

export default RouterProvider;
