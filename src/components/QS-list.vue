<template>
  <div class="qs-list">
    <ul v-if="qsList.length == 0 ? false : true">
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
          <button @click="edit(item)">编辑</button>
          <button @click="deleteHandler(item.num)">删除</button>
          <button @click="watchList(item)">查看问卷</button>
          <button @click="watchData(item)">查看数据</button>
        </li>
      </ul>
    </template>
    <div class="list-bottom" v-if="qsList.length == 0 ? false : true">
      <label><input type="checkbox" id="all-check" v-model="selectAll">全选</label> <button @click="deleteHandler()">删除</button>
    </div>
    <transition name="fade">
      <div class="add-qs" v-if="qsList.length === 0">
        <button class="add-btn">+&nbsp;&nbsp;新建问卷</button>
      </div>
    </transition>
    <div class="shadow" v-if="showDialog">
      <div class="del-dialog">
        <header>
          <span>提示</span>
          <span class="close-btn" @click="showDialog = false">X</span>
        </header>
        <p>{{info}}</p>
        <div class="btn-box">
          <button class="yes" @click="selectDelete()">确定</button>
          <button @click="showDialog = false">取消</button>
        </div>
      </div>
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
        qsList: [],
        showDialog: false,
        delArg: '',
        info: ''
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
    methods: {
      deleteHandler(arg) {
        this.showDialog = true;
        this.delArg = arg;
        this.info = '确认要删除此问卷?';
      },
      selectDelete() {
        if (this.delArg) this.delItem(this.delArg);
        else this.delItems();
        this.showDialog = false;
      },
      delItem(num) {
        let index = 0;
        for (let length = this.qsList.length; index < length; index++) {
          if (this.qsList[index].num === num) break;
        }
        this.qsList.splice(index, 1);
      },
      delItems() {
        if (this.selectAll) {
          this.qsList = [];
          return;
        }
        if (this.selectGroup == []) return;

        this.selectGroup.forEach( item => {
          if (this.qsList.indexOf(item) > -1) this.qsList.splice(this.qsList.indexOf(item), 1);
        } )
      },
      edit(item) {
        if (item.state !== 'noissue') {
          this.info = '确认要编辑?';
        } else {
          this.info = '只有未发布的问卷才能编辑';
        }
      },
      watchList(item) {
      },
      watchData(item) {
        if (item.state === 'noissue') {
          this.info = '未发布的问卷无数据可查看';
        } else {
          //do something
        }
      }
    },
    computed: {
      selectAll: {
        get() {
          return this.selectCount === this.qsList.length && this.selectCount !== 0;
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
          if (item.checked) i++;
        } );
        return i;
      },
      selectGroup() {
        let group = [];
        this.qsList.forEach( item => {
          if (item.checked) group.push(item);
        } );
        return group;
      }
    },
    watch: {
      qsList: {
        handler(val) {
          storage.save(val);
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '../style/QS-list';
</style>