<template>
  <div>
    <div v-if="isDay" class="day">
      <span class="number">{{ days }}</span>
      <div class="format">{{ wordString.day }}</div>
    </div>
    <div class="hour">
      <span class="number">{{ hours }}</span>
      <div class="format">{{ wordString.hours }}</div>
    </div>
    <div class="min">
      <span class="number">{{ minutes }}</span>
      <div class="format">{{ wordString.minutes }}</div>
    </div>
    <div v-if="isSecond" class="sec">
      <span class="number">{{ seconds }}</span>
      <div class="format">{{ wordString.seconds }}</div>
    </div>
    <div v-if="statusType!='expired'" class="message">{{ message }}</div>
    <div v-if="statusType=='expired'" class="message">{{ statusText }}</div>
    <div class="status-tag" :class="statusType" @click="handleRefresh">{{ refreshButtonText }}</div>
  </div>
</template>

<script>
export default {
  name: 'Timer',
  components: {
  },
  props: {
    starttime: {
      type: String,
      default: ''
    },
    endtime: {
      type: String,
      default: ''
    },
    trans: {
      type: Object,
      default: null
    },
    isHours: {
      type: Boolean,
      default: false
    },
    isDay: {
      type: Boolean,
      default: false
    },
    isSecond: {
      type: Boolean,
      default: false
    },
    handleClick: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      timer: '',
      start: '',
      end: '',
      interval: '',
      days: '',
      minutes: '',
      hours: '',
      seconds: '',
      message: '',
      statusType: '',
      statusText: '',
      refreshButtonText: 'Refresh',
      startTime: null,
      endTime: null,
      wordString: {}
    }
  },
  watch: {
    starttime: function(val) {
      this.refreshTimer()
    }
  },
  created: function() {
    this.wordString = this.trans
  },
  mounted() {
    this.refreshTimer()
  },
  methods: {
    timerCount: function(start, end) {
      // Get todays date and time
      var now = new Date().getTime()

      // Find the distance between now an the count down date
      var distance = start - now
      var passTime = end - now
      this.wordString = this.trans ? this.trans : {}

      if (distance < 0 && passTime < 0) {
        this.message = this.wordString.expired
        this.statusType = 'expired'
        this.statusText = this.wordString.status.expired
        clearInterval(this.interval)
        return
      } else if (distance < 0 && passTime > 0) {
        this.calcTime(passTime)
        this.message = this.wordString.running
        this.statusType = 'running'
        this.statusText = this.wordString.status.running
      } else if (distance > 0 && passTime > 0) {
        this.calcTime(distance)
        this.message = this.wordString.upcoming
        this.statusType = 'upcoming'
        this.statusText = this.wordString.status.upcoming
      }
    },
    calcTime: function(dist) {
      // Time calculations for days, hours, minutes and seconds
      this.days = Math.floor(dist / (1000 * 60 * 60 * 24))
      this.hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      this.minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60))
      this.seconds = Math.floor((dist % (1000 * 60)) / 1000)
    },
    refreshTimer: function() {
      this.start = new Date(this.starttime).getTime()
      this.end = new Date(this.endtime).getTime()
      // Update the count down every 1 second
      this.timerCount(this.start, this.end)
      this.interval = setInterval(() => {
        this.timerCount(this.start, this.end)
      }, 1000)
    },
    handleRefresh: function() {
      this.handleClick(true)
    }
  }
}
</script>
<style lang="scss">
.timer {
  font-size: 20px;
  color: #fff;
  text-align:center;
  margin-top: 50px;
  color: #c9d6e4;

  .day, .hour, .min, .sec {
    font-size: 30px;
    display: inline-block;
    font-weight: 500;
    text-align: center;
    margin: 0 5px;
    .format {
      font-weight: 300;
      font-size: 14px;
      opacity: 0.8;
      width: 60px;
    }
  }
  .number{
    background: rgba(51, 51, 51, 0.53);
    padding: 0 5px;
    border-radius: 5px;
    display: inline-block;
    width: 60px;
    text-align: center;
  }
  .message {
    font-size: 14px;
    font-weight: 400;
    margin-top: 5px;
  }
  .status-tag {
    width: 270px;
    margin: 10px auto;
    padding: 8px 0;
    font-weight: 500;
    color: #000;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
    &.upcoming{
      background-color: lightGreen;
    }
    &.running{
      background-color: gold;
    }
    &.expired{
      background-color: silver;
    }
  }
}
</style>
