"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.down = down;
exports.getTaskDistributedByState = getTaskDistributedByState;
exports.getTaskDistributedByProject = getTaskDistributedByProject;
exports.downByProject = downByProject;
exports.downPendByProject = downPendByProject;
exports.downPendByPerson = downPendByPerson;
exports.downNumByProject = downNumByProject;
exports.downNumByPerson = downNumByPerson;
exports.downContentByProject = downContentByProject;
exports.downContentByPerson = downContentByPerson;
exports.getProListByType = getProListByType;
exports.getProListByJurisdiction = getProListByJurisdiction;
exports.getProjectListByTypeTag = getProjectListByTypeTag;
exports.getPendStatistics = getPendStatistics;
exports.getProjectStatistics = getProjectStatistics;
exports.getNumByProject = getNumByProject;
exports.getNumByPerson = getNumByPerson;
exports.downLoadTaskByStatus = downLoadTaskByStatus;
exports.getProjectProgess = getProjectProgess;
exports.getPendByProject = getPendByProject;
exports.getContentByProject = getContentByProject;
exports.getContentByPerson = getContentByPerson;
exports.addAttentionWitchProject = addAttentionWitchProject;
exports.cancelAttentionWitchProject = cancelAttentionWitchProject;
exports.getProjectTaskListById = getProjectTaskListById;
exports.getProjectList = getProjectList;
exports.createProject = createProject;
exports.deleteProject = deleteProject;
exports.getChartByUserTask = getChartByUserTask;
exports.getChartByUserMoney = getChartByUserMoney;
exports.getChartByTaskSituation = getChartByTaskSituation;
exports.getChartByProjectProgress = getChartByProjectProgress;
exports.getFileListByProjectId = getFileListByProjectId;
exports.getProjectChartData = getProjectChartData;
exports.getProjectCreateInfoById = getProjectCreateInfoById;
exports.updateImportExcelByProject = updateImportExcelByProject;
exports.projectLimit = projectLimit;
exports.projectrecycled = projectrecycled;
exports.restoreProject = restoreProject;
exports.removeCompletely = removeCompletely;
exports.saveFiling = saveFiling;
exports.cancelFiling = cancelFiling;
exports.copyProject = copyProject;
exports.projectCount = projectCount;

var _HttpClient = require("../api/HttpClient");

var _HttpClient2 = _interopRequireDefault(_HttpClient);

var _punycode = require("punycode");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//根据类型和标签获取项目列表
function down(projectIds, callback) {
  _HttpClient2.default.AjaxPost("/statistics/downLoadTaskByStatus", { projectId: projectIds.join(",") }, function (list) {
    callback(list);
  });
}
//统计模块任务分布按任务状态
function getTaskDistributedByState(projectIds, callback) {
  _HttpClient2.default.AjaxPost("/calculate/getTaskDistributedByState", projectIds, function (list) {
    callback(list);
  });
}
//统计模块任务分布按项目
function getTaskDistributedByProject(projectIds, callback) {
  _HttpClient2.default.AjaxPost("/calculate/getTaskDistributedByProject", projectIds, function (list) {
    callback(list);
  });
}
function downByProject(projectIds, callback) {
  _HttpClient2.default.AjaxPost("/statistics/downLoadTaskByProject", { projectId: projectIds.join(",") }, function (list) {
    callback(list);
  });
}
//1
function downPendByProject(projectIds, callback) {
  _HttpClient2.default.AjaxPost("/statistics/downLoadPendByProject", { projectId: projectIds.join(",") }, function (list) {
    callback(list);
  });
}
//2
function downPendByPerson(projectIds, callback) {
  _HttpClient2.default.AjaxPost("/statistics/downLoadPendByPerson", { projectId: projectIds.join(",") }, function (list) {
    callback(list);
  });
}
//3
function downNumByProject(projectIds, type, attdate01, attdate02, callback) {
  _HttpClient2.default.AjaxPost("/statistics/downLoadNumByProject", { projectId: projectIds.join(","), type: type, attdate01: attdate01, attdate02: attdate02 }, function (list) {
    callback(list);
  });
}
//4
function downNumByPerson(projectIds, type, attdate01, attdate02, callback) {
  _HttpClient2.default.AjaxPost("/statistics/downLoadNumByPerson", { projectId: projectIds.join(","), type: type, attdate01: attdate01, attdate02: attdate02 }, function (list) {
    callback(list);
  });
}
//5
function downContentByProject(projectIds, type, attdate01, attdate02, callback) {
  _HttpClient2.default.AjaxPost("/statistics/downLoadContentByProject", { projectId: projectIds.join(","), type: type, attdate01: attdate01, attdate02: attdate02 }, function (list) {
    callback(list);
  });
}
//6
function downContentByPerson(projectIds, type, attdate01, attdate02, callback) {
  _HttpClient2.default.AjaxPost("/statistics/downLoadContentByPerson", { projectId: projectIds.join(","), type: type, attdate01: attdate01, attdate02: attdate02 }, function (list) {
    callback(list);
  });
}

// 根据类型获取项目列表
/*
 * type:'1'                    // 1团队所有 2我参与的 3我收藏的 4我负责的
 */
function getProListByType(type, pageNo, callback) {
  var pageSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 40;
  var labelIds = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var search = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
  var orderBy = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "DESC";
  var userIds = arguments[7];
  var time = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];

  var data = {
    type: type,
    labelId: labelIds,
    orderBy: orderBy,
    search: search,
    userIds: userIds,
    startCreateDate: time[0],
    endCreateDate: time[1]
  };
  _HttpClient2.default.AjaxPost("/project/projectPageIndex?pageSize=" + pageSize + "&pageNo=" + pageNo, data, function (list) {
    callback(list);
  });
}
//获取带有创建权限的项目列表

function getProListByJurisdiction() {
  var pageSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 40;
  var pageNo = arguments[1];
  var callback = arguments[2];
  var proname = arguments[3];

  _HttpClient2.default.AjaxPost("/project/getProjectIds?pageSize=" + pageSize + "&pageNo=" + pageNo, { proname: proname }, function (list) {
    callback(list);
  });
}

//根据类型和标签获取项目列表
function getProjectListByTypeTag() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "0";
  var labelId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var search = arguments[2];
  var callback = arguments[3];

  _HttpClient2.default.AjaxPost("/project/getProjectResult", { type: type, labelId: labelId, search: search }, function (list) {
    callback(list);
  });
}
//根据项目id查询待办统计（按人员）
function getPendStatistics() {
  var projectIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments[1];

  _HttpClient2.default.AjaxPost("/calculate/getPendStatistics", projectIds, function (list) {
    callback(list);
  });
}
//根据项目id查询待办统计（按项目）
function getProjectStatistics() {
  var projectIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments[1];

  _HttpClient2.default.AjaxPost("/project/getStatisticsIndex", projectIds, function (list) {
    callback(list);
  });
}
//根据项目id查询绩效统计（任务数） 按项目
function getNumByProject(type) {
  var projectIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var attdate01 = arguments[2];
  var attdate02 = arguments[3];
  var callback = arguments[4];

  _HttpClient2.default.AjaxPost("/calculate/getNumByProject", type, projectIds, attdate01, attdate02, function (list) {
    callback(list);
  });
}
//根据项目id查询绩效统计（任务数） 按人员
function getNumByPerson(type) {
  var projectIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var attdate01 = arguments[2];
  var attdate02 = arguments[3];
  var callback = arguments[4];

  _HttpClient2.default.AjaxPost("/calculate/getNumByPerson", type, projectIds, attdate01, attdate02, function (list) {
    callback(list);
  });
}

//任务分布按状态
function downLoadTaskByStatus(data, callback) {
  _HttpClient2.default.AjaxPost("/statistics/downLoadTaskByStatus", data, function (list) {
    callback(list);
  });
}
//根据项目id查询项目进展
function getProjectProgess(data, callback) {
  _HttpClient2.default.AjaxPost("/calculate/getStatisticsCountDao", data, function (list) {
    callback(list);
  });
}

//待办统计 按项目
function getPendByProject(data, callback) {
  _HttpClient2.default.AjaxPost("/calculate/getPendByProject", data, function (list) {
    callback(list);
  });
}
//根据项目id查询 绩效统计(绩效值) 按项目

function getContentByProject() {
  var projectIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var attdate01 = arguments[1];
  var attdate02 = arguments[2];
  var type = arguments[3];
  var callback = arguments[4];

  _HttpClient2.default.AjaxPost("/calculate/getContentByProject", projectIds, attdate01, attdate02, type, function (list) {
    callback(list);
  });
}
//根据项目id查询 绩效统计(绩效值) 按人员
function getContentByPerson() {
  var projectIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var attdate01 = arguments[1];
  var attdate02 = arguments[2];
  var type = arguments[3];
  var callback = arguments[4];

  _HttpClient2.default.AjaxPost("/calculate/getContentByPerson", projectIds, attdate01, attdate02, type, function (list) {
    callback(list);
  });
}

// 关注项目
function addAttentionWitchProject(objectId, callback) {
  var data = { rtype: "a", objectId: objectId };
  _HttpClient2.default.AjaxPost("/collect/collect", data, function (list) {
    callback(list);
  });
}
// 取消关注项目
function cancelAttentionWitchProject(objectId, callback) {
  var data = { rtype: "a", objectId: objectId };
  _HttpClient2.default.AjaxPost("/collect/callCollect", data, function (list) {
    callback(list);
  });
}

// 获取项目的任务树结构数据
function getProjectTaskListById(progectId, parentId, taskId, pageNo, callback) {
  var hideOkTask = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
  var search = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";

  _HttpClient2.default.AjaxPost("/taskinfo/findTreePageList?progectId=" + progectId + "&pId=" + parentId + "&pageNo=" + pageNo + "&id=" + taskId, { hidden: hideOkTask, search: search }, function (list) {
    callback(list);
  });
}
// 加载项目列表
function getProjectList(callback) {
  _HttpClient2.default.AjaxPost("/project/projectList", "", function (list) {
    callback(list);
  });
}

// 创建项目
/*
 * {
	category:"0"         // PC创建的
	id:""                // 修改的时候传项目ID
	memberofpros:[{选人组件获取到的信息
		0:{负责人信息
		  delete:""      // 为'1'删除
		  id:""          // 删除时 传递用户的记录ID
		  rtype:"2"
		  user:{
              userid: "8ff0cc5eeb9a4db8929cb5832c05e0b2"
         }
		1:{rtype: "1", id: "",…}管理员信息
		2:{rtype: "0", id: "",…}项目成员信息
		]
	    opentype:"0"是否全员可见（0为不可见）
	    proname:"测试添加2" 项目名称
	    proremark:"三十四" 项目描述
	    attstr04:"" 项目图标
	    labelIds：[id,id] 项目分类id集合(数组)
	}
 */
// 创建修改项目
function createProject(data, callback) {
  _HttpClient2.default.AjaxPost("/project/projectAddNew", data, function (list) {
    callback(list);
  });
}

// 删除项目
function deleteProject(id, callback) {
  _HttpClient2.default.AjaxPost("/project/projectDelete", { id: id }, function (list) {
    callback(list);
  });
}

// 人员任务统计
function getChartByUserTask(data, callback) {
  _HttpClient2.default.AjaxPost("/calculate/getTasktableCount", data, function (list) {
    callback(list);
  });
}

// 人员绩效统计
function getChartByUserMoney(data, callback) {
  _HttpClient2.default.AjaxPost("/calculate/getContenTableData", data, function (list) {
    callback(list);
  });
}

// 任务概述统计
function getChartByTaskSituation(id, callback) {
  _HttpClient2.default.AjaxPost("/calculate/project?id=" + id, "", function (list) {
    callback(list);
  });
}

// 项目进展统计
function getChartByProjectProgress(data, callback) {
  _HttpClient2.default.AjaxPost("/calculate/getProgressView", data, function (list) {
    callback(list);
  });
}

// 获取项目的文件列表
function getFileListByProjectId(projectId, parentId) {
  var pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;
  var pageNo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var callback = arguments[4];
  var fileName = arguments[5];

  _HttpClient2.default.AjaxPost("/files/fileIdexListNew?projectId=" + projectId + "&parentId=" + parentId + "&fileName=" + fileName + "&pageSize=" + pageSize + "&pageNo=" + pageNo, {}, function (list) {
    callback(list);
  });
}

// 获取项目甘特图数据
function getProjectChartData(id, callback) {
  _HttpClient2.default.AjaxPost("/project/projectGantt?id=" + id, "", function (list) {
    callback(list);
  });
}

// 获取项目设置的数据
function getProjectCreateInfoById(id, callback) {
  _HttpClient2.default.AjaxPost("/project/projectDetailsNew?id=" + id, "", function (list) {
    callback(list);
  });
}

// 提交导入的数据
function updateImportExcelByProject(projectId, parentId, callback) {
  _HttpClient2.default.AjaxPost("/taskinfo/affirmChannel?type=0&projectId=" + projectId + "&taskinfoId=" + parentId, "", function (list) {
    callback(list);
  });
}

// 项目更新
/*export function projectUpdate(data,callback) {
    HttpClient.AjaxPost('/project/projectUpdate',data,list => {
        callback(list);
    });
}*/

//免费限制
function projectLimit(callback) {
  _HttpClient2.default.AjaxGet("/project/projectCountLimit", function (list) {
    callback(list);
  });
}
//获取已删除的项目列表
function projectrecycled(callback) {
  _HttpClient2.default.AjaxGet("/project/projectRecycleBin", function (list) {
    callback(list);
  });
}
//恢复已删除的项目
function restoreProject(projectId, callback) {
  _HttpClient2.default.AjaxPost("/project/restoreProject", { id: projectId }, function (list) {
    callback(list);
  });
}

//彻底删除已删除的项目
function removeCompletely(projectId, callback) {
  _HttpClient2.default.AjaxPost("/project/removeCompletely", { id: projectId }, function (list) {
    callback(list);
  });
}
//project/saveFiling  项目归档
function saveFiling(projectId, callback) {
  _HttpClient2.default.AjaxPost("/project/saveFiling", { id: projectId }, function (list) {
    callback(list);
  });
}
//取消归档
function cancelFiling(progectId, callback) {
  _HttpClient2.default.AjaxPost("/project/cancelFiling", { id: progectId }, function (list) {
    callback(list);
  });
}
//项目复制 project/copyProject
function copyProject(projectId, user, antPrefType, proname, callback) {
  _HttpClient2.default.AjaxPost("/project/copyProject", { id: projectId, user: user, antPrefType: antPrefType, proname: proname }, function (list) {
    callback(list);
  });
}
function projectCount(callback) {
  _HttpClient2.default.AjaxGet("/project/projectGroupsNumber", function (list) {
    callback(list);
  });
}