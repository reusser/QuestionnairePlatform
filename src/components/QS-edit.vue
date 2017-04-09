<template>
  <div class="edit-container">
    <h2 @click="titleClick" v-if="!titleChange">{{qsItem.title}}</h2>
    <input type="text" name="qsTitle" v-if="titleChange"
    v-model="titleValue"
    @blur="onblur"
    @keyup.enter="onsubmit"
    ref="titleInput">
    <div class="content">
      <div class="questions" v-for="(qs, index) in qsItem.question">
        <div class="qs-left">
          <p class="qs-title">
            {{qs.num}}&nbsp;{{qs.title}}&nbsp;{{getMsg(qs)}}
          </p>
          <p v-for="option in qs.options" class="option">
            <label>
              <input 
              type="radio" 
              :name="`${qs.num}-${qs.title}`"
              v-if="qs.type === 'radio'">
              <input 
              type="checkbox" 
              :name="`${qs.num}-${qs.title}`"
              v-if="qs.type === 'checkbox'">{{option}}
            </label>
          </p>
          <textarea 
          v-if="qs.type === 'textarea'"></textarea>
        </div>
        <div class="qs-right">
          <label><input type="checkbox" :value="qs.isNeed" v-model="qs.isNeed">
          此题是否必填</label>
          <p>
            <span v-if="index !== 0" @click="goUp(index)">上移</span>
            <span v-if="index !== qsItem.question.length - 1" @click="goDown(index)">下移</span>
            <span @click="copy(index, qs)">复用</span>
            <span @click="del(index)">删除</span>
          </p>
        </div>
      </div>
      <div class="add">
        <transition name="slide">
          <div class="add-option" v-if="showBtn">
            <button @click="addRadio">单选</button>
            <button @click="addCheckbox">多选</button>
            <button @click="addTextarea">文本框</button>
          </div>
        </transition>
        <div class="add-item" @click="addItemClick">
          <span class="add-icon" >+</span><span>添加问题</span>
        </div>
      </div>
    </div>
    <div class="shadow" v-if="showAddQsDialog">
      <div class="add-qs-dialog">
        <header>
          <span>提示</span>
          <span class="close-btn" @click="showAddQsDialog = false">X</span>
        </header>
        <p>{{info}}</p>
        <label>输入题目标题<input type="text" v-model="qsInputTitle"></label>
        <label v-if="showAddOptionInput">输入选项<input type="text" v-model="qsInputOptions"></label>
        <div class="btn-box">
          <button class="yes" @click="validateAddQs">确定</button>
          <button @click="showAddQsDialog = false">取消</button>
        </div>
      </div>
    </div>
    <div class="shadow" v-if="showDialog">
      <div class="dialog">
        <header>
          <span>提示</span>
          <span class="close-btn" @click="cancel">X</span>
        </header>
        <p>{{info}}</p>
        <div class="btn-box">
          <button class="yes" @click="iterator.next()">确定</button>
          <button @click="cancel">取消</button>
        </div>
      </div>
    </div>
    <footer>
      <span>问卷截止日期</span>
      <calendar-input 
      :showCalendar="false" 
      :limit="limit" 
      @getValue="getValue">
      </calendar-input>
      <div class="btn-box">
        <button class="save" @click="iterator = save(); iterator.next()">保存问卷</button>
        <button class="issue" @click="iterator = issueQs(); iterator.next()">发布问卷</button>
      </div>
    </footer>
  </div>
</template>

<script>
import storage from '../store.js'
import calendarInput from './calendar-input'
/**
 * A module that define qs-edit view
 * @exports qs-edit
 * @author oyh(Reusjs)
 */
export default {
  name: 'qsEdit',
  components: {
    calendarInput
  },
  data() {
    return {
      qsItem: {},
      qsList: storage.get(),
      isError: false,
      showBtn: false,
      titleChange: false,
      titleValue: '',
      showAddQsDialog: false,
      showAddOptionInput: true,
      qsInputTitle: '',
      qsInputOptions: [],
      info: '',
      selectTime: '',
      addOptionType: '',
      limit: {},
      showDialog: false,
      iterator: {},
      isGoIndex: false
    }
  },
  beforeRouteEnter(to, from ,next) {
    let num = to.params.num
    let theItem = {}
    if (num != 0) {
      let length = storage.get().length
      if (num < 0 || num > length) {
        alert('非法路由!')
        next('/')
      } else {
        for (let i = 0; i < length; i++) {
          if (storage.get()[i].num == num) {
            theItem = storage.get()[i]
            break
          }
        }
      }
      if (theItem.state === 'noissue') {
        next()
      } else {
        alert('非法路由')
        next('/')
      }
    } else {
      next()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.limit = { 
          minYear: new Date().getFullYear(),
          minMonth: new Date().getMonth() + 1,
          minDay: new Date().getDate(),
          maxYear: 2030,
          maxMonth: 3,
          maxDay: 20
        }
      if (this.$route.params.num == 0) {
        let item = {}
        item.num        = this.qsList.length + 1
        item.title      = '这里是标题'
        item.time       = ''
        item.state      = 'noissue'
        item.question   = []
        item.stateTitle = '未发布'
        item.checked    = false
        this.qsItem = item
        this.qsList.push(this.qsItem)
      } else {
        let i = 0
        for (let length = this.qsList.length; i < length; i++) {
          if (this.qsList[i].num == this.$route.params.num) {
            this.qsItem = this.qsList[i]
            break
          }
        }
        if ( i === this.qsList.length) this.isError = true
      } 
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
    onblur() {
      this.titleValue = this.titleValue.trim()
      this.qsItem.title = this.titleValue === '' ? this.qsItem.title : this.titleValue
      this.titleChange = false
    },
    onsubmit() {
      this.titleValue = this.titleValue.trim()
      this.qsItem.title = this.titleValue === '' ? this.qsItem.title : this.titleValue
      this.titleChange = false
    },
    titleClick() {
      this.titleChange = !this.titleChange
      setTimeout( () => {
        this.$refs.titleInput.focus()
      }, 150 )
    },
    swapItems(oldIndex, newIndex) {
      let [newVal] = this.qsItem.question.splice(newIndex, 1, this.qsItem.question[oldIndex])
      this.qsItem.question.splice(oldIndex, 1, newVal)
    },
    goUp(index) {
      this.swapItems(index, index - 1)
    },
    goDown(index) {
      this.swapItems(index, index + 1)
    },
    copy(index, qs) {
      if (this.questionLength === 10) return alert('问卷已满！')
      qs = Object.assign({}, qs)
      this.qsItem.question.splice(index, 0, qs)
    },
    del(index) {
      this.qsItem.question.splice(index, 1)
    },
    addItemClick() {
      if (this.showBtn === false) {
        this.questionLength === 10 ? alert('问卷已满！') : this.showBtn = !this.showBtn
      } else {
        this.showBtn = !this.showBtn
      }
    },
    showAddDialog(msg, showOption) {
      this.showAddQsDialog = true
      this.showAddOptionInput = showOption
      this.info = msg
      this.qsInputTitle = ''
      this.qsInputOptions = ''
    },
    addRadio() {
      if (this.questionLength === 10) return alert('问卷已满！')
      this.showAddDialog('分别在下面的输入框中输入问题的名称以及选项, 选项用半角逗号","分隔开', true)
      this.addOptionType = 'radio'
    },
    addCheckbox() {
      if (this.questionLength === 10) return alert('问卷已满！')
      this.showAddDialog('分别在下面的输入框中输入问题的名称以及选项, 选项用半角逗号","分隔开', true)
      this.addOptionType = 'checkbox'
    },
    addTextarea() {
      if (this.questionLength === 10) return alert('问卷已满！')
      this.showAddDialog('在输入框中输入问题名称', false)
      this.addOptionType = 'textarea' 
    },
    validateAddQs() {
      let qsTitle = this.qsInputTitle.trim()
      if (qsTitle === '') return alert('题目不能为空')
      if (this.showAddOptionInput) {
        let qsOptions = this.qsInputOptions.trim()
        if (qsOptions === '') return alert('选项不能为空！')
        qsOptions = qsOptions.split(',')
        for (let i = 0, length = qsOptions.length; i < length; i++) {
          if (qsOptions[i].trim() === '') {
            return alert('存在某个选项内容为空')
          }
        }
        this.qsItem.question.push({
          'num': this.qsItem.question.length - 1, 
          'title': qsTitle, 
          'type': this.addOptionType,
          'isNeed': true,
          'options':qsOptions
        })
        this.showAddQsDialog = false
      } else {
        this.qsItem.question.push({
          'num': this.qsItem.question.length - 1,
          'title': qsTitle,
          'type': 'textarea',
          'isNeed': true
        })
        this.showAddQsDialog = false
      }
    },
    getValue(selectTime) {
      this.selectTime = selectTime
      this.qsItem.time = this.selectTime
    },
    *save() {
      this.showDialog = true
      this.info = '确认保存?'
      yield
      if (this.qsItem.question.length === 0) {
        this.showDialog = false
        alert('问卷为空无法保存')
      } else {
        storage.save(this.qsList)
        this.info = '是否发布?'
        this.isGoIndex = true
      }
      
      yield
      this.qsItem.state = 'inissue'
      this.qsItem.stateTitle = '发布中'
      storage.save(this.qsList)
      this.showDialog = false
      this.$router.push({path:'/'})
    },
    *issueQs() {
      this.showDialog = true
      this.info = '确认发布?'
      yield
      if (this.qsItem.question.length === 0) {
        this.showDialog = false
        alert('问卷为空无法保存')
      } else {
        this.qsItem.state = 'inissue'
        this.qsItem.stateTitle = '发布中'
        storage.save(this.qsList)
        this.showDialog = false
        this.$router.push({path:'/'})
      }
      
    },
    cancel() {
      this.showDialog = false
      if (this.isGoIndex === true) {
        this.$router.push({path:'/'})
      }
    }
  },
  computed: {
    questionLength() {
      return this.qsItem.question.length
    }
  },
  watch: {
    '$route': 'fetchData',
    qsItem: {
      handler(newVal) {
        newVal.question.forEach( (item, index) => {
          item.num = `Q${index + 1}`
        } )
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/QS-edit';
</style>