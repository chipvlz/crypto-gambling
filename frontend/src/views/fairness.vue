<template>
  <div class="root content-padding">
    <b-row align-v="start">
      <div class="w-h m-b-sm">
        <bit-crash-card :body-style="1" :no-header="true">
          <div class="bitcoin-card-content">
            <b-row class="text-center fairness-title">
              <b-col class="label">
                Provably Fair
              </b-col>
            </b-row>
            <b-row class="fairness-subtitle m-t-30">
              <b-col class="label">
                HOW CAN I KNOW THAT THE GAME IS FAIR?
              </b-col>
            </b-row>
            <b-row class="fairness-desc m-t-15">
              <b-col class="label">
                The game results have been generated BEFORE you even place your bet, and most importantly, we can prove it.<p />
                Before each round, we actually give you the round result in a hashed format<p />
                Before the round, we give you the hash of the secret seed which the round result is based on.
                After the round ends, we publish the secret seed, which you can then compare to the hash to make sure that they match. With this system we can prove that the results were fair and pre-generated.
              </b-col>
            </b-row>
            <b-row class="fairness-subtitle m-t-30">
              <b-col class="label">
                HOW IT WORKS
              </b-col>
            </b-row>
            <b-row class="fairness-desc m-t-15">
              <b-col class="label">
                We have generated a chain of one million SHA256 hashes for each game, starting with a server secret that has been repeatedly fed the output of SHA256
                back into itself one million times. <p />
                The SHA256 of the final hash for crash is: <span class="hash-label">ad9ad4ef999ed9f8097a9a23a2d3dca6eaf446228f056b435c079bdbbaa7c117</span> <br>
                By publcising it here we are preventing any ability to pick an alternate SHA256 chain. Now the game server is playing through this chain of hashes in reverse order,
                using these values to calculate the game's crashpoint provably fair.
              </b-col>
            </b-row>
            <b-row class="fairness-subtitle m-t-30">
              <b-col class="label">
                CRASH TECHNICAL DETAILS
              </b-col>
            </b-row>
            <b-row class="fairness-desc m-t-15">
              <b-col class="label">
                Our system generates the result for each round by using the SHA-256 hash of 3 separate inputs
              </b-col>
            </b-row>
            <b-row class="fairness-desc m-t-15">
              <b-col class="label">
                <span>1 -</span> The "public seed" is a concatenation of 5 pairs of random numbers, 01 to 39, generated daily.
              </b-col>
            </b-row>
            <b-row class="fairness-desc m-t-15">
              <b-col class="label">
                <span>2 -</span> The "server seed" is a SHA-256 hash of 16 cryptographically secure random bytes, generated at the same time as the public seed.
              </b-col>
            </b-row>
            <b-row class="fairness-desc m-t-15">
              <b-col class="label">
                <span>3 -</span> Game ID
              </b-col>
            </b-row>
            <b-row class="fairness-desc m-t-15">
              <b-col class="label">
                Players can replicate any past roll by using the code below. Please note that you should use unhashed server seed with the script.
              </b-col>
            </b-row>
            <b-row class="fairness-desc m-t-15">
              <codemirror class="code-editor" :value="code" :options="options" />
            </b-row>
            <b-row class="fairness-subtitle m-t-30">
              <b-col class="label">
                How to verify
              </b-col>
            </b-row>
            <b-row class="fairness-desc m-t-15">
              <b-col class="label">
                Anyone can easily verify integrity of the chain. We're publishing a game's hash immediately after the game ends. <br>
                By checking that the SHA256 hash of that game's hash is the game's hash of the previous game you can make sure that we were not able to modify the result. <br>
                The sample code to generate games hashes and calculate Crash results can be found  <b-link class="fairness-link" target="new" href="https://jsfiddle.net/GarryTayler/qv2pukjb/">here</b-link>
              </b-col>
            </b-row>
          </div>
        </bit-crash-card>
      </div>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BitCrashCard from '@/components/crashTable/BitCrashCard.vue'
import titleMixin from '@/mixins/titleMixin'
import global from '@/mixins/global'
import { codemirror } from 'vue-codemirror-lite'
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/vue/vue')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/hint/javascript-hint.js')
export default {
  name: 'Home',
  title: 'Provably Fair - Redexc',
  components: {
    BitCrashCard,
    codemirror
  },
  mixins: [titleMixin, global],
  data() {
    return {
      code: 'var crypto = require(\'crypto\');\nvar server_seed = \'b51d85e720c6b5d1c4ff3bf6e5ff1c82a0bf8374788044ae0fac88246709a627\';\n' +
'var public_seed = \'460670512935\';\nvar game_id = \'120\';\nvar hash = crypto.createHash(\'sha256\').update(server_seed + \'-\' + public_seed + \'-\' + game_id).digest(\'hex\');\n' +
'function gameResult(seed, salt) {\nconst nBits = 52;\n\tconst hmac = crypto.createHmac("sha256", salt);\n\t' +
'hmac.update(seed);\n\tseed = hmac.digest("hex");\n\tseed = seed.slice(0, nBits / 4);\n\tconst r = parseInt(seed, 16);\n\t' +
'let X = r / Math.pow(2, nBits);\n\tX = 99 / (1 - X);\n\tconst result = Math.floor(X);\n\treturn Math.max(1, result / 100);\n}\n' +
'var crash = gameResult(public_seed + \'-\' + game_id , hash);\nconsole.log(\'result-crash: \' , crash);',
      options: {
        mode: 'javascript',
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: Infinity,
        readOnly: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' }
      }
    }
  },
  computed: {
    ...mapGetters([
      'is_logged_in',
      'wallet',
      'avatar',
      'crash_server_url',
      'user_id',
      'name',
      'token'
    ])
  },
  created: function() {
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
    font-weight: bold;
    color: #ebf1f5;
    font-size: 1.125rem;
    letter-spacing: .025em;
    line-height: 1.25;
}
.fairness-desc .label
 {
  color: #c9d6e4;
  font-weight: 400;
  font-size: .875rem;
  line-height: 1.5;
}
.fairness-desc .label span {
  color: #feca0a;
}
.hash-label {
   @include media-breakpoint-down(sm) {
      word-wrap: break-word;
      word-break: break-all;
   }
   font-style: italic;
   color: #feca0a;
}
.fairness-link {
 color: #feca0a;
 font-weight: bold;
}
.code-editor {
  max-width: 100%;
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
.with-menu {
  @include media-breakpoint-down(md) {
    padding-left: 50px;
  }
  padding-left: calc(50px + #{$menu-width});
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
