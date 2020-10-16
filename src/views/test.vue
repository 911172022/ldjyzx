<template>
    <div>
        <!-- <FYHDDistribute 
        @closeDialog='closeFYHDDialog' 
        :processId='FYHDProcessId'
        :showDialog='FYHDShowDialog' 
        :editForm='{}' /> -->
        <el-button @click="operate">test</el-button>
        <!-- <div style="border: solid 1px red; width: 200px; height: 200px" id="uploaddrop" @dragover='dragover' @drop="drop" @dragenter="dragenter" @dragleave="dragleave"></div> -->
    </div>
</template>
<script>
// import bosApi from '../api/bos/index.js'
// import { bosConfig } from '../const.js'
import { makeDialog } from '../util/Common'
export default {
    components: {},
    data() {
        return {
            // FYHDProcessId: 'PaymentNotice',
            // FYHDShowDialog: true,
        };
    },
    mounted() {
        // bosApi.model.parsesModel('key1')

    },
    methods: {
        async operate() {
            let res = await makeDialog({
                title: 'tip',
                content: 'content',
                operation: [
                    {
                        text: '111',
                        value: '111'
                    },
                    {
                        text: '122',
                        value: '222'
                    }
                ]
            })
            console.log(res)
        },
        showText() {
            console.log('123123')
        }

    }
};
</script>
<style lang='scss' scoped>
.wrapper {
    margin: 15px;
    padding: 20px 15px;
    border: solid 1px rgba(0,0,0,0.3);
}
</style>
