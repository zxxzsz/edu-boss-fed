<template>
  <div class="role-list">
    <el-card class="box-card">
      <span>筛选搜索</span>
      <div style="float: right">
        <el-button size="small">重置</el-button>
        <el-button type="primary" size="small">查询搜索</el-button>
      </div>
      <div style="margin-top: 15px">
        <span style="margin-left: 50px;color: #606266;font-size: 14px">输入搜索:</span>
        <el-input size="small" placeholder="角色名称" v-model="name">
        </el-input>
      </div>
    </el-card>
    <el-card>
      <!-- 点击按钮显示提示框 -->
      <el-button @click="handleAdd">添加角色</el-button>
      <create-or-edit v-if="dialogVisible" :dialog-visible="dialogVisible" :role-data="rowData" :is-edit="isEdit"
        @success="handleSuccess" @cancel="handleCancel" @handleClose="handleClose" />
    </el-card>
    <el-table border v-loading="isLoading" :data="roles" style="width: 100%">
      <el-table-column align="center" prop="id" label="编号" width="100" />
      <el-table-column align="center" prop="name" label="角色名称" />
      <el-table-column align="center" prop="description" label="描述" />
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150px" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="$router.push({ name: 'alloc-menu', params: { roleId: scope.row.id } })">分配菜单
            </el-button>
            <el-button type="text">分配资源</el-button>
          </div>
          <div>
            <el-button type="text" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="text" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRoles, deleteRole } from '@/services/role'
import CreateOrEdit from '@/views/role/components/CreateOrEdit'

export default {
  name: 'RoleList',
  components: { CreateOrEdit },
  data () {
    return {
      name: '',
      isLoading: false,
      roles: [],
      // 控制对话框显示
      dialogVisible: false,
      isEdit: false,
      rowData: {}
    }
  },
  created () {
    this.loadRoles()
  },
  filters: {
    dateFormat (date) {
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
  },
  methods: {
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRoles({ name: this.name })
      if (data.code === '000000') {
        this.roles = data.data.records
        this.isLoading = false
      }
    },
    submitForm () {
    },
    resetForm () {
    },
    handleEdit (rowData) {
      this.isEdit = true
      this.dialogVisible = true
      this.rowData = rowData
      console.log(rowData)
    },
    async handleDelete (rowData) {
      this.$confirm(`确认删除${rowData.name}?`, '删除提示')
        .then(async () => {
          await deleteRole(rowData.id)
          this.$message.success('删除成功!')
          this.loadRoles()
        })
        .catch((err) => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('取消删除')
          }
        })
    },
    handleClose () {
      this.dialogVisible = false
    },
    handleSuccess () {
      // 隐藏对话框
      this.dialogVisible = false
      // 添加成功刷新列表
      this.loadRoles()
    },
    handleCancel () {
      this.dialogVisible = false
    },
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 200px;
  margin-left: 16px;
  height: 32px !important;
}
</style>
