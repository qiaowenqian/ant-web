"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTaskListByCondition = getTaskListByCondition;
exports.getTaskListByConditionNew = getTaskListByConditionNew;
exports.getDictsByTypes = getDictsByTypes;
exports.attentionUsers = attentionUsers;
exports.addAttentionWitchTask = addAttentionWitchTask;
exports.cancelAttentionWitchTask = cancelAttentionWitchTask;
exports.setMilestoneWithTask = setMilestoneWithTask;
exports.moveTaskList = moveTaskList;
exports.batchUpdata = batchUpdata;
exports.updateMoreTaskData = updateMoreTaskData;
exports.getTaskDetailsDataById = getTaskDetailsDataById;
exports.updateTaskById = updateTaskById;
exports.getChildTaskById = getChildTaskById;
exports.getCoopTaskById = getCoopTaskById;
exports.getTaskFilesById = getTaskFilesById;
exports.updateTaskStateByCode = updateTaskStateByCode;
exports.deleteTaskById = deleteTaskById;
exports.urgeTaskById = urgeTaskById;
exports.urgeSonTaskByTaskId = urgeSonTaskByTaskId;
exports.claimTaskById = claimTaskById;
exports.deleteCoopTaskById = deleteCoopTaskById;
exports.createTask = createTask;
exports.addTalkAtTask = addTalkAtTask;
exports.deleteTalkById = deleteTalkById;
exports.copyTask = copyTask;
exports.moveTask = moveTask;
exports.getFormulaById = getFormulaById;
exports.updateFormula = updateFormula;
exports.addPrevCoopTaskByTaskId = addPrevCoopTaskByTaskId;
exports.addNextCoopTaskByTaskId = addNextCoopTaskByTaskId;
exports.getTaskBreadById = getTaskBreadById;
exports.getSonTask = getSonTask;
exports.getLimtTask = getLimtTask;
exports.getAtSelectUser = getAtSelectUser;
exports.taskRecycled = taskRecycled;
exports.restoreTaskinfo = restoreTaskinfo;
exports.removeTask = removeTask;

var _HttpClient = require("../api/HttpClient");

var _HttpClient2 = _interopRequireDefault(_HttpClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 获取任务列表
/* data = {
 *   panelId: ['0']            // 0未完成  1已完成  2待确认  3未指派  4已终止       // 当group是任务进展
 *                             // 1未确定，2今天，3逾期，4近期，5以后               // 当group是截止日期
 *                             // 1高，2中，3低                                   // 当group是优先级
 *                             // 1 0-300，2 300-800，3 800-2000，4 未设置        // 当group是任务绩效
 *                             // 1 1天以内，2 1-3天，3 3天以上，4 未定义          // 当group是计划工期
 *   group: 'evolve'           // 分组方式： evolve任务进展,planTime截至日期,coefficienttype优先级,flowConten任务绩效,worktime计划工期 
 *   menuType: 'sub1'          // 分类：sub1我负责的,my_succeed我确认的,my_add我创建的,my_be我指派的,my_attention我关注的
 *   projectIds: ['001']       // 项目ID
 *   labelId： ['001']         // labelID
 *   'planTimeSear':{          // 截止日期 区间查询
          'start':'',
          'end':''
        },
        'worktimeSear':{       // 预计工期 区间查询
          'min':'',
          'max':''
        },
        'flowContenSear':{     // 任务绩效 区间查询
          'min':'',
          'max':''
        },
        'userSear':{           // 人 区间查询
          'type':'0',          // 负责人0 确认人1
          'userIds':['']       // userId
      }
 * }
 */

function getTaskListByCondition(pageNo, pageSize, data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskHome/taskIniNew?pageNo=" + pageNo + "&pageSize=" + pageSize, data, function (list) {
    callback(list);
  }, isSmall);
}

function getTaskListByConditionNew(data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskHome/findIndexNum", data, function (list) {
    callback(list);
  }, isSmall);
}
// 获取字典数据
/* data = 'ant_taskinfo_flow,ant_taskinfo_state'
 * ant_taskinfo_flow                任务绩效分组
 * ant_taskinfo_state               任务状态
 * ant_taskinfo_coefficienttype     优先级
 * ant_task_home_planTime           截止日期
 * ant_task_home_workTime           计划工期
 */
function getDictsByTypes(data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/findDict?type=" + data, "", function (list) {
    callback(list);
  }, isSmall);
}

// 邀请关注
function attentionUsers(taskId, users, callback, isSmall) {
  var data = {
    objectId: taskId,
    rtype: "b",
    users: users
  };
  _HttpClient2.default.AjaxPost("/collect/inviteAttention", data, function (list) {
    callback(list);
  }, isSmall);
}

// 关注任务
function addAttentionWitchTask(taskId, callback, isSmall) {
  var data = { rtype: "b", objectId: taskId };
  _HttpClient2.default.AjaxPost("/collect/collect", data, function (list) {
    callback(list);
  }, isSmall);
}

// 取消关注任务
function cancelAttentionWitchTask(taskId, callback) {
  var data = { rtype: "b", objectId: taskId };
  _HttpClient2.default.AjaxPost("/collect/callCollect", data, function (list) {
    callback(list);
  });
}

// 设置里程碑任务
function setMilestoneWithTask(taskId, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/updateMilestoneIndex?id=" + taskId, "", function (list) {
    callback(list);
  }, isSmall);
}
// 移动任务顺序
function moveTaskList(original1,
// originalRank,
target1,
// targetRank,
callback, isSmall) {
  var original = {
    id: original1.id
    // rank: original1.rank
  };
  var target = {
    id: target1.id
    // rank: target1.rank
  };
  _HttpClient2.default.AjaxPost("/taskinfo/taskOrder", { original: original, target: target }, function (list) {
    callback(list);
  }, isSmall);
}
//批量修改任务数据（带权限）
function batchUpdata(data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/isModify", data, function (list) {
    callback(list);
  }, isSmall);
}
// 批量修改任务数据
/*
 * updateData:{
        'coefficienttype': '',
        'flowConten': '',
        'planEndTime': '',
        'selectTags': [],
        'taskinfoIds': [],
        'userFlowId': '',
        'userFlowName': '',
        'userResponseId': '',
        'userResponseName': '',
        'workTime':''
    }
 */
function updateMoreTaskData(proId, data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/taskinfoUpdaleAll?progectId=" + proId, data, function (list) {
    callback(list);
  }, isSmall);
}

// 获取任务详情数据
function getTaskDetailsDataById(taskId, proId) {
  var hideOkTask = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var callback = arguments[3];
  var isSmall = arguments[4];

  _HttpClient2.default.AjaxPost("/taskinfo/findByTaskinfoId?id=" + taskId + "&projectId=" + proId, { hidden: hideOkTask }, function (list) {
    callback(list);
  }, isSmall);
}

// 修改单条任务
/*
 * data:{
 *   workTime: '',                                      // 预计工期
 *   labelrelations: [{labe对象，后台传的}]              // 标签
 * }
 */
function updateTaskById(data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/updateMoreIndex", data, function (list) {
    callback(list);
  }, isSmall);
}

// 获取任务的子任务数据
function getChildTaskById(id, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/findChildTaskinfo?id=" + id, "", function (list) {
    callback(list);
  }, isSmall);
}

// 获取任务的协作任务数据
function getCoopTaskById(id, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/findreLevanceTaskinfo?id=" + id, "", function (list) {
    callback(list);
  }, isSmall);
}

// 获取任务的文件数据
function getTaskFilesById(id, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/findTaskinfoFiles?tId=" + id, "", function (list) {
    callback(list);
  }, isSmall);
}

// 修改任务任务状态
/*data = {
    id:taskinfoId,
    projectId:projectId,
    state:'0'              // 0重启 1完成 1审核通过 0驳回 4终止
    taskSignRemarks:''     // 审核说明 完成说明


    taskIds:批量修改状态ids
}*/
function updateTaskStateByCode(data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/updateStateIndex", data, function (list) {
    callback(list);
  }, isSmall);
}

// 删除任务
function deleteTaskById(id, projectId, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/deleteTaskinfo?id=" + id + "&projectId=" + projectId, "", function (list) {
    callback(list);
  }, isSmall);
}

// 催办任务
/*ids:被催办的任务id数组['',''], tid:详情的任务id, type:1 子任务,2:前序任务*/
function urgeTaskById(ids, tid, type, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/expedite?tid=" + tid + "&type=" + type, ids, function (list) {
    callback(list);
  }, isSmall);
}

// 批量催办子任务
function urgeSonTaskByTaskId(id, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/expediteSonTask", { id: id }, function (list) {
    callback(list);
  }, isSmall);
}

// 认领任务
function claimTaskById(ids, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/drawTaskinfo", ids, function (list) {
    callback(list);
  }, isSmall);
}

// 删除协作任务
function deleteCoopTaskById(recordId, nowTaskId, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskrrelation/deleteTaskrTelation?id=" + recordId + "&taskinfo=" + nowTaskId, "", function (list) {
    callback(list);
  }, isSmall);
}

// 创建任务
/* data = {
    planEndTimeString: "2018-07-13",
    taskname:"555666",
    userResponse:{
        userid: "393dc1f0b64d4609a5b71502e2917232"
    }
   }
 */
function createTask(progectId, parentId, data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/addTaskinfo?progectId=" + progectId + "&pid=" + parentId, data, function (list) {
    callback(list);
  }, isSmall);
}

// 添加讨论
/*
 * data = {description:'描述',taskinfo:{id:'任务ID'},reply:{id:'回复人的ID'},files:[{文件对象}]}
 */
function addTalkAtTask(data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/leave/addLeave", data, function (list) {
    callback(list);
  }, isSmall);
}

// 删除讨论
function deleteTalkById(id, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/leave/deleteLeave?id=" + id, "", function (list) {
    callback();
  }, isSmall);
}

// 复制任务
/*
 *  userResponse     // 负责人    复制传1  不复制传空
	taskFile         // 完成日期      复制传1  不复制传空
	childTask        // 子任务     复制传1  不复制传空
	userFlow         // 确认人        复制传1  不复制传空
	taskeva          // 协作任务         复制传1  不复制传空
	flowConten       // 任务绩效    复制传1 不复制传空
	workTime         // 计划工期                 复制传1  不复制传空
	coefficientType  // 重要程度       复制传1  不复制传空
	parentId         // 父任务id 
	projectId        // 项目id
 */
function copyTask(data, callback) {
  var task = {
    id: data.id,
    taskname: data.name,
    userResponse: data.fzr,
    taskFile: data.endTime,
    childTask: data.child,
    userFlow: data.qrr,
    taskeva: data.loop,
    flowConten: data.money,
    workTime: data.worktime,
    coefficientType: data.lev,
    parentId: data.parentId,
    projectId: data.projectId,
    copyFlag: data.copyFlag,
    collect: data.collect1
  };
  _HttpClient2.default.AjaxPost("/taskinfo/copyTaskNew", task, function (list) {
    callback(list);
  });
}

// 移动任务
/*
 * type 1移动到根目录 否则不传
 */
function moveTask(taskId, parentId, type, callback) {
  _HttpClient2.default.AjaxPost("/taskinfo/relateFatherTaskNew?resourceId=" + taskId + "&targetId=" + parentId + "&type=" + type, "", function (list) {
    callback(list);
  });
}

// 查询计算公式
function getFormulaById(id, callback) {
  _HttpClient2.default.AjaxPost("/calculate/getPrefTypeByProjectId?projectId=" + id, "", function (list) {
    callback(list);
  });
}

// 添加、修改计算公式
function updateFormula(data, callback) {
  _HttpClient2.default.AjaxPost("/calculate/savePrefType", data, function (list) {
    callback(list);
  });
}

// 添加前序任务
function addPrevCoopTaskByTaskId(taskId, coopTaskIds, callback) {
  var data = { antTaskinfo: { id: taskId }, selectIds: coopTaskIds };
  _HttpClient2.default.AjaxPost("/taskrrelation/saveTaskrTelationParent", data, function (list) {
    callback(list);
  });
}

// 添加后序任务
function addNextCoopTaskByTaskId(taskId, coopTaskIds, callback) {
  var data = { antTaskinfo: { id: taskId }, selectIds: coopTaskIds };
  _HttpClient2.default.AjaxPost("/taskrrelation/saveTaskrTelationNext", data, function (list) {
    callback(list);
  });
}

// 获取任务的面包屑
function getTaskBreadById(projectId, taskId, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/findByProjectId?id=" + projectId + "&pid=" + taskId, "", function (list) {
    callback(list);
  }, isSmall);
}

// 获取未完成的子任务
function getSonTask(taskId, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/taskinfo/sonTask?id=" + taskId, "", function (list) {
    callback(list);
  }, isSmall);
}
//免费版限制
function getLimtTask(callback) {
  _HttpClient2.default.AjaxGet("/taskinfo/taskCountLimit", function (list) {
    callback(list);
  });
}
//获取@的人员列表
function getAtSelectUser(bodyobj, callback) {
  //   HttpClient.AjaxGet("/ant-cgi/user/selectUser", data => {
  //     callback(data);
  //   });
  _HttpClient2.default.AjaxPost("/user/selectUser/", bodyobj, function (data) {
    callback(data);
  });
}

// pageSize = 50,
// pageNo = 1,
//获取已删除的任务列表
function taskRecycled(pageSize, pageNo, callback) {
  _HttpClient2.default.AjaxGet("/taskinfo/taskRecycleBin?pageSize=" + pageSize + "&pageNo=" + pageNo, function (list) {
    callback(list);
  });
}

//恢复已删除的Task
function restoreTaskinfo(taskId, callback) {
  _HttpClient2.default.AjaxPost("/taskinfo/restoreTaskinfo", { id: taskId }, function (list) {
    callback(list);
  });
}

//彻底删除已删除的Task
function removeTask(taskId, callback) {
  _HttpClient2.default.AjaxPost("/taskinfo/removeCompletely", { id: taskId }, function (list) {
    callback(list);
  });
}