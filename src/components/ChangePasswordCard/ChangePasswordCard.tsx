import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React from "react";
import { Form, Input, Icon, Button, Message } from "semantic-ui-react";
import { auth } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { ErrorType, GlobalPropsType } from "../../types";
import "./ChangePasswordCard.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  loading: boolean;
  error?: ErrorType;
  password: string;
  confirmPassword: string;
  success: boolean;
  currentPassword: string;
}
class ChangePasswordCard extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      loading: false,
      success: false,
      currentPassword: "",
      password: "",
      confirmPassword: "",
    };
  }
  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      state: { password, confirmPassword, currentPassword },
      props: {
        globalProps: { user },
      },
    } = this;

    if (password.trim() !== confirmPassword.trim()) {
      this.setState((state) => ({
        ...state,
        error: {
          field: "confirmPassword",
          value: "The two password does not match.",
        },
        password: "",
        confirmPassword: "",
        currentPassword: "",
      }));
      return;
    }
    if (auth.currentUser) {
      // re authenticate the user
      const credentials = EmailAuthProvider.credential(
        user?.email as string,
        currentPassword.trim()
      );
      reauthenticateWithCredential(auth.currentUser, credentials)
        .then(async () => {
          console.log(password, auth.currentUser);
          updatePassword(auth.currentUser as any, password.trim())
            .then(() => {
              console.log("Password upd");
              // await signOut(auth).finally(() => navigate("/"));
            })
            .catch((error) => {
              console.log(error);
              this.setState((state) => ({
                ...state,
                error: {
                  field: "confirmPassword",
                  value: error.message,
                },
              }));
              return;
            });
        })
        .catch((error) => {
          this.setState((state) => ({
            ...state,
            error: {
              field: "currentPassword",
              value: "The current password is incorrect.",
            },
            password: "",
            confirmPassword: "",
            currentPassword: "",
          }));
        });
    } else {
      this.setState((state) => ({
        ...state,
        error: {
          field: "confirmPassword",
          value:
            "You don't have the right to change the password if you are not authenticated.",
        },
      }));
      return;
    }
  };

  componentDidMount() {
    const {
      globalProps: { user },
    } = this.props;
    this.setState((s) => ({ ...s, email: user?.email }));
  }
  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  render() {
    const {
      onSubmit,
      state: { loading, error, password, confirmPassword, currentPassword },
      onChange,
    } = this;
    return (
      <div className="change__password__card">
        <h1>Change Password</h1>
        <Message success className="change__password__message">
          <p>
            Note that by changing your password you will be logged out so that
            you <strong>sign in</strong> with new credentials.
          </p>
        </Message>

        <Form
          loading={loading}
          onSubmit={onSubmit}
          className="change__password__card__form"
        >
          <div className="change__password__card__inputs">
            <Input
              className={"change__password__card__form__input"}
              iconPosition="left"
              onChange={onChange}
              type={"password"}
              placeholder="current password"
              icon={<Icon name="lock" />}
              value={currentPassword}
              name="currentPassword"
              fluid
              error={error?.field === "password"}
            />
          </div>
          <div className="change__password__card__inputs">
            <Input
              className={"change__password__card__form__input"}
              iconPosition="left"
              onChange={onChange}
              type={"password"}
              placeholder="password"
              icon={<Icon name="lock" />}
              value={password}
              name="password"
              fluid
              error={error?.field === "password"}
            />
            <Input
              className={"change__password__card__form__input"}
              iconPosition="left"
              type={"password"}
              placeholder="confirm password"
              onChange={onChange}
              icon={<Icon name="lock" />}
              value={confirmPassword}
              name={"confirmPassword"}
              fluid
              error={error?.field === "confirmPassword"}
            />
          </div>
          {error?.value && (
            <Message negative className="change__password__message">
              <p>{error ? error.value : ""}</p>
            </Message>
          )}{" "}
          <Button primary type="submit">
            Change Password
          </Button>
        </Form>
      </div>
    );
  }
}

export default withGlobalProps(ChangePasswordCard);
