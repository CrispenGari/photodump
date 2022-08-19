import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { Button, Form, Icon, Input, Message } from "semantic-ui-react";
import { auth, db, storage } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { ErrorType, GlobalPropsType, PhotoType } from "../../types";
import "./DeleteAccountSetting.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  password: string;
  loading: boolean;
  error?: ErrorType;
}
class DeleteAccountSetting extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { password: "", loading: false };
  }
  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // re-authenticate
    // delete photos
    // delete profile
    // delete user doc
    // delete the user
    const {
      state: { password },
      props: {
        globalProps: { user, navigate },
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
            const docSnap = await getDoc(doc(db, "users", user?.uid as any));
            const photos = docSnap.data()?.photos;
            const photoDeleteRefs = photos?.map(({ name }: PhotoType) =>
              ref(storage, `images/${name}`)
            );
            (async () => {
              for (let i = 0; i < photoDeleteRefs?.length; i++) {
                // Delete the file
                await deleteObject(photoDeleteRefs[i])
                  .then(() => {
                    // File deleted successfully
                    console.log("File deleted succ");
                  })
                  .catch((error) => {
                    console.log(error);
                    this.setState((s) => ({ ...s, loading: false }));
                  });
              }
            })().then(async () => {
              const profileRef = ref(storage, "profiles/" + user?.uid + ".jpg");
              await deleteObject(profileRef);
              await deleteDoc(doc(db, "users", user?.uid as any)).finally(
                async () => {
                  if (auth.currentUser) {
                    await deleteUser(auth.currentUser);
                    this.setState((s) => ({ ...s, loading: false }));
                    await signOut(auth);
                    await navigate("/");
                  }
                }
              );
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
  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((state) => ({
      ...state,
      [name]: value,
    }));
  };
  render() {
    const {
      state: { loading, error, password },
      onSubmit,
      onChange,
    } = this;
    return (
      <div className="delete__account__setting">
        <h1>Delete account</h1>
        <Message warning className="delete__account__setting__message">
          <p>
            Deleting your account is an irreversible action. By deleting your
            account you will loose all your <strong>photos</strong> and
            settings.
          </p>
        </Message>
        <Form
          loading={loading}
          onSubmit={onSubmit}
          className="delete__account__card__form"
        >
          <Input
            className={"delete__account__card__form__input"}
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
          {error?.value && (
            <Message negative className="delete__account__setting__message">
              <p>{error ? error.value : ""}</p>
            </Message>
          )}{" "}
          <Button secondary type="submit">
            Delete Account
          </Button>
        </Form>
      </div>
    );
  }
}

export default withGlobalProps(DeleteAccountSetting);
