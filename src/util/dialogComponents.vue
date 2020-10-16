<template>
    <div>
        <div class="content">{{ content }}</div>
        <div>
            <el-button v-for='(i, index) in operation' :key="index" @click="operate(i.value)">{{ i.text }}</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['content', 'operation'],
    methods: {
        operate(v) {
            this.$emit('event', v)
        }
    }
}
</script>

<style scoped>
.content {
    margin-bottom: 20px;
}
</style>