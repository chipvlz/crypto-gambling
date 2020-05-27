<template>
  <div class="flex-row-hl-vc">
    <img src="@/assets/img/avatar_mark.png" class="p-r-10">
    {{ bet }}
  </div>
</template>

<script>
export default {
  name: 'CoinLabel',
  components: {},
  props: {
    bet: {
      type: String,
      default: '0'
    }
  }
}
</script>

<style lang="scss" scoped>
.p-r-10 {
  padding-right: 10px;
}
</style>
