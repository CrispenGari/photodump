import React from "react";
import { Button, Progress } from "semantic-ui-react";
import { FileUploader } from "react-drag-drop-files";
import "./UploadForm.css";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType, PhotoType } from "../../types";
import { storage, db } from "../../firebase";
// import { decode } from "base64-arraybuffer";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { dataURLtoFile, getBase64 } from "../../utils";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { v4 as uuid_v4 } from "uuid";
interface PropsType {
  closeForm: () => void;
  globalProps: GlobalPropsType;
}
interface StateType {
  files: Array<{
    fileName: string;
    size: number;
    base64: string;
  }>;
  progress: boolean;
}
class UploadForm extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      files: [],
      progress: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange = async (files: any) => {
    let _files: Array<any> = [];
    if (files) {
      this.setState((state) => ({ ...state, progress: true }));
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const _file = await getBase64(file);
        _files.push({
          fileName: file.name,
          size: file.size,
          base64: _file,
        });
        if (i + 1 === files.length) {
          this.setState((state) => ({ ...state, progress: false }));
        }
      }
    }
    this.setState((state) => ({
      ...state,
      files: _files,
      progress: true,
    }));
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      state: { files },
      props: {
        globalProps: { user },
      },
    } = this;
    (async () => {
      if (files.length > 0 && user) {
        for (let i = 0; i < files.length; i++) {
          this.setState((state) => ({ ...state, progress: true }));
          const { fileName, base64 } = files[i];
          const _fileName =
            uuid_v4().slice(0, 10) + "." + fileName.split(".")[1];
          const storageRef = ref(storage, `images/${_fileName}`);
          const uploadTask = uploadBytesResumable(
            storageRef,
            dataURLtoFile(base64, fileName)
          );

          await uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(progress);
            },
            (error) => {
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                const photo: PhotoType = {
                  favoured: false,
                  id: uuid_v4(),
                  timestamp: new Date(),
                  url,
                  name: _fileName,
                };
                const docSnap = await getDoc(doc(db, "users", user.uid));
                const _user = {
                  id: docSnap.id,
                  data: docSnap.data(),
                };

                // previous photos
                const _photos: PhotoType[] = _user.data?.photos;
                await setDoc(
                  doc(db, "users", user.uid),
                  {
                    user: user,
                    photos: [photo, ..._photos],
                  },
                  {
                    merge: true,
                  }
                );
              });
            }
          );
        }
      }
    })()
      .then(() => {
        this.setState((state) => ({
          ...state,
          progress: false,
          files: [],
        }));
        this.props.closeForm();
      })
      .catch(() => {
        this.setState((state) => ({
          ...state,
          progress: false,
          files: [],
        }));
        this.props.closeForm();
      });
  };

  render() {
    const {
      props: { closeForm },
      state: { progress, files },
    } = this;

    return (
      <div className="upload__form">
        <form onSubmit={this.onSubmit}>
          <h1>Upload Pictures.</h1>
          <FileUploader
            handleChange={(files: any) => this.handleChange(files)}
            name="file"
            types={["JPEG", "png", "jpg", "webp", "gif"]}
            className="upload__form__dragzone"
            multiple
          />
          <div className="upload__form__controls">
            <Button
              content="Upload"
              primary
              type="submit"
              disabled={files.length === 0}
            />
            <Button
              content="Cancel"
              secondary
              type="button"
              onClick={() => {
                this.setState((state) => ({
                  ...state,
                  progress: false,
                  files: [],
                }));
                closeForm();
              }}
            />
          </div>
          {progress ? (
            <Progress
              indicating
              percent={100}
              color="blue"
              className="upload__form__progress"
              size="tiny"
            />
          ) : null}
          <p>{this.state.files.length} files selected.</p>
        </form>
      </div>
    );
  }
}

export default withGlobalProps(UploadForm);
