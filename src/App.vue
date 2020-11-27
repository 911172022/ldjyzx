<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
export default {
    methods: {
        globleFunc(payload) {
            payload.type = 'home/' + payload.type
            return this.$store.dispatch(payload)
        },
    }
};
</script>
<style lang="scss">
// *::-webkit-scrollbar {width:6px; height:10px; background-color:transparent; z-index: 99} /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
// *::-webkit-scrollbar-track {background-color:#fff;  } /*定义滚动条轨道 内阴影+圆角*/
// *::-webkit-scrollbar-thumb {background-color:rgba(144,147,153,.3); border-radius:6px;} /*定义滑块 内阴影+圆角*/

*::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 8px;
}
*::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background-color: #cdcdcd;
    background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
    );
}
*::-webkit-scrollbar-thumb:hover {
    /*滚动条里面小方块*/
    cursor: pointer;
    border-radius: 10px;
    background-color: #999999;
    background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
    );
}
*::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
}

body,
html {
    margin: 0px;
    padding: 0px;
    height: 100%;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
        "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    // font-family: "Avenir", Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #333;
    letter-spacing: 1px;
    -webkit-font-smoothing: antialiased;
}
#app {
    // overflow-y: hidden;
    height: 100%;
}
.flex-row {
    justify-content: space-between;
    .left {
        display: flex;
        justify-content: space-between;
    }
    .right {
        display: flex;
        justify-content: space-between;
    }
}
</style>
