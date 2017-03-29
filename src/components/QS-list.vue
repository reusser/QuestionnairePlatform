<template>
  <div class="qs-list">
    <ul>
      <li></li>
      <li>标题</li>
      <li>时间</li>
      <li>状态</li>
      <li>操作<span>+新建问卷</span></li>
    </ul>
    <template v-for="item in qsList">
      <ul>
        <li><input type="checkbox" v-model="item.checked"></li>
        <li>{{item.title}}</li>
        <li>{{item.time}}</li>
        <li :class="item.state === 'inissue' ? 'inissue' : ''">{{item.stateTitle}}</li>
        <li>
          <button>编辑</button>
          <button>删除</button>
          <button>查看问卷</button>
          <button>查看数据</button>
        </li>
      </ul>
    </template>
    <div class="list-bottom" v-if="qsList.length == 0 ? false : true">
      <label><input type="checkbox" id="all-check" v-model="selectAll">全选</label> <button>删除</button>
    </div>
  </div>
</template>

<script>
import storage from '../store.js'

/**
 * A module that define qs-list router view
 * @exports qs-list
 * @author oyh(Reusjs)
 */
  export default {
    name: 'qsList',
    data() {
      return {
        qsList: []
      }
    },
    mounted() {
      if (storage.get().length > 0) {
        this.qsList = storage.get();
      } else {
        storage.save([
          {'num': 1, 'title': '第一份问卷', 'time': '2017-3-28', 'state': 'inissue', 'stateTitle': '发布中', 'checked': false},
          {'num': 2, 'title': '第二份问卷', 'time': '2017-3-29', 'state': 'noissue', 'stateTitle': '未发布', 'checked': false},
          {'num': 3, 'title': '第三份问卷', 'time': '2017-3-27', 'state': 'issueed', 'stateTitle': '已发布', 'checked': false}
        ]);
        this.qsList = storage.get();
      }
    },
    computed: {
      selectAll: {
        get() {
          return this.selectCount === this.qsList.length;
        },
        set(value) {
          this.qsList.forEach( item => {
            item.checked = value;
          } );
          return value;
        }
      },
      selectCount() {
        let i = 0;
        this.qsList.forEach( item => {
          if (item.checked === true) i++;
        } );
        return i;
      }
    },
    watch: {
      qsList: {
        handler(val) {
          storage.save(val);console.log(val)
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss">
@import '../style/QS-list';
</style>