'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findReadMessage = findReadMessage;
exports.findMessageDetail = findMessageDetail;
exports.findTaskinfoByProjectId = findTaskinfoByProjectId;
exports.updateRead = updateRead;
exports.updateAllRead = updateAllRead;
exports.deleteBath = deleteBath;
exports.getMessageCount = getMessageCount;
exports.getDingMessageDetails = getDingMessageDetails;

var _HttpClient = require('../api/HttpClient');

var _HttpClient2 = _interopRequireDefault(_HttpClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 获取未读消息
function findReadMessage() {
    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var callback = arguments[1];

    _HttpClient2.default.AjaxPost('/message/findMessage?pageNo=' + page + '&read=', '', function (list) {
        callback(list);
    });
}

// 消息详情
function findMessageDetail(id, callback) {
    _HttpClient2.default.AjaxPost('/message/findMessageDetail?id=' + id, '', function (list) {
        callback(list);
    });
}

// 任务id获取项目id
function findTaskinfoByProjectId(id, type, callback) {
    _HttpClient2.default.AjaxPost('/taskinfo/findTaskinfoByProjectId?taskId=' + id + '&type=' + type, '', function (list) {
        callback(list);
    });
}
// 改为已读
function updateRead(ids, callback) {
    _HttpClient2.default.AjaxPost('/message/updateReadBath?ids=' + ids, '', function (list) {
        callback(list);
    });
}

// 全部改为已读
function updateAllRead(callback) {
    _HttpClient2.default.AjaxPost('/message/updateAllRead?', '', function (list) {
        callback(list);
    });
}
// 清除已读
function deleteBath(ids, read, callback) {
    _HttpClient2.default.AjaxPost('/message/deleteBath?ids=' + ids + '&read=' + read, '', function (list) {
        callback(list);
    });
}

// 获取未读数量
function getMessageCount(callback) {
    _HttpClient2.default.AjaxPost('/time/timeList', '', function (list) {
        callback(list);
    });
}

// 消息id获取项目id任务id
function getDingMessageDetails(id, callback) {
    _HttpClient2.default.AjaxPost('/taskinfo/getDingMessageDetails?taskinfoId=' + id, '', function (list) {
        callback(list);
    });
}