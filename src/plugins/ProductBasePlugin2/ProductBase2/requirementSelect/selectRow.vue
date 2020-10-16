<template>
  <div id="selectRow">
    <el-collapse v-model="activeSelection" accordion>
      <el-collapse-item name="pannel">
        <template slot="title">
          <div class="select-row">
            <label>{{ label }}：</label>
            <ul>
              <li
                v-for="item in selection.slice(0, selectionCount)"
                :key="item.id"
                @click.stop="selectHandle(item)"
                :class="selectionClass(item)"
              >
                {{ item.name }}
              </li>
              <li
                v-show="selectionToggle"
                v-for="item in selection.slice(selectionCount, selection.length)"
                :key="item.id"
                @click.stop="selectHandle(item)"
                :class="selectionClass(item)"
              >
                {{ item.name }}
              </li>
            </ul>
            <div
              class="more-btn"
              @click.stop="showMoreSelection"
              v-if="selection.length > selectionCount"
            >
              <span v-if="!selectionToggle" key="true">更多</span>
              <span v-else key="false">隐藏</span>
              <i :class="arrowClass"></i>
            </div>
          </div>
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "selectRow",
  props: {
    // 一行的标签，指产品或者行业
    label: {
      type: String
    },
    // 可选的条件选项
    selection: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 用户选择了的选项
    selected: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 自选项
    moreSelection: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 用户选择的子选项
    moreSelectionSelected: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 供选择的一行显示多少个条件，默认10个
    selectionCount: {
      type: Number,
      default: () => {
        return 3;
      }
    },
    // 控制行的loading
    moreLoading: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  watch: {
    loading(v) {
      console.log(v);
    }
  },
  data() {
    return {
      selectionToggle: false
    };
  },
  computed: {
    selectionClass() {
      return function(item) {
        return (this.selected.Keyword === item.Keyword ? "product-selected" : "") + " selection";
      };
    },
    arrowClass() {
      return this.selectionToggle ? "el-icon-arrow-down move-up" : "el-icon-arrow-down move-down";
    },
    moreSelectionClass() {
      return function(item) {
        return (
          (this.moreSelectionSelected.Keyword === item.Keyword ? "product-selected" : "") +
          " selection"
        );
      };
    },
    // 控制自选项折叠面板的开关，如果自选项列表moreSelection列表为空，面板关闭，否则开启
    // 如果是在等待中，面板也要开启
    activeSelection() {
      if (this.moreLoading) {
        return "pannel";
      }
      return this.moreSelection.length === 0 ? "" : "pannel";
    }
  },
  methods: {
    selectHandle(item) {
      this.$emit("selectHandle", item);
    },
    // 用于子选项的事件传递
    selectHandle2(item) {
      this.$emit("moreSelectionSelectHandle", item);
    },
    // 用户点击显示更多条件
    showMoreSelection() {
      this.selectionToggle = !this.selectionToggle;
    }
  }
};
</script>

<style lang="scss">
// 箭头旋转动画
@keyframes rotate0 {
  from {
    transform: rotate(180deg);
    -ms-transform: rotate(180deg); /* IE 9 */
    -moz-transform: rotate(180deg); /* Firefox */
    -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
    -o-transform: rotate(180deg); /* Opera */
  }
  to {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg); /* IE 9 */
    -moz-transform: rotate(0deg); /* Firefox */
    -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
    -o-transform: rotate(0deg); /* Opera */
  }
}

@keyframes rotate180 {
  from {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg); /* IE 9 */
    -moz-transform: rotate(0deg); /* Firefox */
    -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
    -o-transform: rotate(0deg); /* Opera */
  }
  to {
    transform: rotate(180deg);
    -ms-transform: rotate(180deg); /* IE 9 */
    -moz-transform: rotate(180deg); /* Firefox */
    -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
    -o-transform: rotate(180deg); /* Opera */
  }
}

.move-down {
  animation: rotate0 0.5s;
  -moz-animation: rotate0 0.5s; /* Firefox */
  -webkit-animation: rotate0 0.5s; /* Safari 和 Chrome */
  -o-animation: rotate0 0.5s; /* Opera */
  // 加入结束状态
  transform: rotate(0deg);
  -ms-transform: rotate(0deg); /* IE 9 */
  -moz-transform: rotate(0deg); /* Firefox */
  -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
  -o-transform: rotate(0deg); /* Opera */
}

.move-up {
  animation: rotate180 0.5s;
  -moz-animation: rotate180 0.5s; /* Firefox */
  -webkit-animation: rotate180 0.5s; /* Safari 和 Chrome */
  -o-animation: rotate180 0.5s; /* Opera */
  // 加入结束状态
  transform: rotate(180deg);
  -ms-transform: rotate(180deg); /* IE 9 */
  -moz-transform: rotate(180deg); /* Firefox */
  -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
  -o-transform: rotate(180deg); /* Opera */
}

#selectRow {
  .select-row {
    width: 100%;
    line-height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    .more-btn {
      padding: 0 20px;
      cursor: pointer;
      pointer-events: auto;
    }
  }
  .selection {
    cursor: pointer;
  }
  label {
    color: #c0c0c0;
  }
  .more-selection {
    flex-basis: 100%;
    padding: 10px 0;
    margin: 0px 10px 0px 44px;
    background: rgba(0, 0, 0, 0.05);
  }
  .el-collapse {
    border: none;
    width: 100%;
    .el-collapse-item {
      width: 100%;
    }
    .el-collapse-item__header:hover {
      color: black;
    }
    .el-collapse-item__header:focus {
      color: black;
    }
    .selection {
      pointer-events: auto !important;
    }
    .el-collapse-item__wrap {
      border: none;
    }
    .el-collapse-item__header {
      border: none;
      pointer-events: none;
      height: auto;
      line-height: unset;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
}
#selectRow > div {
  ul {
    list-style: none;
    flex: 1;
    flex-wrap: wrap;
    display: flex;
    padding-left: 15px;
    li {
      margin-right: 25px;
    }
  }
}
</style>

<style lang="scss" scoped>
.product-selected {
  color: #0080ff;
}
</style>
