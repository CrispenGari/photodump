import React from "react";
import IconButton from "../IconButton/IconButton";
import "./PhotoViewer.css";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoCloudDownload } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { AlbumType, GlobalPropsType, PhotoType } from "../../types";
import { withGlobalProps } from "../../hoc";
import { formatTimeStamp } from "../../utils";
import { Button } from "semantic-ui-react";
import { setAlbum } from "../../actions";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {
  currentIndex: number;
  previewPhotos: Array<PhotoType>;
}
class PhotoViewer extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { previewPhotos: [], currentIndex: 0 };
  }

  handleKey = ({ key, code }: KeyboardEvent) => {
    if (key === "Escape" && code === "Escape") {
      this.close();
    } else if (key === "ArrowRight" && code === "ArrowRight") {
      this.next();
    } else if (key === "ArrowLeft" && code === "ArrowLeft") {
      this.prev();
    } else {
      return;
    }
  };
  componentDidMount = () => {
    const { album, albumPhotos } = this.props.globalProps;
    const previewPhotos =
      album.albumName === "RECENT"
        ? albumPhotos.recent
        : album.albumName === "FAVORITES"
        ? albumPhotos.favorites
        : albumPhotos.all;

    const currentIndex: number = previewPhotos
      .map((p) => p.id)
      .indexOf(album.current?.id as any);
    this.setState((s) => ({
      ...s,
      previewPhotos,
      currentIndex,
    }));

    window.document.addEventListener("keydown", this.handleKey, false);
  };

  componentWillUnmount = () => {
    window.document.removeEventListener("keydown", this.handleKey, false);
  };
  handleFavorite = async () => {
    const {
      props: {
        globalProps: { user },
      },
      state: { currentIndex, previewPhotos },
    } = this;
    const photo: PhotoType = previewPhotos[currentIndex];
    console.log(photo.id);
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
      state: { currentIndex, previewPhotos },
    } = this;
    const photo: PhotoType = previewPhotos[currentIndex];
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

  next = () => {
    const {
      state: { currentIndex, previewPhotos },
    } = this;
    if (currentIndex + 1 !== previewPhotos.length) {
      this.setState((s) => ({ ...s, currentIndex: currentIndex + 1 }));
    }
  };
  prev = () => {
    const {
      state: { currentIndex },
    } = this;
    if (currentIndex !== 0) {
      this.setState((s) => ({ ...s, currentIndex: currentIndex - 1 }));
    }
  };

  close = () => {
    const { dispatch } = this.props.globalProps;
    const alb: AlbumType = {
      albumName: "RECENT",
      current: undefined,
    };
    dispatch(setAlbum(alb));
  };
  render() {
    const {
      state: { currentIndex, previewPhotos },
      prev,
      next,
      handleDelete,
      handleDownload,
      handleFavorite,
      close,
      props: {
        globalProps: { album },
      },
      handleUnFavorite,
    } = this;
    const photo: PhotoType = previewPhotos[currentIndex];
    return (
      <div className="photo__viewer">
        <div className="photo__viewer__main">
          <Button
            primary
            fluid
            className="photo__viewer__main__btn"
            onClick={close}
          >
            CLOSE
          </Button>
          <div className="photo__viewer__header">
            <h1>{album.albumName} Photos</h1>
            <p>
              {currentIndex + 1}/{previewPhotos.length} photo(s)
            </p>
          </div>
          <IconButton
            title="previous"
            Icon={BiChevronLeft}
            disabled={currentIndex === 0}
            onClick={prev}
            classes="photo__viewer__icon__btn"
          />
          <IconButton
            title="next"
            onClick={next}
            disabled={currentIndex + 1 === previewPhotos.length}
            Icon={BiChevronRight}
            classes="photo__viewer__icon__btn photo__viewer__icon__btn--next"
          />
          <div className="photo__viewer__body">
            <img src={photo?.url} alt={photo?.name} />
          </div>
          <div className="photo__viewer__footer">
            <div className="photo__viewer__footer__info">
              <h1>{photo?.name}</h1>
              <p>
                <span>uploaded:</span>
                <strong>{formatTimeStamp(photo?.timestamp)}</strong>
              </p>
            </div>
            <div className="photo__viewer__footer__controls" hidden>
              {photo?.favoured ? (
                <IconButton
                  Icon={AiFillHeart}
                  title="unfavorite"
                  classes="photo__viewer__footer__controls__icon__btn"
                  onClick={handleUnFavorite}
                />
              ) : (
                <IconButton
                  Icon={AiOutlineHeart}
                  title="favorite"
                  classes="photo__viewer__footer__controls__icon__btn"
                  onClick={handleFavorite}
                />
              )}
              <IconButton
                Icon={MdDelete}
                title="delete"
                classes="photo__viewer__footer__controls__icon__btn"
                onClick={handleDelete}
              />
              <IconButton
                Icon={IoCloudDownload}
                title="download"
                onClick={handleDownload}
                classes="photo__viewer__footer__controls__icon__btn"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withGlobalProps(PhotoViewer);
