<template>
  <div>
    <div class="cropper-content">
      <!-- 剪裁框 -->
      <div class="cropper">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          @realTime="realTime"
          :fixed="option.fixed"
          :fixedNumber="fixedNumber"
        ></vueCropper>
      </div>
      <!-- 预览框 -->
      <div class="show-preview">
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </div>
    </div>
    <el-row class="dialog-footer">
      <el-col :span="12">
        <el-button type="primary" icon="el-icon-zoom-in" @click="changeScale(1)"></el-button>
        <el-button type="primary" icon="el-icon-zoom-out" @click="changeScale(-1)"></el-button>
        <el-button type="primary" @click="rotateLeft"><i class="el-icon-refresh-left"></i></el-button>
        <el-button type="primary" @click="rotateRight"><i class="el-icon-refresh-right"></i></el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" @click="uploadImg('base64')">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  props: ["imgFile", "fixedNumber"],
  data() {
    return {
      previews: {}, // 预览数据
      option: {
        img: "", // 裁剪图片的地址  (默认：空)
        size: 1, // 裁剪生成图片的质量  (默认:1)
        full: true, // 是否输出原图比例的截图 选true生成的图片会非常大  (默认:false)
        outputType: "png", // 裁剪生成图片的格式  (默认:jpg)
        canMove: true, // 上传图片是否可以移动  (默认:true)
        original: false, // 上传图片按照原始比例渲染  (默认:false)
        canMoveBox: true, // 截图框能否拖动  (默认:true)
        autoCrop: true, // 是否默认生成截图框  (默认:false)
        autoCropWidth: 400, // 默认生成截图框宽度  (默认:80%)
        autoCropHeight: 400, // 默认生成截图框高度  (默认:80%)
        fixedBox: false, // 固定截图框大小 不允许改变  (默认:false)
        fixed: true, // 是否开启截图框宽高固定比例  (默认:true)
        fixedNumber: [10, 10] // 截图框比例  (默认:[1:1])
      },
      downImg: "#"
    };
  },
  components: { 
    VueCropper 
  },
  methods: {
    // 图片缩放
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    Update() {
      this.option.img = this.imgFile.url;
    },
    // 实时预览
    realTime(data) {
      this.previews = data
    },
    // 将剪裁好的图片回传给父组件
    uploadImg(type) {
      event.preventDefault()
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          this.$emit("upload", data)
        })
      } else {
        this.$refs.cropper.getCropData(data => {
          this.$emit("upload", data)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-footer {
    display: block;
    margin-top: 20px;
  }
</style>
<style lang="scss">
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  .cropper {
    width: 350px;
    height: 300px;
  }
  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
    width: 300px;
    height: 300px;
    margin: 0 25px;
    overflow: hidden;
    border: 1px solid #cccccc;
    background: #cccccc;
    margin-left: 40px;
    .preview {
      overflow: hidden;
      border: 1px solid #cccccc;
      background: #cccccc;
    }
  }
}
</style>