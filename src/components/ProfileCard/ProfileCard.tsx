import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Input, Form, Card, Message } from "semantic-ui-react";
import { db, storage } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { ErrorType, GlobalPropsType, PhotoType, UserType } from "../../types";
import { getBase64, validatePhoneNumber } from "../../utils";
import "./ProfileCard.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  email?: string;
  password?: string;
  error?: ErrorType;
  loading?: true | false;
  username?: string;
  favorites: Array<PhotoType>;
  all: Array<PhotoType>;
  user?: UserType;
  enableEdit: true | false;
  profileLoading?: boolean;
  profileImage?: string;
  phoneNumber?: string;
}
class ProfileCard extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      favorites: [],
      all: [],
      enableEdit: false,
      profileLoading: false,
    };
  }
  unsubscribe = () => {};

  inputRef = React.createRef();

  componentDidMount() {
    this.unsubscribe = onSnapshot(
      doc(db, "users", this.props.globalProps.user?.uid as any),
      async (querySnapshot) => {
        const photos = querySnapshot.data()?.photos as any;
        const user = querySnapshot.data()?.user as any;
        const favorites = photos?.filter((photo: PhotoType) => photo.favoured);
        this.setState((state) => ({
          ...state,
          all: photos,
          favorites,
          user,
          email: user?.email,
          username: user?.displayName,
          profileImage: user?.photoURL,
          phoneNumber: user?.phoneNumber,
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
  };
  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name, files } = e.target;
    if (name === "profile") {
      this.setState((s) => ({
        ...s,
        profileLoading: true,
      }));
      const file = files ? files[0] : null;
      if (!file) {
        return;
      }
      const _file = await getBase64(file);
      this.setState((state) => ({
        ...state,
        profileImage: _file as any,
        profileLoading: false,
      }));
    } else {
      this.setState((state) => ({
        ...state,
        [name]: value,
      }));
    }
  };

  updateProfilePicture = async () => {
    const { profileImage, user } = this.state;
    if (profileImage?.startsWith("data:image/")) {
      this.setState((s) => ({ ...s, profileLoading: true }));
      const childName = user?.uid + ".jpg";
      const uploadRef = ref(storage, `profiles/${childName}`);
      await uploadString(uploadRef, profileImage, "data_url").then(
        (snapshot) => {
          getDownloadURL(snapshot.ref)
            .then(async (url) => {
              await setDoc(
                doc(db, "users", user?.uid as any),
                {
                  user: {
                    photoURL: url,
                  },
                },
                {
                  merge: true,
                }
              );
            })
            .catch((e) => console.log(e))
            .finally(() => {
              this.setState((s) => ({ ...s, profileLoading: false }));
            });
        }
      );
    } else {
      return;
    }
  };

  updateInfo = async () => {
    const { phoneNumber, username, user } = this.state;
    this.setState((s) => ({ ...s, loading: true }));
    if (!validatePhoneNumber(phoneNumber as string)) {
      this.setState((state) => ({
        ...state,
        loading: false,
        error: {
          field: "phoneNumber",
          value: "Invalid Phone Number.",
        },
      }));
      return;
    }
    await setDoc(
      doc(db, "users", user?.uid as any),
      {
        user: {
          displayName: username,
          phoneNumber,
        },
      },
      {
        merge: true,
      }
    );

    this.setState((state) => ({
      ...state,
      error: undefined,
      loading: false,
      enableEdit: false,
    }));
  };
  render() {
    const {
      onChange,
      onSubmit,
      state: {
        error,
        email,
        loading,
        username,
        all,
        favorites,
        profileImage,
        enableEdit,
        user,
        profileLoading,
        phoneNumber,
      },
      inputRef,
      updateProfilePicture,
    } = this;
    return (
      <div className="profile__card">
        <Form className="profile__card__image" loading={profileLoading}>
          <input
            hidden
            type="file"
            accept="images/*"
            ref={inputRef as any}
            name="profile"
            onChange={onChange}
          />
          <img
            src={profileImage ? profileImage : "/profile.jpg"}
            alt="profile"
            onClick={() => {
              (inputRef.current as any).click();
            }}
          />
          {profileImage?.startsWith("data:image/") ? (
            <>
              <Button
                secondary
                fluid
                type="button"
                onClick={() => {
                  (inputRef.current as any).click();
                }}
                style={{
                  marginBottom: 5,
                }}
              >
                select
              </Button>
              <Button
                secondary
                fluid
                type="button"
                onClick={() => {
                  this.setState((state) => ({
                    ...state,
                    profileImage: user?.photoURL,
                  }));
                }}
                style={{
                  marginBottom: 5,
                }}
              >
                restore
              </Button>
              <Button
                primary
                fluid
                type="button"
                onClick={updateProfilePicture}
              >
                update
              </Button>
            </>
          ) : (
            <Button
              primary
              fluid
              type="button"
              onClick={() => {
                (inputRef.current as any).click();
              }}
            >
              select
            </Button>
          )}
        </Form>
        <Form
          loading={loading}
          onSubmit={onSubmit}
          className="profile__card__info"
        >
          <div className="profile__card__info__inputs">
            <Input
              iconPosition="left"
              type={"email"}
              placeholder="email@domain.com"
              name="email"
              value={email}
              error={error?.field === "email"}
              onChange={onChange}
              icon={<Icon name="at" />}
              className="profile__card__info__input"
              fluid
              disabled
            />
            <Input
              iconPosition="left"
              type={"text"}
              placeholder="username"
              name="username"
              value={username}
              error={error?.field === "username"}
              onChange={onChange}
              icon={<Icon name="user" />}
              className="profile__card__info__input"
              fluid
              disabled={!enableEdit}
            />
          </div>
          <div className="profile__card__info__inputs">
            <Input
              iconPosition="left"
              type={"text"}
              placeholder="phone number"
              name="phoneNumber"
              value={phoneNumber}
              error={error?.field === "phoneNumber"}
              onChange={onChange}
              icon={<Icon name="phone" />}
              className="profile__card__info__input"
              //   fluid
              disabled={!enableEdit}
            />
            <div className="profile__card__info__input"></div>
          </div>
          {error?.value && (
            <Message negative>
              <p>{error ? error.value : ""}</p>
            </Message>
          )}
          <div className="profile__card__info__buttons">
            <Button
              primary
              onClick={() => {
                this.setState((state) => ({
                  ...state,
                  enableEdit: !enableEdit,
                }));
              }}
            >
              {enableEdit ? "done" : "edit"}
            </Button>
            <Button secondary onClick={this.updateInfo}>
              update
            </Button>
          </div>
          <Card>
            <Card.Content extra>
              <Link to="/all">
                <Icon name="picture" />
                {all.length} Pictures
              </Link>
            </Card.Content>
            <Card.Content extra>
              <Link to="/favorites">
                <Icon name="heart" />
                {favorites.length} Favorites
              </Link>
            </Card.Content>
          </Card>
        </Form>
      </div>
    );
  }
}

export default withGlobalProps(ProfileCard);
