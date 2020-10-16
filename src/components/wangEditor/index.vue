<template>
  <div id="wangeditor">
    <div ref="editor"></div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  name: "wangeEditor",
  data() {
    return {
      editor: null,
    };
  },
  props: {
    content: {
      type: String,
    },
    isSubmit: {
      type: Boolean,
      default: false,
    },
    isClear: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    var vm = this;
    vm.editor = new E(this.$refs.editor);
    vm.editor.customConfig = {
      onchange: function (html) {
        vm.content = html;
      },
    };
    vm.editor.create();
  },
  methods: {
    getHtml() {
      let html = this.editor.txt.html();
      this.$emit("getHtml", html);
    },
    clear() {
      this.editor.txt.clear();
    },
  },
  watch: {
    isSubmit: {
      handler(newValue) {
        if (newValue) {
          this.getHtml();
        }
      },
      deep: true,
      immediate: true,
    },
    isClear: {
      handler(newValue) {
        if (newValue) {
          this.clear();
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>