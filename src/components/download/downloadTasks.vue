<template>
    <div id="downloadTasks" :draggable="false">
        <!-- <button style="position: fixed; z-index: 10000; top: 50px" @click="test">test</button> -->
        <!-- @mousedown="move" -->
        <div class="ball" v-show="downloadTasks.length > 0" @mousedown="move" :style="ballStyle"  @click="showTasks" ref='ball'>
            <div class='el-icon-download download-icon'></div>
        </div>
        <div class='wrapper' :style="wrapperStyle">
            <div class="tasks-wrapper" ref='tasksWrapper' id="tasksWrapper">
                <div v-for="i in downloadTasks" :key="i.docKeyword" class="tasks-card flex-row" :style="cardStyle">
                    <div class="logo-wrapper">
                        <img :src='AddTypeIcon(i.filename)' />
                    </div>
                    <div class="flex-column info-wrapper">
                        <div class="file-name">{{ i.filename }}</div>
                        <!-- <div class="file-path">{{ i.localFilePath }}</div> -->
                        <div class="file-path">{{ i.downloadedSize }} / {{ i.size }} （{{ tasksStatus(i) }}）</div>
                        <div>
                            <el-progress :text-inside="true" :percentage="i.status === 'Done' ? 100 : parseInt(i.progress)" :stroke-width="18" :color="progressColor(i)"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const tasksStatus = {
    Stopped: '停止',
    Started: '开始',
    Queued: '排队',
    Downloading: '正在下载',
    Failed: '下载失败',
    Done: '下载成功'
}

import { mapGetters } from 'vuex';
import { AddTypeIcon } from '../../util/AddTypeIcon'
export default {
    data() {
        return {
            wrapperStyle: {
                height: 0,
                width: 0,
                top: 0,
                left: 0
            },
            ballStyle: {

            },
            cardStyle: {
                width: "400px"
            },
            tasksTrigger: false,
            moved: false,
            num: false
        }
    },
    computed: {
        /**
         * tasks 
         * {
         *  filename,
         * docKeyword,
         * size,
         * localFilePath,
         * url,
         * progress,
         * downloadedSize
         * }
         */
        ...mapGetters('download', ['downloadTasks']),
        AddTypeIcon() {
            return AddTypeIcon
        },
        progressColor() {
            return function (i) {
                if (i.status === 'Done') {
                    return '#67c23a'
                } else if (i.status === 'Failed') {
                    return '#f56c6c'
                } else if (i.status === 'Queued') {
                    return '#e6a23c'
                } else {
                    return '#409EFF'
                }
            }
        },
        tasksStatus() {
            return function (i) {
                return tasksStatus[i.status]
            }
        }
    },
    mounted() {
        // 吸左边
        let left = document.body.clientWidth * 0.1
        this.ballStyle.left = (left > 40 ? 40: left) + 'px'
        this.ballStyle.top = document.body.clientHeight - 90 + 'px'
    },
    methods: {
        showTasks() {
            if (this.moved) {
                this.moved = false;
                return
            }
            this.tasksTrigger = !this.tasksTrigger
            
        },
        move(e) {
            // let odiv = e.target
            let odiv = this.$refs.ball
            let disX = e.clientX - odiv.offsetLeft
            let disY = e.clientY - odiv.offsetTop
            document.onmousemove = (e2) => {
                this.tasksTrigger = false
                let left = e2.clientX - disX
                let top = e2.clientY - disY
                this.ballStyle = {
                    top: top + 'px',
                    left: left + 'px'
                }
                this.moved = true
            }
            document.onmouseup = (e) => {
                // 添加吸边效果
                let ballStyle = this.$refs.ball.getBoundingClientRect()
                if (e.pageX > document.body.clientWidth / 2) {
                    // 吸右边
                    let left = document.body.clientWidth * 0.9 - ballStyle.width
                    this.ballStyle.left = (document.body.clientWidth - left + ballStyle.width > 40 ? document.body.clientWidth - 40 - ballStyle.width : left) + 'px'
                } else {
                    // 吸左边
                    let left = document.body.clientWidth * 0.1
                    this.ballStyle.left = (left > 40 ? 40: left) + 'px'
                }

                document.onmousemove = null
                document.onmouseup = null
            }
        },
        test() {
            let filename = 'test1111111 - 1 .zip'
            let data = {
                "filename":filename,
                "docKeyword": 'test',
                "size":"81062",
                "localFilePath":"C:\\Temp\\test\\testZip - 副本.zip",
                "url":"http://jhcdms.f3322.net:81/GJEPCStorage/CDMS0006083/testZip%20-%20%e5%89%af%e6%9c%ac.zip?p=AxGa3x39tENVQ0DTfmcUE/pVjn4RdXDGxJ1aat2/T70IT9xFOgTfgbHFcTs1vPt9WQ9/QjVNXGNOnLR7y6/YY9Vfdl1b/cc1UVuGIZVIGETCpnra%2B8jHbz83AtQ%2BSprBsgEeZuMR77f37QPmQHBCwDYqjkoy64j6sGGHfC8/Vxg=",
                "progress":"100%",
                status: this.num ? 'Done': 'Downloading',
                "downloadedSize":"113 Kb"
            }
            this.$store.commit('download/UPDATE_DOWNLOAD_TASKS', data)
            this.num = !this.num
        },
        setPositionStyle(v) {
            if (v) {
                this.cardStyle['width'] = '400px'
                this.$nextTick(() => {
                    if (!this.tasksTrigger) return;
                    let ballStyle = this.$refs.ball.getBoundingClientRect()
                    let tasksStyle = this.$refs.tasksWrapper.getBoundingClientRect()
                    if (!((ballStyle.left + ballStyle.width + tasksStyle.width) <= document.body.clientWidth) && !(ballStyle.left - tasksStyle.width > 0)) {
                        // 设置max-width
                        if (ballStyle.left > document.body.clientWidth / 2) {
                            // 在左
                            this.cardStyle['width'] = ballStyle.left - 10 + 'px'
                        } else {
                            // 在右
                            this.cardStyle['width'] = document.body.clientWidth - (ballStyle.left + ballStyle.width) - 10 + 'px' 
                        }
                    }

                    this.$nextTick(() => {
                        if (!this.tasksTrigger) return;
                        ballStyle = this.$refs.ball.getBoundingClientRect()
                        tasksStyle = this.$refs.tasksWrapper.getBoundingClientRect()
                        // 设置wrapper宽高和定位
                        // 先设置左右
                        if ((ballStyle.left + ballStyle.width + tasksStyle.width) <= document.body.clientWidth) {
                            // 在右
                            this.wrapperStyle.left = ballStyle.left + ballStyle.width + 'px'
                        } else {
                            // 在左
                            this.wrapperStyle.left = ballStyle.left - tasksStyle.width + 'px'
                        } 

                        this.$nextTick(() => {
                            if (!this.tasksTrigger) return;
                            ballStyle = this.$refs.ball.getBoundingClientRect()
                            tasksStyle = this.$refs.tasksWrapper.getBoundingClientRect()
                            // 设置上下
                            if ((ballStyle.top + ballStyle.height + tasksStyle.height) <= document.body.clientHeight) {
                                // 在下
                                this.wrapperStyle.top = ballStyle.top + ballStyle.height + 'px'
                            } else {
                                // 在上
                                this.wrapperStyle.top = ballStyle.top - tasksStyle.height + 'px'
                            }

                            // 设置宽高
                            this.wrapperStyle.width = tasksStyle.width + 10 + 'px'
                            this.wrapperStyle.height = tasksStyle.height + 10 + 'px'
                        })
                    })
                })
                
            } else {
                this.wrapperStyle.height = 0
                this.wrapperStyle.width = 0
            }
        }
    },
    watch: {
        tasksTrigger: {
            handler(v) {
                this.setPositionStyle(v)
            },
            deep: true,
            immediate: true
        },
        downloadTasks: {
            handler(newValue, oldValue) {
                if (!oldValue) return
                if (newValue.length != oldValue.lenght) {
                    if (this.tasksTrigger) {
                        this.setPositionStyle(true)
                    }
                    this.tasksTrigger = true

                }
                if (newValue.filter(i => i.status === "Done").length === newValue.length) {
                    this.tasksTrigger = false
                }
            },
            deep: true,
            immediate: true
        }
    },

}
</script>

<style lang='scss' scoped>
#downloadTasks {
    z-index: 10000;
    position: fixed;
    // border: solid 1px red;
}
.flex-row {
    display: flex;
    flex-direction: row;
}
.flex-column {
    display: flex;
    flex-direction: column;
}
.tasks-wrapper {
    position: absolute;
    left: 5px;
    top: 5px;
    border-radius: 10px;
    box-shadow: 0 0 3px 1px #0000004f;
    overflow: hidden;
    max-height: 600px;
    overflow-y: auto;
}
.wrapper {
    position: fixed;
    transition: width 0.5s, height 0.5s;
    overflow: hidden;
    z-index: 100;
}
.tasks-card {
    background: white;
    // box-shadow: 0 0 3px 1px #0000004f;
    border-bottom: solid 1px #0000004f;
    .logo-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 15px;
    }
    img {
        width: 25px;
        height: 25px;
    }
}
.tasks-wrapper .tasks-card:last-child {
    border-bottom: none;
}
.info-wrapper {
    width: 100%;
    border-inline-start: 1px #d8d8d8 solid;
    padding: 10px 15px;
    .file-path {
        color: #5F6368;
        font-size: 13px;
        margin-bottom: 10px;
        // white-space: nowrap;
    }
    .file-name {
        color: rgb(26, 115, 232);
        font-weight: 500;
        font-size: 13px;
        margin-bottom: 5px;
        // white-space: nowrap;
    }
}
.download-icon {
    font-size: 30px;
    color: white;

}
.ball {
    position: fixed;
    width: 50px;
    height: 50px;
    background:rgba(19, 112, 235, 0.8);
    box-shadow: 0 0 3px 1px #0000004f;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}
</style>