<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
        ref="menu-tree"
        node-key="id"
        show-checkbox
        default-expand-all
      ></el-tree>
      <div style="margin: 20px">
        <el-button>清空</el-button>
        <el-button type="primary">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AllocMenu",
};
</script>

<style lang="scss" scoped></style>
