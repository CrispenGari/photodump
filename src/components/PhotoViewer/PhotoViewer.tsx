import React from "react";
import "./PhotoViewer.css";
interface PropsType {}
interface StateType {}
class PhotoViewer extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    const {} = this;
    return (
      <div className="PhotoViewer">
        <h1>Hello from PhotoViewer.tsx</h1>
      </div>
    );
  }
}

export default PhotoViewer;
