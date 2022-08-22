import React from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { BiPhotoAlbum } from "react-icons/bi";
import { ImHistory } from "react-icons/im";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { IoCloudDownload } from "react-icons/io5";
import { Image } from "semantic-ui-react";
import { withGlobalProps } from "../../hoc";
import { AlbumType, GlobalPropsType, PhotoType } from "../../types";
import { downloadImage, formatTimeStamp } from "../../utils";
import "./RecentItem.css";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase";
import IconButton from "../IconButton/IconButton";
import { setAlbum } from "../../actions";
interface PropsType {
  photo: PhotoType;
  globalProps: GlobalPropsType;
}
interface StateType {
  loading: boolean;
}
class RecentItem extends React.Component<PropsType, StateType> {
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
  render() {
    const {
      props: {
        photo: { id, url, timestamp, favoured, name },
        globalProps: { dispatch },
      },
      handleDelete,
      handleDownload,
      handleFavorite,
      handleUnFavorite,
    } = this;

    return (
      <div className="recent__item">
        {favoured ? (
          <MdOutlineFavorite className="recent__item__icon" />
        ) : (
          <BiPhotoAlbum className="recent__item__icon" />
        )}
        <ImHistory className="recent__item__icon--down" />
        <div className="recent__item__controls">
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
          <IconButton
            Icon={IoCloudDownload}
            title="download"
            onClick={handleDownload}
          />
        </div>

        <Image
          className="recent__item__image"
          src={url}
          alt={id}
          loading="lazy"
          onClick={() => {
            const alb: AlbumType = {
              albumName: "RECENT",
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
        <h1>{id.substring(0, 10)}</h1>
        <p>
          uploaded: <strong>{formatTimeStamp(timestamp)}</strong>
        </p>
      </div>
    );
  }
}

export default withGlobalProps(RecentItem);
