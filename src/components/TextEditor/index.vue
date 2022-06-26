<template>
  <div style="border: 1px solid #ccc;">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor style="height: 500px; overflow-y: hidden;" v-model="html" :defaultConfig="editorConfig" :mode="mode"
      @onCreated="onCreated" @onChange="onChange" />
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { uploadCourseImg } from '@/services/course'

export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  components: { Editor, Toolbar },
  data () {
    return {
      isLoaded: false,
      editor: null,
      html: ' ',
      toolbarConfig: {},
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            customUpload: this.update
          }
        }
      },
      mode: 'default'// or 'simple'
    }
  },
  methods: {
    async update (file, insertFn) {
      const fd = new FormData()
      fd.append('file', file)
      // 自定义插入图片
      const { data } = await uploadCourseImg(fd)
      if (data.code === '000000') {
        // 通过insertFn传回给富文本编辑器显示
        insertFn(data.data.name)
      }
    },
    onCreated (editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      this.html = this.value
    },
    onChange (editor) {
      if (editor.getHtml() === '<p><br></p>') return
      this.$emit('input', editor.getHtml())
    }
  },
  watch: {
    value () {
      if (this.isLoaded === false) {
        this.html = this.value
        this.isLoaded = true
      }
    }
  },
  beforeDestroy () {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css">
</style>
