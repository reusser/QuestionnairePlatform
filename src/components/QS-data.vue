<template>
  <div class="data-container">
    <span>&lt; 返回</span>
    <h3>{{item.title}}</h3>
    <div class="error" v-if="isError">
      404 Not Found
    </div>
  </div>
</template>

<script>
import storage from '../store.js'
/**
 * A module that define qs-data router view
 */
  export default {
    name: 'qsData',
    data() {
      return {
        item: {},
        qsList: storage.get(),
        isError: false
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        let i = 0;
        for (let length = this.qsList.length; i < length; i++) {
          if (this.qsList[i].num == this.$route.params.num) {
            this.item = this.qsList[i]
            break
          }
        }
        if (i === this.qsList.length) this.isError = true
      }
    },
    watch: {
      '$route': 'fetchData'
    }
  }
</script>

<style lang="scss" scoped>
@import '../style/QS-data';
</style>