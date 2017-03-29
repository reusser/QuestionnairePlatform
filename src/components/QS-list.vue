<template>
  <div class="qs-list">
  </div>
</template>

<script>
import storage from '../store.js'

/**
  *
  * Rowphoto v0.0.1
  * desciption, by StevenYu.
  * use with rowphoto.css
  * @author StevenYu
  */
  export default {
    name: 'qsList',
    data() {
      return {
        qsList: {}
      }
    },
    mounted() {
      if (storage.get().length > 0) {
        this.qsList = storage.get();
      } else {
        storage.save([
          {'num': 1, 'title': 1, 'time': '2017-3-28', 'state': 'inissue'},
          {'num': 2, 'title': 2, 'time': '2017-3-29', 'state': 'noissue'},
          {'num': 3, 'title': 3, 'time': '2017-3-27', 'state': 'issueed'}
        ]);
        this.qsList = storage.get();
      }
    }
  }
</script>