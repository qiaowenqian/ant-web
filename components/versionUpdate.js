import React from "react";
import { Modal, Row, Col } from "antd";
import stylesheet from "styles/components/versionUpdate.scss";
import HttpClient from "../core/api/HttpClient";

/*
 （选填） closeCallBack()    // 关闭回调
 */

export default class MoneyEnd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      St: true
    };
  }
  componentWillMount = () => {
    if (HttpClient.getVersion() === "2.3.4") {
      this.setState({ St: true });
    } else {
      this.setState({ St: false });
    }
  };
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  closeModal() {
    if (this.props.closeCallBack) {
      this.props.closeCallBack();
    } else {
      this.setState({ visible: false });
    }
  }
  show1St = () => {
    const { St } = this.state;
    this.setState({ St: !St });
  };
  render() {
    const { versionUpdateShow } = this.props;
    const { St } = this.state;
    return (
      <Modal
        visible={versionUpdateShow}
        width={800}
        closable={true}
        onCancel={() => {
          this.closeModal();
        }}
        footer={null}
        mask={true}
        className="upMask"
        wrapClassName="versionModel"
      >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNew">2.3.5</div>
            <span>2019.06.14</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotBlue" />
            <div>增加开始时间</div>
            <p>
              1、新增为任务设置计划开始时间
              <br />
              2、新增标记完成时可选择实际的开始时间
              <br />
              3、新增为任务设置自定义的提醒
              <br />
              4、新增关于开始时间的筛选和排序
              <br />
              5、新增对开始时间的批量修改
              <br />
              6、优化重复任务对截止时间的计算
              <br />
              7、修复项目导出只导出第一批任务的问题
              <br />
              8、修复附件名字太长时显示错行的问题
              <br />
              9、修复统计模块历史数据出现负数的问题
              <br />
              10、修复通过父任务完成子任务会覆盖原始完成时间的问题
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">一周年</div>
            <span>2019.06.05</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                this.show1St();
              }}
            >
              蚂蚁分工写给用户的一周年信{St ? "" : "..."}
            </div>
            {St ? (
              <p>
                &nbsp;&nbsp;
                &nbsp;&nbsp;2019年的6月5日，是[蚂蚁分工]在钉钉平台上正式全面亮相一周年的日子。我们给[蚂蚁分工]的用户写了这一封信：我们努力精进的方向，以及想为用户做到的事情。
                <br />
                &nbsp;&nbsp;
                &nbsp;&nbsp;从决定要开始创业创造一个我们为之骄傲的企业服务产品开始，我们一直在考虑要定期向我们的用户汇报，汇报我们些许的成绩，和在无限接近你的需求的路上的努力。
                <br />
                &nbsp;&nbsp;
                &nbsp;&nbsp;怀着破釜沉舟的决心，经过坚持不懈的努力，钉钉团队的全方位指导协助，[蚂蚁分工]从种子用户的内部应用，在2018年的6月5日正式上架钉钉，面向更广大的用户。
                <br />
                &nbsp;&nbsp;
                &nbsp;&nbsp;过去一年里，[蚂蚁分工]紧跟钉钉开放平台的节奏，在每一个迭代升级窗口持续发布优化，实现了H5应用向钉钉小程序的架构性升级。在此基础上，[蚂蚁分工]获得了众多用户的青睐，持续位居“团队协同”类应用的榜首，数万家企业在这一年中注册启用，在钉钉“331开工节”跻身“同品类冠军”、“全品类五强”……
                <br />
                &nbsp;&nbsp;
                &nbsp;&nbsp;但是，不管我们的工作内容能列多长，我们都心知肚明：
                <br />
                &nbsp;&nbsp;
                &nbsp;&nbsp;[蚂蚁分工]还蹒跚在更接近你的需求的路上，远未达到我们希望为你创造的愿景价值。我们对自己很不满意。
                <br />
                &nbsp;&nbsp;
                &nbsp;&nbsp;特别是当[蚂蚁分工]可适应的需求场景越来越多，自定义功能选项越来越多的时候，我们对自己不满意。我们难道只是在冥思苦想各种“交互”，等着你根据当下需要前来选择相应“功能”吗？难道我们不是应该帮助你从顶层设计和底层逻辑去优化业务流程、创造业务价值吗？
                <br />
                &nbsp;&nbsp; &nbsp;&nbsp;在我们的眼里，有这样两种企业服务：
                <br />
                &nbsp;&nbsp;
                &nbsp;&nbsp;一种是密切接触各种现下的功能需求，密切跟进同类产品的迭代，提供功能细节丰富的工具软件。——这是在马车时代制造更好的马车。
                <br />
                &nbsp;&nbsp;
                &nbsp;&nbsp;另一种服务，有着改变世界的起心动念，有超强的挨饿抗打击力，按照清晰的演化思路，持续进化服务方式。这样的服务未必与你的业务现状丝丝入扣，但持续进行顶层设计和底层优化，改变的是未来的业务形态。——这是马车时代创造汽车的努力。
                <br />
                &nbsp;&nbsp; &nbsp;&nbsp;无所畏惧地讲，我们必须成为后一种。
                <br />
                &nbsp;&nbsp;
                &nbsp;&nbsp;因为我们害怕不是根据深入的思考去行动，而是根据市场位置去思考。
                <br />
                &nbsp;&nbsp; &nbsp;&nbsp;
                一旦被现在的“位置”限制了思考，就不太分得清楚：
                <li style={{ listStyleType: "circle", marginLeft: 23 }}>
                  努力在干的工作，是在创造未来？还是在随波逐流？
                </li>
                <li style={{ listStyleType: "circle", marginLeft: 23 }}>
                  获得的一些成绩，是属于既往成就？还是属于未来羁绊？
                </li>
                <li style={{ listStyleType: "circle", marginLeft: 23 }}>
                  没有做出来的事情，到底是因为自己克制？还是因为能力欠缺？
                </li>
                &nbsp;&nbsp;
                &nbsp;&nbsp;所以，我们不能一直呆在同一个位置，那会让你失望。
                <br />
                <br />
                &nbsp;&nbsp; &nbsp;&nbsp;未来，我们会一直坚持All
                in钉钉，在钉钉开放平台上提供真正的“服务”，而不仅仅是“工具”。
                <br />
                &nbsp;&nbsp;
                &nbsp;&nbsp;我们强调“服务”，因为接受服务的用户——也就是你和你的团队——才是中心。一个“产品”好不好，得看它在为用户提供什么价值，为社会解决什么问题。
                <br />
                &nbsp;&nbsp; &nbsp;&nbsp;
                <b style={{ textDecoration: "underline" }}>
                  用互联网让工作更轻松
                </b>
                ——越朝向这个愿景，就越感到服务能力的不足。接下来的一年，我们就会紧紧围绕“服务”两个字玩命：
                <br />
                <b>1. 拓展“行业业务”的支持</b>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;除了持续优化更灵活强大的各项功能，我们要全面拓展跟你的团队业务直接相关的行业性解决方案，你可以分享经验给其他同学，也可以借鉴同学分享的模板来优化你的业务流程。
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;无论你是什么行业，总有同行的优化经验可以学习和借鉴；无论你有何种有助于让信息网络协同一切工作的思路，也可以分享给同行，甚至形成同行同盟，共同优化解决方案。
                <br />
                <b> 2. 拓展“业务协作”的新形态</b>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;以往的协同工作，都是基于企业内部组织架构，优化内部工作流程，提高工作衔接效率。随着互联网深入到各种场景，接下来我们将组织、壮大企业外部的协作群体，帮你构建一个企业内外部的业务共同体。
                <br />
                <b> 3. 帮你复盘总结过去的经验</b>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;随着你在[蚂蚁分工]上过去一年多的积累，让我们感觉到了另一种可能，你积累的业务数据，已经可以作为经验进行复盘和复用了。我们要帮助在使用蚂蚁分工过程中有思考、尝试、积累的每一个团队，形成独创的、丰富维度的经验体系，指导后续的业务优化、评价每一位参与协作的员工同伴。
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;基于以上发展规划，你会发现，[蚂蚁分工]将不仅仅是钉钉上的一个团队协同工具应用，它会成为你的业务桥梁，联通同行、联通上下游，成为你团队的知识库，追溯过往经验，持续优化业务流程。
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;[蚂蚁分工]的目标愿景坚持不变，也将坚持All
                in钉钉。我们现在想要走得更快一点。
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;在过去这一年，我们有幸给很多卓越的企业和团队提供了服务，他们绝大多数都已经在[蚂蚁分工]上倾注了极大的热情和努力，也持续提出需求与我们的团队一起共创。我们借此机会向他们表示感谢，并感恩回馈。
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;在接下来的一年，如果你想帮助我们，请你表达出这个意愿——在钉钉开放平台找到[蚂蚁分工]，给我们真实的好评。帮助了更多团队认识我们，你就是蚂蚁分工的荣誉赞助人。同时请监督我们，发现我们偏离规划方向，也请你严厉地批评我们。
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;谢谢。请你和你的团队在新的一年继续容忍和监督[蚂蚁分工]。
              </p>
            ) : (
                ""
              )}
            {St ? (
              <p style={{ fontSize: 12, color: "#bdbdbd", marginLeft: 12 }}>
                注：作为《得到》的深度用户，读《得到》撰写发布的三周年信后，清润（高治剑）深觉感动和认同，遂向《得到》表明用意，在其结构基础上修成[蚂蚁分工]的周年信。在此向《得到》致谢，并推荐《得到》——中国最好的知识服务商
              </p>
            ) : (
                <p />
              )}
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.3.3</div>
            <span>2019.05.23</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>多项功能优化</div>
            <p>
              1、符合条件的基础版企业可再次试用专业版，体验最新专业版功能
              <br />
              2、优化了任务的导出体验，导出的文件通过工作通知异步发送
              <br />
              3、修复了统计图表数据为0时的显示问题
              <br />
              4、修复了批量修改个别字段通知错误的问题
              <br />
              5、修复了统计中任务会被重复计数的问题
              <br />
              6、修复了删除复制出项目中的文件会删除原项目文件的问题
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.3.2</div>
            <span>2019.05.17</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>
              重复任务上线<span className="upVersion">专业版</span>
            </div>
            <p>
              重复任务可以用来管理周期性事项，为一个任务设置好重复规则后，蚂蚁分工将在符合重复规则的条件下，自动创建相同的任务，并自动计算出新的任务截止时间。
              <br />
              1、创建任务时可设置重复规则，生成周期创建的重复任务
              <span className="upVersion">专业版</span>{" "}
              <span
                className="upGif"
                onClick={() => {
                  this.props.cycleRule(true);
                }}
              >
                GIF
              </span>
              <br />
              2、可为现有的普通任务设置重复规则，生成周期创建的重复任务
              <span className="upVersion">专业版</span>
              <br />
              3、任务的重复规则可通过“设置-自动化规则”统一管理
              <span className="upVersion">专业版</span>
              <span
                className="upGif"
                onClick={() => {
                  this.props.cycle(true);
                }}
              >
                GIF
              </span>
              <br />
              4、催办任务时可填写催办内容
              <br />
              5、催办任务时可使用钉钉的 DING 功能来提醒任务责任人
              <br />
              6、任务的负责人筛选去除数量限制
              <br />
              7、优化标签的宽度自适应规则
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.3.1</div>
            <span>2019.05.10</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>多项功能优化</div>
            <p>
              1、任务分组增加综合排序
              <br />
              2、增加批量添加关注人的功能
              <br />
              3、导入任务时可选择是否将关注人加入项目成员
              <br />
              4、任务详情中添加关注人时可选择是否将关注人加入项目
              <br />
              5、不可见项目的任务关注人仅可通过“我关注的”任务分组查看任务
              <br />
              6、移除项目成员时增加提示
              <br />
              7、修复保存项目设置引起的权限丢失问题
              <br />
              8、修复项目名称修改后更新延迟的问题
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.3.0</div>
            <span>2019.04.16</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>
              项目归档及多项优化
              <span
                className="upGif"
                onClick={() => {
                  this.props.VersionFile(true);
                }}
              >
                GIF
              </span>
            </div>
            <p>
              1、增加项目归档功能
              <br />
              2、项目页增加筛选和排序，优化视觉显示
              <br />
              3、筛选项目后的条件和位置修改为在返回时不清除
              <br />
              4、筛选排序窗口增加常驻功能
              <br />
              5、开放“我的任务”，可查看不分时间段的相关任务
              <br />
              6、调整标签管理权限，基础版可对已有标签进行修改或删除
              <br />
              7、任务中的人员筛选支持选择多人
              <br />
              8、修复复制项目时响应缓慢的问题
              <br />
              9、修复富文本格式导致的显示乱码问题
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.2.9</div>
            <span>2019.03.26</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>
              回收站功能 <span className="upVersion">专业版</span>
              <span
                className="upGif"
                onClick={() => {
                  this.props.recycleGif(true);
                }}
              >
                GIF
              </span>
            </div>
            <p>
              1、在设置中增加了回收站入口，专业版可恢复最近30天删除的任务和项目
              <span className="upVersion">专业版</span>
              <br />
              2、在项目设置中增加了复制功能，专业版可通过复制快速创建项目
              <span className="upVersion">专业版</span>
              <br />
              3、修复项目标签与任务标签无法同名的问题
              <br />
              4、修复任务详情中点击@页面会返回顶部的问题
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.2.8</div>
            <span>2019.03.15</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>调整任务分组</div>
            <p>
              1、任务分组新增今日任务、最近7天、最近30天，关注不同时段要做的事，回顾做过的事
              <br />
              2、导入任务中增加导入关注人的功能
              <br />
              3、任务描述和讨论中可自动识别 URL，点击可直接打开
              <br />
              4、优化创建任务时搜索项目的功能
              <br />
              5、修复个别操作的任务日志记录问题
              <br />
              6、修复添加关注人通知缺失的问题
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.2.7</div>
            <span>2019.03.01</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>任务详情页体验优化</div>
            <p>
              1、调整页面整体布局与排版
              <br />
              2、优化子任务、协作任务的交互体验
              <br />
              3、优化页面内管理附件的交互体验
              <br />
              4、讨论与日志调整为倒序显示，最新的在前
              <br />
              5、规范日志格式，完整记录任务的每一次变化
              <br />
              6、优化发布讨论的交互体验
              <br />
              7、讨论中增加@功能，可提醒指定人员
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.2.6</div>
            <span>2019.01.25</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>多项功能优化</div>
            <p>
              1、项目内增加对任务的手动排序功能
              <span
                className="upGif"
                onClick={() => {
                  this.props.sortGif(true);
                }}
              >
                GIF
              </span>
              <br />
              2、优化移动与复制任务的交互，选择任务时支持按名称搜索
              <br />
              3、复制任务时可对子任务统一添加前缀
              <br />
              4、基础版可进行项目内的任务移动和复制
              <br />
              5、任务详情中协作任务增加WBS编号显示
              <br />
              6、修复已知bug
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.2.5</div>
            <span>2019.01.10</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>
              任务操作权限控制与多项优化
              <span
                className="upGif"
                onClick={() => {
                  this.props.settingGif(true);
                }}
              >
                GIF
              </span>
            </div>
            <p>
              基础版和专业版均可在项目设置中对任务的创建、修改、删除进行自定义的权限设置，方便在不同项目中对任务进行更加灵活的管理。本次更新同时包含以下功能优化：
              <br />
              1、任务模块中可快速查看今日新增、今日完成的任务
              <br />
              2、任务列表增加对未完成任务的数字统计
              <br />
              3、任务模块可快速查看逾期任务
              <span className="upVersion">专业版</span>
              <br />
              4、筛选排序增加按截止时间的排序
              <br />
              5、筛选排序对基础版开放负责人筛选
              <br />
              6、项目图标支持上传自定义图片
              <br />
              7、标签管理中支持将标签拖拽移动至其他分组
              <span className="upVersion">专业版</span>
              <br />
              8、优化应用内文字缩略规则
              <br />
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.2.3</div>
            <span>2019.01.05</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>8项体验优化</div>
            <p>
              1、优化应用的加载与响应速度
              <br />
              2、优化版本介绍的功能对比样式
              <br />
              3、优化各个版本的标识显示
              <br />
              4、在各个列表底部增加条目数显示
              <br />
              5、调整绩效默认值，适应大部分企业
              <br />
              6、优化导出表格，增加时间显示
              <br />
              7、修复标记完成时文本格式消失的问题
              <br />
              8、项目介绍去掉字数限制
              <br />
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.2.0</div>
            <span>2018.12.14</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>
              跨项目统计模块上线
              <span className="upVersion">专业版</span>
              <span
                className="upGif"
                onClick={() => {
                  this.props.demoShowTest(true);
                }}
              >
                GIF
              </span>
            </div>
            <p>
              专业版用户在统计模块中通过筛选项目，可快速查看多个项目中当前的任务分布以及待办排行，也可快速统计出不同时间段内各项目与人员的绩效值排行，同时支持导出各类完整的统计数据。
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.1.5</div>
            <span>2018.12.07</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>10项功能优化</div>
            <p>
              新增：项目详情页左栏增加搜索与标签筛选，切换更加方便；项目内文件列表增加文件格式图标，查阅更加直观；点击讨论区和动态的人员头像可显示钉钉资料窗口，沟通更加快捷；设置中增加授权信息，随时查看当前版本与状态。优化：编辑任务时不再遮挡输入区；批量修改时点任务行即可选中和反选；记忆更多用户习惯如“隐藏已完成”等；调整统计图表的配色；微调绩效系数使更符合用户视角；调整设置项菜单层次。
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.1.4</div>
            <span>2018.11.18</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>任务的高级筛选与排序</div>
            <p>
              重新设计任务列表的筛选功能，专业版支持同时按项目、标签、负责人、确认人、截止时间、任务绩效等多个条件筛选，新增支持不同的排序方式，筛选与排序都具有记忆功能，越用越顺手。任务截止时间精确到分钟，逾期之前及时提醒。同时优化了不同版本的引导弹窗以及更有条理的版本更新说明。
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.1.3</div>
            <span>2018.10.16</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>8项功能优化</div>
            <p>
              新增：对于已离职或未授权人员的特殊显示、移动端的任务搜索功能；优化：动态列表筛选条件变更后列表自动回到顶部、人员统计图放大后的显示效果、已完成任务禁止删除成果文件、导入任务的交互与流程；修复：手动换行排版在两端显示不一样的问题、里程碑无法取消的问题、个别情况全部任务下显示不完整的问题。
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.1.2</div>
            <span>2018.09.30</span>
          </Col>
          <Col span={20} className="upName moreText">
            <span className="dotbdbdbd" />
            <div>8项功能优化</div>
            <p>
              新增：甘特图图例、分批次导出、绩效计算合法校验、点击每日通知可直接跳转工作台；
              优化：动态列表中任务跳转逻辑、
              已删除任务的提示页面、项目进展图绘制；修复：子任务列表催办缺失的问题
              。
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.1.1</div>
            <span>2018.09.21</span>
          </Col>
          <Col span={20} className="upName moreTextlast">
            <span className="dotbdbdbd" />
            <div>动态列表体验优化</div>
            <p>
              在列表中直接显示任务图片及讨论内容，查看更直观；调整UI布局，层次更清晰；筛选功能优化，使用更顺手。同时完成了多项功能优化，如修复了文件列表中过程文件的缺失问题、标签管理操作优化、任务文件及通知添加任务编号的显示等。
            </p>
          </Col>
        </Row>
        <Row className="lastText">
          <Col span={4} className="upDateTime">
            <div className="upDateTimeNum">2.1.0</div>
            <span>2018.09.08</span>
          </Col>
          <Col span={20} className="upName">
            <span className="dotbdbdbd" />
            <div>专业版正式上线</div>
            <p>
              项目中新增甘特图、进展趋势图、任务分布图、人员待办统计图以及人员绩效统计图，新增人员待办与绩效的导出的功能。任务中新增“全部任务”视图，支持高级筛选及批量操作；新增任务的复制与移动，支持跨项目操作；新增任务完成后的撤回功能，支持在驳回、确认任务时上传文件；新增快捷隐藏已完成与任务包的功能。
            </p>
          </Col>
        </Row>
      </Modal>
    );
  }
}
