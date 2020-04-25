export const PROJECT_SEARCH = "PROJECT_SEARCH";
export const STATE_CHART = "STATE_CHART";
export const PROJECT_CHART = "PROJECT_CHART";
export const PROJECT_PROGESS_CHART = "PROJECT_PROGESS_CHART";
export const LIST_STATE = "LIST_STATE";
export const CLEAR_LIST_STATE = "CLEAR_LIST_STATE";
// 项目筛选条件
export function setProjectSeachVal(data) {
  return {
    type: PROJECT_SEARCH,
    payload: data
  };
}
//项目待办按状态统计
export function setStateVal(data) {
  return {
    type: STATE_CHART,
    payload: data
  };
}
//项目待办按项目统计
export function setProjectVal(data) {
  return {
    type: PROJECT_CHART,
    payload: data
  };
}
//项目进展统计
export function setProjectProgessVal(data) {
  return {
    type: PROJECT_PROGESS_CHART,
    payload: data
  };
}
/**
 * 保存列表状态
 * @param data
 * @returns {Function}
 */
export function saveListState(data) {
  return {
    type: LIST_STATE,
    payload: data
  };
}

/**
 * 清除列表状态
 * @returns {Function}
 */
export function clearListState() {
  return {
    type: CLEAR_LIST_STATE
  };
}
