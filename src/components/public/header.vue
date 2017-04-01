<template>
  <div class="header">
    <router-link to="/">问卷管理</router-link>
    <router-link to="/">我的问卷</router-link>
  </div>
</template>

<script>
  /**
   * A module that define public header component
   * @exports header
   * @author oyh(Reusjs)
   */
  export default {
    name: 'header'
  }
</script>

<style lang="scss" scoped>
@import '../../style/header';
</style>