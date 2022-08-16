import React from "react";
import { Button, Progress } from "semantic-ui-react";
import { FileUploader } from "react-drag-drop-files";
import { pick } from "lodash";
import "./UploadForm.css";
import { withGlobalProps } from "../../hoc";
import { GlobalPropsType } from "../../types";
import { storage, db } from "../../firebase";
// import { decode } from "base64-arraybuffer";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { dataURLtoFile } from "../../utils";
import { addDoc, collection } from "firebase/firestore";
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
  progress: number;
}
class UploadForm extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      files: [],
      progress: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getBase64 = this.getBase64.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  handleChange = async (files: any) => {
    let _files: Array<any> = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const _file = await this.getBase64(file);
        _files.push({
          fileName: file.name,
          size: file.size,
          base64: _file,
        });
      }
    }
    this.setState((state) => ({
      ...state,
      files: _files,
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
    if (files.length > 0 && user) {
      const _user = pick(user, [
        "email",
        "displayName",
        "photoURL",
        "phoneNumber",
        "uid",
      ]);

      for (let i = 0; i < files.length; i++) {
        this.setState((state) => ({ ...state, progress: files.length }));
        const { fileName, base64 } = files[i];
        const storageRef = ref(storage, `images/${fileName}`);
        const uploadTask = uploadBytesResumable(
          storageRef,
          dataURLtoFile(base64, fileName)
        );
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.setState((state) => ({ ...state, progress }));
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              addDoc(collection(db, "images"), {
                user: {
                  ..._user,
                },
                url: downloadURL,
              });
            });
          }
        );
      }
      this.setState((state) => ({ ...state, progress: 0, files: [] }));
    }
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
                  progress: 0,
                  files: [],
                }));
                closeForm();
              }}
            />
          </div>
          {progress > 0 ? (
            <Progress
              progress
              percent={progress}
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
