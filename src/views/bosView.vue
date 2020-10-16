<template>
    <div id="viewerWrapper">
        <div class="awsd">
            <div @click="fakeAKeydown">A</div>
        </div>
        <div v-if="modelShow" id="viewer3D" ref="viewer" style="width:100%; height:100%"></div>
        <div v-if="queryError" class="query-error">
            传递参数错误
        </div>
    </div>
</template>
<script>
import { HOST3D } from "../const";
export default {
    data() {
        return {
            // modelKey: 'M1594635212305',
            // projectKey: 'ad92eed7ca0e4e0282b7c72d949062fe',
            modelKey: '',
            projectKey: '',
            modelShow: false,
            queryError: false,
        };
    },
    beforeCreate() {
    },
    mounted() {
        this.projectKey = this.$route.query.projectKey
        this.modelKey = this.$route.query.modelKey

        if (this.projectKey && this.modelKey) {
            this.modelShow = true
            setTimeout(() => {
                this.getViewerSize();
                this.setModel();
            }, 500);
        } else {
            this.queryError = true
        }

        
        // 适应屏幕大小
        // viewer3D.autoResize();
        // window.addEventListener("resize", function() {
        //   viewer3D.autoResize();
        // })
        // 设置视窗大小
        // viewer3D.resize(500, 500)
        // 传入构件key，查看构件
        // viewer3D.showComponentsByKey("M1533004205283_35ulmdG1fBmv6VyzLMAXX5");
        // 卸载模型
        // setTimeout(() => {
        //   viewer3D.viewerImpl.unload(modelKey)
        // }, 1000 * 10)
    },
    methods: {
        fakeAKeydown() {
            setInterval(() => {
                let inputObj = document.body
                this.fireKeyEvent(inputObj, "keydown", 87)
            }, 500)
            
            
        },
        fireKeyEvent(el, evtType, keyCode) {
            let evtObj;
            if (document.createEvent) {
                if (window.KeyEvent) {
                    evtObj = document.createEvent("KeyEvents")
                    evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0)
                } else {
                    evtObj = document.createEvent("Events")
                    // evtObj.initUIEvent(evtType, true, true, window, 1)
                    evtObj.initEvent(evtType, true, true)
                    evtObj.keyCode = keyCode
                    evtObj.which = keyCode
                }
            }
            console.log(evtObj)
            el.dispatchEvent(evtObj)
        },
        setModel() {
            let option = {
                // host: "http://bos3d.bimwinner.com",
                host: HOST3D,
                viewport: "viewer3D"
            };
            let viewer3D = new window.BIMWINNER.BOS3D.Viewer(option);
            let modelKey = this.modelKey;
            let projectKey = this.projectKey;
            let tool = new window.BIMWINNER.BOS3D.UI.ToolBar(viewer3D);
            tool.createTool();
            /* let res = */ viewer3D.addView(modelKey, projectKey);

            // if (!res) {
            //   this.$message({
            //     message: '获取bos模型失败！',
            //     type: 'error'
            //   })
            // }

            viewer3D.resize(this.viewerWidth, this.viewerHeight);
            // viewer3D.autoResize()
        },
        getViewerSize() {
            this.viewerHeight = this.$refs.viewer.offsetHeight;
            this.viewerWidth = this.$refs.viewer.offsetWidth;
        }
    }
};
</script>
<style lang='scss' scoped>
#viewerWrapper {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    height: 100%;
    flex: 1;
}
.query-error {
    text-align: center;
    margin-top: 20px;
}
.awsd {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 100;
    div {
        background: black;
        width: 20px;
        height: 20px;
    }
}
</style>
