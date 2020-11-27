import ArchivesApi from "../api/services2/archives"; //未归
import ArchivesApi2 from "../api/services2/archives2"; // 归档
import ArchivesApi3 from "../api/services2/archives3"; // 审核
import { AddTypeIcon } from "../util/AddTypeIcon";
import { Message } from "element-ui";

export default {
  namespaced: true,
  state: {
    // 请求列表时，接口返回中会有一个对象，把那个放到该数组中
    extraField: [],
    DocListHead: [],
    DocList: [],
    pagination: {
      total: 0,
      pageSize: 40
    },
    categoryId: "",
    // 存放查看详情
    archInfo: {},
    // 用户刷新列表
    refreshList: true,
    // 0未归 1案卷 2归档 3资料
    menuType: ""
  },
  actions: {
    // 获取未归档案列表
    getunFiledList({ commit }, data) {
      ArchivesApi.getunFiledList(data).then(res => {
        if (res.code === 200) {
          res.data.list.map(item => {
            for (let key in item.extraParam) {
              item[key] = item.extraParam[key];
            }
            return item;
          });
          commit("GET_DOC_LIST", res.data.list);
          const total = res.data.total;
          commit("GET_DOC_TOTAL", total);
        }
      });
    },
    // 获取未归档案列表表头
    getunFiledListHead({ commit }, data) {
      ArchivesApi.getunFiledListHead(data).then(res => {
        if (res.code === 200) {
          let result = res.data.map(item => {
            let obj = {
              label: item.label,
              fieldName: item.fieldName,
              isMain: item.isMain,
              textValue: ""
            };
            return obj;
          });
          commit("GET_DOC_LIST_HEAD", result);
        }
      });
    },
    // 查看档案详情--未归
    getArchInfo({ commit }, data) {
      ArchivesApi.getArchInfo(data).then(res => {
        if (res.code === 200) {
          commit("GET_ARCH_INFO", res.data);
        }
      });
    },

    // 获取档案列表--正式库——归档
    getunFiledList2({ commit }, data) {
      ArchivesApi2.getunFiledList(data).then(res => {
        if (res.code === 200) {
          res.data.list.map(item => {
            for (let key in item.extraParam) {
              item[key] = item.extraParam[key];
            }
            return item;
          });
          commit("GET_DOC_LIST", res.data.list);
          const total = res.data.total;
          commit("GET_DOC_TOTAL", total);
        }
      });
    },
    // 获取档案列表--临时库——归档
    getunFiledList22({ commit }, data) {
      ArchivesApi2.getunFiledList2(data).then(res => {
        if (res.code === 200) {
          res.data.list.map(item => {
            for (let key in item.extraParam) {
              item[key] = item.extraParam[key];
            }
            return item;
          });
          commit("GET_DOC_LIST", res.data.list);
          const total = res.data.total;
          commit("GET_DOC_TOTAL", total);
        }
      });
    },
    // 获取档案列表表头——归档
    getunFiledListHead2({ commit }, data) {
      ArchivesApi2.getunFiledListHead4(data).then(res => {
        if (res.code === 200) {
          let result = res.data.map(item => {
            let obj = {
              label: item.label,
              fieldName: item.fieldName,
              isMain: item.isMain,
              textValue: ""
            };
            return obj;
          });
          commit("GET_DOC_LIST_HEAD", result);
        }
      });
    },
    // 查看档案详情-- 归档
    getArchInfo2({ commit }, data) {
      ArchivesApi2.getArchInfo4(data).then(res => {
        if (res.code === 200) {
          commit("GET_ARCH_INFO", res.data);
        }
      });
    },

    // 获取档案列表-- 审核案卷
    getunFiledList3({ commit }, data) {
      ArchivesApi3.getunFiledList(data).then(res => {
        if (res.code === 200) {
          res.data.list.map(item => {
            for (let key in item.extraParam) {
              item[key] = item.extraParam[key];
            }
            return item;
          });
          commit("GET_DOC_LIST", res.data.list);
          const total = res.data.total;
          commit("GET_DOC_TOTAL", total);
        }
      });
    },
    // 获取档案列表表头-- 审核案卷
    getunFiledListHead3({ commit }, data) {
      ArchivesApi3.getunFiledListHead(data).then(res => {
        if (res.code === 200) {
          let result = res.data.map(item => {
            let obj = {
              label: item.label,
              fieldName: item.fieldName,
              isMain: item.isMain,
              textValue: ""
            };
            return obj;
          });
          commit("GET_DOC_LIST_HEAD", result);
        }
      });
    },
    // 查看档案详情-- 审核案卷
    getArchInfo3({ commit }, data) {
      ArchivesApi3.getArchInfo(data).then(res => {
        if (res.code === 200) {
          commit("GET_ARCH_INFO", res.data);
        }
      });
    },
    // 获取档案列表--审核资料
    getunFiledList333({ commit }, data) {
      ArchivesApi3.getunFiledList3(data).then(res => {
        if (res.code === 200) {
          res.data.list.map(item => {
            for (let key in item.extraParam) {
              item[key] = item.extraParam[key];
            }
            return item;
          });
          commit("GET_DOC_LIST", res.data.list);
          const total = res.data.total;
          commit("GET_DOC_TOTAL", total);
        }
      });
    },
    // 获取档案列表表头--审核资料
    getunFiledListHead333({ commit }, data) {
      ArchivesApi3.getunFiledListHead3(data).then(res => {
        if (res.code === 200) {
          let result = res.data.map(item => {
            let obj = {
              label: item.label,
              fieldName: item.fieldName,
              isMain: item.isMain,
              textValue: ""
            };
            return obj;
          });
          commit("GET_DOC_LIST_HEAD", result);
        }
      });
    },
    // 查看档案详情--审核资料
    getArchInfo333({ commit }, data) {
      ArchivesApi3.getArchInfo3(data).then(res => {
        if (res.code === 200) {
          commit("GET_ARCH_INFO", res.data);
        }
      });
    },
    // 获取档案列表--审核文件
    getunFiledList444({ commit }, data) {
      ArchivesApi3.getunFiledList4(data).then(res => {
        if (res.code === 200) {
          res.data.list.map(item => {
            for (let key in item.extraParam) {
              item[key] = item.extraParam[key];
            }
            return item;
          });
          commit("GET_DOC_LIST", res.data.list);
          const total = res.data.total;
          commit("GET_DOC_TOTAL", total);
        }
      });
    },
    // 获取档案列表表头--审核文件
    getunFiledListHead444({ commit }, data) {
      ArchivesApi3.getunFiledListHead4(data).then(res => {
        if (res.code === 200) {
          let result = res.data.map(item => {
            let obj = {
              label: item.label,
              fieldName: item.fieldName,
              isMain: item.isMain,
              textValue: ""
            };
            return obj;
          });
          commit("GET_DOC_LIST_HEAD", result);
        }
      });
    },
    // 查看档案详情--审核文件
    getArchInfo444({ commit }, data) {
      ArchivesApi3.getArchInfo4(data).then(res => {
        if (res.code === 200) {
          commit("GET_ARCH_INFO", res.data);
        }
      });
    },
  },
  mutations: {
    GET_DOC_LIST(state, status) {
      state.DocList = status;
    },
    GET_DOC_TOTAL(state, status) {
      state.pagination.total = status;
    },
    GET_DOC_PAGE_SIZE(state, status) {
      state.pagination.pageSize = status;
    },
    GET_DOC_LIST_HEAD(state, status) {
      state.DocListHead = status;
    },
    GET_CATEGORYID(state, status) {
      state.categoryId = status;
    },
    GET_ARCH_INFO(state, status) {
      state.archInfo = status;
    },
    GET_MENU_TYPE(state, status) {
      state.menuType = status;
    }
  },
  getters: {
    DocList: state => state.DocList,
    DocListHead: state => state.DocListHead,
    pagination: state => state.pagination,
    categoryId: state => state.categoryId,
    refreshList: state => state.refreshList,
    archInfo: state => state.archInfo,
    menuType: state => state.menuType
  }
};
