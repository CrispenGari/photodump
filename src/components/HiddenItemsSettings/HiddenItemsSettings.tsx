import { doc, onSnapshot, setDoc } from "firebase/firestore";
import React from "react";
import { Button, Form, Message } from "semantic-ui-react";
import { db } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType } from "../../types";

import "./HiddenItemsSettings.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  blur: 1 | 0;
  loading: false | true;
  hide: 1 | 0;
}
class HiddenItemsSettings extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { loading: false, hide: 0, blur: 0 };
  }

  unsubscribe = () => {};

  componentDidMount() {
    this.unsubscribe = onSnapshot(
      doc(db, "users", this.props.globalProps.user?.uid as any),
      async (querySnapshot) => {
        const settings = querySnapshot.data()?.settings as any;
        console.log(settings);
        this.setState((state) => ({
          ...state,
          blur: settings?.blurHiddenPhotos ?? 0,
          hide: settings?.dontHideBlurInstead ?? 0,
        }));
      }
    );
  }

  componentWillUnmount() {
    return () => {
      this.unsubscribe();
    };
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "blur") {
      this.setState((s) => ({
        ...s,
        blur: checked ? 1 : 0,
      }));
    } else if (name === "hide") {
      this.setState((s) => ({
        ...s,
        hide: checked ? 1 : 0,
      }));
    }
    return;
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      state: { blur, hide },
      props: {
        globalProps: { user },
      },
    } = this;
    this.setState((s) => ({
      ...s,
      loading: true,
    }));
    await setDoc(
      doc(db, "users", user?.uid as string),
      {
        settings: {
          blurHiddenPhotos: blur,
          dontHideBlurInstead: hide,
        },
      },
      {
        merge: true,
      }
    )
      .then(() => {
        this.setState((s) => ({ ...s, loading: false }));
      })
      .catch(() => this.setState((s) => ({ ...s, loading: false })));
  };
  render() {
    const {
      state: { loading, blur, hide },
      onChange,
      onSubmit,
    } = this;
    return (
      <Form
        className="hidden__item__setting"
        onSubmit={onSubmit}
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
              name="blur"
              defaultChecked={!!blur}
            />
            Blur Hidden Photos
          </label>
          <label htmlFor="hide">
            <input
              type="checkbox"
              onChange={onChange}
              value={hide}
              name="hide"
              defaultChecked={!!hide}
            />
            Don't Hide Blur Instead
          </label>
        </div>
        <Button primary type="submit" fluid>
          Update
        </Button>
      </Form>
    );
  }
}

export default withGlobalProps(HiddenItemsSettings);
