<template>
  <div id="app">
    <v-header></v-header>
    <router-view></router-view>
  </div>
</template>

<script>
/**
 * description app.vue
 * @author oyh(Reusjs)
 */
import vHeader from './components/public/header'
export default {
  name: 'app',
  components: {
    vHeader
  }
}
</script>

<style lang="scss">
@import "style/app";
</style>
