import React from "react";
import "./Photo.css";
import { MdOutlineFavorite } from "react-icons/md";
import { BiPhotoAlbum } from "react-icons/bi";
import { ImHistory } from "react-icons/im";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { IoCloudDownload } from "react-icons/io5";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import IconButton from "../IconButton/IconButton";
import { AlbumType, GlobalPropsType, PhotoType } from "../../types";
import { downloadImage, formatTimeStamp } from "../../utils";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { withGlobalProps } from "../../hoc";
import { db, storage } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";
import { setAlbum } from "../../actions";

interface PropsType {
  photo: PhotoType;
  globalProps: GlobalPropsType;
  blur?: true | false;
}
interface StateType {
  loading: true | false;
}
class Photo extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { loading: false };
  }
  handleFavorite = async () => {
    const {
      props: {
        globalProps: { user },
        photo: { id },
      },
    } = this;
    this.setState((s) => ({ ...s, loading: true }));
    const docSnap = await getDoc(doc(db, "users", user?.uid as any));
    const photos = docSnap.data()?.photos;
    const all = photos?.map((p: PhotoType): PhotoType => {
      if (p.id === id) {
        return { ...p, favoured: true };
      }
      return p;
    });
    await setDoc(
      doc(db, "users", user?.uid as string),
      {
        photos: all,
      },
      {
        merge: true,
      }
    ).then(() => {
      this.setState((s) => ({ ...s, loading: false }));
    });
  };
  handleUnFavorite = async () => {
    const {
      props: {
        globalProps: { user },
        photo: { id },
      },
    } = this;
    this.setState((s) => ({ ...s, loading: true }));
    const docSnap = await getDoc(doc(db, "users", user?.uid as any));
    const photos = docSnap.data()?.photos;
    const all = photos?.map((p: PhotoType): PhotoType => {
      if (p.id === id) {
        return { ...p, favoured: false };
      }
      return p;
    });
    await setDoc(
      doc(db, "users", user?.uid as string),
      {
        photos: all,
      },
      {
        merge: true,
      }
    ).then(() => {
      this.setState((s) => ({ ...s, loading: false }));
    });
  };
  handleDelete = async () => {
    const {
      props: {
        globalProps: { user },
        photo: { id },
      },
    } = this;
    // delete file in storage
    this.setState((s) => ({ ...s, loading: true }));
    const docSnap = await getDoc(doc(db, "users", user?.uid as any));
    const photos = docSnap.data()?.photos;
    const photo: PhotoType = photos.find((p: any) => p.id === id);
    const all = photos?.filter((p: any) => p.id !== id);
    const deleteRef = ref(storage, `images/${photo.name}`);
    await deleteObject(deleteRef)
      .then(async () => {
        await setDoc(
          doc(db, "users", user?.uid as string),
          {
            photos: all,
          },
          {
            merge: true,
          }
        ).then(() => {
          this.setState((s) => ({ ...s, loading: false }));
        });
      })
      .catch((error) => this.setState((s) => ({ ...s, loading: false })));
  };

  handleDownload = async () => {
    const { url, name, id } = this.props.photo;
    await downloadImage(url, name || id.substring(0, 10) + ".jpg");
  };
  handleHide = async () => {
    const {
      props: {
        globalProps: { user },
        photo: { id },
      },
    } = this;
    this.setState((s) => ({ ...s, loading: true }));
    const docSnap = await getDoc(doc(db, "users", user?.uid as any));
    const photos = docSnap.data()?.photos;
    const all = photos?.map((p: PhotoType): PhotoType => {
      if (p.id === id) {
        return { ...p, hidden: true };
      }
      return p;
    });
    await setDoc(
      doc(db, "users", user?.uid as string),
      {
        photos: all,
      },
      {
        merge: true,
      }
    ).then(() => {
      this.setState((s) => ({ ...s, loading: false }));
    });
  };
  handleUnHide = async () => {
    const {
      props: {
        globalProps: { user },
        photo: { id },
      },
    } = this;
    this.setState((s) => ({ ...s, loading: true }));
    const docSnap = await getDoc(doc(db, "users", user?.uid as any));
    const photos = docSnap.data()?.photos;
    const all = photos?.map((p: PhotoType): PhotoType => {
      if (p.id === id) {
        return { ...p, hidden: false };
      }
      return p;
    });
    await setDoc(
      doc(db, "users", user?.uid as string),
      {
        photos: all,
      },
      {
        merge: true,
      }
    ).then(() => {
      this.setState((s) => ({ ...s, loading: false }));
    });
  };
  render() {
    const {
      props: {
        photo: { favoured, url, timestamp, id, name, hidden },
        globalProps: { dispatch, location },
        blur,
      },
      state: { loading },
      handleDelete,
      handleDownload,
      handleFavorite,
      handleUnFavorite,
      handleHide,
      handleUnHide,
    } = this;
    return (
      <div className="photo">
        {loading ? (
          <div className="photo__loading">
            <div />
          </div>
        ) : null}
        {blur ? <FaRegEyeSlash className="photo__icon__blur" /> : null}
        <img
          src={url}
          alt="placeholder"
          style={{
            filter: `${blur ? "blur(10px)" : "blur(0)"}`,
          }}
          loading="lazy"
          onClick={() => {
            const alb: AlbumType = {
              albumName:
                location?.pathname === "/favorites"
                  ? "FAVORITES"
                  : location?.pathname === "/all"
                  ? "ALL"
                  : location?.pathname === "/hidden"
                  ? "HIDDEN"
                  : "RECENT",
              current: {
                id,
                url,
                timestamp,
                favoured,
                name,
              },
            };
            dispatch(setAlbum(alb));
          }}
        />
        {favoured ? (
          <MdOutlineFavorite className="photo__icon" />
        ) : (
          <BiPhotoAlbum className="photo__icon" />
        )}
        <ImHistory className="photo__icon--down" />
        {location?.pathname !== "/hidden" && hidden ? null : (
          <div className="photo__controls">
            {favoured ? (
              <IconButton
                Icon={AiFillHeart}
                title="unfavorite"
                onClick={handleUnFavorite}
              />
            ) : (
              <IconButton
                Icon={AiOutlineHeart}
                title="favorite"
                onClick={handleFavorite}
              />
            )}
            <IconButton Icon={MdDelete} title="delete" onClick={handleDelete} />
            {!hidden ? (
              <IconButton
                Icon={FaRegEye}
                title="un hide"
                onClick={handleHide}
              />
            ) : (
              <IconButton
                Icon={FaRegEyeSlash}
                title="hide"
                onClick={handleUnHide}
              />
            )}

            <IconButton
              Icon={IoCloudDownload}
              title="download"
              onClick={handleDownload}
            />
          </div>
        )}
        <div className="photo__info">
          <h1>{id.substring(0, 10)}</h1>
          <p>
            <span>uploaded:</span>
            <strong>{formatTimeStamp(timestamp)}</strong>
          </p>
        </div>
      </div>
    );
  }
}

export default withGlobalProps(Photo);
