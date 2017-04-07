<template>
  <div class="fill-container">
    <div class="fill" v-if="!isError">
      <router-link to="/" tag="span" class="back">&lt; 返回</router-link>
      <h2>{{qsItem.title}}</h2>
      <div class="content">
        <div class="content-item" v-for="item in qsItem.question">
          <p class="qs-title">
            {{item.num}}&nbsp;{{item.title}}&nbsp;{{getMsg(item)}}
          </p>
          <p v-for="option in item.options" class="option">
            <label>
              <input 
              type="radio" 
              :name="`${item.num}-${item.title}`"
              v-model="requiredItem[item.num]"
              v-if="item.type === 'radio'"
              :value="option">
              <input 
              type="checkbox" 
              :name="`${item.num}-${item.title}`"
              v-model="requiredItem[item.num]"
              v-if="item.type === 'checkbox'"
              :value="option">{{option}}
            </label>
          </p>
          <textarea 
          v-if="item.type === 'textarea'" 
          v-model="requiredItem[item.num]"></textarea>
        </div>
      </div>
      <transition name="fade">
        <div class="dialog" v-if="showDialog">
          <div class="submit-dialog" v-if="submitError">
            <header>
              <span>提示</span>
              <span class="close-btn" @click="showDialog = false">X</span>
            </header>
            <p>{{info}}</p>
            <div class="btn-box">
              <button class="yes" @click="showDialog = false">确定</button>
              <button @click="showDialog = false">取消</button>
            </div>
          </div>
          <div class="submit-dialog" v-else>
            <header>
              <span>提示</span>
              <span class="close-btn" @click="showDialog = false">X</span>
            </header>
            <p>{{info}}</p>
          </div>
        </div>
      </transition>  
      <footer>
        <button @click="submit" class="submit">提交</button>
      </footer>
    </div>
    <div class="error" v-else>
      404 Not Found
    </div>
  </div>
</template>

<script>
import storage from '../store.js'

/**
 * A module that define qs-fill router view
 * @exports qs-fill
 * @author oyh(Reusjs)
 */
  export default {
    name: 'qsFill',
    data() {
      return {
        qsItem: [],
        qsList: storage.get(),
        isError: false,
        showDialog: false,
        info: '',
        submitError: false,
        requiredItem: {}
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {
      this.getRequiredItem()
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
      getMsg(item) {
        let msg = ''
        if (item.type === 'radio') {
          msg = '(单选题)'
        } else if (item.type === 'checkbox') {
          msg = '(多选题)'
        } else {
          msg = '(文本题)'
        }

        return item.isNeed ? `${msg} *` : msg
      },
      submit() {
        if (this.qsItem.state === 'inissue') {
          let result = this.validate()
          if (result) {
            this.showDialog = true
            this.submitError = false
            this.info = '提交成功！'
            setTimeout(() => {
              this.showDialog = false
            }, 500)
            setTimeout(() => {
              this.$router.push({path: '/'})
            }, 1500)
          } else {
            this.showDialog = true
            this.submitError = true
            this.info = '提交失败！ 存在必填项未填'
          }
        } else {
          this.showDialog = true
          this.submitError = true
          this.info = '提交失败！ 只有发布中的问卷才能提交'
        }
      },
      getRequiredItem() {
        this.qsItem.question.forEach( item => {
          if (item.isNeed) {
            if (item.isNeed) {
              if (item.type === 'checkbox') {
                this.requiredItem[item.num] = []
              } else {
                this.requiredItem[item.num] = ''
              }
            }
          }
        } )
      },
      validate() {
        for (let i in this.requiredItem) {
          if (this.requiredItem[i].length === 0) return false
        }
        return true
      }
    },
    watch: {
      '$route': 'fetchData'
    }
  }
</script>

<style lang="scss" scoped>
@import '../style/QS-fill'
</style>