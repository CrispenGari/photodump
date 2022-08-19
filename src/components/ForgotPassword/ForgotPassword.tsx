import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { Form, Input, Icon, Button, Message } from "semantic-ui-react";
import { auth } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { ErrorType, GlobalPropsType } from "../../types";
import "./ForgotPassword.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  loading: boolean;
  error?: ErrorType;
  email: string;
  success: boolean;
}
class ForgotPassword extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      loading: false,
      email: "",
      success: false,
    };
  }
  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email } = this.state;
    this.setState((state) => ({
      ...state,
      loading: true,
      message: "",
      error: undefined,
      success: false,
    }));
    await sendPasswordResetEmail(auth, email.toLowerCase().trim())
      .then(() => {
        this.setState((state) => ({
          ...state,
          loading: false,
          success: true,
        }));
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          message: "",
          error: {
            field: "email",
            value: "Something went wrong, please try again.",
          },
          loading: false,
          success: false,
        }));
      });
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
      state: { loading, error, email, success },
      onChange,
    } = this;
    return (
      <div className="forgot__password__setting__card">
        <h1>Send a Forgot Password Email</h1>
        <Message success className="forgot__password__setting__message">
          {success ? (
            <p>
              The change password link was sent to <strong>{email}</strong>{" "}
              please check your emails.
            </p>
          ) : (
            <p>
              The change password link will be send to <strong>{email}</strong>.
            </p>
          )}
        </Message>

        <Form
          loading={loading}
          onSubmit={onSubmit}
          className="forgot__password__setting__card__form"
        >
          <Input
            iconPosition="left"
            type={"email"}
            placeholder="email@domain.com"
            name="email"
            value={email}
            error={error?.field === "email"}
            disabled
            onChange={onChange}
            icon={<Icon name="at" />}
            className="forgot__password__setting__card__form__input"
            fluid
          />
          {error?.value && (
            <Message negative className="forgot__password__setting__message">
              <p>{error ? error.value : ""}</p>
            </Message>
          )}{" "}
          <Button primary type="submit">
            Request Email
          </Button>
        </Form>
      </div>
    );
  }
}

export default withGlobalProps(ForgotPassword);
