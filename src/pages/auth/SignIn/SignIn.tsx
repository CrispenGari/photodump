import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Form, Input, Icon, Message } from "semantic-ui-react";
import { auth } from "../../../firebase";
import { withGlobalProps } from "../../../hoc";
import { ErrorType, GlobalPropsType } from "../../../types";

import "./SignIn.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  email?: string;
  password?: string;
  error?: ErrorType;
  loading?: true | false;
}
class SignIn extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      loading: true,
    }));
    const { password, email } = this.state;
    await signInWithEmailAndPassword(
      auth,
      email ? email.trim().toLowerCase() : "",
      password ? password.trim() : ""
    )
      .then(async ({ user }) => {
        this.setState((state) => ({
          ...state,
          password: "",
          email: "",
          error: undefined,
          loading: false,
        }));
        await this.props.globalProps.navigate("/");
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          password: "",
          loading: false,
          error: {
            field: "email",
            value: "Invalid credentials.",
          },
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
      state: { loading, email, password, error },
      onChange,
      onSubmit,
    } = this;
    return (
      <div className="sign__in">
        <div className="sign__in__card">
          <div className="sign__in__card__content">
            <img alt="logo" src="/logo.png" />
            <h1>Sign In</h1>
            <p>
              If you have an account you can <strong>Sign In</strong>.
            </p>
          </div>
          <Form
            loading={loading}
            className={"sign__in__form"}
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
              className="sign__in__form__input"
              fluid
            />

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
              className="sign__in__form__input"
            />
            <div className="sign__in__forgot__password">
              <Link to={"/auth/reset-password"}>Forgot Password?</Link>
            </div>
            {error?.value && (
              <Message negative>
                <p>{error ? error.value : ""}</p>
              </Message>
            )}
            <Button color="green" fluid>
              Sign In
            </Button>
          </Form>
          <p>
            If you don't an account you can{" "}
            <Link to={"/auth/sign-up"}>Sign Up</Link>.
          </p>
        </div>
      </div>
    );
  }
}

export default withGlobalProps(SignIn);
