<template>
  <div class="flex-row-hl-vc user-info-sect">
    <img src="@/assets/img/avatar-medium.png" class="profile">
    <div class="m-l">
      <div class="flex-row-hl-vc m-b">
        <img src="@/assets/img/ic_vip.png">
        <span class="lbl m-l-sm">Level 1</span>
      </div>
      <div class="flex-row-hl-vc m-b">
        <span class="lbl-1">Priven Reddy</span>
      </div>
      <div class="flex-row-hl-vc">
        <div class="circle-indicator" />
        <span class="lbl m-l-sm">4.235</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UserInfoSect',
  components: {
  },
  props: {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.user-info-sect {
    .profile {
        border-radius: 50%;
        box-shadow: $crash-box-shadow;
    }
    .m-l {
        margin-left: 25px;
    }
    .m-l-sm {
        margin-left: 15px;
    }
    .m-b {
        margin-bottom: 15px;
    }
    .lbl {
        font-size: $control-label-text-size-md;
        color: white;
        font-weight: bold;
    }
    .lbl-1 {
        font-size: $control-label-text-size-lg;
        color: white;
        font-weight: bold;
    }
    .circle-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #fdb915;
    }
}
</style>
