import React from "react";

import { Provider } from "react-redux";
import { legacy_createStore } from "redux";
import { rootReducers } from "../reducers";

const store = legacy_createStore(rootReducers);
interface PropsType {
  children: any;
}
interface StateType {}
class ReduxProvider extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const { children } = this.props;
    return <Provider store={store}>{children}</Provider>;
  }
}

export default ReduxProvider;
