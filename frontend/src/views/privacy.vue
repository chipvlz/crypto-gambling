<template>
  <div class="root content-padding">
    <b-row align-v="start">
      <div class="w-h m-b-sm">
        <bit-crash-card :body-style="1" :no-header="true">
          <div class="bitcoin-card-content">
            <b-row class="text-center fairness-title">
              <b-col class="label">
                Privacy And Policy
              </b-col>
            </b-row>
            <b-row class="fairness-subtitle m-t-30 page-content-value">
              <b-col class="label">
                <p v-html="value" />
              </b-col>
            </b-row>
          </div>
        </bit-crash-card>
      </div>
    </b-row>
  </div>
</template>

<script>
import BitCrashCard from '@/components/crashTable/BitCrashCard.vue'
import titleMixin from '@/mixins/titleMixin'
import global from '@/mixins/global'
import { getUserVariable } from '@/api/user'
export default {
  name: 'Privacy',
  title: 'Privacy And Policy - Redexc',
  components: {
    BitCrashCard
  },
  mixins: [titleMixin, global],
  data() {
    return {
      value: ''
    }
  },
  computed: {
  },
  created: function() {
    const loader = this.showOverlay(null)
    getUserVariable({ 'variable': 'PRIVACY_AND_POLICY' }).then(response => {
      this.value = response.data.value
      this.hideOverlay(loader)
    })
  },
  mounted: function() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.fairness-title .label {
    font-weight: bold;
    color: #c9d6e4;
    font-size: 2rem;
    letter-spacing: .025em;
    line-height: 1.25;
}
.fairness-subtitle .label {
    color: #ebf1f5;
    display: flex;
    align-items: center;
    justify-content: center;
}
.m-t-30 {
  margin-top: 30px;
}
.m-t-15 {
  margin-top: 15px;
}
.root {
  position: relative;
  width: 100%;
}
.m-b {
  margin-bottom: $normal-margin-bottom-lg;
}
.m-b-sm {
  margin-bottom: $normal-margin-bottom-sm;
}
.m-l {
  margin-left: 15px;
}
.w-h {
    width: 100%;
}

.bitcoin-card-content {
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 30px;
  padding-bottom: 50px;
}
// responsive
.content-padding {
  padding-left: 50px;
  padding-top: 20px;
  padding-right: calc(50px + #{$chat-width} + #{$scrollbar-width});
  @include media-breakpoint-down(md) {
    padding-left: 20px;
    padding-right: 20px;
  }
  padding-bottom: 50px;
}
@media (max-width: 991.98px) and (min-width: 321px)
{
  .content-padding {
    padding-right: 20px;
  }
}
@media (max-width: 1600px) and (min-width: 992px)
{
  .content-padding {
    padding-right: calc(50px + 300px + #{$scrollbar-width});
  }
}
</style>
