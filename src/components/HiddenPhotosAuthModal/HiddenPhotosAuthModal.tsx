import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Form, Icon, Input, Message } from "semantic-ui-react";
import { setOpenHiddenPhotosAuthModal } from "../../actions";
import { auth } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { ErrorType, GlobalPropsType } from "../../types";
import "./HiddenPhotosAuthModal.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  loading: boolean;
  password: string;
  error?: ErrorType;
}
class HiddenPhotosAuthModal extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { loading: false, password: "" };
  }
  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      props: {
        globalProps: { user, dispatch },
      },
      state: { password },
    } = this;
    if (auth.currentUser) {
      this.setState((s) => ({ ...s, loading: true }));
      const credentials = EmailAuthProvider.credential(
        user?.email as string,
        password.trim()
      );
      await reauthenticateWithCredential(auth.currentUser, credentials)
        .then(async () => {
          this.setState((s) => ({
            ...s,
            loading: false,
            error: undefined,
            password: "",
          }));
          dispatch(setOpenHiddenPhotosAuthModal(false));
        })
        .catch((error) => {
          this.setState((state) => ({
            ...state,
            loading: false,
            error: {
              field: "password",
              value: "The current password is incorrect.",
            },
            password: "",
          }));
        });
    } else {
      this.setState((state) => ({
        ...state,
        password: "",
        loading: false,
        error: {
          field: "password",
          value:
            "You don't have the right to open hidden photos if you are not authenticated.",
        },
      }));
    }
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.setState((state) => ({
      ...state,
      [name]: value,
    }));
  };
  render() {
    const {
      state: { loading, password, error },
      onSubmit,
      onChange,
    } = this;
    return (
      <div className="hidden__photos__auth__modal">
        <Form
          loading={loading}
          onSubmit={onSubmit}
          className="hidden__photos__auth__modal__form"
        >
          <h1>Authorization</h1>
          <p>
            In order to open your <b>Hidden Photos</b> you need to authorize
            with your current account password.
          </p>
          <Input
            iconPosition="left"
            fluid
            type={"password"}
            placeholder="password"
            icon={<Icon name="lock" />}
            name="password"
            value={password}
            error={error?.field === "password"}
            onChange={onChange}
            className="hidden__photos__auth__modal__form__input"
          />
          {error?.value && (
            <Message negative>
              <p>{error ? error.value : ""}</p>
            </Message>
          )}
          <Button color="green" fluid type="submit">
            Open
          </Button>
          <div className="hidden__photos__auth__modal__form__navs">
            <p>OR NAVIGATE</p>
            <div>
              <Link to="/">HOME</Link>
              <Link to="/all">ALL PHOTOS</Link>
              <Link to="/favorites">FAVORITES</Link>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default withGlobalProps(HiddenPhotosAuthModal);
