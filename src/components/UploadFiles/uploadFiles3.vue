<!--
    第三版上传文件
    该组件仅有选择文件的功能，真正上传的逻辑交由 vuex 管理
    :autoUpload - 选择完文件自动上传（根据文件名创建文档上传）
    :rawFileList - 暴露给父组件的 fileList
    :projectKeyword - 要上传的目录
    :multiple - 是否可以多选文件
-->
<template>
    <div>
        <!-- 上传按钮 -->
        <el-upload
            ref="upload"
            action="#"
            :multiple='multiple'
            :auto-upload="false"
            :on-change="handleChange"
            :show-file-list="false"
            :on-error="onError"
        >
            <!-- <el-button
                size="small"
                type="primary"
                icon="el-icon-upload2"
            >上传</el-button> -->
            <slot></slot>
        </el-upload>
    </div>
</template>
<script>
export default {
    props: {
        // 控制自动上传
        autoUpload: {
            type: Boolean
        },
        // 暴露给父组件的 fileList
        rawFileList: {
            type: Array,
            default: function() {
                return [];
            },
            required: false,
        },
        // 要上传到哪个文件夹
        projectKeyword: {
            required: true
        },
        // 是否可以选择多个文件
        multiple: {
            require: false,
            default: function() {
                return true
            }
        }
    },
    data() {
        return {
            // 保存handleChange时候的setTimeout的timeId
            timeId: -1,
        }
    },
    methods: {
        /* ------------------------------------------------------------ */
        // 用户选择完文件的钩子
        // 或者是 rawFileList 改变
        handleChange(file, fileList) {
            // 更新 rawFileList
            this.$emit("update:rawFileList", fileList);
            clearTimeout(this.timeId);
            this.timeId = setTimeout(() => {
                if (this.autoUpload) {
                    this.$store.commit('upload/SET_FILE_LIST', fileList.map(i => {
                        return {
                            ...i,
                            projectKeyword: this.projectKeyword
                        }
                    }))
                    this.$store.dispatch({
                        type: 'upload/beforeUploadCreateDoc'
                    })
                } else {
                    // 传出去让父组件解收（让父组件决定是什么方式上传
                    this.$emit("handleChange", fileList)
                }
                this.$refs.upload.clearFiles()
                
            }, 500);
        },
        onError(e) {
            console.log(e)
        }
    }
}
</script>