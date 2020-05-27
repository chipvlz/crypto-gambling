<template>
  <div>
    <div v-if="!data.sameTime" class="flex-row-hl-vc justify-content-center m-b-8 time-color">
      {{ getDate }}
    </div>
    <div v-if="!data.sameName || !data.sameTime" class="flex-row-hl-vc">
      <div class="d-flex align-items-center m-b-10">
        <div class="icon p-r-15">
          <v-lazy-image :src="data.avatar" class="profile-img" />
        </div>
        <div class="chat-text">
          <div class="chat-user">{{ data.user }}</div>
          {{ data.message }}
        </div>
      </div>
    </div>
    <div v-if="data.sameName && data.sameTime" class="flex-row-hl-vc">
      <div class="d-flex align-items-center m-b-10">
        <div class="right-chat-text">
          {{ data.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ChatItem',
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'user_id',
      'token',
      'name',
      'wallet',
      'avatar'
    ]),
    getDate() {
      var date = new Date(this.data.CREATE_TIME * 1000)
      var month = date.getMonth() + 1
      var day = date.getDate()
      var hour = date.getHours()
      var minute = date.getMinutes()

      if (month < 10) { month = '0' + month }
      if (day < 10) { day = '0' + day }
      if (hour < 10) { hour = '0' + hour }
      if (minute < 10) { minute = '0' + minute }
      return month + '-' + day + ' ' + hour + ':' + minute
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
  .p-l-r {
    padding-right: 10px;
  }
  .m-b-10 {
    margin-bottom: 8px;
  }
  .m-b-8 {
    margin-bottom: 6px;
  }
  .m-p-5 {
    margin-top: 8px;
  }
  img {
    width: 55px;
    height: 55px;
    border-radius: 10px;
  }
  .align-items-center{
    width: 100%;
  }
  .chat-user {
    color: #c1cedf;
  }
  .chat-text {
    border-radius: 5px;
    position: relative;
    padding: 0.8vw 0.5vw 0.8vw 0.5vw;
    @include media-breakpoint-down(sm) {
      padding: 17px 10px 17px 10px;
    }
    background: #4b5e9a;
    border: 1px solid #4b5e9a;
    margin: 2px 0 0 15px;
    margin-right: -16px;
    color: white;
    width: 100%;
  }
  .chat-text:before {
    border-width: 6px;
    margin-top: -6px;
  }
  .chat-text:after {
    position: absolute;
    right: 100%;
    top: 15px;
    border: 8px solid transparent;
    border-right-color: #4b5e9a;
    content: ' ';
    height: 0;
    width: 0;
    pointer-events: none;
  }

  .right-chat-text:after{
    right: auto;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #4b5e9a;
  }

  .right-chat-text {
    border-radius: 5px;
    position: relative;
    padding: 17px 10px 17px 10px;
    background: #4b5e9a;
    border: 1px solid #4b5e9a;
    margin-left: 70px;
    margin-right: -16px;
    color: white;
    width: 100%;
  }

  .time-color {
    color: #697f9b;
  }
</style>
