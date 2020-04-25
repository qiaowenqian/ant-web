'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.saveFeedback = saveFeedback;

var _HttpClient = require('../api/HttpClient');

var _HttpClient2 = _interopRequireDefault(_HttpClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function saveFeedback(remarks, mail, callback) {
    _HttpClient2.default.AjaxPost('/feedback/save', { mail: mail, remarks: remarks }, function (list) {
        callback(list);
    });
}