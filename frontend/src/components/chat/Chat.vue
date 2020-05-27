<template>
  <div ref="chat" :class="{show:show}" class="chat-container">
    <div class="chat-background" />
    <div class="chat">
      <div class="handle-button" :style="{'top':buttonTop+'px'}" @click="show=!show">
        <font-awesome-icon :icon="show?'chevron-right' : 'chevron-left'" />
      </div>
      <div class="chat-header flex-space-between-vc">
        Chat
        <nation-group-flag />
      </div>
      <div id="chat-items" class="chat-items">
        <div class="drawer-container">
          <chat-item v-for="message in messages" :key="message.id" :data="message" />
        </div>
      </div>
      <div class="chat-footer flex-space-between-vc">
        <chat-input-box :value="current_chat" :disabled="!is_logged_in" @sendMsg="sendMsg" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import NationGroupFlag from '@/components/chat/NationGroupFlag.vue'
import ChatItem from '@/components/chat/ChatItem.vue'
import ChatInputBox from '@/components/chat/ChatInputBox.vue'
import io from 'socket.io-client/dist/socket.io.js'
import { emit, list } from '@/api/chat'

export default {
  name: 'Chat',
  components: {
    NationGroupFlag,
    ChatItem,
    ChatInputBox
  },
  props: {
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonTop: {
      default: 250,
      type: Number
    }
  },
  data() {
    return {
      show: false,
      messages: [
      ],
      current_chat: ''
    }
  },
  computed: {
    ...mapGetters([
      'is_logged_in',
      'chat_server_url',
      'user_id',
      'name',
      'ipaddress',
      'token',
      'crash_chat',
      'avatar'
    ])
  },
  watch: {
    show(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
    }
  },
  mounted() {
  },
  beforeDestroy() {
    const elx = this.$refs.chat
    elx.remove()
  },
  created: function() {
    var self = this
    this.chat_socket = io.connect(this.chat_server_url)
    self.reload()
    // socket reference
    this.chat_socket.on('chat_message', function(item) {
      self.addChatItem(item)
    })
  },
  methods: {
    scrollToEnd() {
      var container = this.$el.querySelector('#chat-items')
      container.scrollTop = container.scrollHeight
    },
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.chat')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    addChatItem(item) {
      var id = 0
      if (this.messages.length > 0) { id = this.messages[this.messages.length - 1].id }
      id += 1
      item = JSON.parse(item)
      item.sameName = false; item.sameTime = false
      if (this.messages.length > 0) {
        var prev_d = new Date(this.messages[this.messages.length - 1].CREATE_TIME * 1000)
        var current_d = new Date(item.curtime * 1000)
        if (current_d.getHours() === prev_d.getHours() && current_d.getMinutes() === prev_d.getMinutes()) {
          item.sameTime = true
        }
        if (this.messages[this.messages.length - 1].user === item.username) {
          item.sameName = true
        }
      }
      this.messages.push({
        id: id,
        user_id: item.user_id,
        CREATE_TIME: item.curtime,
        message: item.msg,
        user: item.username,
        avatar: item.avatar,
        sameName: item.sameName,
        sameTime: item.sameTime
      })
      var self = this
      Vue.nextTick(function() {
        self.scrollToEnd()
      })
    },
    reload() {
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
      var yyyy = today.getFullYear()
      today = yyyy + '-' + mm + '-' + dd
      today = today + ' 00:00:00'
      today = Math.floor(new Date(today).getTime() / 1000)
      list({ type: this.crash_chat, today: today }).then(response => {
        if (response.data != null && response.data.length > 0) {
          response.data[0].sameName = false
          response.data[0].sameTime = false
          for (var i = 1; i < response.data.length; i++) {
            response.data[i].sameTime = false
            response.data[i].sameName = false
            var current_d = new Date(response.data[i].CREATE_TIME * 1000)
            var prev_d = new Date(response.data[i - 1].CREATE_TIME * 1000)

            if (current_d.getHours() === prev_d.getHours() && current_d.getMinutes() === prev_d.getMinutes()) {
              response.data[i].sameTime = true
            }
            if (response.data[i - 1].user === response.data[i].user) {
              response.data[i].sameName = true
            }
          }
          this.messages = response.data
          var self = this
          Vue.nextTick(function() {
            self.scrollToEnd()
          })
        }
      })
    },
    sendMsg(msg) {
      var emitData = {
        CHAT_TYPE: this.crash_chat,
        MSG: msg,
        IPADDRESS: this.ipaddress,
        USERID: this.user_id,
        AVATAR: this.avatar,
        USERNAME: this.name
      }

      const loader = this.$loading.show({
        container: null,
        canCancel: false,
        loader: 'bars',
        color: '#3f48cc'
      })

      emit(emitData).then(response => {
        if (response.code !== 20000) {
          loader.hide()
        } else {
          loader.hide()
        }
      })

      this.current_chat = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.chat-container {
  height: 100%;
}
.chat-background {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  @include media-breakpoint-up(md) {
    display: none;
  }
  @include media-breakpoint-down(md) {
    transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }
  background: rgba(0, 0, 0, 0.2);
}
.chat {
  z-index: 10;
  width: 100%;
  width: $chat-width;
  height: 100%;
  right: 0;
  position: fixed !important;
  @include media-breakpoint-down(md) {
    transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
    transform: translate(100%);
  }
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  background: $navbar-bg-color;
  @include media-breakpoint-up(md) {
    position: absolute;
  }
}

@media (max-width: 320px)
{
  .chat {
    width: 260px;
  }
}

@media (max-width: 1600px) and (min-width: 321px)
{
  .chat {
    width: 300px;
  }
}

.show {
  @include media-breakpoint-down(md) {
    transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }

  .chat-background {
    opacity: 1;
    @include media-breakpoint-up(md) {
      opacity: 0;
    }
    width: 100%;
    height: 100%;
  }

  .chat {
    @include media-breakpoint-down(md) {
      transform: translate(0);
    }
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
  display: none;
  @include media-breakpoint-down(md) {
    display: block;
  }
}
.chat-header {
  padding: 15px;
  background: $sidebar-header-bg-color;
  color: white;
  font-weight: bold;
}
.chat-items {
  direction: rtl;
  padding-right: $scrollbar-width;
  height: calc(100% - 202px);
  overflow-y: auto;
  padding-bottom: 10px;
}
.drawer-container {
  direction: ltr;
  padding: 1vw;
  @include media-breakpoint-down(sm) {
    padding: 24px;
  }
  font-size: 12.6px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
.chat-footer {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
