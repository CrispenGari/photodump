import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { Form, Input, Icon, Button, Message } from "semantic-ui-react";
import { auth, db } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { ErrorType, GlobalPropsType } from "../../types";
import "./ChangeEmailCard.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  loading: boolean;
  error?: ErrorType;
  email: string;
  success: boolean;
  password: "";
}
class ChangeEmailCard extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      loading: false,
      success: false,
      email: "",
      password: "",
    };
  }
  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      state: { email, password },
      props: {
        globalProps: { user },
      },
    } = this;

    if (auth.currentUser) {
      this.setState((s) => ({ ...s, loading: true }));
      const credentials = EmailAuthProvider.credential(
        user?.email as string,
        password.trim()
      );
      await reauthenticateWithCredential(auth.currentUser, credentials)
        .then(async () => {
          if (auth.currentUser) {
            await updateEmail(auth.currentUser, email.trim().toLowerCase())
              .then(async () => {
                await setDoc(
                  doc(db, "users", user?.uid as string),
                  {
                    user: {
                      email: email.trim().toLowerCase(),
                    },
                  },
                  {
                    merge: true,
                  }
                ).then(() => {
                  this.setState((s) => ({ ...s, loading: false }));
                  this.props.globalProps.navigate("/");
                });
              })
              .catch(() => {
                this.setState((state) => ({
                  ...state,
                  loading: false,
                  password: "",
                  error: {
                    field: "email",
                    value: `The email ${email.trim()} is invalid or it is already taken.`,
                  },
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
                  "You don't have the right to change the password if you are not authenticated.",
              },
            }));
          }
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
            "You don't have the right to change the password if you are not authenticated.",
        },
      }));
    }
  };

  componentDidMount() {
    const {
      globalProps: { user },
    } = this.props;
    this.setState((s) => ({ ...s, email: user?.email as string }));
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
      state: { loading, error, email, password },
      onChange,
      props: {
        globalProps: { user },
      },
    } = this;
    return (
      <div className="change__email__card">
        <h1>Update email</h1>

        <Message success className="change__email__message">
          <p>
            The email will be updated from <strong>{user?.email}</strong> to{" "}
            <strong>{email}</strong>.
          </p>
        </Message>

        <Form
          loading={loading}
          onSubmit={onSubmit}
          className="change__email__card__form"
        >
          <div className="change__email__card__inputs">
            <Input
              iconPosition="left"
              type={"email"}
              placeholder="email@domain.com"
              name="email"
              value={email}
              error={error?.field === "email"}
              onChange={onChange}
              icon={<Icon name="at" />}
              className="change__email__card__form__input"
              fluid
            />
            <Input
              className={"change__email__card__form__input"}
              iconPosition="left"
              onChange={onChange}
              type={"password"}
              placeholder="current password"
              icon={<Icon name="lock" />}
              value={password}
              name="password"
              fluid
              error={error?.field === "password"}
            />
          </div>
          {error?.value && (
            <Message negative className="change__email__message">
              <p>{error ? error.value : ""}</p>
            </Message>
          )}{" "}
          <Button primary type="submit">
            Change Email
          </Button>
        </Form>
      </div>
    );
  }
}

export default withGlobalProps(ChangeEmailCard);
