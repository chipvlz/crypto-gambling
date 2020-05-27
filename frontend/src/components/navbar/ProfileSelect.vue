<template>
  <mdb-dropdown class="profile_menu_container">
    <mdb-dropdown-toggle slot="toggle" sr-only tag="p">
      {{ avatarName }}
      <div class="">
        <div class="bit-text">{{ avatarBits }}</div>
      </div>
    </mdb-dropdown-toggle>
    <mdb-dropdown-menu>
      <mdb-dropdown-item v-for="item in items" :key="item.id" :href="'#'+item.url" @click="onItemClick(item.id)">
        {{ item.lbl }}
      </mdb-dropdown-item>
    </mdb-dropdown-menu>
  </mdb-dropdown>
</template>

<script>
// Close the dropdown menu if the user clicks outside of it
import { mdbDropdownMenu, mdbDropdown, mdbDropdownItem, mdbDropdownToggle } from 'mdbvue'

export default {
  name: 'ProfileSelect',
  components: {
    mdbDropdownMenu,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownToggle
  },
  props: {
    avatarUrl: {
      type: String,
      default: '@/assets/img/avatar-sample.png'
    },
    avatarName: {
      type: String,
      default: ''
    },
    avatarBits: {
      type: Number,
      default: 0
    },
    avatarImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeItem: 0,
      items: [
        {
          id: 0,
          lbl: 'Log Out',
          url: ''
        },
        {
          id: 1,
          lbl: 'My Profile',
          url: '/profile'
        },
        {
          id: 2,
          url: '/my_referral',
          lbl: 'My Referrals'
        }
      ]
    }
  },
  methods: {
    showDropDown() {
      document.getElementById('dropdownList').classList.toggle('show')
    },
    onItemClick(id) {
      this.activeItem = id
      if (id === 0) {
        this.$store.dispatch('user/logout')
          .then((res) => {
            this.$router.push({ name: 'home' })
          })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/_variables.scss';
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";

.profile_menu_container {
  .dropdown-menu {
    background: #4b5e9a;
    a {
      color: #fff;
      font-size: 14px;
    }
    a:hover {
      background: transparent !important;
    }
  }
}

::v-deep .dropdown-menu {
   background: #4b5e9a;
   outline: none;
    a {
      color: #fff;
      font-size: 14px;
      @include media-breakpoint-down(md) {
        font-size: 14px;
      }
    }
    a:hover {
      background: #384779 !important;
    }
}
::v-deep .dropdown-menu:hover {
  outline: none;
}

.m-l {
  margin-left: 15px;
}
.profile-name {
  color: $navbar-text-color;
  font-size: $navbar-text-size;
  font-weight: bold;
  max-width: 200px;
}
.p-l-r {
  padding-left: 10px;
  padding-right: 10px;
}
.bit-text {
  color: #fdd233;
  font-size: $navbar-text-size;
  font-weight: bold;
  margin-top: 5px;
}
.down {
  color: $navbar-text-color;
}
// Dropdown
.dropbtn {
  cursor: pointer;
  border: none;
  background: transparent;
  outline: none;
}

/* Dropdown button on hover & focus */
.dropbtn:hover,
.dropbtn:focus {
  background-color: rgba(0, 0, 0, 0.2);
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

</style>
