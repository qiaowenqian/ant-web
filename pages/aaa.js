import stylesheet from "../../../styles/components/task/discuss/index.scss";
import React from "react";
import {
  Icon,
  Tooltip,
  Timeline,
  Input,
  Button,
  Badge,
  Popover,
  Mention,
  Avatar,
  message
} from "antd";
const { TextArea } = Input;
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
      newTalkReplyUserId: [], //新建讨论人
      newTalkDesc: "", //讨论描述
      newTalkFiles: [], //讨论文件
      newTalkPromptTxt: "请输入讨论内容", //讨论内容
      uploadList_talk: [],
      showAiteList: false,
      butDisabled: false, //提交按钮拦截
      taskCompletFiles: [] //上传完成的附件列表
    };
  }
  componentWillMount() {
    if (this.props && this.props.taskInfo) {
      this.setState({
        taskInfo: this.props.taskInfo,
        leaveList: this.props.taskInfo.talk,
        collectList: this.props.taskInfo.collectList,
        // newTalkReplyUserId: this.props.publishObj.newTalkReplyUserId, //新建讨论人
        newTalkReplyUserId: this.props.publishObj.newTalkReplyUserId
          ? [this.props.publishObj.newTalkReplyUserId]
          : [], //新建讨论人
        newTalkDesc: this.props.publishObj.newTalkDesc, //讨论描述
        newTalkFiles: this.props.publishObj.newTalkFiles, //讨论文件
        newTalkPromptTxt: this.props.publishObj.newTalkPromptTxt //讨论内容
      });
    }
  }
  componentDidMount() {
    //     document.getElementById("atDemo").onkeydown = function(e) {
    //       console.log("dkkdk", e.keyCode);
    //     };
    let user = Storage.get("user");
    this.setState({ user: user });
    if (Storage.get("showLog")) {
      let isshowLog = Storage.get("showLog");
      this.setState({ isshowLog: isshowLog });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.taskInfo) {
      this.setState({
        taskInfo: nextProps.taskInfo,
        leaveList: nextProps.taskInfo.talk,
        collectList: nextProps.taskInfo.collectList,
        // newTalkReplyUserId: nextProps.publishObj.newTalkReplyUserId,
        newTalkReplyUserId: nextProps.publishObj.newTalkReplyUserId
          ? [nextProps.publishObj.newTalkReplyUserId]
          : [], //新建讨论人
        newTalkDesc: nextProps.publishObj.newTalkDesc, //讨论描述
        newTalkFiles: nextProps.publishObj.newTalkFiles, //讨论文件
        newTalkPromptTxt: nextProps.publishObj.newTalkPromptTxt //讨论内容
      });
    }
  }
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
    const {
      newTalkFiles,
      newTalkReplyUserId,
      taskInfo,
      newTalkDesc
    } = this.state;
    //     //删除at-text取出回复值
    //     let elements = document.getElementsByClassName("at-text");
    //     for (var i = elements.length - 1; i >= 0; i--) {
    //       elements[i].parentNode.removeChild(elements[i]);
    //     }
    //     this.setState(
    //       {
    //         newTalkDesc: document.getElementById("atDemo").innerText
    //       },
    //       () => {
    //         const { newTalkDesc } = this.state;
    //         console.log(newTalkReplyUserId);
    //         if (!newTalkDesc && (!newTalkFiles || newTalkFiles.length <= 0)) {
    //           message.info("请输入发布的内容！");
    //           return false;
    //         }
    //         const data = {
    //           description: newTalkDesc,
    //           taskinfo: {
    //             id: this.state.taskInfo.id
    //           },
    //           reply: {
    //             //     id: newTalkReplyUserId.join(",")
    //             id: newTalkReplyUserId
    //           },
    //           files: newTalkFiles
    //         };
    //         let _this = this;
    //         this.setState(
    //           {
    //             butDisabled: true
    //           },
    //           () => {
    //             setTimeout(function() {
    //               _this.setState({
    //                 butDisabled: false
    //               });
    //             }, 500);
    //           }
    //         );
    //         addTalkAtTask(
    //           data,
    //           res => {
    //             if (res.err) {
    //               return false;
    //             }
    //             if (res.success) {
    //               this.setState({
    //                 newTalkReplyUserId: [], //新建讨论人
    //                 newTalkDesc: "", //讨论描述
    //                 newTalkFiles: [], //讨论文件
    //                 newTalkPromptTxt: "请输入讨论内容", //讨论内容
    //                 uploadList_talk: [],
    //                 showAiteList: false,
    //                 butDisabled: false, //提交按钮拦截
    //                 taskCompletFiles: [] //上传完成的附件列表
    //               });
    //               this.props.getTaskDetail(taskInfo.id, taskInfo.project.id);
    //             } else {
    //               this.setState({
    //                 newTalkReplyUserId: []
    //               });
    //             }
    //           },
    //           this.props.isSmall
    //         );
    //       }
    //     );

    if (!newTalkDesc && (!newTalkFiles || newTalkFiles.length <= 0)) {
      message.info("请输入发布的内容！");
      return false;
    }
    const data = {
      description: newTalkDesc,
      taskinfo: {
        id: this.state.taskInfo.id
      },
      reply: {
        //     id: newTalkReplyUserId.join(",")
        id: newTalkReplyUserId
      },
      files: newTalkFiles
    };
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
          newTalkReplyUserId: [], //新建讨论人
          newTalkDesc: "", //讨论描述
          newTalkFiles: [], //讨论文件
          newTalkPromptTxt: "请输入讨论内容", //讨论内容
          uploadList_talk: [],
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

              <Icon
                type="delete"
                className="pointer"
                style={{ position: "absolute", top: "6px", right: "8px" }}
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
  sPersonDone(person) {
    // 成功选人后，关闭选择框，让输入框获取焦点。

    const { lastSelection, newTalkReplyUserId } = this.state;

    let selection = lastSelection.selection;
    let range = lastSelection.range;
    let textNode = range.startContainer;

    this.setState({
      showAiteList: false
    });
    let ele = document.getElementById("atDemo");
    ele.focus();

    // 获取之前保留先来的信息。
    // 需要修改 keyIn 的代码，保存选区以及光标信息，用于获取在光标焦点离开前，光标的位置

    // 删除 @ 符号。
    range.setStart(textNode, range.endOffset);
    range.setEnd(textNode, range.endOffset);
    range.deleteContents();

    // 生成需要显示的内容，包括一个 span 和一个空格。
    let spanNode1 = document.createElement("span");
    let spanNode2 = document.createElement("span");
    spanNode1.className = "at-text";
    spanNode1.innerHTML = "@" + person.nickname + "&nbsp;";
    spanNode1.id = person.id;
    //     spanNode1.setAttribute("contentEditable", false);
    newTalkReplyUserId.push(person.id);
    spanNode2.innerHTML = "&nbsp;";
    spanNode2.id = person.id;
    // 将生成内容打包放在 Fragment 中，并获取生成内容的最后一个节点，也就是空格。
    let frag = document.createDocumentFragment(),
      node,
      lastNode;
    frag.appendChild(spanNode1);
    while ((node = spanNode2.firstChild)) {
      lastNode = frag.appendChild(node);
    }

    // 将 Fragment 中的内容放入 range 中，并将光标放在空格之后。
    range.insertNode(frag);
    selection.extend(lastNode, 1);
    selection.collapseToEnd();
    console.log(selection);
  }

  keyIn = e => {
    const { newTalkDesc, newTalkReplyUserId } = this.state;
    let selection = getSelection();
    let ele = document.getElementById("atDemo");
    if (e.shiftKey && e.keyCode == 50) {
      // 保存光标信息
      this.setState({
        lastSelection: {
          range: selection.getRangeAt(0),
          offset: selection.focusOffset,
          selection: selection
        }
      });
      this.setState({
        showAiteList: true
      });
      //       e.preventDefault();
      //       $scope.showSelect = true;
      //       // 设置弹出框位置
      //       var offset = $(ele).caret("offset");
      //       $scope.sPersonPosi = {
      //         left: offset.left + "px",
      //         top: offset.top + 30 + "px"
      //       };
      //       $timeout(function() {
      //         $("#searchPersonInput")[0].focus();
      //       });
    } else if (e.key == "Backspace") {
      // 删除逻辑
      // 1 ：由于在创建时默认会在 @xxx 后添加一个空格，
      // 所以当得知光标位于 @xxx 之后的一个第一个字符后并按下删除按钮时，
      // 应该将光标前的 @xxx 给删除
      // 2 ：当光标位于 @xxx 中间时，按下删除按钮时应该将整个 @xxx 给删除。
      let range = selection.getRangeAt(0);
      let removeNode = null;
      if (
        range.startOffset <= 1 &&
        range.startContainer.parentElement.className != "at-text"
      )
        removeNode = range.startContainer.previousElementSibling;
      if (range.startContainer.parentElement.className == "at-text")
        removeNode = range.startContainer.parentElement;
      if (removeNode) {
        console.log(removeNode.id, "dkkd");
        if (removeNode.id) {
          newTalkReplyUserId.map((item, index) => {
            if (item == removeNode.id) {
              newTalkReplyUserId.splice(index, 1);
            }
          });
        }
        ele.removeChild(removeNode);
      }
    }
  };
  onChooseAtpeople(people) {
    const { lastSelection } = this.state;
    if (lastSelection) {
      this.sPersonDone(people);
    } else {
      let selection = getSelection();
      // 保存光标信息
      this.setState(
        {
          lastSelection: {
            range: selection.getRangeAt(0),
            offset: selection.focusOffset,
            selection: selection
          }
        },
        () => {
          this.sPersonDone(people);
        }
      );
    }

    //   let keyObj={};
    //   let keyname=${"@"}
    //   keyObj[]
    //   this.peopleList.push({
    //         "@"
    //   })
  }
  onSearchChangeRang() {
    //     const webFrameworks = [
    //       { name: "React", type: "JavaScript", id: "1" },
    //       { name: "Angular", type: "JavaScript", id: "2" },
    //       { name: "Laravel", type: "PHP", id: "3" },
    //       { name: "Flask", type: "Python", id: "4" },
    //       { name: "Django", type: "Python", id: "5" }
    //     ];
    const { collectList } = this.state;

    //     const searchValue = value.toLowerCase();
    //     const filtered = collectList.filter(
    //       item => item.nickname.indexOf(searchValue) !== -1
    //     );
    //     const suggestions = ;
    return (
      <div
        style={{
          minWidth: "100px",
          maxHeight: "240px",
          border: "1px solid #eee",
          borderRadius: "2px",
          overflowY: "auto",
          boxShadow: "0px -1px 2px 0px rgba(238, 238, 238, 1)",
          position: "absolute",
          left: 0,
          bottom: "44px",
          background: "#fff"
        }}
      >
        {collectList &&
          collectList.map(suggestion => {
            return (
              <div
                key={suggestion.id}
                data={suggestion}
                style={{ borderBottom: "1px solid #eee", padding: "4px 10px" }}
                className="suggest pointer"
                onClick={() => {
                  this.onChooseAtpeople(suggestion);
                }}
                onKeyDown={() => {
                  this.onChooseAtpeople(suggestion);
                }}
              >
                {suggestion.photo ? (
                  <Avatar
                    src={suggestion.photo}
                    size="small"
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 8,
                      top: -1,
                      position: "relative"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 8,
                      top: -1,
                      position: "relative",
                      display: "inline-block",
                      background: "#5c6bc0",
                      color: "#fff",
                      fontSize: "12px",
                      borderRadius: "50%",
                      textAlign: "center"
                    }}
                  >
                    {suggestion.nickname && suggestion.nickname.substr(0, 1)}
                  </div>
                )}
                <span>{suggestion.nickname}</span>
              </div>
            );
          })}
      </div>
    );
    //     this.setState({ suggestions });
  }
  onSelectChange(suggestion, item) {
    console.log("onselect", suggestion, item);
  }

  render() {
    const {
      newTalkPromptTxt,
      uploadList_talk,
      taskCompletFiles,
      showAiteList,
      butDisabled,
      newTalkDesc
    } = this.state;
    return (
      <div className="wirteDiscuss">
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {/* <TextArea
          id="atDemo"
          value={newTalkDesc}
          placeholder={newTalkPromptTxt}
          autoFocus
          autosize={{ minRows: 1, maxRows: 3 }}
          //   style={{
          //     width: "100%",
          //     minHeight: "44px",
          //     maxHeight: "132px",
          //     marginBottom: "10px"
          //   }}
          className="wirteText"
          onChange={e => {
            //     this.keyIn(e);
            //             if (e.target.value == "@") {
            //               this.setState({ showAiteList: true });
            //             }
            this.setState({
              newTalkDesc: e.target.value
            });
          }}
          onPaste={e => {
            this.pasteingImg(e);
          }}
        /> */}
        <div
          id="atDemo"
          value={newTalkDesc}
          placeholder={newTalkPromptTxt}
          autoFocus
          autosize={{ minRows: 1, maxRows: 3 }}
          style={{
            width: "100%",
            minHeight: "44px",
            maxHeight: "132px",
            marginBottom: "10px"
          }}
          contentEditable={true}
          className="wirteText"
          onKeyDown={e => {
            this.keyIn(e);
            //             if (e.target.value == "@") {
            //               this.setState({ showAiteList: true });
            //             }
          }}
          onPaste={e => {
            this.pasteingImg(e);
          }}
        >
          {newTalkDesc}
        </div>
        {/* 选择@人列表 */}

        {showAiteList && this.onSearchChangeRang()}
        <div className="wirteRight">
          {/* 图片 */}
          {uploadList_talk && uploadList_talk.length > 0 && (
            <Popover
              content={this.renderImgPreviewAndDelete()}
              title={null}
              placement="topRight"
              trigger="click"
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
            >
              <div className="uploadList">
                <Badge
                  count={taskCompletFiles.length}
                  style={{ height: "18px", width: "18px" }}
                >
                  <Icon
                    type="paper-clip"
                    style={{ fontSize: "16px", padding: "0 10px" }}
                    onClick={() => {
                      this.updateImg();
                    }}
                  />
                </Badge>
              </div>
            </Popover>
          ) : (
            <div className="uploadList">
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
            style={{ backgroundColor: "#64B5F6" }}
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
