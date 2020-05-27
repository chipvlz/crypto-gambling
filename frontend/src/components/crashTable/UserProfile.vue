<template>
  <div class="d-flex align-items-center">
    <div class="icon p-r-15">
      <v-lazy-image :src="avatar" />
    </div>
    {{ user.name }}
  </div>
</template>
<script>
export default {
  name: 'UserProfile',
  components: {},
  props: {
    user: {
      type: Object,
      default: function() {
        return {}
      }
    },
    avatar: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'sm'
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
  .p-r-15 {
    padding-right: 15px;
  }
  img {
    width: $user-tbl-profile-size;
    border-radius: $navbar-profile-border-radius;
  }
  img.lg{
    width: 55px
  }
  .v-lazy-image {
    filter: blur(10px);
    transition: filter 0.1s;
  }
  .v-lazy-image-loaded {
    filter: blur(0);
  }
</style>
