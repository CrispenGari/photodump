import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import React from "react";
import { Button, Form, Icon, Input, Message } from "semantic-ui-react";
import { auth, db, storage } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { ErrorType, GlobalPropsType, PhotoType } from "../../types";
import "./DeletePhotos.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  all: PhotoType[];
  favorite: PhotoType[];
  password: string;
  loading: boolean;
  error?: ErrorType;
  passwordForm: boolean;
}
class DeletePhotos extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      all: [],
      favorite: [],
      password: "",
      loading: false,
      passwordForm: false,
    };
  }
  unsubscribe = () => {};

  selectBtnRef = React.createRef();

  componentDidMount() {
    this.unsubscribe = onSnapshot(
      doc(db, "users", this.props.globalProps.user?.uid as any),
      async (querySnapshot) => {
        const photos = querySnapshot.data()?.photos as any;
        const favorites = photos?.filter((photo: PhotoType) => photo.favoured);
        this.setState((state) => ({
          ...state,
          all: photos,
          favorite: favorites,
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
      state: { password },
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
                    this.setState((s) => ({ ...s, loading: false }));
                  })
                  .catch((error) => {
                    this.setState((s) => ({ ...s, loading: false }));
                  });
              }
            })().then(async () => {
              await setDoc(
                doc(db, "users", user?.uid as string),
                {
                  photos: [],
                },
                {
                  merge: true,
                }
              ).then(() => {
                this.setState((s) => ({ ...s, loading: false }));
              });
            });
          } else {
            this.setState((state) => ({
              ...state,
              password: "",
              loading: false,
              error: {
                field: "password",
                value:
                  "You don't have the right to delete the photos if you are not authenticated.",
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
            "You don't have the right to delete photos if you are not authenticated.",
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
      state: { all, favorite, password, error, loading, passwordForm },
      onChange,
      onSubmit,
    } = this;
    return (
      <div className="delete__photos">
        <h1>Delete All Pictures</h1>
        <Message warning className="delete__photos__message">
          <p>
            Deleting photos is an <strong>irreversible</strong> action. By doing
            this all your <strong>{all.length}</strong> photo(s) including{" "}
            <strong>{favorite.length}</strong> favorite will be lost forever.
          </p>
        </Message>
        {passwordForm ? (
          <Form loading={loading} onSubmit={onSubmit}>
            <Input
              className={"change__email__card__form__input"}
              iconPosition="left"
              onChange={onChange}
              type={"password"}
              placeholder="current account password"
              icon={<Icon name="lock" />}
              value={password}
              name="password"
              fluid
              error={error?.field === "password"}
            />
            {error?.value && (
              <Message negative className="delete__photos__message">
                <p>{error ? error.value : ""}</p>
              </Message>
            )}{" "}
            <Button primary className="delete__photos__btn" type="submit">
              CONFIRM
            </Button>
          </Form>
        ) : (
          <Button
            onClick={() => this.setState((s) => ({ ...s, passwordForm: true }))}
            secondary
            className="delete__photos__btn"
            type="button"
          >
            DELETE ALL
          </Button>
        )}
      </div>
    );
  }
}

export default withGlobalProps(DeletePhotos);
