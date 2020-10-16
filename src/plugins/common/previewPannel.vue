<!--

    一个全屏的预览面板
    使用示例：
    <preview-pannel
        :docKeyword='previewDocKeyword'
        :previewTrigger.sync='previewTrigger'
    >
    </preview-pannel>

    docKeyword 要预览的 keyword
    设定了 docKeyword 之后，previewTrigger = true 即可开启预览
    组件内监听 previewTrigger，检查 该 docKeyword 文件是否可预览，再打开预览
    并把 previewTrigger 设为 false

-->

<template>
    <div>
        <!-- 2020-5-22 退出预览按钮 -->
        <div id="previewPannel" v-if="realPreviewShow">
            <el-button id='previewPannelExitBtn' type="warning" round @click="exitPreview">退出预览</el-button>
            <div class="preview-wrapper" @keyup.esc="test">
                <template v-if="previewType === 'image'">
                    <viewer @inited='inited' :images='[previewUrl]' v-if="previewType === 'image'">
                        <img :src="previewUrl" alt="#">
                    </viewer>
                </template>
                <template v-else-if="previewType === 'doc'">
                    <iframe
                        scrolling="auto"
                        :src="previewUrl"
                        width="100%"
                        height="100%"
                        frameborder="0"
                    />
                    <div id="iframeMask" ref="iframeMask" />
                </template>
                <template v-else-if="previewType === 'video'">
                    <video
                        :src="previewUrl"
                        width="100%"
                        controls
                        style="max-height: 600px; background: black"
                        autoplay="autoplay"
                    >
                        <!-- <source :src="PreviewVideoURL" type="video/mp4"> -->
                        您的浏览器不支持 HTML5 video 标签。
                    </video>
                </template>
                <!-- 2020.4.20-1 -->
                <!-- <template v-else-if='isPreview === "MODEL"'>
                        <Bos3d :projectKey='projectKey' :modelKey='modelKey' />
                    </template>
                    <template v-else>
                        <div style="text-align: center;">
                            <img src="../../assets/PreviewError.png" alt style="max-width: 100%;" />
                            <p>文件暂不支持预览，请直接下载查看</p>
                        </div>
                </template>-->
                <!-- <div class='arrow-wrapper'>
                        <div><span @click='previewPrevious' class='el-icon-arrow-left left-arrow'></span></div>
                        <div><span  @click='previewNext' class='el-icon-arrow-right right-arrow'></span></div>
                </div>-->
            </div>
        </div>
        
    </div>
</template>

<script>
import { BASE_URL } from "@/const";
import DocApi from '../../api/services/doc'


export default {
    props: {
        docKeyword: {
            reqiure: true,
        },
        previewTrigger: {
            require: true,
        }
        
    },
    data() {
        return {
            realPreviewShow: false,
            previewType: '',
            path: ''
        }
    },
    computed: {
        previewUrl() {
            return `${BASE_URL}/${ this.path }`
        },
        // 退出按钮的dom
        exitDom() {
            return this.$el.querySelector('#previewPannelExitBtn')
        }
    },
    mounted() {
    },
    methods: {
        exitPreview() {
            this.realPreviewShow = false
        },
        async previewCheck() {
            let res = await DocApi.previewDoc(this.docKeyword)
            if (!res.success) {
                this.$message({
                    message: `获取文档预览链接失败：${ res.msg }`,
                    type: 'warning'
                })
                return
            }
            // 处理res里的信息，格式化
            res = res.data[0]
            let suffix = res.filename.split(".").pop().toUpperCase();
            if (['PNG', "JPG", "JPGE"].indexOf(suffix) != -1) {
				res.previewType = 'image'
			} else if (['DOC', "DOCX", "XLSX", "XLS", "PPTX", "PPT", "PDF", "TXT", "PDF"].indexOf(suffix) != -1) {
                res.previewType = 'doc'
            } else if (['MP4', 'WMV', 'AVI', "MOV"].indexOf(suffix) != -1) {
                let res2 = await DocApi.fileDownload(this.docKeyword, '')
                if (!res2.success) {
                    this.$message({
                        message: `获取文件链接错误：${ res.msg }`,
                        type: 'error'
                    })
                }
                res.path = res2.data[0].path
                res.previewType = 'video'
            } else {
                this.$message({
                    message: `${ res.filename } 该格式不支持预览！`,
                    type: 'warning'
                })
            }
            this.path = res.path
            this.previewType = res.previewType
            return true
        },
        inited (viewer) {
            this.$viewer = viewer
        },
        show() {
            this.$viewer.show()
        },
        setExitBtn() {
            this.$nextTick(() => {
                const body = document.querySelector('body')
                this.exitDom.onclick = () => {
                    this.exitPreview()
                }
                if (body.append) {
                    body.append(this.exitDom)
                } else {
                    body.appendChild(this.exitDom)
                }
            })
        },
        clearExitBtn() {
            this.$nextTick(() => {
                let btn = document.getElementById('previewPannelExitBtn')
                btn.parentNode.removeChild(btn)
            })
        }
    },
    watch: {
        async previewTrigger(newValue, oldValue) {
            if (!oldValue && newValue) {
                // 先做预览准备
                let checked = await this.previewCheck()
                if (checked) {
                    this.realPreviewShow = true
                    if (this.previewType === 'image') {
                        this.$nextTick(() => {
                            // this.setExitBtn()
                            this.show()
                        })
                    }
                }
                this.$emit('update:previewTrigger', false)
            }
        },
        // 检测previewShow ，动态添加删除退出预览按钮
        realPreviewShow(v) {
            this.$nextTick(() => {
                if (v) {
                    this.setExitBtn()
                } else {
                    this.clearExitBtn()
                }
            })
            
        }
    }

}
</script>

<style lang="scss" scoped>
#previewPannel {
    position: fixed;
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .preview-wrapper {
        position: relative;
        height: 95vh;
        max-width: 1000px;
        width: 90%;
    }
}
</style>
<style >
#previewPannelExitBtn{
    position: fixed;
    right: 20px;
    z-index: 9999;
    bottom: 20px;
}
</style>