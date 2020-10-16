<template>
  <div class="toolbar">
    <link
      rel="stylesheet"
      type="text/css"
      href="//at.alicdn.com/t/font_598462_3xve1872wizzolxr.css"
    />
    <i
      class="command iconfont icon-undo"
      title="撤销"
      :class="undoList.length>0?'':'disable'"
      @click="handleUndo"
    ></i>
    <i
      class="command iconfont icon-redo"
      title="重做"
      :class="redoList.length>0?'':'disable'"
      @click="handleRedo"
    ></i>
    <span class="separator"></span>
    <!-- <i data-command="copy" class="command iconfont icon-copy-o disable" title="复制"></i>
    <i data-command="paste" class="command iconfont icon-paster-o disable" title="粘贴"></i>-->
    <i
      data-command="delete"
      class="command iconfont icon-delete-o"
      title="删除"
      :class="selectedItem?'':'disable'"
      @click="handleDelete"
    ></i>
    <span class="separator"></span>
    <i
      data-command="zoomIn"
      class="command iconfont icon-zoom-in-o"
      title="放大"
      @click="handleZoomIn"
    ></i>
    <i
      data-command="zoomOut"
      class="command iconfont icon-zoom-out-o"
      title="缩小"
      @click="handleZoomOut"
    ></i>
    <i
      data-command="autoZoom"
      class="command iconfont icon-fit"
      title="适应画布"
      @click="handleAutoZoom"
    ></i>
    <i
      data-command="resetZoom"
      class="command iconfont icon-actual-size-o"
      title="实际尺寸"
      @click="handleResetZoom"
    ></i>
    <span class="separator"></span>
    <i
      data-command="toBack"
      class="command iconfont icon-to-back"
      :class="selectedItem?'':'disable'"
      title="层级后置"
      @click="handleToBack"
    ></i>
    <i
      data-command="toFront"
      class="command iconfont icon-to-front"
      :class="selectedItem?'':'disable'"
      title="层级前置"
      @click="handleToFront"
    ></i>
    <span class="separator"></span>
    <span class="separator"></span>
    <i
      data-command="multiSelect"
      class="command iconfont icon-select"
      :class="multiSelect?'disable':''"
      title="多选"
      @click="handleMuiltSelect"
    ></i>
    <i
      data-command="addGroup"
      class="command iconfont icon-group"
      title="成组"
      :class="addGroup?'':'disable'"
      @click="handleAddGroup"
    ></i>
    <i data-command="unGroup" class="command iconfont icon-ungroup disable" title="解组"></i>
    <el-button @click="consoleData" type="primary">控制台输出数据</el-button>
    <el-button @click="getDefWf" type="primary">获取流程</el-button>
    <el-button @click="saveWf" type="primary">保存流程</el-button>
  </div>
</template>

<script>
import UserApi from "../../../../../api/services/defworkflow";
import eventBus from "../../utils/eventBus";
import Util from "@antv/g6/src/util";
import { uniqueId, getBox } from "../../utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      page: {},
      graph: {},
      redoList: [],
      undoList: [],
      editor: null,
      command: null,
      selectedItem: null,
      multiSelect: false,
      addGroup: false,
      offsetX: 0,
      offsetY: 0
    };
  },
  created() {
    this.init();
    this.bindEvent();
  },
  watch: {
    selectedItem(val) {
      if (val && val.length > 1) {
        this.addGroup = true;
      } else {
        this.addGroup = false;
      }
    }
  },
  computed: {
    ...mapGetters("defworkflow", [
      "DefWorkFlowKeyword",
      "CStateBranchList",
      "CWorkStateList"
    ])
  },
  methods: {
    init() {
      const { editor, command } = this.$parent;
      this.editor = editor;
      this.command = command;
    },
    bindEvent() {
      let self = this;
      eventBus.$on("afterAddPage", page => {
        self.page = page;
        self.graph = self.page.graph;
      });
      eventBus.$on("add", data => {
        this.redoList = data.redoList;
        this.undoList = data.undoList;
      });
      eventBus.$on("update", data => {
        this.redoList = data.redoList;
        this.undoList = data.undoList;
      });
      eventBus.$on("delete", data => {
        this.redoList = data.redoList;
        this.undoList = data.undoList;
      });
      //更新流程状态位置，移动流程状态后触发
      eventBus.$on("updateItem", item => {

        //这里必须先更新页面，再保存到服务器，否则位置会对不上
        this.command.executeCommand("update", [item]);

        //保存新的位置到服务器
        this.sendSaveDefWsPosition(item);

      });
      eventBus.$on("addItem", (item) => {
        this.command.executeCommand("add", [item]);
      });
      eventBus.$on("nodeselectchange", () => {
        this.selectedItem = this.graph.findAllByState("node", "selected");
        this.selectedItem = this.selectedItem.concat(
          ...this.graph.findAllByState("edge", "selected")
        );
      });
      eventBus.$on("deleteItem", () => {
        this.handleDelete();
      });
      eventBus.$on("muliteSelectEnd", () => {
        this.multiSelect = false;
        this.selectedItem = this.graph.findAllByState("node", "selected");
      });
      //添加流程状态模板
      eventBus.$on("newDefWfState", (data) => {
        //保存新的位置到服务器
        this.sendNewDefWfState(data);
      });
      //添加流程分支模板
      eventBus.$on("newDefWfBranc", (model) => {
        //保存新的分支模板到服务器
        this.sendNewDefWfBranc(model);
      });
    },
    handleUndo() {
      if (this.undoList.length > 0) this.command.undo();
    },
    handleRedo() {
      if (this.redoList.length > 0) this.command.redo();
    },
    handleDelete() {
      if (this.selectedItem.length > 0) {
        this.command.executeCommand("delete", this.selectedItem);
        this.selectedItem = null;
      }
    },
    getFormatPadding() {
      return Util.formatPadding(this.graph.get("fitViewPadding"));
    },
    getViewCenter() {
      const padding = this.getFormatPadding();
      const graph = this.graph;
      const width = this.graph.get("width");
      const height = graph.get("height");
      return {
        x: (width - padding[2] - padding[3]) / 2 + padding[3],
        y: (height - padding[0] - padding[2]) / 2 + padding[0]
      };
    },
    handleZoomIn() {
      const currentZoom = this.graph.getZoom();
      this.graph.zoomTo(currentZoom + 0.5, this.getViewCenter());
    },
    handleZoomOut() {
      const currentZoom = this.graph.getZoom();
      this.graph.zoomTo(currentZoom - 0.5, this.getViewCenter());
    },
    handleToBack() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          item.toBack();
          this.graph.paint();
        });
      }
    },
    handleToFront() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          if (item.getType() === "edge") {
            // const nodeGroup = this.graph.get("nodeGroup");
            // const edgeGroup = item.get("group");
            // nodeGroup.toFront();
            // edgeGroup.toFront()
          } else {
            item.toFront();
          }

          this.graph.paint();
        });
      }
    },
    handleAutoZoom() {
      this.graph.fitView(20);
    },
    handleResetZoom() {
      this.graph.zoomTo(1, this.getViewCenter());
    },
    handleMuiltSelect() {
      this.multiSelect = true;
      this.graph.setMode("mulitSelect");
    },
    handleAddGroup() {
      //TODO 这部分等阿里更新Group之后添加
      // const model = {
      //   id: "group" + uniqueId(),
      //   title: "新建分组"
      // };
      // // this.command.executeCommand("add", "group", model);
      // this.selectedItem.forEach(item => {
      //   console.log(item);
      // });
      //this.getPosition(this.selectedItem);
    },
    getPosition(items) {
      const boxList = [];
      items.forEach(item => {
        const box = item.getBBox();
        boxList.push(getBox(box.x, box.y, box.width, box.height));
      });
      let minX1, minY1, MaxX2, MaxY2;
      boxList.forEach(box => {
        if (typeof minX1 == "undefined") {
          minX1 = box.x1;
        }
        if (typeof minY1 == "undefined") {
          minY1 = box.y1;
        }
        if (typeof MaxX2 == "undefined") {
          MaxX2 = box.x2;
        }
        if (typeof MaxY2 == "undefined") {
          MaxY2 = box.y2;
        }
        if (minX1 > box.x1) {
          minX1 = box.x1;
        }
        if (minY1 > box.y1) {
          minY1 = box.y1;
        }
        if (MaxX2 < box.x2) {
          MaxX2 = box.x2;
        }
        if (MaxY2 < box.y2) {
          MaxY2 = box.y2;
        }
      });
      const width = MaxX2 - minX1,
        height = MaxY2 - minY1,
        x = minX1 + width / 2,
        y = minY1 + height / 2,
        id = "team" + uniqueId();
      const model = {
        id: id,
        width,
        height,
        x,
        y,
        shape: "teamNode"
      };
      this.command.executeCommand("add", model);
      // const item = this.graph.findById(id);
      // item.get("group").toBack();
      // const edgeGroup = this.graph.get("edgeGroup");
      // edgeGroup.toFront();
      // this.graph.paint();
    },

    consoleData() {
      console.log(this.graph.save());
    },
    //获取流程图，包括流程状态核流程分支
    getDefWf() {
      let DefWFKeyWord = "GJEPCMSDWF20";

      this.sendGetDefWf(DefWFKeyWord);

    },
    async sendGetDefWf(DefWFKeyWord) {

      this.$store.commit("defworkflow/DEFWFLOW", DefWFKeyWord);

      const res = await UserApi.getCDefWorkFlow(DefWFKeyWord);
      if (res.success) {

        this.$store.commit("defworkflow/GET_DEF_WORK_FLOW", res.data);

        console.log("defWorkFlowKeyWord:"+this.DefWorkFlowKeyword);

        //定义流程块的大小
        let cWsSizeWidth = 150;
        let cWsSizeHeight = 60;

        //绘制所有流程状态到流程图组件
        this.CWorkStateList.forEach(item => {

          this.offsetX = 0;
          this.offsetY = 0;

          //let strSize="150*60";
          let data = {};
          data.keyword = item.WorkStateKeyword;
          data.name = item.Code;
          data.label = item.Code;
          data.offsetX = this.offsetX;
          data.offsetY = this.offsetY;
          data.x = item.Location[0].X;
          data.y = item.Location[0].Y;
          //data.size = strSize.split("*");
          data.size = [cWsSizeWidth, cWsSizeHeight];
          data.type = "node";
          data.shape = "customNode";
          data.color = "#1890ff";
          data.image =
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg";
          data.stateImage = "/img/ok.463ab0e4.svg";
          data.inPoints = [
            [0, 0.5],
            [0.5, 0]
          ];
          data.outPoints = [
            [0.5, 1],
            [1, 0.5]
          ];
          this.command.executeCommand("add", [data]);
        });

        const graphNodes = this.graph.getNodes();
        //绘制所有流程分支到流程图组件
        this.CStateBranchList.forEach(item => {

          let startItem = this.findNode(graphNodes, item.PreDefWorkStateCode);
          let endItem = this.findNode(graphNodes, item.NextDefWorkStateCode);
          if (startItem && endItem) {
            const branchStartX = parseInt(item.CLineList[0].startPt[0].X);
            const branchStartY = parseInt(item.CLineList[0].startPt[0].Y);
            const wsStartX = startItem._cfg.model.x;
            const wsStartY = startItem._cfg.model.y;
            //流程分支的x与y，是流程状态和流程分支的偏移
            const startX = parseInt(branchStartX - wsStartX);
            const startY = parseInt(branchStartY - wsStartY);
            let startPoint = { x: startX, y: startY };

            const branchEndX = parseInt(item.CLineList[0].endPt[0].X);
            const branchEndY = parseInt(item.CLineList[0].endPt[0].Y);
            const wsEndX = endItem._cfg.model.x;
            const wsEndY = endItem._cfg.model.y;
            //流程分支的x与y，是流程状态和流程分支的偏移
            const endX = parseInt(branchEndX - wsEndX);
            const endY = parseInt(branchEndY - wsEndY);
            let endPoint = { x: endX, y: endY };

            //调整输入点，输入点在下面的，修改为上面，输入点为左面的，修改为右面
            //输入点在下面的，修改为上面
            if(endPoint.x==0 && endPoint.y== parseInt(cWsSizeHeight/2)){
              endPoint.y = -1 * parseInt(cWsSizeHeight/2);
            }
            //输入点为左面的，修改为右面
            if(endPoint.x==parseInt(cWsSizeWidth/2) && endPoint.y== 0){
              endPoint.x = -1 * parseInt(cWsSizeWidth/2);
            }

            //调整输出点，输出点在上面的，修改为下面，输出点为右面的，修改为左面
            //输出点在上面的，修改为下面
            if(startPoint.x==0 && startPoint.y== -1* parseInt(cWsSizeHeight/2)){
              startPoint.y = parseInt(cWsSizeHeight/2);
            }
            //输出点为右面的，修改为左面
            if(startPoint.x == -1 * parseInt(cWsSizeWidth/2) && startPoint.y== 0){
              startPoint.x = parseInt(cWsSizeWidth/2);
            }
            //console.log(fNode);
            const model = {
              id: "edge" + uniqueId(),
              keyword: item.StateBranchKeyword,
              brachname: item.BrachName,
              source: startItem,
              target: endItem,
              sourceId: startItem._cfg.id,
              targetId: endItem._cfg.id,
              start: startPoint,
              end: endPoint,
              shape: "customEdge",
              type: "edge"
            };
            //console.log("model:"+model);
            eventBus.$emit('addItem', model);
          }
        });
      }
    },
    findNode(graphNodes, sName) {
      let resItem = null;
      graphNodes.forEach(nodeItem => {
        let mName = nodeItem._cfg.model.name;
        // let sName2 = sName;
        if (mName === sName) {
          resItem = nodeItem;
          //break;
        }
      });
      return resItem;
    },
    //保存流程
    saveWf(){
      console.log("按下了保存流程！");
    },
    async sendSaveDefWsPosition(item){
        let wsPositionJson = []

        //获取流程状态属性
        let wsModel=item.item._cfg.model;
        let wsKeyword=wsModel.keyword;
        let wsName=wsModel.name;
        let wsLocationX = wsModel.x;
        let wsLocationY = wsModel.y;

        wsPositionJson.push(
          {
            "keyword":wsKeyword,
            "code":wsName,
            "locationx":wsLocationX,
            "locationy":wsLocationY,
          }
        )

      const res = await UserApi.saveCDefWFStatePosition(this.DefWorkFlowKeyword, wsPositionJson)

      if (res.success) {
        //修改页面
        //this.command.executeCommand("update", [item]);
      } else {
        this.$message({message: '修改失败，请检查服务器连接！', type: 'error'})
      }

    },
    //新建流程状态模板
    async sendNewDefWfState(data){
      // console.log(data);

      let newNode=this.searchNode(data.id);

      if (newNode){
        const res = await UserApi.newCDefWfState(this.DefWorkFlowKeyword, data.x, data.y)

        if (res.success) {
          //修改页面
          //this.command.executeCommand("update", [item]);
          let resData=res.data[0];
            const model = {
              name: resData.Code,
              label: resData.Code,
              keyword:resData.WorkStateKeyword
            };

            this.graph.update(newNode, model);

        } else {
          this.$message({message: '修改失败，请检查服务器连接！', type: 'error'})
        }
      }
    },
    searchNode(nodeId){
        var nodeItem = null;
        const graphNodes = this.graph.getNodes();
        graphNodes.forEach(item =>{
          if(item._cfg.id == nodeId){
            nodeItem =item;
          }
        })
        return nodeItem;
    },
    //新建流程分支模板
    async sendNewDefWfBranc(model){

      console.log(model);

      let preWorkStateKeyword = model.source._cfg.model.keyword;
      let nextWorkStateKeyword = model.target._cfg.model.keyword;

      // let startPtX = Math.round (model.startPoint.x);
      // let startPtY = Math.round (model.startPoint.y);
      // let endPtX = Math.round (model.endPoint.x);
      // let endPtY = Math.round (model.endPoint.y);

      let startPtX = Math.round (model.source._cfg.model.x - model.start.x);
      let startPtY = Math.round (model.source._cfg.model.y - model.start.y);
      let endPtX = Math.round (model.target._cfg.model.x - model.end.x);
      let endPtY = Math.round (model.target._cfg.model.y - model.end.y);

      const res = await UserApi.newCDefWfBranch(this.DefWorkFlowKeyword, preWorkStateKeyword,nextWorkStateKeyword,startPtX,startPtY,endPtX,endPtY)
        if (res.success) {
          //修改页面
          //this.command.executeCommand("update", [item]);
          // let resData=res.data[0];
          //   const model = {
          //     name: resData.Code,
          //     label: resData.Code,
          //     keyword:resData.WorkStateKeyword
          //   };

          //   this.graph.update(newNode, model);

        } else {
          this.$message({message: '修改失败，请检查服务器连接！', type: 'error'})
        }

    }
  }
};
</script>


<style scoped>
.toolbar {
  box-sizing: border-box;
  padding: 8px 0px;
  width: 100%;
  border: 1px solid #e9e9e9;
  height: 42px;
  z-index: 3;
  box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
  position: absolute;
}
.toolbar .command:nth-of-type(1) {
  margin-left: 24px;
}
.toolbar .command {
  box-sizing: border-box;
  width: 27px;
  height: 27px;
  margin: 0px 6px;
  border-radius: 2px;
  padding-left: 4px;
  display: inline-block;
  border: 1px solid rgba(2, 2, 2, 0);
}
.toolbar .command:hover {
  cursor: pointer;
  border: 1px solid #e9e9e9;
}
.toolbar .disable {
  color: rgba(0, 0, 0, 0.25);
}
.toolbar .separator {
  margin: 4px;
  border-left: 1px solid #e9e9e9;
}
</style>
