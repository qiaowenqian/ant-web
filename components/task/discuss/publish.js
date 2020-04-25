import stylesheet from "../../../styles/components/task/discuss/index.scss";
import React from "react";
import { Icon, Button, Badge, Popover, Mention, Avatar, message } from "antd";
const Nav = Mention.Nav;
const { getMentions, toContentState, toString } = Mention;
import _ from "lodash";
import Storage from "../../../core/utils/storage.js";
import { updateImgsInService } from "../../../core/service/file.service";
import { addTalkAtTask } from "../../../core/service/task.service";
import dingJS from "../../../core/utils/dingJSApi";
import { createFileIcon, pasteImg } from "../../../core/utils/util.js";

export default class DiscussPublish extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collectList: [], //关注人列表
      taskInfo: null, //数据信息
      user: {}, //登陆人信息
      newTalkReplyUserId: null, //新建讨论人
      newTalkDesc: "", //讨论描述
      newTalkFiles: [], //讨论文件
      newTalkPromptTxt: "请输入讨论内容", //讨论内容
      uploadList_talk: [],
      showAiteList: false,
      suggestions: [],
      mentionvalue: 111,
      loading: false,
      peopleAllList: [],
      butDisabled: false, //提交按钮拦截
      taskCompletFiles: [], //上传完成的附件列表
      placeholderNull: false
    };
  }
  componentWillMount() {
    if (this.props && this.props.peopleAllList) {
      this.setState({ peopleAllList: this.props.peopleAllList });
      this.renderSuggestion(this.props.peopleAllList);
    }
    if (this.props && this.props.taskInfo) {
      this.setState({
        taskInfo: _.cloneDeep(this.props.taskInfo),
        leaveList: this.props.taskInfo.talk,
        collectList: this.props.taskInfo.collectList,
        mentionvalue: this.props.publishObj
          ? toContentState("@" + this.props.publishObj.people.name + " ")
          : toContentState(""),
        newTalkReplyUserId: this.props.publishObj.newTalkReplyUserId, //新建讨论人
        newTalkDesc: this.props.publishObj.newTalkDesc, //讨论描述
        newTalkFiles: this.props.publishObj.newTalkFiles, //讨论文件
        newTalkPromptTxt: this.props.publishObj.newTalkPromptTxt //讨论内容
      });
    }
  }
  componentDidMount() {
    let user = Storage.get("user");
    this.setState({ user: user });
    if (Storage.get("showLog")) {
      let isshowLog = Storage.get("showLog");
      this.setState({ isshowLog: isshowLog });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps &&
      nextProps.peopleAllList &&
      !_.isEqual(nextProps.peopleAllList, this.props.peopleAllList)
    ) {
      this.setState({
        peopleAllList: nextProps.peopleAllList
      });
      this.renderSuggestion(nextProps.peopleAllList);
    }
    if (
      nextProps &&
      nextProps.taskInfo &&
      nextProps.taskInfo.id !== this.state.taskInfo.id
    ) {
      this.setState({
        taskInfo: _.cloneDeep(nextProps.taskInfo),
        leaveList: nextProps.taskInfo.talk,
        collectList: nextProps.taskInfo.collectList,
        mentionvalue: nextProps.publishObj.newTalkReplyUserId
          ? toContentState(" " + "@" + nextProps.publishObj.people.name + " ")
          : toContentState(""),
        newTalkReplyUserId: nextProps.publishObj.newTalkReplyUserId, //新建讨论人
        newTalkDesc: nextProps.publishObj.newTalkDesc, //讨论描述
        newTalkFiles: nextProps.publishObj.newTalkFiles, //讨论文件
        newTalkPromptTxt: nextProps.publishObj.newTalkPromptTxt //讨论内容
      });
    }
    if (nextProps.publishObj.people && nextProps.publishObj.people.id !== "") {
      this.setState(
        {
          mentionvalue: nextProps.publishObj.newTalkReplyUserId
            ? toContentState(" " + "@" + nextProps.publishObj.people.name + " ")
            : toContentState("")
        },
        () => {
          if (
            nextProps.publishObj &&
            nextProps.publishObj.newTalkReplyUserId !== ""
          ) {
            this.refs.mention.focus();
          }
        }
      );
    }
  }
  onChange = contentState => {
    this.setState({ mentionvalue: contentState });
  };
  renderSuggestion(Arr) {
    const suggestions =
      Arr && Arr.length <= 0
        ? ""
        : Arr.map(suggestion => (
            <Nav
              data={suggestion}
              ref="suggestionRef"
              value={suggestion.name}
              className="pointer"
            >
              {suggestion.photo ? (
                <Avatar
                  src={suggestion.photo}
                  size="small"
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 8
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 8,
                    position: "relative",
                    display: "inline-block",
                    background: "#ef9a9a",
                    color: "#fff",
                    fontSize: "12px",
                    borderRadius: "50%",
                    textAlign: "center"
                  }}
                >
                  {suggestion.name && suggestion.name.substr(0, 1)}
                </div>
              )}
              <span>{suggestion.name}</span>
            </Nav>
          ));
    this.setState({ suggestions });
  }
  onSearchChange = (value, e) => {
    const { peopleAllList } = this.state;
    let filterArr = peopleAllList.filter(
      item =>
        item.name.indexOf(value) !== -1 || item.pingYin.indexOf(value) !== -1
    );
    this.renderSuggestion(filterArr);
  };
  deleteUploadImg(id) {
    const { uploadList_talk, newTalkFiles } = this.state;
    uploadList_talk.map((item, index) => {
      if (item.uid == id) {
        uploadList_talk.splice(index, 1);
        this.setState({
          uploadList_talk: uploadList_talk
        });
        return false;
      }
    });
    newTalkFiles.map((item, index) => {
      if (item.id == id) {
        newTalkFiles.splice(index, 1);
        this.setState({
          newTalkFiles: newTalkFiles
        });
        return false;
      }
    });
  }
  renderImgPreviewAndDelete() {
    const { uploadList_talk } = this.state;
    const { isSmall } = this.props;

    return (
      <div className="imageListPreviewBox">
        {uploadList_talk &&
          uploadList_talk.map(item => {
            return (
              <div className="preimgBox" key={item.uid}>
                <img
                  src={item.thumbUrl}
                  className="pointer"
                  onClick={() => {
                    let urls = [];
                    uploadList_talk.map(urlitem => {
                      urls.push(urlitem.thumbUrl);
                    });
                    dingJS.previewImages(item, isSmall, urls);
                  }}
                />
                <Icon
                  type="close-circle"
                  className="del pointer"
                  style={{ color: "rgba(117, 117, 117, 1)", fontSize: "16px" }}
                  onClick={() => {
                    this.deleteUploadImg(item.uid);
                  }}
                />
              </div>
            );
          })}
      </div>
    );
  }

  //粘贴讨论附件
  pasteingImg(e) {
    const { newTalkFiles, uploadList_talk } = this.state;
    pasteImg(
      e,
      url => {
        updateImgsInService(url, data => {
          if (data.err) {
            return false;
          }
          const fileObj = data;
          let img = {
            uid: fileObj.id,
            thumbUrl: fileObj.fileUrlAbsolute,
            status: "done",
            url: fileObj.fileUrlAbsolute,
            fileUrlAbsolute: fileObj.fileUrlAbsolute
          };
          uploadList_talk.push(img);
          newTalkFiles.push(fileObj);
          this.setState({
            uploadList_talk: uploadList_talk,
            newTalkFiles: newTalkFiles
          });
        });
      },
      this.props.isSmall
    );
  }
  addTalk() {
    const { newTalkFiles, peopleAllList, taskInfo, mentionvalue } = this.state;
    let lastValue = toString(mentionvalue); //所有的字符串
    let lastPeople = getMentions(mentionvalue); //未过滤的所有的人员
    let newArr = lastValue.split(" ");
    let ids = []; //@的人员的信息
    //处理选中人员比对获取符合条件的人员Id
    lastPeople.map(item => {
      let flag = true;
      peopleAllList.map(item2 => {
        if (item.substr(1) == item2.name) {
          //   ids.push(item2.id);
          ids.push(item2.user);
          flag = false;
          return false;
          //   return false;
        }
      });
      if (flag) {
        ids.push("");
      }
    });
    //处理传给后台的信息desc
    let newArr2 = [];
    newArr.map(item => {
      let obj = item;
      lastPeople.map((item2, index2) => {
        if (item == item2 && ids[index2] && ids[index2].id) {
          obj = "!#$" + item2 + "$#$" + ids[index2].id + "$#:";
          return;
        }
      });
      newArr2.push(obj);
    });
    //取出处理后的传给后台的信息desc
    let newString = newArr2.join(" ");
    // console.log(lastPeople, peopleAllList);
    if (!newString.trim() && (!newTalkFiles || newTalkFiles.length <= 0)) {
      message.info("请输入发布的内容！");
      return false;
    }
    const data = {
      description: newString,
      content: lastValue,
      taskinfo: {
        id: this.state.taskInfo.id
      },
      files: newTalkFiles,
      users: ids
    };
    // console.log(data, "@的数据");
    let _this = this;
    this.setState(
      {
        butDisabled: true
      },
      () => {
        setTimeout(function() {
          _this.setState({
            butDisabled: false
          });
        }, 500);
      }
    );
    addTalkAtTask(
      data,
      res => {
        if (res.err) {
          return false;
        }

        this.setState({
          newTalkReplyUserId: null, //新建讨论人
          newTalkDesc: "", //讨论描述
          newTalkFiles: [], //讨论文件
          newTalkPromptTxt: "请输入讨论内容", //讨论内容
          uploadList_talk: [],
          mentionvalue: toContentState(""),
          showAiteList: false,
          butDisabled: false, //提交按钮拦截
          taskCompletFiles: [] //上传完成的附件列表
        });
        this.props.getTaskDetail(taskInfo.id, taskInfo.project.id);
      },
      this.props.isSmall
    );
  }
  //上传附件
  updateImg() {
    const { taskCompletFiles, newTalkFiles } = this.state;
    dingJS.uploadImage(res => {
      const data = res.data;
      data.map((item, i) => {
        taskCompletFiles.push(item);
        newTalkFiles.push(item);
      });
      this.setState({
        taskCompletFiles: taskCompletFiles,
        newTalkFiles: newTalkFiles
      });
    }, true);
  }
  //附件预览删除组件
  renderPriviewAndDelete() {
    const { taskCompletFiles } = this.state;

    return (
      <div className="fileSection2">
        {taskCompletFiles.map(item => {
          return (
            <div className="fileItem" key={item.id}>
              {createFileIcon(item.fileType)}
              <span
                className="fileInfo pointer"
                onClick={() => {
                  dingJS.previewImage(item);
                }}
              >
                {item.fileName}
              </span>

              <i
                // type="delete"
                className="iconfont icon-icon_huabanfuben5 pointer"
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "8px",
                  fontSize: "14px",
                  color: "#bdbdbd"
                }}
                onClick={() => {
                  this.dellTaskOkFile(item.fileId);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
  //删除附件
  dellTaskOkFile(id) {
    let { taskCompletFiles } = this.state;
    taskCompletFiles.map((item, i) => {
      if (item.fileId === id) {
        taskCompletFiles.splice(i, 1);
        this.setState({ taskCompletFiles: taskCompletFiles });
        return false;
      }
    });
    newTalkFiles.map((item, i) => {
      if (item.fileId === id) {
        newTalkFiles.splice(i, 1);
        this.setState({ newTalkFiles: newTalkFiles });
        return false;
      }
    });
  }

  render() {
    const {
      uploadList_talk,
      taskCompletFiles,
      butDisabled,
      suggestions,
      loading,
      mentionvalue,
      peopleAllList,
      placeholderNull
    } = this.state;

    return (
      <div
        className="wirteDiscuss"
        ref="fixedBottom"
        onPaste={e => {
          this.pasteingImg(e);
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Mention
          loading={loading}
          placeholder={
            placeholderNull ? null : "输入讨论内容，可通过@提醒指定人员"
          }
          multiLines
          ref="mention"
          onFocus={e => {
            this.setState({ placeholderNull: true });
            this.renderSuggestion(peopleAllList);
          }}
          onBlur={e => {
            this.setState({ placeholderNull: false });
          }}
          value={mentionvalue}
          style={{
            width: "100%",
            wordBreak: "break-all",
            minHeight: "44px",
            maxHeight: "100px",
            border: "none",
            lineHeight: "22px"
          }}
          placement="top"
          className="wirteText"
          suggestions={suggestions}
          onChange={this.onChange}
          onSearchChange={this.onSearchChange.bind(this)}
        />
        <div className="wirteRight">
          {/* 图片 */}
          {uploadList_talk && uploadList_talk.length > 0 && (
            <Popover
              content={this.renderImgPreviewAndDelete()}
              title={null}
              placement="topRight"
            >
              <div className="imageList">
                <Badge
                  count={uploadList_talk.length}
                  style={{ height: "18px", width: "18px" }}
                >
                  <img src={uploadList_talk[uploadList_talk.length - 1].url} />
                </Badge>
              </div>
            </Popover>
          )}
          {/* 附件 */}
          {taskCompletFiles && taskCompletFiles.length > 0 ? (
            <Popover
              content={this.renderPriviewAndDelete()}
              title={null}
              placement="topRight"
              trigger="click"
            >
              <div className="uploadList pointer">
                <Badge
                  count={taskCompletFiles.length}
                  style={{ height: "18px", width: "18px" }}
                >
                  <Icon
                    type="paper-clip"
                    style={{ fontSize: "16px", padding: "10px" }}
                    onClick={() => {
                      this.updateImg();
                    }}
                  />
                </Badge>
              </div>
            </Popover>
          ) : (
            <div className="uploadList pointer">
              <Icon
                type="paper-clip"
                style={{ fontSize: "16px", padding: "0 10px" }}
                onClick={() => {
                  this.updateImg();
                }}
              />
            </div>
          )}

          {/* 发布按钮 */}
          <Button
            type="primary"
            className="discussButton"
            style={{ backgroundColor: "#64B5F6", borderRadius: 0 }}
            onClick={() => {
              this.addTalk();
            }}
            disabled={butDisabled}
          >
            发布
          </Button>
        </div>
      </div>
    );
  }
}
