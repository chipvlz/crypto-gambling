<template>
  <div>
    <div v-if="label != ''" class="caption">
      {{ label }}
    </div>
    <div class="row-flex-alignc">
      <div class="dropdown">
        <button
          :id="dropdownId+'-button'"
          class="dropbtn flex-space-between-vc text"
          :class="['dropbtn-' + classify]"
          @click="showDropDown()"
        >
          {{ items[activeItem].lbl }}
          <font-awesome-icon icon="chevron-down" />
        </button>
        <div
          :id="dropdownId"
          class="dropdown-content"
          :class="['dropdown-content-' + classify]"
        >
          <div v-for="item in items" :key="item.id" class="dropdown-item" @click="onItemClick(item.id)">
            {{ item.lbl }}
          </div>
        </div>
      </div>
      <input
        v-model="currentValue"
        :class="{'increase-text': true , disabled: disabled}"
        name="quantity"
        min="0"
        max="10000000"
        :disabled="disabled"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      >
    </div>
  </div>

</template>

<script>
export default {
  name: 'CrashAutoWinLoss',
  components: {
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default: function() {
        return []
      }
      // [String, Number]
    },
    activeItem: {
      type: Number,
      default: 0
    },
    dropdownId: {
      type: String,
      default: 'crashBetDropdown'
    },
    disabled: {
      type: Boolean,
      default: true
    },
    classify: {
      type: String,
      default: 'win'
    }
  },
  data() {
    return {
      currentValue: this.value,
      focus: false,
      items: [
        {
          id: 0,
          lbl: 'Return to Base bet'
        },
        {
          id: 1,
          lbl: 'Increase By'
        }
      ]
    }
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue
    }
  },
  methods: {
    getPosition(el) {
      var yPos = 0
      while (el) {
        if (el.tagName === 'BODY') {
          // deal with browser quirks with body/window/document and page scroll
          var yScroll = el.scrollTop || document.documentElement.scrollTop
          yPos += (el.offsetTop - yScroll + el.clientTop)
        } else {
          // for all other non-BODY elements
          yPos += (el.offsetTop - el.scrollTop + el.clientTop)
        }
        el = el.offsetParent
      }
      if (yPos + 160 > window.innerHeight) {
        return false
      }
      return true
    },
    handleInput(event) {
      const value = event.target.value
      this.$emit('input', value)
      this.$emit('change', value)
    },
    handleFocus(event) {
      this.focus = true
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.focus = false
      this.$emit('blur', event)
    },
    showDropDown() {
      if (!this.getPosition(document.getElementById(this.dropdownId + '-button'))) {
        document.getElementById(this.dropdownId).classList.add('bottomClass')
      } else {
        document.getElementById(this.dropdownId).classList.remove('bottomClass')
      }
      document.getElementById(this.dropdownId).classList.toggle('show')
    },
    onItemClick(id) {
      this.$emit('click', id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.caption {
  font-size: $control-label-text-size;
  color: $navbar-text-color;
  font-weight: bold;
  margin-bottom: 5px;
}
.row-flex-alignc {
  display: flex;
  align-items: center;
}
.bg {
  height: $control-height;
  width: 100%;
  padding-left: $control-padding-left-right;
  padding-right: $control-padding-left-right;
  background: #424f73;
  border-radius: $control-border-radius;
}
.increase-text {
      outline: none;
      height: 54px;
      background: #384779;
      border: 1px;
      border-radius: 10px;
      margin-left: 15px;
      width: 100px;
      padding-left: 10px;
      padding-right: 10px;
      color: #fff;
}
/* Dropdown Button */
.dropbtn {
  cursor: pointer;
  height: $control-height;
  width: 100%;
  padding-left: $control-padding-left-right;
  padding-right: $control-padding-left-right;
  background: #384779;
  border-radius: $control-border-radius;
  border: none;
}

/* Dropdown button on hover & focus */
.dropbtn:hover,
.dropbtn:focus {
  background-color: #202845;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
  .text {
    font-size: 16px;
    color: $navbar-text-color;
    font-weight: bold;
  }
}

@media (max-width: 1268px) and (min-width: 768px)
{
  .dropdown-content {
    font-size: 14px;
  }
}

  @media (min-width: 768px) and (max-width: 1120px)
  {
   .dropdown .text {
      font-size: 14px;
    }
  }

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: $main-bg-color;
  min-width: 160px;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content {
  .dropdown-item {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    cursor: pointer;
    &:hover {
      background-color: #384779;
    }
  }
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  display: block;
}
.bottomClass {
  bottom: 54px;
}
.disabled {
    color: #939fad;
}
</style>
