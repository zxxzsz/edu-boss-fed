<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree :default-checked-keys="checkedKeys" ref="menu-tree" node-key="id" show-checkbox default-expand-all
               :data="menus" :props="defaultProps"
               @node-click="handleNodeClick"></el-tree>
      <div align="center" style="margin-top: 20px">
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button @click="onReset">清空</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'

export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      require: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    // 加载所有菜单信息，用于展示tree结构
    this.loadMenus()
    // 加载当前角色已经分配的菜单信息
    this.loadRoleMenus()
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    async onSave () {
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('分配菜单成功')
        this.$router.push({ name: 'role' })
      }
    },
    // 用于数组筛选,筛选出被选中菜单项的id
    getCheckedKeys (menus) {
      // 遍历数据将所有存在子节点的node排除
      menus.forEach(menu => {
        // 未选中
        if (menu.selected) {
          return
        }
        // 检测是否存在子节点
        if (menu.subMenuList) {
          // 对子节点进行选中状态检测
          return this.getCheckedKeys(menu.subMenuList)
        }
        // 说明选中的不存在子节点
        this.checkedKeys = [...this.checkedKeys, menu.id]
      })
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    }
  }
}
</script>

<style lang="scss" scoped></style>
