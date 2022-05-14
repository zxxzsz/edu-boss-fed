<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          class="demo-form-inline"
        >
          <el-form-item label="资源名称" prop="name">
            <el-input
              clearable
              v-model="form.name"
              placeholder="审批人"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input
              clearable
              v-model="form.url"
              placeholder="审批人"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categpryId">
            <el-select
              clearable
              v-model="form.categoryId"
              placeholder="活动区域"
            >
              <el-option
                v-for="item in recourseCategories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm">重置</el-button>
            <el-button :disabled="isLoading" type="primary" @click="onSubmit"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="isLoading" :data="resources" style="width: 100%">
        <el-table-column prop="id" label="编号" width="100"></el-table-column>
        <el-table-column prop="name" label="资源名称"></el-table-column>
        <el-table-column prop="url" label="资源路径"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <!-- 设置过滤器需要使用作用域插槽获取数据 -->
        <el-table-column label="添加时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dataFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页结构-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 15, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :disable="isLoading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages, getResourceCategories } from '@/services/resource'

export default {
  name: 'ResourceList',
  data () {
    return {
      form: {
        current: 1,
        size: 10,
        name: '',
        url: '',
        categoryId: ''
      },
      total: 0,
      // 用于存储资源列表数据
      resources: [],
      recourseCategories: [],
      isLoading: false
    }
  },
  created () {
    this.loadResources()
    // 加载资源列表
    this.loadResourceCategories()
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
    },
    onSubmit () {
      // 提交筛选功能
      this.form.current = 1
      this.loadResources()
    },
    async loadResources () {
      // 开启加载状态
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.total = data.data.total
        // 取消加载状态
        this.isLoading = false
      }
    },
    handleEdit () { },
    handleDelete () { },
    // 每页条数发生变化时显示
    handleSizeChange (val) {
      this.form.size = val
      // 由于修改了每页条数应该将页数置为1
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.recourseCategories = data.data
      }
    }
  },
  filters: {
    // 日期过滤器
    dataFormat (date) {
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
  }
}
</script>

<style lang='scss' scoped></style>
