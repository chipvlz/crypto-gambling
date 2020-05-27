<template>
  <div ref="graph" class="graph" :style="{height: canvasSetHeight + 'px'}" :class="{ 'crashed': status == 3, 'animate': status == 2 }">
    <div class="bg" />
    <canvas ref="canvas" :height="canvasSetHeight" />
  </div>
</template>

<script>
import titleMixin from '@/mixins/titleMixin'

export default {
  name: 'CrashGraph',
  components: {},
  mixins: [titleMixin],
  props: {
    eventBus: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      STATUS_PENDING: 1,
      STATUS_STARTED: 2,
      STATUS_FINISHED: 3,
      STATUS_CONNECTING: 4,

      status: this.STATUS_CONNECTING,
      start_time: Date.now(),
      crash: 0,
      duration: 0,
      ctx: null,
      canvasWidth: 0,
      canvasHeight: 0,
      canvas: null,
      animRequest: null,
      rendering: false,
      onWindowResizeBinded: this.onWindowResize.bind(this),
      onChangeBinded: this.onChange.bind(this),
      plotWidth: 0,
      plotHeight: 0,
      xStart: 0,
      yStart: 0,

      YAxisSizeMultiplier: 2,
      YAxisInitialPlotValue: 'zero',

      XAxisPlotMinValue: 10000,
      YAxisPlotMinValue: 2,

      XAxisPlotValue: 10000,
      YAxisPlotValue: 2,

      widthIncrement: 0,
      heightIncrement: 0,
      currentX: 0,
      milisecondsSeparation: 0,
      XAxisValuesSeparation: 0,
      payoutSeparation: 0,

      currentTime: 0,
      currentGamePayout: 0,

      canvasSetHeight: 0
    }
  },
  watch: {
    eventBus: {
      deep: true,
      handler(val) {
        var payload = this.eventBus.payload
        switch (this.eventBus.msg) {
          case 'game-created':
            this.status = this.STATUS_PENDING
            this.duration = (payload.duration / 1000).toFixed(1)
            this.setTitle('Redexc - Game Starting')
            break
          case 'game-started':
            //  i modified code below to set real start time
            this.crash = payload.crash
            if (this.status !== this.STATUS_STARTED) {
              this.status = this.STATUS_STARTED
              this.start_time = Date.now() - Math.ceil(this.inverseGrowth(this.crash + 1))
            }
            break
          case 'game-finished':
            this.status = this.STATUS_FINISHED
            if (payload.crash === 100) {
              //  in case that game finishes when it starts,
              this.start_time = Date.now() - Math.ceil(this.inverseGrowth(this.crash + 1))
            }
            this.crash = payload.crash
            this.setTitle('Redexc - Crashed at ' + parseFloat(this.crash / 100).toFixed(2) + 'x')
            break
          case 'resize':
            this.onWindowResizeBinded()
            break
          case 'game-error':
            //  when error occures...
            this.rendering = false
            break
        }
      }
    }
  },
  destroyed() {
    this.stopRendering()
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  mounted() {
    this.startRendering()
  },
  methods: {
    setTick(tick) {
      this.$emit('interface', parseFloat(tick).toFixed(2))
    },
    handleResize() {
      if (window.innerWidth >= 1700) {
        this.canvasSetHeight = 420
      } else if (window.innerWidth >= 1310 && window.innerWidth < 1700) {
        this.canvasSetHeight = 320
      } else if (window.innerWidth >= 1120 && window.innerWidth < 1310) {
        this.canvasSetHeight = 320
      } else {
        this.canvasSetHeight = 260
      }
    },
    growth(ms) {
      const r = 0.00006
      return Math.floor(100 * Math.pow(Math.E, r * ms)) / 100
    },
    inverseGrowth(result) {
      const c = 16666.666667
      return c * Math.log(0.01 * result)
    },
    startRendering() {
      this.canvas = this.$refs.canvas
      this.ctx = this.$refs.canvas.getContext('2d')
      var parentNode = this.$refs.canvas.parentNode
      this.canvasWidth = parentNode.clientWidth
      this.canvasHeight = parentNode.clientHeight
      this.rendering = true

      this.configPlotSettings()
      this.animRequest = window.requestAnimationFrame(this.render.bind(this))
      window.addEventListener('resize', this.onWindowResizeBinded)
    },
    stopRendering() {
      this.rendering = false
      window.removeEventListener('resize', this.onWindowResizeBinded)
    },
    onChange() {
      this.configPlotSettings()
    },
    render() {
      if (!this.rendering) return
      this.calcGameData()
      this.calculatePlotValues()
      this.clean()
      this.drawAxes()
      this.drawGraph()
      this.drawGameData()
      this.animRequest = window.requestAnimationFrame(this.render.bind(this))
    },
    onWindowResize() {
      var parentNode = this.$refs.canvas.parentNode
      this.canvasWidth = parentNode.clientWidth
      this.canvasHeight = parentNode.clientHeight
      this.configPlotSettings()
    },
    configPlotSettings() {
      this.canvas.width = this.canvasWidth
      this.canvas.height = this.canvasHeight
      this.plotWidth = this.canvasWidth - 30
      this.plotHeight = this.canvasHeight - 40 //  280
      this.xStart = this.canvasWidth - this.plotWidth
      this.yStart = this.canvasHeight - this.plotHeight
      this.XAxisPlotMinValue = 10000 //  10 Seconds
      this.YAxisSizeMultiplier = 2 //  YAxis is x times
      this.YAxisInitialPlotValue = 'zero' //  'zero', 'betSize' //  TODO: ???
    },
    calcGameData() {
      if (this.status === this.STATUS_FINISHED) {
        //  when finished status, we don't need to update currentGamePayout
        return
      }
      if (this.status === this.STATUS_STARTED) {
        this.currentTime = Date.now() - this.start_time
      } else {
        this.currentTime = 0
      }
      this.currentGamePayout = this.growth(this.currentTime)
      this.setTick(this.currentGamePayout)
      if (this.status !== this.STATUS_PENDING) { this.setTitle('Redexc - ' + parseFloat(this.currentGamePayout).toFixed(2) + 'x') }
    },
    calculatePlotValues() {
      // Plot variables
      this.YAxisPlotMinValue = this.YAxisSizeMultiplier
      this.YAxisPlotValue = this.YAxisPlotMinValue

      this.XAxisPlotValue = this.XAxisPlotMinValue

      // Adjust X Plot's Axis
      if (this.currentTime > this.XAxisPlotMinValue) {
        this.XAxisPlotValue = this.currentTime
      }

      // Adjust Y Plot's Axis
      if (this.currentGamePayout > this.YAxisPlotMinValue) {
        this.YAxisPlotValue = this.currentGamePayout
      }

      // We start counting from cero to plot
      this.YAxisPlotValue -= 1

      // Graph values
      this.widthIncrement = this.plotWidth / this.XAxisPlotValue
      this.heightIncrement = this.plotHeight / this.YAxisPlotValue
      this.currentX = this.currentTime * this.widthIncrement
    },
    clean() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    drawGraph() {
      //  if (this.status !== this.STATUS_STARTED) return
      /* Style the line depending on the game states */
      var gradient = this.ctx.createLinearGradient(
        0,
        this.canvas.height,
        this.canvas.width,
        0
      )
      gradient.addColorStop(0, '#954ce9')
      gradient.addColorStop(0.5, '#7470ec')
      gradient.addColorStop(1, '#2abaec')

      this.ctx.setLineDash([])
      this.ctx.strokeStyle = gradient
      //  check if game finished, then color is same as axes color
      //  else if growth is bigger than 15x, then color is more bright ...
      // if (this.status === this.STATUS_FINISHED) {
      //   this.ctx.strokeStyle = '#7247b3'
      // } else {
      //   if (this.currentGamePayout >= 15) {
      //     this.ctx.strokeStyle = '#ff5f8f'
      //   } else {
      //     this.ctx.strokeStyle = '#ffdf0f'
      //   }
      // }

      this.ctx.lineWidth = 5

      this.ctx.beginPath()

      /* Draw the graph */
      for (var t = 0, i = 0; t <= this.currentTime; t += 100, i++) {
        /* Graph */
        var payout = this.growth(t) - 1 // We start counting from one x
        var y = this.plotHeight - payout * this.heightIncrement
        var x = t * this.widthIncrement
        this.ctx.lineTo(x + this.xStart, y)

        /* Avoid crashing the explorer if the cycle is infinite */
        if (i > 5000) {
          break
        }
      }
      this.ctx.stroke()
    },
    stepValues(x) {
      var step = 0.2
      for (var i = 0; i === 0; i = 0) {
        if (x < step * 5 + 1) return step
        step = step * 5
        if (x < step * 5 + 1) return step
        step = step * 2
      }
    },
    drawAxes() {
      // Function to calculate the plotting values of the Axes
      // Calculate Y Axis
      this.YAxisPlotMaxValue = this.YAxisPlotMinValue
      this.payoutSeparation = this.stepValues(
        !this.currentGamePayout ? 1 : this.currentGamePayout
      )

      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = '#485992'
      this.ctx.font = '14px OpenSans'
      this.ctx.fillStyle = '#657a94'
      this.ctx.textAlign = 'center'

      // Draw Y Axis Values
      var heightIncrement = this.plotHeight / this.YAxisPlotValue
      for (
        var payout = this.payoutSeparation, i = 0;
        payout < this.YAxisPlotValue;
        payout += this.payoutSeparation, i++
      ) {
        var y = this.plotHeight - payout * heightIncrement
        this.ctx.fillText(payout + 1 + 'x', 10, y)

        if (payout === 0) {
          this.ctx.beginPath()
          this.ctx.moveTo(this.xStart, y)
          this.ctx.lineTo(this.canvasWidth, y)
          this.ctx.stroke()
        }

        if (i > 100) {
          break
        }
      }

      // Calculate X Axis
      this.milisecondsSeparation = this.stepValues(this.XAxisPlotValue)
      this.XAxisValuesSeparation =
        this.plotWidth / (this.XAxisPlotValue / this.milisecondsSeparation)

      // Draw X Axis Values
      for (
        var miliseconds = 0, counter = 0, s = 0;
        miliseconds < this.XAxisPlotValue;
        miliseconds += this.milisecondsSeparation, counter++, s++
      ) {
        var seconds = miliseconds / 1000
        var textWidth = this.ctx.measureText(seconds).width
        var x = counter * this.XAxisValuesSeparation + this.xStart
        this.ctx.fillText(
          seconds + '',
          x - textWidth / 2,
          this.plotHeight + 22 // XAxis padding
        )

        if (s > 100) {
          break
        }
      }

      // Draw background Axis
      this.ctx.lineWidth = 1
      this.ctx.beginPath()
      this.ctx.moveTo(this.xStart, 0)
      this.ctx.lineTo(this.xStart, this.canvasHeight - this.yStart)
      this.ctx.lineTo(this.canvasWidth, this.canvasHeight - this.yStart)
      this.ctx.stroke()
    },
    drawGameData() {
      // One percent of canvas width
      var onePercent = this.canvasWidth / 100
      // Multiply it x times
      function fontSizeNum(times) {
        return onePercent * times
      }
      // Return the font size in pixels of one percent of the width canvas by x times
      function fontSizePx(times) {
        var fontSize = fontSizeNum(times)
        return fontSize.toFixed(2) + 'px'
      }

      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'

      this.ctx.font = '0.9rem Verdana'

      //  we hide max profit, because we don't know what to show.
      //  this.ctx.fillText(
      //  	`Max Profit: $`,
      //  	this.canvasWidth / 2,
      //  	15
      //  )

      if (this.status === this.STATUS_STARTED) {
        this.ctx.fillStyle = '#2196f3'
        this.ctx.font = fontSizePx(10) + ' Verdana'
        this.ctx.fillText(
          parseFloat(this.currentGamePayout).toFixed(2) + 'x',
          this.canvasWidth / 2,
          this.canvasHeight / 2
        )
      }

      // If the engine enters in the room @ ENDED it doesn't have the crash value, so we don't display it
      if (this.status === this.STATUS_FINISHED) {
        this.ctx.font = fontSizePx(7) + ' Verdana'
        this.ctx.fillStyle = '#ff4a74'
        this.ctx.fillText(
          'Crashed @ ' + (this.crash / 100).toFixed(2) + 'x',
          this.canvasWidth / 2,
          this.canvasHeight / 2
        )
      }

      if (this.status === this.STATUS_PENDING) {
        this.ctx.font = fontSizePx(10) + ' Verdana'
        this.ctx.fillStyle = '#2196f3'

        this.ctx.fillText(
          this.duration + 's',
          this.canvasWidth / 2,
          this.canvasHeight / 2
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/_variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
</style>
