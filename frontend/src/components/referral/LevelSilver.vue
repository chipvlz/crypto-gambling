<template>
  <div class="flex-row">
    <div class="level-slider">
      <span style="vertical-align: center;">0 / 500</span>
    </div>
    <div class="level-balance ml-5">
      <span style="vertical-align: center;">Your Balance</span>
      <div class="flex-row-hl-vc bitcoin-content-logo mt-5 ml-4">
        <img src="@/assets/img/ic_bitcoin_col.png" width="25px">
        <span class="label ml-2">0</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LevelSlider'
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
  .level-slider {
    background-color: $main-bg-color;
    border-radius: 50%;
    height: 144px;
    width: 144px;
    text-align: center;
    padding-top: 58px;
  }
  .level-balance {
    border: 1px solid #657a94;
    border-radius: 5px;
    padding: 20px;
  }
</style>

