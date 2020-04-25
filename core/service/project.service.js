import HttpClient from "../api/HttpClient";
import { toASCII } from "punycode";
import moment from "moment";

//根据类型和标签获取项目列表
export function down(projectIds, callback) {
  HttpClient.AjaxPost(
    "/statistics/downLoadTaskByStatus",
    { projectId: projectIds.join(",") },
    list => {
      callback(list);
    }
  );
}
//统计模块任务分布按任务状态
export function getTaskDistributedByState(projectIds, callback) {
  HttpClient.AjaxPost(
    "/calculate/getTaskDistributedByState",
    projectIds,
    list => {
      callback(list);
    }
  );
}
//统计模块任务分布按项目
export function getTaskDistributedByProject(projectIds, callback) {
  HttpClient.AjaxPost(
    "/calculate/getTaskDistributedByProject",
    projectIds,
    list => {
      callback(list);
    }
  );
}
export function downByProject(projectIds, callback) {
  HttpClient.AjaxPost(
    "/statistics/downLoadTaskByProject",
    { projectId: projectIds.join(",") },
    list => {
      callback(list);
    }
  );
}
//1
export function downPendByProject(projectIds, callback) {
  HttpClient.AjaxPost(
    "/statistics/downLoadPendByProject",
    { projectId: projectIds.join(",") },
    list => {
      callback(list);
    }
  );
}
//2
export function downPendByPerson(projectIds, callback) {
  HttpClient.AjaxPost(
    "/statistics/downLoadPendByPerson",
    { projectId: projectIds.join(",") },
    list => {
      callback(list);
    }
  );
}
//3
export function downNumByProject(
  projectIds,
  type,
  attdate01,
  attdate02,
  callback
) {
  HttpClient.AjaxPost(
    "/statistics/downLoadNumByProject",
    { projectId: projectIds.join(","), type, attdate01, attdate02 },
    list => {
      callback(list);
    }
  );
}
//4
export function downNumByPerson(
  projectIds,
  type,
  attdate01,
  attdate02,
  callback
) {
  HttpClient.AjaxPost(
    "/statistics/downLoadNumByPerson",
    { projectId: projectIds.join(","), type, attdate01, attdate02 },
    list => {
      callback(list);
    }
  );
}
//5
export function downContentByProject(
  projectIds,
  type,
  attdate01,
  attdate02,
  callback
) {
  HttpClient.AjaxPost(
    "/statistics/downLoadContentByProject",
    { projectId: projectIds.join(","), type, attdate01, attdate02 },
    list => {
      callback(list);
    }
  );
}
//6
export function downContentByPerson(
  projectIds,
  type,
  attdate01,
  attdate02,
  callback
) {
  HttpClient.AjaxPost(
    "/statistics/downLoadContentByPerson",
    { projectId: projectIds.join(","), type, attdate01, attdate02 },
    list => {
      callback(list);
    }
  );
}

// 根据类型获取项目列表
/*
 * type:'1'                    // 1团队所有 2我参与的 3我收藏的 4我负责的
 */
export function getProListByType(
  type,
  pageNo,
  callback,
  pageSize = 40,
  labelIds = [],
  search = "",
  orderBy = "DESC",
  userIds,
  time = []
) {
  const data = {
    type: type,
    labelId: labelIds,
    orderBy: orderBy,
    search: search,
    userIds: userIds,
    startCreateDate: time[0],
    endCreateDate: time[1]
  };
  HttpClient.AjaxPost(
    "/project/projectPageIndex?pageSize=" + pageSize + "&pageNo=" + pageNo,
    data,
    list => {
      callback(list);
    }
  );
}
//获取带有创建权限的项目列表

export function getProListByJurisdiction(
  pageSize = 40,
  pageNo,
  callback,
  proname
) {
  HttpClient.AjaxPost(
    "/project/getProjectIds?pageSize=" + pageSize + "&pageNo=" + pageNo,
    { proname: proname },
    list => {
      callback(list);
    }
  );
}

//根据类型和标签获取项目列表
export function getProjectListByTypeTag(
  type = "0",
  labelId = [],
  search,
  callback
) {
  HttpClient.AjaxPost(
    "/project/getProjectResult",
    { type: type, labelId: labelId, search: search },
    list => {
      callback(list);
    }
  );
}
//根据项目id查询待办统计（按人员）
export function getPendStatistics(projectIds = {}, callback) {
  HttpClient.AjaxPost("/calculate/getPendStatistics", projectIds, list => {
    callback(list);
  });
}
//根据项目id查询待办统计（按项目）
export function getProjectStatistics(projectIds = {}, callback) {
  HttpClient.AjaxPost("/project/getStatisticsIndex", projectIds, list => {
    callback(list);
  });
}
//根据项目id查询绩效统计（任务数） 按项目
export function getNumByProject(
  type,
  projectIds = {},
  attdate01,
  attdate02,
  callback
) {
  HttpClient.AjaxPost(
    "/calculate/getNumByProject",
    type,
    projectIds,
    attdate01,
    attdate02,
    list => {
      callback(list);
    }
  );
}
//根据项目id查询绩效统计（任务数） 按人员
export function getNumByPerson(
  type,
  projectIds = {},
  attdate01,
  attdate02,
  callback
) {
  HttpClient.AjaxPost(
    "/calculate/getNumByPerson",
    type,
    projectIds,
    attdate01,
    attdate02,
    list => {
      callback(list);
    }
  );
}

//任务分布按状态
export function downLoadTaskByStatus(data, callback) {
  HttpClient.AjaxPost("/statistics/downLoadTaskByStatus", data, list => {
    callback(list);
  });
}
//根据项目id查询项目进展
export function getProjectProgess(data, callback) {
  HttpClient.AjaxPost("/calculate/getStatisticsCountDao", data, list => {
    callback(list);
  });
}

//待办统计 按项目
export function getPendByProject(data, callback) {
  HttpClient.AjaxPost("/calculate/getPendByProject", data, list => {
    callback(list);
  });
}
//根据项目id查询 绩效统计(绩效值) 按项目

export function getContentByProject(
  projectIds = {},
  attdate01,
  attdate02,
  type,
  callback
) {
  HttpClient.AjaxPost(
    "/calculate/getContentByProject",
    projectIds,
    attdate01,
    attdate02,
    type,
    list => {
      callback(list);
    }
  );
}
//根据项目id查询 绩效统计(绩效值) 按人员
export function getContentByPerson(
  projectIds = {},
  attdate01,
  attdate02,
  type,
  callback
) {
  HttpClient.AjaxPost(
    "/calculate/getContentByPerson",
    projectIds,
    attdate01,
    attdate02,
    type,
    list => {
      callback(list);
    }
  );
}

// 关注项目
export function addAttentionWitchProject(objectId, callback) {
  const data = { rtype: "a", objectId: objectId };
  HttpClient.AjaxPost("/collect/collect", data, list => {
    callback(list);
  });
}
// 取消关注项目
export function cancelAttentionWitchProject(objectId, callback) {
  const data = { rtype: "a", objectId: objectId };
  HttpClient.AjaxPost("/collect/callCollect", data, list => {
    callback(list);
  });
}

// 获取项目的任务树结构数据
export function getProjectTaskListById(
  progectId,
  parentId,
  taskId,
  pageNo,
  callback,
  hideOkTask = "",
  search = ""
) {
  HttpClient.AjaxPost(
    "/taskinfo/findTreePageList?progectId=" +
    progectId +
    "&pId=" +
    parentId +
    "&pageNo=" +
    pageNo +
    "&id=" +
    taskId,
    { hidden: hideOkTask, search: search },
    list => {
      callback(list);
    }
  );
}
// 加载项目列表
export function getProjectList(callback) {
  HttpClient.AjaxPost("/project/projectList", "", list => {
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
export function createProject(data, callback) {
  HttpClient.AjaxPost("/project/projectAddNew", data, list => {
    callback(list);
  });
}

// 删除项目
export function deleteProject(id, callback) {
  HttpClient.AjaxPost("/project/projectDelete", { id: id }, list => {
    callback(list);
  });
}

// 人员任务统计
export function getChartByUserTask(data, callback) {
  HttpClient.AjaxPost("/calculate/getTasktableCount", data, list => {
    callback(list);
  });
}

// 人员绩效统计
export function getChartByUserMoney(data, callback) {
  HttpClient.AjaxPost("/calculate/getContenTableData", data, list => {
    callback(list);
  });
}

// 任务概述统计
export function getChartByTaskSituation(id, callback) {
  HttpClient.AjaxPost("/calculate/project?id=" + id, "", list => {
    callback(list);
  });
}

// 项目进展统计
export function getChartByProjectProgress(data, callback) {
  HttpClient.AjaxPost("/calculate/getProgressView", data, list => {
    callback(list);
  });
}

// 获取项目的文件列表
export function getFileListByProjectId(
  projectId,
  parentId,
  pageSize = 50,
  pageNo = 1,
  callback,
  fileName
) {
  HttpClient.AjaxPost(
    "/files/fileIdexListNew?projectId=" +
    projectId +
    "&parentId=" +
    parentId +
    "&fileName=" +
    fileName +
    "&pageSize=" +
    pageSize +
    "&pageNo=" +
    pageNo,
    {},
    list => {
      callback(list);
    }
  );
}

// 获取项目甘特图数据
export function getProjectChartData(id, callback) {
  HttpClient.AjaxPost("/project/projectGantt?id=" + id, "", list => {
    callback(list);
  });
}

// 获取项目设置的数据
export function getProjectCreateInfoById(id, callback) {
  HttpClient.AjaxPost("/project/projectDetailsNew?id=" + id, "", list => {
    callback(list);
  });
}

// 提交导入的数据
export function updateImportExcelByProject(
  projectId,
  parentId,
  joinProject,
  callback
) {
  HttpClient.AjaxPost(
    "/taskinfo/affirmChannel?type=0&projectId=" +
    projectId +
    "&taskinfoId=" +
    parentId +
    "&joinProject=" +
    joinProject,
    {},
    list => {
      callback(list);
    }
  );
}

// 项目更新
/*export function projectUpdate(data,callback) {
    HttpClient.AjaxPost('/project/projectUpdate',data,list => {
        callback(list);
    });
}*/

//免费限制
export function projectLimit(callback) {
  HttpClient.AjaxGet("/project/projectCountLimit", list => {
    callback(list);
  });
}
//获取已删除的项目列表
export function projectrecycled(callback) {
  HttpClient.AjaxGet("/project/projectRecycleBin", list => {
    callback(list);
  });
}
//恢复已删除的项目
export function restoreProject(projectId, callback) {
  HttpClient.AjaxPost("/project/restoreProject", { id: projectId }, list => {
    callback(list);
  });
}

//彻底删除已删除的项目
export function removeCompletely(projectId, callback) {
  HttpClient.AjaxPost("/project/removeCompletely", { id: projectId }, list => {
    callback(list);
  });
}
//project/saveFiling  项目归档
export function saveFiling(projectId, callback) {
  HttpClient.AjaxPost("/project/saveFiling", { id: projectId }, list => {
    callback(list);
  });
}
//取消归档
export function cancelFiling(progectId, callback) {
  HttpClient.AjaxPost("/project/cancelFiling", { id: progectId }, list => {
    callback(list);
  });
}
//项目复制 project/copyProject
export function copyProject(projectId, user, antPrefType, proname, callback) {
  HttpClient.AjaxPost(
    "/project/copyProject",
    { id: projectId, user: user, antPrefType: antPrefType, proname: proname },
    list => {
      callback(list);
    }
  );
}
export function projectCount(callback) {
  HttpClient.AjaxGet("/project/projectGroupsNumber", list => {
    callback(list);
  });
}

//异步步导出
export function downLoadTaskTest(projectId, startcount, taskIds, callback) {
  HttpClient.AjaxPost(
    "/CommonExcel/downLoadTaskTest?projectId=" +
    projectId +
    "&start=" +
    startcount,
    { taskIds: taskIds },
    list => {
      callback(list);
    }
  );
}
