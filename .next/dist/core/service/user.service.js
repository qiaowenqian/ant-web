'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.login = login;
exports.guideUpdate = guideUpdate;
exports.dingLoginByQrCode = dingLoginByQrCode;
exports.getUserVersion = getUserVersion;
exports.dingLoginByCode = dingLoginByCode;
exports.getDingUserCode = getDingUserCode;
exports.getUserBusinessStatistics = getUserBusinessStatistics;
exports.getUserTaskChart = getUserTaskChart;
exports.getUserMoneyChart = getUserMoneyChart;
exports.getMessageByUser = getMessageByUser;
exports.getFreeLimit = getFreeLimit;

var _HttpClient = require('../api/HttpClient');

var _HttpClient2 = _interopRequireDefault(_HttpClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 测试登录
function login(user, password, callback) {
    _HttpClient2.default.AjaxPost('/user/loginUser', { loginName: user, password: password }, function (list) {
        callback(list);
    });
}

function guideUpdate(callback) {
    var version = _HttpClient2.default.getVersion();
    _HttpClient2.default.AjaxPost('/user/updateLoginState?type=pc&version=' + version, '', function (list) {
        callback(list);
    });
}

// 钉钉二维码登录
function dingLoginByQrCode(userCode, corpId, callback) {
    _HttpClient2.default.AjaxPost('/user/dingtalkId?cid=' + userCode + '&s=' + corpId, '', function (list) {
        callback(list);
    });
}

// 判断用户是否登录新版本
function getUserVersion(corpId, callback) {
    _HttpClient2.default.AjaxPost('/user/getUserVersion?corpid=' + corpId, '', function (list) {
        callback(list);
    });
}

// 钉钉code登录
function dingLoginByCode(userCode, corpId, callback) {
    _HttpClient2.default.AjaxPost('/user/dingtalkCodeLogin?code=' + userCode + '&corpid=' + corpId, '', function (list) {
        callback(list);
    });
}

// 钉钉获取授权jsapi信息
function getDingUserCode(corpid, SuiteKey, urlData, callback) {
    _HttpClient2.default.AjaxPost('/dingTalk/mobilejs?corpid=' + corpid + '&SuiteKey=' + SuiteKey + '&urlData=' + urlData, '', function (list) {
        callback(list);
    });
}

// 获取用户业务数据统计
function getUserBusinessStatistics(callback) {
    _HttpClient2.default.AjaxPost('/taskHome/getData', '', function (list) {
        callback(list);
    });
}

// 我的任务 图表 按月查传month  按周查传week
function getUserTaskChart(searDate, callback) {
    _HttpClient2.default.AjaxPost('/taskHome/getMyTask?type=' + searDate, '', function (list) {
        callback(list);
    });
}

// 我的绩效 图表
function getUserMoneyChart(projectIds, searDate, callback) {
    var data = {
        projectIds: projectIds,
        type: searDate
    };
    _HttpClient2.default.AjaxPost('/taskHome/getMyConten', data, function (list) {
        callback(list);
    });
}

// 通知信息
function getMessageByUser(pageNo, callback) {
    _HttpClient2.default.AjaxPost('/message/findMessage?pageNo=' + pageNo + '&read=', '', function (list) {
        callback(list);
    });
}
// 切换免费版
function getFreeLimit(callback) {
    _HttpClient2.default.AjaxGet('/time/createFreeOrder', function (list) {
        callback(list);
    });
}