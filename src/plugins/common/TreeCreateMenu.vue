<template>
  <div>
    <!-- 新建厂家信息 -->
    <template v-if="isStatus === 10">
      <SetFactoryMes :dialogObj="SetFactoryMesData" @reData="cancelHandle" />
    </template>
    <!-- 创建发文 -->
    <template v-else-if="isStatus === 11">
      <CreateFile :dialogObj="CreateFileData" @reData="cancelHandle" />
    </template>
    <!-- 生成提资单 -->
    <template v-else-if="isStatus === 12">
      <PayList :dialogObj="PayListData" @reData="cancelHandle" />
    </template>
    <!-- 创建成品 -->
    <template v-else-if="isStatus === 13">
      <SetProduct :dialogObj="SetProductData" @reData="cancelHandle" />
    </template>
    <!-- 创建设计阶段与选择专业 -->
    <template v-else-if="isStatus === 14">
      <SelectMajors :dialogObj="SelectMajorsData" @reData="cancelHandle" />
    </template>
    <!-- 创建任务 -->
    <template v-else-if="isStatus === 15">
      <SetWork :dialogObj="SetWorkData" @reData="cancelHandle" />
    </template>
    <!-- 方圆创建发文 -->
    <template v-else-if="isStatus === 16">
      <FyCreateFile :dialogObj="FyCreateFileData" @reData="cancelHandle" />
    </template>
    <!-- 方圆创建收文 -->
    <template v-else-if='isStatus === 18'>
      <FyReceivedDocument :dialogObj='FyReceivedDocumentData' @refreshAsideL='refreshAsideL' @reData='cancelHandle'/>
    </template>
  </div>
</template>

<script>
// 2020.4.16-2-1
import { PluginsList } from '../../const.js'

export default {
  props: {
    dialogObj: {
      type: Object,
      required: true,
      default: function() {
        return {
          switch: false,
          dialogTitle: "提示"
        };
      }
    }
  },
  data() {
    return {
      dialogWidth: 0,
      isStatus: null,
      // ZY start
      SetFactoryMesData: {
        switch: false,
        projectId: ""
      },
      CreateFileData: {
        switch: false,
        projectId: ""
      },
      PayListData: {
        switch: false,
        projectId: "",
        title: ""
      },
      SetProductData: {
        switch: false,
        projectId: ""
      },
      SelectMajorsData: {
        switch: false,
        keyword: ""
      },
      SetWorkData: {
        switch: false,
        projectId: ""
      },
      FyCreateFileData: {
        switch: false,
        projectId: ""
      },
      // ZY end
      // 方圆创建收文
      FyReceivedDocumentData: {
        switch: false,
        projectId: ''
      }
    }
  },
  methods: {
    cancelHandle(){
      this.isStatus = null
      this.$emit("cancelHandle")
    },
    // 刷新asideL
    refreshAsideL(e) {
      this.$emit('refreshAsideL', e)
    }
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (!newValue.switch) return;
        const id = newValue.Id;
        // const CopyDirectory = newValue.contextMenuObj;

        if ( id.slice(0, 2) === "FY" | id.slice(0, 2) === 'HX'  ){
          if (PluginsList.indexOf('HXPlugin') != -1){
            if( id === "HX_SelectProfession") {
              this.isStatus = 14;
              this.$emit('changeDialogWidth', '25%')
              this.SelectMajorsData.switch = true;
              this.SelectMajorsData.startAtWfBtn = false;
              this.SelectMajorsData.keyword = newValue.projectId;
            } else if ( id === 'HX_CreateCompany') {
              this.isStatus = 10;
              this.$emit('changeDialogWidth', '60%')
              this.SetFactoryMesData.switch = true;
              this.SetFactoryMesData.projectId = newValue.projectId;
            } else if ( id === "HX_SendDocument"){
              this.isStatus = 11;
              this.$emit('changeDialogWidth', '45%')
              this.CreateFileData.switch = true;
              this.CreateFileData.projectId = newValue.projectId;
            } else if ( id === 'HX_ExcangeDoc'){
              this.$emit('changeDialogWidth', '40%')
              this.isStatus = 12;
              this.PayListData.title = newValue.dialogTitle;
              this.PayListData.switch = true;
              this.PayListData.projectId = newValue.projectId;
            } else if ( id === 'HX_CreateProdect' ) {
              this.isStatus = 13;
              this.$emit('changeDialogWidth', '25%')
              this.SetProductData.switch = true;
              this.SetProductData.projectId = newValue.projectId;
            } else if ( id === 'HX_CreateWorkTask') {
              this.isStatus = 15;
              this.$emit('changeDialogWidth', '25%')
              this.SetWorkData.switch = true;
              this.SetWorkData.projectId = newValue.projectId;
              this.SetWorkData.text = "HX_CreateWorkTask";
            }
          }
          if (PluginsList.indexOf('FYPlugin') != -1) {
            if ( id === 'FY_SendDocument') {
              // 方圆 创建发文
              this.isStatus = 16;
              this.$emit('changeDialogWidth', '45%')
              this.FyCreateFileData.switch = true;
              this.FyCreateFileData.projectId = newValue.projectId;
            } else if ( id === 'FY_CreateCompany') {
              this.isStatus = 10;
              this.$emit('changeDialogWidth', '60%')
              this.SetFactoryMesData.switch = true;
              this.SetFactoryMesData.projectId = newValue.projectId;
            } else if (id === 'FY_ReceivedDocument') {
              this.isStatus = 18
              this.$emit('changeDialogWidth', '60%')
              this.FyReceivedDocumentData.switch = true;
              this.FyReceivedDocumentData.projectId = newValue.projectId;
              this.FyReceivedDocumentData.projectPath = newValue.projectPath
            }
          }
        }
      },
      deep: true,
      immediate: true,
    }
  }
}
</script>

<style lang="scss">

</style>
