<template>
  <div class="data-container">
    <template v-if="!isError">
      <span class="back">&lt; 返回</span>
      <h2>{{qsItem.title}}</h2>
      <p>此统计分析只包含完整回收的数据(数据皆为自制数据模拟来mock数据)</p>
    </template>

    <div class="content" v-if="!isError">
      <template v-for="item in qsItem.question">
        <div class="content-item">
          <div class="item-left">
            <p>{{item.num}} &nbsp; {{item.title}}</p>
            <template v-for="option in item.options">
              <p class="option">{{option}}</p>
            </template>
          </div>
          <div class="item-right" v-if="item.type === 'radio'">
            <p>数据占比</p>
            <template v-for="(option, index) in item.options">
              <div class="progress-bar">
                <div class="bar-inner" :style="{width: renderProgressMath(item.options.length, index)}" v-if="renderProgressMath(item.options.length, index) !== '0%'"></div>
              </div>
              <span class="percent">{{renderProgressMath(item.options.length, index)}}</span>
            </template>
          </div>
          <div class="item-right" v-else-if="item.type === 'textarea'">
            <p>有效回答占比</p>
              <div class="progress-bar">
                <div class="bar-inner" :style="{width: '85%'}"></div>
              </div>
              <span class="percent">85%</span>
          </div>
        </div>
      </template>
    </div>
    <div class="error" v-if="isError">
      404 Not Found
    </div>
  </div>
</template>

<script>
import storage from '../store.js'
/**
 * A module that define qs-data router view
 * @exports qs-data
 * @author oyh(Reusjs)
 */
  export default {
    name: 'qsData',
    data() {
      return {
        qsItem: {},
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
            this.qsItem = this.qsList[i]
            break
          }
        }
        if (i === this.qsList.length) this.isError = true
      },
      renderProgressMath(length, index) {
        if (length < 2) return '100%'
        if (length >= 2) {
          if (index === 0) {
            return '85%'
          } else if (index === 1) {
            return '15%'
          } else {
            return '0%'
          }
        }
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