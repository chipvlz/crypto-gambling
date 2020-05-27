<template>
  <div class="container flex-row-hl-vc header-item-crash" @click="detailPopup">
    <div :class="circleStyle" />
    <div class="text-container">
      <div class="val-text" :class="data.is_active ? 'is-active' : ''">{{ data.val }}</div>
      <div :class="scaleTextStyle">{{ data.scale }}x</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CrashHeaderItem',
  components: {
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          id: 0,
          scale: 1.5,
          val: 978513,
          type: 0,
          is_active: false
        }
      }
    }
  },
  computed: {
    scaleTextStyle: {
      get() {
        return (this.data.is_active ? 'is-active' : '') + (' scale-text-' + (this.data.scale > 2.5 ? '1' : '0'))
      }
    },
    circleStyle: {
      get() {
        return 'circle circle-bg-' + (this.data.scale > 2.5 ? '1' : '0')
      }
    }
  },
  methods: {
    detailPopup() {
      this.$store.dispatch('app/setDetailId', { detail_id: this.data.id })
      this.$bvModal.show('crash-game-detail-form')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
.header-item-crash {
  cursor: pointer;
}
.circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.circle-bg-0 {
    background-color: $crash-header-item-color-0;
}
.circle-bg-1 {
    background-color: $crash-header-item-color-1;
}
.text-container {
  margin-left: 13.5px;
}
.val-text {
  color: $navbar-text-color;
  font-size: 14px;
  font-weight: bold;
}
.scale-text-0 {
  color: $crash-header-item-color-0;
  font-size: 14px;
}
.scale-text-1 {
  color: $crash-header-item-color-1;
  font-size: 14px;
}
.is-active {
}
</style>
