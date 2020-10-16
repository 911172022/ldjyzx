<!-- 新建Bos模型 -->

<template>
    <div>
        <div v-if="showControl">
            <div>
                <ul class="explain-ul">
                    <li class="text">
                        支持模型格式为
                        <span v-text="legalModels"></span>
                    </li>
                    <li class="text">REVIT模型，必须先用轻量化插件转换成ZIP格式</li>
                    <li class="text">上传后服务器解析模型，根据复杂度不同需要约10-30分钟</li>
                    <li class="text">模型在服务器端解析成功后，才可以抽取模型编码</li>
                    <li class="text">为保证成功，操作时保证网络稳定电脑流畅</li>
                </ul>
                <div style="text-align: right;">
                    <el-upload
                        ref="upload"
                        action='#'
                        :file-list="fileList"
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change='handleChange'>
                        <el-button icon="el-icon-upload" slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </div>
                
                <el-form
                    ref="form"
                    :model="form"
                    label-width="100px"
                    label-position="top"
                    :rules="rules"
                >
                    <el-form-item label="模型名称" required prop="name">
                        <el-input v-model="form.name" prefix-icon="el-icon-document" placeholder="请选择模型上传"></el-input>
                    </el-form-item>
                    <el-form-item label="模型说明" >
                        <el-input v-model="form.desc" prefix-icon="el-icon-info" placeholder="请输入模型描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="progress-wrapper">
                <span>上传进度</span>
                <el-progress :text-inside="true" :stroke-width="24" :percentage="progress" status="success"></el-progress>
            </div>
            <span slot="footer" class="footerBtn">
                <el-button @click="cancelHandle">取消</el-button>
                <el-button
                    type="primary"
                    @click="submit('bosModelForm')"
                >确定</el-button>
            </span>
        </div>
    </div>
</template>

<script>
import docApi from "../../api/services/doc";
import { MODEL_TYPES  } from '../../const.js'
import { mapGetters } from 'vuex'

export default {
    props: {
        dialogObj: {
            type: Object,
            required: true,
            default: function() {
                return {
                    dialogTitle: "提示"
                };
            }
        }
    },
    data() {
        return {
            legalModels: MODEL_TYPES.join(','),
            fileList: [],
            form: {
                // 模型名称
                name: '',
                // 模型描述
                desc: '',
            },
            modelFile: null,
            projectId: null,
            dialogWidth: 0,
            showControl: false,
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入模型名称',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) =>  {
                            return this.modelFile ? callback() : callback(new Error('请选择文件上传'))
                        },
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        handleChange(file, files) {
            this.modelFile = file
            let formName = file.name.split('.')
            formName = formName.length > 1 ? formName.slice(0, formName.length - 1).join('') : formName[0]
            this.form.name = formName
        },
        cancelHandle() {
            this.reData();
            this.showControl = false;
            this.$emit("cancelHandle");
            this.$store.commit('bos/PROGRESS_UPDATE', 0)
        },
        async submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$store.dispatch({
                        type: 'bos/uploadModel',
                        // cdms 的projectkeyword
                        projectKeyword: this.projectId,
                        modelName: this.form.name,
                        modelDesc: this.form.desc,
                        modelFile: this.modelFile,
                        onSuccess: () => {
                            this.cancelHandle(true)
                            this.$store.commit("project/REFRESH_TREE", true);
                        }
                    }) 
                }
            })
        },
        reData() {
            this.form = {
                // 模型名称
                name: '',
                // 模型描述
                desc: '',
            }
            this.modelFile = null
        }
    },
    watch: {
        dialogObj: {
            handler(newValue) {
                if (!newValue.switch) return;
                const id = newValue.Id;
                this.projectId = newValue.projectId;
                // const CopyDirectory = newValue.contextMenuObj;
                if (id === "TD_NewBosModel") {
                    this.$emit("changeDialogWidth", "50%");
                    this.showControl = true;
                } else {
                    this.showControl = false
                }
            },
            deep: true,
            immediate: true
        },
    },
    computed: {
        // buttonClickDisabled() {
        //     return Boolean(
        //         !this.bosModelForm.projectCode ||
        //             !this.bosModelForm.projectDesc ||
        //             !this.bosModelForm.modelKey ||
        //             !this.bosModelForm.projectKey
        //     );
        // }
        ...mapGetters('bos', ['progress'])
    }
};
</script>

<style lang="scss" scoped>
.explain-ul {
    padding: 0 10px;
    .text {
        margin-bottom: 18px;
        font-size: 14px;
    }
}
.progress-wrapper {
    padding: 20px;
    span {
        display: block;
        margin-bottom: 15px;
    }
}
</style>
