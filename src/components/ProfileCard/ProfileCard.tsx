import { updateProfile } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { Link } from "react-router-dom";
import { Button, Icon, Input, Form, Card, Message } from "semantic-ui-react";
import { auth, db, storage } from "../../firebase";
import { withGlobalProps } from "../../hoc";
import { ErrorType, GlobalPropsType, PhotoType, UserType } from "../../types";
import { getBase64, validatePhoneNumber } from "../../utils";
import "./ProfileCard.css";
interface PropsType {
  globalProps: GlobalPropsType;
  readonly: boolean;
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

  selectBtnRef = React.createRef();

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
    await this.updateInfo();
  };
  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  handleFileChange = async (file: any) => {
    if (file) {
      this.setState((s) => ({
        ...s,
        profileLoading: true,
      }));
      const _file = await getBase64(file);
      this.setState((state) => ({
        ...state,
        profileImage: _file as any,
        profileLoading: false,
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
              if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                  photoURL: url,
                });
              }
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
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: username,
      });

      // await updatePhoneNumber(auth.currentUser, new PhoneAuthCredential(auth))
    }

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
      selectBtnRef,
      updateProfilePicture,
      handleFileChange,
      props: { readonly },
    } = this;
    return (
      <div className="profile__card">
        <Form className="profile__card__image" loading={profileLoading}>
          <img
            src={profileImage ? profileImage : "/profile.jpg"}
            alt="profile"
            onClick={() => {
              if (readonly) {
                return;
              } else {
                (selectBtnRef.current as any)?.click();
              }
            }}
          />
          {readonly ? (
            <></>
          ) : profileImage?.startsWith("data:image/") ? (
            <>
              <FileUploader
                handleChange={(files: any) => handleFileChange(files)}
                name="file"
                types={["jpeg", "png", "jpg", "webp", "gif"]}
                multiple={false}
                children={
                  <Button
                    secondary
                    fluid
                    type="button"
                    style={{
                      marginBottom: 5,
                    }}
                    ref={selectBtnRef as any}
                  >
                    re-select
                  </Button>
                }
              />
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
            <FileUploader
              handleChange={(files: any) => handleFileChange(files)}
              name="file"
              types={["jpeg", "png", "jpg", "webp", "gif"]}
              multiple={false}
              children={
                <Button
                  primary
                  fluid
                  type="button"
                  style={{
                    marginBottom: 5,
                  }}
                >
                  select
                </Button>
              }
            />
          )}
        </Form>
        <Form
          loading={loading}
          onSubmit={onSubmit}
          className="profile__card__info"
        >
          <p>
            To <strong>update</strong> the email visit you{" "}
            <Link to={"/settings"}>Settings</Link>.
          </p>
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
              disabled={!enableEdit}
            />
            <div className="profile__card__info__input"></div>
          </div>
          {error?.value && (
            <Message negative>
              <p>{error ? error.value : ""}</p>
            </Message>
          )}
          {!readonly && (
            <div className="profile__card__info__buttons">
              <Button
                primary
                type="button"
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
          )}
          <Card>
            <Card.Content extra>
              <Link to="/all">
                <Icon name="picture" />
                {all?.length} Pictures
              </Link>
            </Card.Content>
            <Card.Content extra>
              <Link to="/favorites">
                <Icon name="heart" />
                {favorites?.length} Favorites
              </Link>
            </Card.Content>
            <Card.Content extra>
              <Link to="/hidden">
                <Icon name="eye slash" />
                {all.filter((p) => p.hidden)?.length} Hidden
              </Link>
            </Card.Content>
          </Card>
        </Form>
      </div>
    );
  }
}

export default withGlobalProps(ProfileCard);
