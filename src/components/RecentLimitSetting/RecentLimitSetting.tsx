import { doc, onSnapshot, setDoc } from "firebase/firestore";
import React from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { db } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType } from "../../types";
import "./RecentLimitSetting.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  limit: number;
  loading: false | true;
}
class RecentLimitSetting extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      limit: 10,
      loading: false,
    };
  }

  unsubscribe = () => {};

  componentDidMount() {
    this.unsubscribe = onSnapshot(
      doc(db, "users", this.props.globalProps.user?.uid as any),
      async (querySnapshot) => {
        const settings = querySnapshot.data()?.settings as any;
        this.setState((state) => ({
          ...state,
          limit: settings?.recentLimit ? settings?.recentLimit : 10,
        }));
      }
    );
  }

  componentWillUnmount() {
    return () => {
      this.unsubscribe();
    };
  }
  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      state: { limit },
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
          recentLimit: limit >= 10 ? limit : 10,
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

  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((state) => ({
      ...state,
      [name]: value,
    }));
  };
  render() {
    const {
      state: { limit, loading },
      onChange,
      onSubmit,
    } = this;
    return (
      <Form
        className="recent__limit__setting"
        onSubmit={onSubmit}
        loading={loading}
      >
        <h1>Set Recent Uploads</h1>
        <Message success className="recent__limit__message">
          <p>
            Recent uploads are the photos that shows as recent uploaded on the
            home page.
          </p>
          <p>
            The recent uploads must be at least <b>10</b> photos. Setting a
            value below <strong>10</strong> will be converted to the standard
            limit of <strong>10</strong>.{" "}
          </p>
        </Message>
        <div className="recent__limit__setting__inputs">
          <Input
            className="recent__limit__setting__input"
            type="number"
            onChange={onChange}
            value={limit}
            name="limit"
          />
          <Button primary type="submit">
            update
          </Button>
        </div>
      </Form>
    );
  }
}

export default withGlobalProps(RecentLimitSetting);
