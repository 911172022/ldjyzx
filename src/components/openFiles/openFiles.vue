<!-- 显示用户打开中的文件的悬浮球显示框 -->
<template>
    <div id="openFiles" :draggable="false">
        <!-- <button style="position: fixed; z-index: 10000; top: 50px" @click="test">test</button> -->
        <!-- @mousedown="move" -->
        <div v-if="openFilesList.length > 0" class="ball" v-show="true" @mousedown="move" :style="ballStyle"  @click="showTasks" ref='ball'>
            <div class='el-icon-folder-opened download-icon'></div>
        </div>
        <div class='wrapper' :style="wrapperStyle">
            <div class="tasks-wrapper" ref='tasksWrapper' id="tasksWrapper">
                <div v-for="(i, index) in openFilesList" @click="redirectDoc(i)" :key="i.Keyword + index" class="tasks-card flex-row" :style="cardStyle">
                    <div class="logo-wrapper">
                        <img :src='AddTypeIcon(i.O_filename)' />
                    </div>
                    <div class="flex-column info-wrapper">
                        <div class="file-name">{{ i.O_filename }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { AddTypeIcon } from '../../util/AddTypeIcon'
import ProjectApi from "../../api/services/project";
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
            num: false,
            lastLength: 0
        }
    },
    filters: {
        filterSize(val) {
            if (val == 0) return "0 B";
            const k = 1024;
            const sizes = ["B", "KB", "MB", "GB"],
                i = Math.floor(Math.log(val) / Math.log(k));
            return (val / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
        }
    },
    computed: {
        ...mapGetters("home", ['openFilesList']),
        AddTypeIcon() {
            return AddTypeIcon
        },
    },
    mounted() {
        // 吸左边
        let left = document.body.clientWidth * 0.1
        this.ballStyle.left = (left > 40 ? 40: left) + 'px'
        this.ballStyle.top = document.body.clientHeight - 270 + 'px'
    },
    methods: {
        /* ----------------------------------------------------------- */
        async redirectDoc(i) {
            // 获取 ProjectKeyWord
            let Keyword = i.Keyword,
                IgnoreShortCut = "false";
            const res = await ProjectApi.getProjectPath(
                Keyword,
                IgnoreShortCut
            );
            if (res.success) {
                const ProjectKeyWord = res.data[0].ProjectKeyword;
                //  储存位置
                await ProjectApi.saveLastProject(ProjectKeyWord);
                if (this.$route.name != 'DocManagement') {
                    this.$router.push({ name: "DocManagement" });
                } else {
                    this.$store.commit("project/REFRESH_TREE", true);
                }
            }
        },
        /* ----------------------------------------------------------- */
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
        openFilesList: {
            handler(v) {
                if (v.length > 0) {
                    if (v.length != this.lastLength) {
                        if (this.tasksTrigger === true) {
                            this.setPositionStyle(true)
                            this.lastLength = v.lenght
                        } else {
                            this.tasksTrigger = true
                        }
                    }
                } else {
                    this.tasksTrigger = false
                }
            },
            deep: true,
            immediate: true,
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
.tip {
    font-size: 12px;
    color: rgba(0,0,0,0.4)
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
    z-index: 10;
    position: fixed;
    transition: width 0.5s, height 0.5s;
    overflow: hidden;
}
.progress-wrapper {
    display: flex;
    i {
        margin-left: 10px;
        cursor: pointer;
    }
}
.tasks-card {
    cursor: pointer;
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
.err-tip {
    color: red;
    font-size: 12px;
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
    z-index: 100;
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
}
.speed-tip {
    font-size: 12px;
    color: rgba(0,0,0,0.5)
}
</style>