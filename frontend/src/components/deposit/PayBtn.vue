<template>
  <bit-crash-card :hover-border="true" :body-style="1" class="bg">
    <div class="flex-row-hc-vc main-content" @click="btnClick">
      <div>
        <p class="text-center">{{ value }}</p>
        <div v-if="type=='signup'" class="flex-row-hc-vc">
          <img src="@/assets/img/ic_ranking.png">
        </div>
        <div v-if="type=='success'" class="flex-row-hc-vc">
          <img src="@/assets/img/ic_rewards.png">
        </div>

        <div class="text-wrapper text-wrapper-hover flex-row-hc-vc">
          <div>{{ text }}</div>
        </div>
      </div>
    </div>
  </bit-crash-card>
</template>

<script>
import BitCrashCard from '@/components/crashTable/BitCrashCard.vue'

export default {
  name: 'PayBtn',
  components: {
    BitCrashCard
  },
  props: {
    type: {
      type: String,
      default: 'skins'
    },
    value: {
      type: Number,
      default: 0
    }
  },
  computed: {
    text: {
      get() {
        switch (this.type) {
          case 'signup':
            return 'Referral Signups'
          case 'success':
            return 'Successful Referrals'
          default:
            return ''
        }
      }
    }
  },
  methods: {
    btnClick() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.bg {
  cursor: pointer;
  width: 260px;
  height: 170px;
  margin-left: 20px;
  margin-bottom: 30px;
  .main-content {
    width: 100%;
    height: 100%;
  }
  .text-wrapper {
    background-color: #46568c;
    box-shadow: $crash-box-shadow;
    border-radius: $control-border-radius;
    width: 150px;
    height: $paybtn-text-wrapper-height;
    text-align: center;

    font-size: $control-label-text-size;
    font-family: bold;
    color: white;

    margin-top: 12px;
  }
  &:hover {
    .text-wrapper-hover {
      background-color: #f7931a !important;
    }
  }
}
</style>
