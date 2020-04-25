import { Upload, Icon, message } from "antd";
import { baseURI } from "../../../core/api/HttpClient";
import React from "react";
import stylesheet from "styles/components/project/UserInfoSetting/uploadAvatar.scss";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPEG = file.type === "image/jpeg";
  const isPng = file.type === "image/png";
  const isJPG = file.type === "image/jpg";
  if (isJPG || isPng || isJPEG) {
  } else {
    message.error("请选择正确的文件格式!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片最大为2MB!");
  }
  return (isJPG || isPng || isJPEG) && isLt2M;
}

export default class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      attstr04: ""
    };
  }
  componentWillMount() {
    let reg = /^https/;
    let reg2 = /^http/;
    if (this.props.attstr04) {
      if (reg.test(this.props.attstr04) || reg2.test(this.props.attstr04)) {
        this.setState({
          attstr04: this.props.attstr04
        });
      }
    }
  }
  handleChange = info => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      if (info.file.response.data) {
        this.setState;
        getBase64(info.file.originFileObj, attstr04 => {
          this.setState({
            attstr04: info.file.response.data,
            loading: false
          });
          this.props.onChoosePic(info.file.response.data);
        });
      }
    }
  };

  render() {
    const { attstr04 } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div id="uploadAvatat">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Upload
          name="file"
          listType="picture-card"
          className={"avatar-uploader " + attstr04 ? "hasattstr04" : ""}
          showUploadList={false}
          action={baseURI + "/project/uploadAvatar"}
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
          multiple={true}
        >
          {attstr04 ? (
            <img
              src={attstr04}
              alt="avatar"
              style={{ height: "118px", width: "118px", borderRadius: "50%" }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>
    );
  }
}
