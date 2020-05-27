<template>
  <div class="bit-crash-table-wrapper">
    <table class="bit-crash-table">
      <thead>
        <th v-for="element in fields" :key="element.id">
          {{ element.label }}
        </th>
      </thead>
      <tbody v-if="items.length <= 0 || items.length==1 && !items[0].ID">
        <tr>
          <td colspan="20" style="text-align: center;line-height: 40px;">Empty</td>
        </tr>
      </tbody>
      <transition-group v-else name="fade" tag="tbody">
        <tr v-for="item in items" :key="item.id ? `tr-${item.id}`: item.ID" :class="{'active-background':item.name===name}">
          <td v-for="field in fields" :key="field.ID">
            <user-profile v-if="field.type == 'profile'" :size="size" :user="item" :avatar="item.avatar ? item.avatar : item.AVATAR" />
            <coin-label v-if="field.type=='bet'" :bet="setNumberFormat(item[field.key])" />
            <div v-if="field.type==='text' && field.key!=='bet' && field.key!=='profit'">
              {{ item[field.key] }}
            </div>
            <div v-if="field.type==='text' && (field.key==='bet')">
              {{ setNumberFormat(item[field.key]) }}
            </div>
            <div v-if="field.type==='text' && (field.key==='profit')" :class="crashType == '2' ? '' : 'green-text-label'">
              {{ setNumberFormat(item[field.key]) }}
            </div>
            <div v-if="field.type==='plain'">
              {{ item[field.key] }}
            </div>
            <div v-if="field.type==='date'">
              <span v-if="isNaN(parseInt(item[field.key]))">
                {{ item[field.key] }}
              </span>
              <span v-else>
                {{ item[field.key] | parseTime('{y}-{m}-{d}') }}
              </span>
            </div>
            <div v-if="field.type==='link'" class="link" @click="onItemClick(item)">
              View Referral Earnings
            </div>
          </td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>

<script>
import CoinLabel from '@/components/crashTable/CoinLabel.vue'
import UserProfile from '@/components/crashTable/UserProfile.vue'
import { getNumberFormat } from '@/utils/index'
import { mapGetters } from 'vuex'

export default {
  name: 'BitCrashTable',
  components: {
    CoinLabel,
    UserProfile
  },
  props: {
    fields: {
      type: Array,
      default: function() {
        return []
      }
    },
    items: {
      type: Array,
      default: function() {
        return []
      }
    },
    crashType: {
      type: String,
      default: function() {
        return '2'
      }
    },
    size: {
      type: String,
      default: function() {
        return 'sm'
      }
    }
  },
  data() {
    return {
      striped: true
    }
  },
  computed: {
    ...mapGetters([
      'is_logged_in',
      'chat_server_url',
      'user_id',
      'name',
      'ipaddress',
      'token',
      'crash_chat',
      'avatar'
    ])
  },
  mounted() {
  },
  methods: {
    setNumberFormat(num) {
      return getNumberFormat(num)
    },
    onItemClick(item) {
      this.$emit('click', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";

.link {
  text-decoration: underline;
  cursor: pointer;
}

.bit-crash-table-wrapper {
  display: block;
  width: 100%;
  overflow: auto;
  height: 100%;
  .green-text-label {
    color: #2cc49d;
    font-weight: bold;
  }
  .bit-crash-table {
    font-size: $user-tbl-header-text-size;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    thead {
      font-weight: bold;
      // color: white;
      border-bottom: 1px solid $user-tbl-header-border-color;

      th {
        padding-bottom: 20px;
        padding-left: 0.9vw;
        @include media-breakpoint-down(sm) {
          padding-left: 15px;
        }
      }
    }

    tbody {
      // color: white;
      td {

        padding: 0.5vw;
        padding-left: 0.9vw;

        @include media-breakpoint-down(sm) {
          padding: 10px;
          padding-left: 15px;
        }

        img {
          width: $user-tbl-profile-size;
          border-radius: $navbar-profile-border-radius;
        }
      }
      .active-background {
        background-color: #17a2b8 !important;
      }
      tr:nth-child(even) {
        background-color: #e3f2fd ;
      }
    }
  }
  .p-r-15 {
    padding-right: 15px;
    padding-left: 5px;
  }
}
</style>
