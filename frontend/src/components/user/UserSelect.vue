<template>
  <div class="dropdown">
    <el-input v-model="active_username" type="password" placeholder="New Password" />
    <button id="betmethod-dropdown" class="dropbtn dropbtn-bet-select flex-space-between-vc text" @click="showDropDown()">
      <font-awesome-icon icon="chevron-down" />
    </button>
    <font-awesome-icon v-if="valid_name" icon="cross" />
  </div>
</template>
<script>
import global from '@/mixins/global'
import message from '@/filters/message'
// Close the dropdown menu if the user clicks outside of it
export default {
  name: 'UserSelect',
  components: {
  },
  mixins: [global],
  props: {
    userName: {
      type: String,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      active_username: '',
      valid_name: {
        type: Boolean,
        default: false
      }
    }
  },
  computed: {
  },
  mounted() {
    this.active_username = user_name
  },
  methods: {
    onItemClick(id, username) {
      this.$emit('click', id)
      this.active_username = username
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
