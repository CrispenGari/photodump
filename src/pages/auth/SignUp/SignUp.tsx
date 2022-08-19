import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Form, Icon, Input, Message } from "semantic-ui-react";
import { auth, db } from "../../../firebase";
import { withGlobalProps } from "../../../hoc";
import { ErrorType, GlobalPropsType } from "../../../types";
import { pick } from "lodash";
import "./SignUp.css";
import { AuthFooter } from "../../../components";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  email?: string;
  password?: string;
  confPassword?: string;
  error?: ErrorType;
  loading: boolean;
}
class SignUp extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      password: "",
      email: "",
      confPassword: "",
      loading: false,
    };
  }

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { password, email, confPassword } = this.state;

    this.setState((state) => ({
      ...state,
      loading: true,
    }));
    if (password !== confPassword) {
      this.setState((state) => ({
        ...state,
        error: {
          field: "confPassword",
          value: "The two password does not match.",
        },
        loading: false,
      }));
      return;
    } else {
      this.setState((state) => ({
        ...state,
        error: undefined,
        loading: false,
      }));
    }

    await createUserWithEmailAndPassword(
      auth,
      email ? email.trim().toLowerCase() : "",
      password ? password.trim() : ""
    )
      .then(async ({ user }) => {
        this.setState((state) => ({
          ...state,
          password: "",
          email: "",
          confPassword: "",
          error: undefined,
          loading: false,
        }));
        const _user = pick(user, [
          "displayName",
          "email",
          "phoneNumber",
          "emailVerified",
          "photoURL",
          "uid",
        ]);
        await setDoc(
          doc(db, "users", _user.uid),
          {
            user: _user,
            photos: [],
            settings: {
              recentLimit: 10,
            },
          },
          {
            merge: true,
          }
        )
          .then(() => {
            this.props.globalProps.navigate("/");
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          password: "",
          confPassword: "",
          loading: false,
          error: {
            field: (error.message as string).includes("email")
              ? "email"
              : "password",
            value: (error.message as string).includes("email")
              ? "The email address is invalid or it has already been taken."
              : "The password must contain at least 6 characters.",
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
      onChange,
      onSubmit,
      state: { confPassword, email, password, error, loading },
    } = this;

    return (
      <div className="sign__up">
        <div className="sign__up__wrapper">
          <div className="sign__up__card">
            <div className="sign__up__card__content">
              <img alt="logo" src="/logo.png" />
              <h1>Sign Up</h1>
              <p>
                If you have an account you can <strong>Sign In</strong>.
              </p>
            </div>
            <Form
              loading={loading}
              className={"sign__up__form"}
              onSubmit={onSubmit}
            >
              <Input
                fluid
                className={"sign__up__form__input"}
                iconPosition="left"
                type={"email"}
                onChange={onChange}
                placeholder="email@domain.com"
                icon={<Icon name="at" />}
                key={"email"}
                value={email}
                name="email"
                error={error?.field === "email"}
              />

              <Input
                className={"sign__up__form__input"}
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
                className={"sign__up__form__input"}
                iconPosition="left"
                type={"password"}
                placeholder="confirm password"
                onChange={onChange}
                icon={<Icon name="lock" />}
                value={confPassword}
                name={"confPassword"}
                fluid
                error={error?.field === "confPassword"}
              />
              {error?.value && (
                <Message negative>
                  <p>{error ? error.value : ""}</p>
                </Message>
              )}
              <Button color="green" type="submit" fluid>
                Sign Up
              </Button>
            </Form>

            <p>
              Already have an account you can{" "}
              <Link to={"/auth/sign-in"}>Sign In</Link>.
            </p>
          </div>
        </div>
        <AuthFooter />
      </div>
    );
  }
}

export default withGlobalProps(SignUp);
