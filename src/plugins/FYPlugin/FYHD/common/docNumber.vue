<!--

    后边可能需要要求单号格式，做成组件

-->

<template>
    <div>
        <el-form-item :label="title" prop="number" :rules="rules.number">
            <el-input v-model="numberComputed" placeholder="请填写单号"></el-input>
        </el-form-item>
    </div>
</template>

<script>
export default {
    props: {
        number: {
            required: true,
        },
        title: {
            required: false,
            default: function() {
                return '单号'
            }
        }
    },
    data() {
        return {
            rules: {
                number: [
                    {
                        required: true,
                        message: '请填写单号'
                    }
                ]
            }
        }
    },
    computed: {
        numberComputed: {
            get() {
                return this.number
            },
            set(v) {
                this.$emit('update:number', v)
            }
        }
    }
}
</script>

<style scoped>

</style>