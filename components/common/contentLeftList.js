import React from "react";
import { Radio, Spin, Icon, Input, Row, Checkbox } from "antd";
import {
  getProListByType,
  getProjectListByTypeTag
} from "../../core/service/project.service";
import { listScroll, isIosSystem } from "../../core/utils/util";
import TagSelect from "../../components/tagSelect";
import Tag from "../../components/tag";
import { oneOf } from "../../core/utils/util";
import _ from "lodash";
import stylesheet from "../../styles/components/common/contentLeft.scss";
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class ContentLeftList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: "",
      checkedList: [],
      remeberCheckedList: [],
      pageType: 0, //0代表项目左侧，1代表统计左侧
      projectListNowPage: 1,
      projectListAllPage: 0,
      projectSearchDivOnTop: false,
      projectList: [], //左侧列表数据
      tagComponentShow: false, //是否显示标签组组件
      tagSelecteds: [], //选中的标签组件列表
      labelId: [], //选中的标签ids
      searchText: "", //搜索关键字
      noTagShow: false, //是否显示选择标签按钮
      searchProType: "2", //默认选中全部类型
      projectCount: 0, //  项目总数
      isIso: true
    };
  }
  //组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state。
  componentWillMount() {
    if (this.props.pageType) {
      this.setState({
        pageType: 1
      });
      if (this.props.projectIds) {
        const newArray = _.cloneDeep(this.props.projectIds);
        const newArray2 = _.cloneDeep(this.props.projectIds);
        this.setState({
          checkedList: newArray,
          remeberCheckedList: newArray2
        });
      }
      this.getProjectListByPage();
    } else {
      if (this.props.projectId && this.props.projectId != "") {
        this.setState(
          {
            projectId: this.props.projectId,
            pageType: 0,
            searchProType: this.props.searchProType
          },
          () => {
            this.getProjectListByPage();
          }
        );
      }
    }
    if (this.props.projectSearchDivOnTop) {
      this.setState({
        projectSearchDivOnTop: this.props.projectSearchDivOnTop
      });
    }
  }
  //组件渲染之后调用，只调用一次。
  componentDidMount() {
    this.setState({ isIso: isIosSystem() });
  }
  //组件初始化时不调用，组件接受新的props时调用。
  componentWillReceiveProps(nextProps) {
    this.setState({
      projectSearchDivOnTop: nextProps.projectSearchDivOnTop
    });
  }
  //   react性能优化非常重要的一环。组件接受新的state或者props时调用，
  //   我们可以设置在此对比前后两个props和state是否相同，
  //   如果相同则返回false阻止更新，
  //   因为相同的属性状态一定会生成相同的dom树，
  //   这样就不需要创造新的dom树和旧的dom树进行diff算法对比，节省大量性能，
  //   尤其是在dom结构复杂的时候
  //   shouldComponentUpdate(nextProps, nextState) {}
  //组件初始化时不调用，组件更新完成后调用，此时可以获取dom节点。
  componentDidUpdate() {}
  //组件初始化时不调用，只有在组件将要更新时才调用，此时可以修改state
  componentWillUpdata(nextProps, nextState) {}
  //组件将要卸载时调用，一些事件监听和定时器需要在此时清除。
  componentWillUnmount() {}
  checkOnClick(id, checkevent) {
    const { pageType, checkedList } = this.state;
    const newArray = _.cloneDeep(checkedList);
    if (pageType) {
      if (checkevent.target.checked) {
        newArray.push(id);
      } else {
        newArray.forEach((item, index) => {
          if (item == id) {
            newArray.splice(index, 1);
          }
        });
      }
      this.setState({
        checkedList: newArray
      });
    } else {
      this.setState(
        {
          projectId: id
        },
        () => {
          this.projectOnClick();
        }
      );
    }
  }
  projectOnClick() {
    const {
      searchProType,
      pageType,
      projectId,
      checkedList,
      labelId
    } = this.state;

    if (pageType) {
      let typenum = searchProType - 1;
      //这里是因为获取列表我参与的传searchProType=4，而
      if (searchProType - 1 == 2) {
        typenum = 3;
      } else if (searchProType - 1 == 3) {
        typenum = 2;
      }
      if (checkedList && checkedList.length > 0) {
        this.props.projectOnClick(checkedList, typenum, labelId);
      }
    } else {
      this.props.projectOnClick(projectId);
    }
  }
  //当搜索栏改变的时候，更新内容，触发回调
  setSearchText(value) {
    this.setState(
      { searchText: value, projectListNowPage: 1, projectListAllPage: 0 },
      () => {
        this.refs.pro_list_scroll.scrollTop = 0;
        this.getProjectListByPage();
      }
    );
  }
  refeshList(isReLoad, options) {
    const {
      searchText,
      searchProType,
      labelIds,
      projectList,
      projectId
    } = this.state;

    //重新获取左侧列表
    if (isReLoad) {
      //重新定位滚动条
      this.refs.pro_list_scroll.scrollTop = 0;
      this.getProjectListByPage();
    } else {
      projectList.map((item, i) => {
        if (item.id === projectId) {
          projectList[i].attstr04 = options.attstr04;
          projectList[i].proname = options.proname;
          this.setState({ projectList: projectList });
          return false;
        }
      });
    }
  }
  /**
   *
   * @param {*搜索关键字} search
   * @param {*项目分组} type
   * @param {*标签数组} labIds
   * @param {*当前页码} pageNo
   * @param {*是否重新加载} isReLoad
   */
  getProjectListByPage() {
    const { searchProType, labelId, searchText } = this.state;
    let typenum = searchProType - 1;
    //这里是因为获取列表我参与的传searchProType=4，而
    if (searchProType - 1 == 2) {
      typenum = 3;
    } else if (searchProType - 1 == 3) {
      typenum = 2;
    }
    getProjectListByTypeTag(typenum, labelId, searchText, data => {
      if (!data) {
        return false;
      }
      this.setState({
        projectList: data.projectList,
        projectListLoading: false
      });
    });
  }
  resolveInitCheckBox() {
    const { searchProType, labelId, searchText } = this.state;
    let typenum = searchProType - 1;
    //这里是因为获取列表我参与的传searchProType=4，而
    if (searchProType - 1 == 2) {
      typenum = 3;
    } else if (searchProType - 1 == 3) {
      typenum = 2;
    }
    getProjectListByTypeTag(typenum, labelId, searchText, data => {
      let firstArr = [];
      if (!data) {
        return false;
      }
      data.projectList.forEach(item => {
        firstArr.push(item.id);
      });
      const newArray = _.cloneDeep(firstArr);
      const newArray2 = _.cloneDeep(firstArr);
      this.setState({
        checkedList: newArray,
        remeberCheckedList: newArray2,
        projectList: data.projectList
      });
    });
    //当第一次加载而且时统计模块是，默认全选中
  }
  resolveListData(data, isReLoad) {}
  typeChange(value) {
    const { pageType } = this.state;
    this.setState({ searchProType: value }, () => {
      this.refs.pro_list_scroll.scrollTop = 0;

      if (pageType) {
        this.resolveInitCheckBox();
      } else {
        this.getProjectListByPage();
      }
    });
  }
  /**
   * @description 打开标签组件
   */
  openTagComponent() {
    this.setState({ tagComponentShow: true });
  }
  /**
   * @description 点击删除标签
   */
  deleteTag(id) {
    const { tagSelecteds, pageType } = this.state;
    const labelIds = [];
    if (tagSelecteds.length > 0) {
      tagSelecteds.map((item, index) => {
        if (item.id === id) {
          tagSelecteds.splice(index, 1);
        }
      });
    }
    this.setState({ tagSelecteds: tagSelecteds });
    if (tagSelecteds.length > 0) {
      tagSelecteds.map(item => {
        labelIds.push(item.id);
      });
    }
    //更新标签显示
    this.setState(
      { labelId: labelIds, projectListNowPage: 1, projectListAllPage: 0 },
      () => {
        if (pageType) {
          this.resolveInitCheckBox();
        } else {
          this.getProjectListByPage();
        }
      }
    );
  }

  /**
   * 选择标签回调
   */
  selectedTag(val) {
    const { pageType } = this.state;
    const labelId = [];
    val.map(item => {
      labelId.push(item.id);
    });
    //更新标签显示
    this.setState(
      {
        labelId: labelId,
        projectListNowPage: 1,
        projectListAllPage: 0,
        tagSelecteds: val
      },
      () => {
        if (pageType) {
          this.resolveInitCheckBox();
        } else {
          this.getProjectListByPage();
        }
      }
    );
    //     this.refs.pro_list_scroll.scrollTop = 0;
    //     this.getProjectListByPage(searchText, searchProType, labelId);
    //     this.setState({ selectedTags: selectedTags });
  }
  /**
   * 清除筛选按钮是否高亮
   */
  clearBtnIsActive() {
    const { searchText, searchProType, tagSelecteds } = this.state;
    if (
      searchText.trim() == "" &&
      searchProType == "1" &&
      tagSelecteds != undefined &&
      tagSelecteds.length <= 0
    ) {
      return false;
    } else {
      return true;
    }
  }
  /**
   * 清除所有的筛选条件
   */
  clearAll() {
    this.setState(
      {
        searchText: "",
        checkedList: [],
        projectListNowPage: 1,
        projectListAllPage: 0,
        labelId: [], //清空请求时的ids
        tagSelecteds: [], //清空视图层的标签列表数据
        searchProType: "2" //默认为全部
      },
      () => {
        this.getProjectListByPage();
      }
    );
    //     this.getProjectListByPage("", "1", []);
  }
  /**
   *
   * @description 分页加载更多列表
   */
  // projectListScroll(e) {
  //   const { projectListNowPage, projectListAllPage } = this.state;
  //   if (listScroll(e) && projectListNowPage < projectListAllPage) {
  //     this.setState(
  //       {
  //         projectListNowPage: projectListNowPage + 1
  //       },
  //       () => {
  //         this.getProjectListByPage();
  //       }
  //     );
  //   }
  // }
  onAllChange() {
    const { remeberCheckedList } = this.state;
    this.setState({
      checkedList: remeberCheckedList
    });
    //如果当前是取消，改为全选择
  }
  onPartChange() {
    const { remeberCheckedList, checkedList } = this.state;
    let newArray = [];
    remeberCheckedList.forEach((item, index) => {
      if (oneOf(item, checkedList)) {
      } else {
        newArray.push(item);
      }
    });
    this.setState({
      checkedList: newArray
    });
  }
  render() {
    const {
      projectSearchDivOnTop,
      tagSelecteds,
      tagComponentShow,
      searchText,
      searchProType,
      noTagShow,
      projectList,
      projectListAllPage,
      projectListNowPage,
      projectListLoading,
      projectListMoreLoading,
      projectId,
      checkedList,
      pageType,
      projectCount,
      isIso
    } = this.state;
    let reg = /^https/;
    let reg2 = /^http/;
    const TopSection = !pageType ? (
      <Row>
        <Input
          // prefix='a'
          prefix={
            <i
              className="iconfont icon-search"
              style={
                isIso
                  ? {
                      color: "#bdbdbd"
                    }
                  : {
                      fontSize: "16px",
                      color: "#08c",
                      height: "16px",
                      display: "flex",
                      color: "#bdbdbd",
                      lineHeight: "24px"
                    }
              }
            />
          }
          placeholder="搜索项目"
          value={searchText}
          onChange={e => {
            this.setSearchText(e.target.value);
          }}
        />
      </Row>
    ) : (
      <Row>
        <div
          style={{
            fontSize: "18px",
            color: "#212121",
            padding: "0px 0px 10px 0"
          }}
        >
          项目筛选
        </div>
      </Row>
    );
    const BottomButton = !pageType ? (
      <div className="bottom_button">
        <span
          onClick={() => {
            if (this.clearBtnIsActive()) {
              this.clearAll();
            }
          }}
          style={this.clearBtnIsActive() ? { color: "#64b5f6" } : {}}
        >
          清除筛选
        </span>
        <span className="small_span">
          筛选出{projectList && projectList.length}个项目
        </span>
      </div>
    ) : (
      ""
    );
    const MainList1 =
      projectList && projectList.length > 0
        ? projectList.map((item, i) => {
            return (
              <li key={item.id}>
                <Checkbox
                  checked={oneOf(item.id, checkedList)}
                  onChange={e => {
                    this.checkOnClick(item.id, e);
                  }}
                />
                <div className="pic pic2">
                  {item.attstr04 ? (
                    reg.test(item.attstr04) || reg2.test(item.attstr04) ? (
                      <img
                        src={item.attstr04}
                        className="pro-icon"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : item.attstr04 === "#pro-myfg-1020" ? (
                      <div className="nullIcon">
                        <i
                          className={
                            isIso
                              ? "iconfont icon-project "
                              : "iconfont icon-project windowIconProject"
                          }
                        />
                      </div>
                    ) : (
                      <svg className="pro-icon" aria-hidden="true">
                        <use xlinkHref={item.attstr04} />
                      </svg>
                    )
                  ) : (
                    <div className="nullIcon">
                      <i
                        className={
                          isIso
                            ? "iconfont icon-project "
                            : "iconfont icon-project windowIconProject"
                        }
                      />
                    </div>
                    // <svg className="pro-icon" aria-hidden="true">
                    //   <use xlinkHref="#pro-myfg-1020" />
                    // </svg>
                  )}
                </div>
                <div className="textMore">{item.proName && item.proName}</div>
              </li>
            );
          })
        : "";
    const MainList0 =
      projectList && projectList.length > 0
        ? projectList.map((item, i) => {
            return (
              <li
                key={item.id}
                onClick={() => {
                  this.checkOnClick(item.id);
                }}
                className={projectId === item.id ? " act" : ""}
              >
                <div className="pic">
                  {item.attstr04 ? (
                    reg.test(item.attstr04) || reg2.test(item.attstr04) ? (
                      <img
                        src={item.attstr04}
                        className="pro-icon"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : item.attstr04 == "#pro-myfg-1020" ? (
                      <div className="nullIcon">
                        <i
                          className={
                            isIso
                              ? "iconfont icon-project "
                              : "iconfont icon-project windowIconProject"
                          }
                        />
                      </div>
                    ) : (
                      <svg className="pro-icon" aria-hidden="true">
                        <use xlinkHref={item.attstr04} />
                      </svg>
                    )
                  ) : (
                    // ""
                    <div className="nullIcon">
                      <i
                        className={
                          isIso
                            ? "iconfont icon-project "
                            : "iconfont icon-project windowIconProject"
                        }
                      />
                    </div>
                    // <svg className="pro-icon" aria-hidden="true">
                    //   <use xlinkHref="#pro-myfg-1020" />
                    // </svg>
                  )}
                </div>
                <div className="textMore">{item.proName}</div>
              </li>
            );
          })
        : "";
    const MainContent = pageType ? MainList1 : MainList0;
    return (
      <div style={{ height: "100%" }}>
        {tagComponentShow ? (
          <TagSelect
            title="标签"
            type="2"
            selectedTags={tagSelecteds}
            closedCallBack={() => {
              this.setState({ tagComponentShow: false });
            }}
            // selectedProjects={JSON.parse(JSON.stringify(tagSelecteds))}
            selectedCallBack={val => {
              this.selectedTag(val);
            }}
          />
        ) : (
          ""
        )}
        <div
          className={
            projectSearchDivOnTop
              ? "pro_search pro_search_fixed "
              : "pro_search"
          }
        >
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          {/* 头部 */}
          {TopSection}
          {/* 项目分组 */}
          {pageType ? (
            ""
          ) : (
            <div className="pro_tag">
              <div className="pro_tag_title">项目分组</div>
            </div>
          )}

          <Row>
            <RadioGroup
              value={searchProType}
              buttonStyle="solid"
              onChange={e => {
                this.typeChange(e.target.value);
              }}
            >
              <RadioButton value="1">全部</RadioButton>
              <RadioButton value="2">我参与</RadioButton>
              <RadioButton value="4">我负责</RadioButton>
              <RadioButton value="3">我关注</RadioButton>
            </RadioGroup>
          </Row>
          {/* 项目标签 */}
          <div
            className="pro_tag"
            onMouseOver={() => {
              this.setState({ noTagShow: true });
            }}
            onMouseOut={() => {
              this.setState({ noTagShow: false });
            }}
          >
            <div className="pro_tag_title">项目标签</div>
            <div
              className={tagSelecteds.length > 0 ? "myTag tagBox" : "tagBox"}
            >
              <Tag
                tagSelecteds={tagSelecteds}
                canAdd={true}
                canEdit={true}
                tagChangeCallBack={val => {
                  this.selectedTag(val);
                }}
                maxHeight="300px"
                isProjectTypes={true}
              />
              {tagSelecteds.length > 0 ? (
                ""
              ) : (
                <div className="null">
                  {/* {noTagShow ? <span>选择标签</span> : <span>未选标签</span>} */}
                  不限
                </div>
              )}
            </div>
          </div>
          {/* 清除筛选 */}
          <div className="pro_tag">
            <div
              className="pro_tag_title"
              style={{ marginTop: pageType ? "16px" : "5px" }}
            >
              <span>项目列表</span>
              {pageType ? (
                <span
                  onClick={() => {
                    this.onAllChange();
                  }}
                  style={{
                    marginLeft: "10px",
                    textDecoration: "underline",
                    fontSize: "12px",
                    color: "#757575",
                    cursor: "pointer"
                  }}
                >
                  全选
                </span>
              ) : (
                ""
              )}
              {pageType ? (
                <span
                  onClick={() => {
                    this.onPartChange();
                  }}
                  style={{
                    marginLeft: "10px",
                    textDecoration: "underline",
                    fontSize: "12px",
                    color: "#757575",
                    cursor: "pointer"
                  }}
                >
                  反选
                </span>
              ) : (
                ""
              )}
              {pageType ? (
                <span
                  className="jisuan"
                  style={checkedList.length > 0 ? {} : { background: "#eee" }}
                  onClick={() => {
                    this.projectOnClick();
                  }}
                >
                  计算
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div
            className="pro-list"
            style={{
              marginBottom: pageType ? "0px" : "40px"
            }}
            ref="pro_list_scroll"
            onScroll={e => {
              // this.projectListScroll(e);
            }}
          >
            <Spin spinning={projectListLoading} />

            {MainContent}
            {!projectListMoreLoading &&
            projectListNowPage < projectListAllPage ? (
              <div className="moreLoadingRow">下拉加载更多</div>
            ) : (
              ""
            )}
            {projectListMoreLoading ? (
              <div className="moreLoadingRow">
                <Icon type="loading" className="loadingIcon" />
                正在加载更多
              </div>
            ) : (
              ""
            )}
            {!projectListMoreLoading &&
            projectListNowPage === projectListAllPage &&
            projectList.length > 0 ? (
              <div className="moreLoadingRow">共计{projectCount}个项目</div>
            ) : (
              ""
            )}
          </div>
          {BottomButton}
        </div>
      </div>
    );
  }
}
