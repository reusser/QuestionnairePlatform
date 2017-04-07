<template>
  <div class="edit-container">
    <h2>这里是标题</h2>
    <div class="content">
      <div class="add-item">
        <span class="add-icon">+</span><span>添加问题</span>
      </div>
    </div>
    <footer>
      <span>问卷截止日期</span>
      <calendar-input :showCalendar="false"></calendar-input>
      <div class="btn-box">
        <button class="save">保存问卷</button>
        <button class="issue">发布问卷</button>
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
  }
}
</script>

<style lang="scss" scoped>
@import '../style/QS-edit';
</style>