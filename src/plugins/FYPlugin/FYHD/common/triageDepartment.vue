<!--

    选择会审部门

-->

<template>
    <div id='selectDepartment'>
        <el-checkbox-group v-model="selectedDesc" size="mini">
            <el-checkbox 
                v-for="(i, index) in departmentList" 
                :key="i.Code"
                v-model='departmentList[index]'
                :label="i.Code"
            >{{ i.Desc }}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
import processApi from '../api/process'

export default {
    props: ['selected'],
    data() {
        return {
            departmentList: [],

        }
    },
    mounted() {
        this.getDepartmentList()
    },
    methods: {
        // 获取部门列表
        async getDepartmentList() {
            let res = await processApi.GetDepartmentList().catch(err => {
                this.$message({
                    message: `获取部门列表失败${ err.msg }`
                })
            })

            if (!res) return

            this.departmentList = res.data
        }
    },
    computed: {
        selectedDesc: {
            get() {
                return this.selected
            },
            set(v) {
                this.$emit('update:selected', v)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>