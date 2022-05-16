<template>
  <div class="user-list">
    <el-card>
      <div slot="header">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="手机号">
            <el-input v-model="form.phone" placeholder="审批人"></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="range"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column prop="id" label="用户ID" width="100"/>
        <el-table-column prop="name" label="头像" width="100">
          <template slot-scope="scope">
            <img style="width: 30px;height: 30px;border-radius: 50%"
                 :src="scope.row.portrait || 'http://www.lgstatic.com/thumbnail_100x100/i/image2/M01/5E/65/CgotOVszSAOANi0LAAAse2IVWAE693.jpg'">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名"/>
        <el-table-column prop="phone" label="手机号"/>
        <el-table-column prop="createTime" label="注册时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleSelectRole(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
        <!--下拉菜单-->
        <el-select style="width:80%" v-model="rolesIdList" multiple placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAllocRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserPages } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'

export default {
  name: 'UserList',
  data () {
    return {
      form: {
        currentPage: 1,
        pageSize: 10,
        phone: '',
        startCreateTime: '',
        endCreateTime: ''
      },
      total: 0,
      range: [],
      tableData: [],
      dialogVisible: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      roles: [],
      // 选中选项的id
      rolesIdList: [],
      // 当前分配角色的用户id
      currentRoleId: null
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    handleSizeChange (val) {
      this.form.pageSize = val
      this.loadUsers()
    },
    handleCurrentChange (val) {
      this.form.currentPage = val
      this.loadUsers()
    },
    onSubmit () {
      if (this.range) {
        this.form.startCreateTime = this.range[0]
        this.form.endCreateTime = this.range[1]
      } else {
        this.form.startCreateTime = ''
        this.form.endCreateTime = ''
      }
      this.form.currentPage = 1
      this.loadUsers()
    },
    async loadUsers () {
      const { data } = await getUserPages(this.form)
      if (data.code === '000000') {
        this.tableData = data.data.records
        this.total = data.data.total
      }
    },
    handleClose () {
      this.dialogVisible = false
    },
    // 点击用户分配角色
    async handleSelectRole (userInfo) {
      this.currentRoleId = userInfo.id
      this.dialogVisible = true
      const { data } = await getAllRoles()
      if (data.code === '000000') {
        this.roles = data.data
      }
      // 请求当前用户的一分配角色信息
      const { data: d } = await getUserRoles(userInfo.id)
      if (d.code === '000000') {
        this.rolesIdList = d.data.map(item => item.id)
      }
    },
    async handleAllocRole () {
      // 点击确定将分配角色信息提交给服务端
      const { data } = await allocateUserRoles({ userId: this.currentRoleId, roleIdList: this.rolesIdList })
      if (data.code === '000000') {
        this.$message.success('分配角色成功')
        this.dialogVisible = false
      }
    }
  },
  filters: {
    dateFormat (date) {
      date = new Date(date)
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getDate()} ${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}:${date.getSeconds()}`
    }
  }
}
</script>

<style lang="scss" scoped></style>
