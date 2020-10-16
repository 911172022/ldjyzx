<template>
  <!-- 产品介绍 -->
  <div class='pannel'>
    <div class='label'>
      <div>
        <label>产品经理</label>
        <span>{{ item.ProductManagerDesc }}</span>
      </div>
      <div>
        <label>所属部门</label>
        <span>{{ item.Department }}</span>
      </div>
      <div>
        <label>联系电话</label>
        <span>{{ item.ContactNumber }}</span>
      </div>
      <div>
        <label>更新时间</label>
        <span>{{ item.UpdateDate }}</span>
      </div>
    </div>
    <div class='introduction'>
      <div class='title'>
        软件价格
      </div>
      <div class='desc'>
        {{ item.ProductPrice }}
      </div>
    </div>
    <div class='introduction'>
      <div class='title'>
        产品特性
      </div>
      <div class='desc'>
        {{ item.ProductFeatures }}
      </div>
    </div>
    <div class='introduction'>
      <div class='title'>
        竞品分析
      </div>
      <div class='desc'>
        {{ item.ProductComparison }}
      </div>
    </div>
    <div class='introduction'>
      <div class='title'>
        案例
      </div>
      <template v-if='showCaseAttachment'>
        <div class='desc product-file-preview' v-for='caseAttachment in item.CaseAttachment' @click='previewFile(caseAttachment)' :key='caseAttachment.Keyword'>
              <img :src='fileIconSrc(caseAttachment.Code)'/>
              <span>{{ caseAttachment.Code }}</span>
        </div>
      </template>
      <div class='desc' v-else>
        ——
      </div>
    </div>
    <div class='introduction'>
      <div class='title'>
        资料
      </div>
      <template v-if='showDocument'>
        <div class='desc product-file-preview'  v-for='doc in item.AdditionalDocument'  @click='previewFile(doc)' :key='doc.Keyword'>
              <img :src='fileIconSrc(doc.Code)'/>
              <span>{{ doc.Code }}</span>
        </div>

      </template>
      <div class='desc' v-else>
        ——
      </div>
    </div>
  </div>
</template>

<script>
import UserApi from "../../../../api/services/project";
import UserApi2 from '../../../../api/services/doc';
export default {
  props: ['item'],
  computed: {
    showDocument() {
      if(this.item.AdditionalDocument && this.item.AdditionalDocument.length > 0){
        return true
      }
      return false
    },
    showCaseAttachment() {
      if(this.item.CaseAttachment && this.item.CaseAttachment.length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    //  用来返回显示文件的图标的链接
    fileIconSrc(fileName){
      let i = fileName.split('.')
      if(i.length > 1) {
        i = i[i.length - 1].toUpperCase()
        if (['AUDIO', 'DLL', 'DOC', 'JPG', 'PDF', 'PNG', 'PPT', 'TXT', 'VIDEO', 'XLS', 'ZIP'].indexOf(i) !== -1){
          return require(`@/assets/table/${i}.png`)
        }
      }
      return require("@/assets/table/currency.png")
    },
    // 跳转文件预览
    async previewFile(file) {
        // 获取 ProjectKeyWord
        let Keyword = file.Keyword, IgnoreShortCut = 'false'
        const res = await UserApi.getProjectPath(Keyword, IgnoreShortCut)
        const ProjectKeyWord = res.data[0].ProjectKeyword
        //  储存位置
        await UserApi.saveLastProject(ProjectKeyWord)
        this.$router.push({ name: 'DocManagement' })
        //  获取列表
        const filterJson = '', page = 1, limit = 50
        const res3 = await UserApi2.getDocList(ProjectKeyWord, filterJson, page, limit)
        if (res3.success) {
          let KeywordList = res3.data.filter(item => item.Keyword === Keyword)
          this.$store.commit('PerMessage/ATTACHMENT_MOVE_DOC', KeywordList[0])
        }
    }
  }
}
</script>

<style lang='scss' scoped>
.pannel{
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  .label{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    label{
      color: #BBBBBB;
      margin-right: 15px;
    }
  }
  .label>div{
    flex-basis: 50%;
    margin-bottom: 15px;
  }
  .title{
    margin-bottom: 5px;
    margin-top: 10px;
  }
  .introduction{
    .desc{
      display: flex;
      align-items: center;
      img{
        width: auto;
        height: auto;
        max-width: 20px;
        max-height: 20px;
        margin-right: 10px;
      }
    }
  }
}
.pannel>div{
  margin-top: 20px;
}
.product-file-preview {
  cursor: pointer;
}
</style>
