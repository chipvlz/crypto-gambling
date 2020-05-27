<template>
  <div class="root flex-space-between-vc">
    <b-row>
      <b-col v-for="item in list" :key="item.id" cols="6" sm="6" md="3" lg="3" xl="3">
        <button class="item" @click="itemClick(item)">
          {{ item.lbl }}
        </button>
      </b-col>
    </b-row>
  </div>
</template>

<script>

export default {
  name: 'CrashScaleItem',
  components: {
  },
  props: {
  },
  data() {
    return {
      list: [
        {
          id: 0,
          lbl: 'MIN'
        },
        {
          id: 1,
          lbl: '+10'
        },
        {
          id: 2,
          lbl: '+100'
        },
        {
          id: 3,
          lbl: '+250'
        },
        {
          id: 4,
          lbl: '+1K'
        },
        {
          id: 5,
          lbl: '1/2'
        },
        {
          id: 6,
          lbl: 'X2'
        },
        {
          id: 7,
          lbl: 'MAX'
        }
      ]
    }
  },
  methods: {
    itemClick(item) {
      this.$emit('click', item)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.root {
  // height: $control-height;
  .item {
    color: $control-sup-text-color;
    background-color: transparent;
    border:none;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    &:hover {
      color: white;
    }
    &:active {
      color: white;
    }
  }
  @include media-breakpoint-down(md) {
    margin-top: $normal-margin-bottom-sm;
    margin-bottom: $normal-margin-bottom-sm;
  }
}
</style>
