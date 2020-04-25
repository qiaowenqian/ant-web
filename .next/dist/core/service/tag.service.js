"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTagList = getTagList;
exports.getProjectTypeList = getProjectTypeList;
exports.addProjectType = addProjectType;
exports.updateProjectType = updateProjectType;
exports.getLabelList = getLabelList;
exports.findLabelUser = findLabelUser;
exports.addLabel = addLabel;
exports.updateLabel = updateLabel;
exports.updateLabelParent = updateLabelParent;
exports.deleteLabel = deleteLabel;
exports.deleteAllLabel = deleteAllLabel;
exports.findLabelByUser = findLabelByUser;
exports.getPersonLabel = getPersonLabel;
exports.addPersonLabel = addPersonLabel;
exports.findLabelByAdimn = findLabelByAdimn;

var _HttpClient = require("../api/HttpClient");

var _HttpClient2 = _interopRequireDefault(_HttpClient);

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 获取标签列表
/*
 * 返回值 type:'1'  个人标签
 *        type:'2'  公共标签
 *        type:'3'  项目分类
 */
function getTagList(callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/findLabelByUser", "", function (list) {
    callback(list);
  }, isSmall);
}

// 获取项目分类列表
function getProjectTypeList(callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/labelProjectList", "", function (list) {
    callback(list);
  }, isSmall);
}
//添加项目分类
function addProjectType(data, pid, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/addProjectLabel?pid=" + pid, data, function (list) {
    callback(list);
  }, isSmall);
}
//修改项目分类
function updateProjectType(data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/updateProjectLabel", data, function (list) {
    callback(list);
  }, isSmall);
}
//获取标签列表
function getLabelList(callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/findLabelAll", "", function (list) {
    callback(list);
  }, isSmall);
}
//通过标签获取用户
function findLabelUser(id, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/findLabelUser?lid=" + id, "", function (list) {
    callback(list);
  }, isSmall);
}
//添加标签
function addLabel(data, pid, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/addLabel?pid=" + pid, data, function (list) {
    callback(list);
  }, isSmall);
}
//编辑标签
function updateLabel(data, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/updateLabel",
  // { id: id, labelname: name, color: color ? color : "" },
  data, function (list) {
    callback(list);
  }, isSmall);
}
//更换父标签
function updateLabelParent(id, parentId, callback) {
  _HttpClient2.default.AjaxPost("/label/updateLabelParent", { id: id, parent: { id: parentId } }, function (list) {
    callback(list);
  });
}
//删除标签
function deleteLabel(id, callback) {
  _HttpClient2.default.AjaxPost("/label/deleteLabel?id=" + id, "", function (list) {
    callback(list);
  });
}
//删除多个标签
function deleteAllLabel(ids, callback) {
  _HttpClient2.default.AjaxPost("/label/deleteLabelAll", ids, function (list) {
    callback(list);
  });
}

//获取自己和公共标签
function findLabelByUser(callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/findLabelByUser", "", function (list) {
    callback(list);
  }, isSmall);
}

//获取个人标签
function getPersonLabel(callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/getPersonLabel", "", function (list) {
    callback(list);
  }, isSmall);
}

//添加个人标签
function addPersonLabel(name, pid, callback, isSmall) {
  _HttpClient2.default.AjaxPost("/label/addPersonLabel?pid=" + pid, name, function (list) {
    callback(list);
  }, isSmall);
}

//根据是不是管理员 获取个人标签
function findLabelByAdimn(isAdimn, callback) {
  _HttpClient2.default.AjaxPost("/label/findLabelByAdimn", isAdimn, function (list) {
    callback(list);
  });
}