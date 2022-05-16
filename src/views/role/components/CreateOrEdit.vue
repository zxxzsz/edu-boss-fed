<template>
  <div class="create-or-edit">
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="isVisible"
      width="40%"
      :before-close="handleClose">
      <el-form label-position="right" label-width="150px" size="small">
        <el-form-item label="角色名称">
          <el-input v-model="role.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" label-width="150px">
          <el-input v-model="role.code" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="150px">
          <el-input
            type="textarea"
            v-model="role.description"
            size="small"
            rows="5"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { createOrUpdate } from '@/services/role'

export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleData: {
      type: [Object]
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.dialogVisible
      }
    }
  },
  created () {
    if (this.isEdit) {
      const data = JSON.parse(JSON.stringify(this.roleData))
      this.role = data
    }
  },
  data () {
    return {
      role: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('handleClose')
    },
    async onSubmit () {
      const { data } = await createOrUpdate(this.role)
      if (data.code === '000000') {
        // 关闭提示框，需要子组件向父组件传递状态
        this.$emit('success')
        // 设置成功提示
        this.$message.success('添加成功')
        // 清除表单
        this.role = {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 18px;
}

.el-input, .el-textarea {
  width: 250px;
}
</style>
