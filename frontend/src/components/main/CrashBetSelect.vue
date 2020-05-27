<template>
  <div class="dropdown">
    <button id="betmethod-dropdown" class="dropbtn dropbtn-bet-select flex-space-between-vc text" @click="showDropDown()">
      {{ items[activeItem].lbl }}
      <font-awesome-icon icon="chevron-down" />
    </button>
    <div id="crashBetDropdown" class="dropdown-content dropdown-content-bet-select">
      <div v-for="item in items" :key="item.id" class="dropdown-item" @click="onItemClick(item.id)">
        {{ item.lbl }}
      </div>
    </div>
  </div>
</template>
<script>
import global from '@/mixins/global'
import message from '@/filters/message'
// Close the dropdown menu if the user clicks outside of it
export default {
  name: 'CrashBetSelect',
  components: {
  },
  mixins: [global],
  props: {
    activeItem: {
      type: Number,
      default: 0
    },
    isbusy: Boolean
  },
  data() {
    return {
      items: [
        {
          id: 0,
          lbl: 'Manual Bet'
        },
        {
          id: 1,
          lbl: 'Auto Bet'
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    getPosition(el) {
      var yPos = 0
      while (el) {
        if (el.tagName === 'BODY') {
          // deal with browser quirks with body/window/document and page scroll
          var yScroll = el.scrollTop || document.documentElement.scrollTop
          yPos += (el.offsetTop - yScroll + el.clientTop)
        } else {
          // for all other non-BODY elements
          yPos += (el.offsetTop - el.scrollTop + el.clientTop)
        }
        el = el.offsetParent
      }
      if (yPos + 160 > window.innerHeight) {
        return false
      }
      return true
    },
    showDropDown() {
      if (!this.getPosition(document.getElementById('betmethod-dropdown'))) {
        document.getElementById('crashBetDropdown').classList.add('bottomClass')
      } else {
        document.getElementById('crashBetDropdown').classList.remove('bottomClass')
      }
      document.getElementById('crashBetDropdown').classList.toggle('show')
    },
    onItemClick(id) {
      if (this.isbusy) {
        this.showToast('Error', message.betting_method_err_msg, 'error')
        return
      }
      this.$emit('click', id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
/* Dropdown Button */
.dropbtn {
  cursor: pointer;
  height: $control-height;
  width: 100%;
  padding-left: $control-padding-left-right;
  padding-right: $control-padding-left-right;
  background: #384779;
  border-radius: $control-border-radius;
  border: none;
}

/* Dropdown button on hover & focus */
.dropbtn:hover,
.dropbtn:focus {
  background-color: #202845;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
  .text {
    font-size: 16px;
    color: $navbar-text-color;
    font-weight: bold;
  }
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: $main-bg-color;
  min-width: 160px;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content {
  .dropdown-item {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    cursor: pointer;
    &:hover {
      background-color: #384779;
    }
  }
}

@media (min-width: 768px) and (max-width: 1120px)
{
   .dropdown .text {
      font-size: 14px;
    }
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  display: block;
}
.bottomClass {
  bottom: 54px;
}
</style>
