import React from "react";
import IconButton from "../IconButton/IconButton";
import "./PhotoViewer.css";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoCloudDownload } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { db, storage } from "../../firebase";
import { GlobalPropsType, PhotoType } from "../../types";
import { withGlobalProps } from "../../hoc";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  photo?: PhotoType;
}
class PhotoViewer extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  handleFavorite = async () => {
    const {
      props: {
        globalProps: { user },
      },
      state: { photo },
    } = this;
    this.setState((s) => ({ ...s, loading: true }));
    const docSnap = await getDoc(doc(db, "users", user?.uid as any));
    const photos = docSnap.data()?.photos;
    const all = photos?.map((p: PhotoType): PhotoType => {
      if (p.id === photo?.id) {
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
      },
      state: { photo },
    } = this;
    this.setState((s) => ({ ...s, loading: true }));
    const docSnap = await getDoc(doc(db, "users", user?.uid as any));
    const photos = docSnap.data()?.photos;
    const all = photos?.map((p: PhotoType): PhotoType => {
      if (p.id === photo?.id) {
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
      },
    } = this;
    // delete file in storage
    this.setState((s) => ({ ...s, loading: true }));
    const docSnap = await getDoc(doc(db, "users", user?.uid as any));
    const photos = docSnap.data()?.photos;
    const photo: PhotoType = photos.find((p: any) => p.id === photo?.id);
    const all = photos?.filter((p: any) => p.id !== photo?.id);
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
    // const { url, name, id } = this.props.photo;
    // await downloadImage(url, name || id.substring(0, 10) + ".jpg");
  };
  render() {
    const {
      state: { photo },
      handleDelete,
      handleDownload,
      handleFavorite,
      handleUnFavorite,
    } = this;
    return (
      <div className="photo__viewer">
        <div className="photo__viewer__main">
          <div className="photo__viewer__header">
            <h1>Recent Photos</h1>
            <p>1/3</p>
          </div>
          <IconButton
            title="previous"
            Icon={BiChevronLeft}
            classes="photo__viewer__icon__btn"
          />
          <IconButton
            title="next"
            disabled
            Icon={BiChevronRight}
            classes="photo__viewer__icon__btn photo__viewer__icon__btn--next"
          />
          <div className="photo__viewer__body">
            <img src="/1.jpg" alt="viewer" />
          </div>
          <div className="photo__viewer__footer">
            <div className="photo__viewer__footer__info">
              <p>
                <span>uploaded:</span>
                <strong>today</strong>
              </p>
            </div>
            <div className="photo__viewer__footer__controls">
              {photo?.favoured ? (
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
              <IconButton
                Icon={MdDelete}
                title="delete"
                onClick={handleDelete}
              />
              <IconButton
                Icon={IoCloudDownload}
                title="download"
                onClick={handleDownload}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withGlobalProps(PhotoViewer);
