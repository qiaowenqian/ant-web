'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteFileById = deleteFileById;
exports.updateImgsInService = updateImgsInService;
exports.updateDingFileService = updateDingFileService;
exports.getImportLog = getImportLog;
exports.getExportMenuData = getExportMenuData;

var _HttpClient = require('../api/HttpClient');

var _HttpClient2 = _interopRequireDefault(_HttpClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 删除文件
function deleteFileById(id, callback, isSmall) {
    _HttpClient2.default.AjaxPost('/files/deleteFile?id=' + id, [], function (list) {
        callback(list);
    }, isSmall);
}

// 上传图片 传给我们自己的服务器后台 后台返回图片地址
/*
 * 入参{'Base64Image':''}
 * 出参{'fileUrlAbsolute':{}} 
 */
function updateImgsInService(baseUrl, callback, isSmall) {
    var data = {
        'Base64Image': baseUrl
    };
    _HttpClient2.default.AjaxPost('/files/uploadBase64', data, function (list) {
        callback(list);
    }, isSmall);
}

/*
 * 上传图片
 * 入参{'data':''}
 * 出参{'file':{}} 
 */
function updateDingFileService(pid, type, data, callback, isSmall) {
    _HttpClient2.default.AjaxPost('/files/uploadDingFile?pid=' + pid + '&type=' + type, data, function (list) {
        callback(list);
    }, isSmall);
}

// 获取导入数据日志
function getImportLog(projectId, pageNo, callback, isSmall) {
    _HttpClient2.default.AjaxPost('/taskinfo/channelList?projectId=' + projectId + '&pageNo=' + pageNo, '', function (list) {
        callback(list);
    }, isSmall);
}

/**
 * 获取导出目录数据
 * @param {*} projectId 项目id
 * @param {*} parentId  父任务id，导出全部项目传空
 * @param {*} callback 
 */
function getExportMenuData(projectId, parentId, callback) {
    _HttpClient2.default.AjaxPost('/CommonExcel/findExportList?projectId=' + projectId + '&parentId=' + parentId, '', function (list) {
        callback(list);
    });
}