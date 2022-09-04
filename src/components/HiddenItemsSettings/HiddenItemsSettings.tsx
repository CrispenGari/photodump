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
  blur: string;
  loading: false | true;
  hide: string;
}
class HiddenItemsSettings extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { loading: false, hide: "hide", blur: "blur" };
  }

  unsubscribe = () => {};

  componentDidMount() {
    this.unsubscribe = onSnapshot(
      doc(db, "users", this.props.globalProps.user?.uid as any),
      async (querySnapshot) => {
        const settings = querySnapshot.data()?.settings as any;
        this.setState((state) => ({
          ...state,
          blur: settings?.blurHiddenPhotos
            ? settings?.blurHiddenPhotos
            : "blur",
          hide: settings?.dontHideBlurInstead
            ? settings?.dontHideBlurInstead
            : "hide",
        }));
      }
    );
  }

  componentWillUnmount() {
    return () => {
      this.unsubscribe();
    };
  }

  onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    this.setState((s) => ({
      ...s,
      [name]: value,
    }));

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
            <b>Automatic Blur Hidden Photos</b> allows you to only see photos
            when you open them in the <b>Hidden</b> photos album.
          </p>
          <p>
            <b>Don't Hide Blur Instead</b> allows you to show hidden photos in
            the photos library as <b>blurred</b> photos.
          </p>
        </Message>
        <div className="hidden__item__setting__inputs">
          <label>Automatic Blur Hidden Photos</label>
          <select
            name="blur"
            onChange={onChange}
            value={blur}
            className="hidden__item__setting__inputs__select"
          >
            <option value="blur">BLUR</option>
            <option value="dont-blur">DON'T BLUR</option>
          </select>
          <label>Don't Hide Blur Instead</label>
          <select
            value={hide}
            name="hide"
            onChange={onChange}
            className="hidden__item__setting__inputs__select"
          >
            <option value="hide">HIDE</option>
            <option value="show">BLUR DON'T HIDE</option>
          </select>
        </div>
        <Button primary type="submit" fluid>
          Update
        </Button>
      </Form>
    );
  }
}

export default withGlobalProps(HiddenItemsSettings);
