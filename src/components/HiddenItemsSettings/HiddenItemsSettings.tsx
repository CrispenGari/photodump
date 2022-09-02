import React from "react";
import { Form, Message } from "semantic-ui-react";

import "./HiddenItemsSettings.css";
interface PropsType {}
interface StateType {
  blur: 0 | 1;
  loading: false | true;
  dontHideBlur: 0 | 1;
}
class HiddenItemsSettings extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { loading: false, dontHideBlur: 0, blur: 0 };
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
  };
  render() {
    const {
      state: { loading, dontHideBlur, blur },
      onChange,
    } = this;
    return (
      <Form
        className="hidden__item__setting"
        onSubmit={(e) => e.preventDefault()}
        loading={loading}
      >
        <h1>Hidden Photos</h1>
        <Message success className="hidden__item__message">
          <p>
            <b>Blur Hidden Photos</b> allows you to only see photos when you
            open them in the <b>Hidden</b> photos album.
          </p>
          <p>
            <b>Don't Hide Blur Instead</b> allows you to show hidden photos in
            the photos library as <b>blurred</b> photos.
          </p>
        </Message>
        <div className="hidden__item__setting__inputs">
          <label htmlFor="hidden-blur-0">
            <input
              value={blur}
              type="checkbox"
              onChange={onChange}
              name="hidden-blur-0"
            />
            Blur Hidden Photos
          </label>
          <label htmlFor="hidden-blur-1">
            <input
              type="checkbox"
              onChange={onChange}
              value={dontHideBlur}
              name="hidden-blur-1"
            />
            Don't Hide Blur Instead
          </label>
        </div>
      </Form>
    );
  }
}

export default HiddenItemsSettings;
