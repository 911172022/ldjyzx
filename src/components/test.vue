<!-- 测试用组件 -->

<template>
    <div id="testComponent">
        <div v-for="i in DocList" :key="i.Keyword">
            <button @click="setStatus(i)">{{ i.O_filename }}</button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {

        }
    },
    methods: {
        test() {
            console.log(this.DocList)
        },
        setStatus(i) {
            if (this.openFilesList.map(i => i.Keyword).includes(i.Keyword)) {
                this.$store.dispatch({
                    type: 'home/removeOpenFile',
                    ...i
                })
            } else {
                this.$store.dispatch({
                    // type: 'doc/setDocStatus',
                    // docKeyword: keyword,
                    // status: '锁定'
                    type: 'home/addOpenFile',
                    ...i
                })
            }
            
        }
    },
    computed: {
        ...mapGetters("doc", ['DocList']),
        ...mapGetters('home', ['openFilesList'])
    }
}
</script>
<style lang="scss" scoped>
#testComponent{
    z-index: 1000000;
    position: fixed;
    top: 100px;
    left: 20px;
    border: solid 1px red;
    padding: 20px;
}
</style>