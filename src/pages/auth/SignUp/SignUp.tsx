import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Icon,
  Input,
  Image,
  Message,
} from "semantic-ui-react";
import { auth, db } from "../../../firebase";
import { withRouter } from "../../../hoc";
import { ErrorType, RouterType } from "../../../types";
import "./SignUp.css";
interface PropsType {
  router: RouterType;
}
interface StateType {
  email?: string;
  password?: string;
  confPassword?: string;
  error?: ErrorType;
}
class SignUp extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      password: "",
      email: "",
      confPassword: "",
    };
  }

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { password, email, confPassword } = this.state;

    if (password !== confPassword) {
      this.setState((state) => ({
        ...state,
        error: {
          field: "confPassword",
          value: "The two password does not match.",
        },
      }));
      return;
    } else {
      this.setState((state) => ({
        ...state,
        error: undefined,
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
        }));
        await addDoc(collection(db, "users"), {
          ...user,
        });
        await this.props.router.navigate("/");
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          password: "",
          confPassword: "",
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
      state: { confPassword, email, password, error },
    } = this;
    console.log(this.state);
    return (
      <div className="sign__up">
        <Card className="sign__up__card">
          <Card.Content className="sign__up__card__content">
            <Image floated="right" size="mini" src="/logo512.png" />
            <Card.Header>Sign Up</Card.Header>
            <Card.Description>
              If you have an account you can <strong>Sign In</strong>
            </Card.Description>
          </Card.Content>
          <Form
            loading={false}
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

          <Card.Description>
            Already have an account you can{" "}
            <Link to={"/auth/sign-in"}>Sign In</Link>
          </Card.Description>
        </Card>
      </div>
    );
  }
}

export default withRouter(SignUp);
