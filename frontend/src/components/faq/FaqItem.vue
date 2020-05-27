/* eslint-disable vue/require-v-for-key */
@@ -0,0 +1,86 @@
<template>
  <div>
    <div class="flex-row-hl-vc" :class="{'m-b-sm': data.collapsed==false}">
      <div class="title-text">{{ data.question }}</div>
      <button class="collapse-btn" :class="{'discollapsed': data.collapsed==false}" @click="data.collapsed=!data.collapsed">
        <font-awesome-icon v-if="data.collapsed" icon="plus" />
        <font-awesome-icon v-if="!data.collapsed" icon="minus" />
      </button>
    </div>
    <span v-if="data.collapsed == false" class="content-text">
      <!-- <p v-html="data.answer" /> -->
      <div v-for="line in data.answer.split('\n')" :key="line">{{ line }}<br></div>
    </span>
  </div>
</template>

<script>
export default {
  name: 'FaqItem',
  components: {
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {
        //   question: '',
        //   answer: '',
        //   collapsed: true
        }
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  created: function() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.m-b-sm {
  margin-bottom: $normal-margin-bottom-sm;
}
.title-text {
  font-size: 18px;
  font-weight: bold;
  color: white;
  width: 100%;
}
.content-text {
  font-size: 14px;
  color: $navbar-text-color;
}
.collapse-btn {
  border: none;
  outline: none;
  width: 33px;
  height: 33px;
  background: transparent;
  border-radius: 0px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  float: right;
  &:hover {
    background: rgba(0, 0, 0, 0.2)
  }
}
.discollapsed {
  background: #fec70d;
  border-radius: 50%;
  color: black;
  &:hover {
    background: #c99d0a;
  }
}
</style>
