import * as types from "../actions/project";

const initialState = {
  projectSearchVal: {},
  stateChartVal: [],
  projectChartVal: [],
  projectProgessVal: [],

  //index.js
  // scrollTop: 0, //列表滑动位置
  // listData: [], //列表数据
  // pageIndex: 1, //当前分页页码
  // itemIndex: -1 //点击的条目index
  listState: {}
};

export default function project(state = initialState, action = {}) {
  switch (action.type) {
    case types.PROJECT_SEARCH:
      return Object.assign({}, state, { projectSearchVal: action.payload });
    case types.STATE_CHART:
      return Object.assign({}, state, { stateChartVal: action.payload });
    case types.PROJECT_CHART:
      return Object.assign({}, state, { projectChartVal: action.payload });
    case types.PROJECT_PROGESS_CHART:
      return Object.assign({}, state, { projectProgessVal: action.payload });
    case types.LIST_STATE:
      //更新列表状态
      return Object.assign({}, state, { listState: action.payload });
    // { ...state, ...action };
    case types.CLEAR_LIST_STATE:
      //清空列表状态
      return initListState;
    default:
      return state;
  }
}
