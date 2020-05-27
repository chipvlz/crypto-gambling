@@ -0,0 +1,76 @@
<template>
  <div>
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <div v-for="item in data.items" :key="item.id" class="content">
          <faq-item :data="item" />
          <div class="seperator" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FaqItem from './FaqItem.vue'
export default {
  name: 'FaqSection',
  components: {
    FaqItem
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          title: '',
          items: []
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
  font-size: 22px;
  font-weight: bold;
  color: white;
}
.seperator {
  height: 1px;
  background-color: $user-tbl-header-border-color;
  width: 100%;
  margin-top: 25px;
  margin-bottom: 25px;
}
.content {
  &:last-child {
    .seperator {
      display: none;
    }
  }
}
</style>
