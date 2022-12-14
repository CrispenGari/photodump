import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Icon, Message, Button } from "semantic-ui-react";
import { AuthFooter } from "../../../components";
import { auth } from "../../../firebase";
import { withGlobalProps } from "../../../hoc";
import { ErrorType, GlobalPropsType } from "../../../types";
import "./ResetPassword.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  email: string;
  loading: boolean;
  error?: ErrorType;
  message?: string;
}
class ResetPassword extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      email: "",
      loading: false,
      message: "",
    };
  }

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      loading: true,
      message: "",
      error: undefined,
    }));
    await sendPasswordResetEmail(auth, this.state.email.toLowerCase().trim())
      .then(() => {
        this.setState((state) => ({
          ...state,
          loading: false,
          email: "",
          message:
            "Your reset password link was sent to the email: " +
            this.state.email,
        }));
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          message: "",
          error: {
            field: "email",
            value: "Something went wrong, make sure that the email is valid.",
          },
          loading: false,
        }));
      });
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
      state: { email, loading, error, message },
      onSubmit,
      onChange,
    } = this;
    return (
      <div className="reset__password">
        <div className="reset__password__wrapper">
          <div className="reset__password__card">
            <div className="reset__password__card__content">
              <img alt="logo" src="/logo.png" />
              <h1>Reset Password</h1>
              <p>
                If you have an account and you{" "}
                <strong>forgot your password</strong> you can reset it via{" "}
                <strong>email</strong>. Please provide a valid{" "}
                <strong>email</strong> address for your account.
              </p>
            </div>
            <Form
              loading={loading}
              className={"reset__password__form"}
              onSubmit={onSubmit}
            >
              <Input
                iconPosition="left"
                type={"email"}
                placeholder="email@domain.com"
                name="email"
                value={email}
                error={error?.field === "email"}
                onChange={onChange}
                icon={<Icon name="at" />}
                className="reset__password__form__input"
                fluid
              />
              {message && (
                <Message color="green">
                  <p>{message}</p>
                </Message>
              )}
              {error?.value && (
                <Message negative>
                  <p>{error ? error.value : ""}</p>
                </Message>
              )}
              <Button color="green" fluid>
                Request Password Reset Email
              </Button>
            </Form>
            <p>
              Or you have remembered your password{" "}
              <Link to={"/auth/sign-in"}>Sign In</Link>.
            </p>
          </div>
        </div>
        <AuthFooter />
      </div>
    );
  }
}

export default withGlobalProps(ResetPassword);
