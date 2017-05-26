<template>
  <div id="landing">
    <div class="jumbotron" :style="jtStyle" ref="jt">
      <div class="container" :style="containerStyle">
        <div></div>
        <h1 v-cloak>
          Crowdsourcing projects from<br>the British Library
        </h1>
        <a id="scrollDown" href="#" v-on:click="$emit('scrollDown')" v-cloak>
          <p>Scroll Down</p>
          <div class="pulse">
            <icon name="angle-down" scale="2"></icon>
          </div>
      </a>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollReveal from 'scrollreveal'
import 'vue-awesome/icons/angle-down'
import getScrollTop from '@/utils/get-scroll-top.js'

export default {
  data: function () {
    return {
      jtStyle: {
        filter: 'brightness(100%)'
      },
      containerStyle: {
        opacity: 1
      }
    }
  },
  methods: {
    handleScroll: function () {
      const jtElem = this.$refs.jt
      const scrollTop = getScrollTop()
      const visPixels = jtElem.offsetHeight - scrollTop - jtElem.offsetTop
      const visPercent = Math.round(visPixels * 100 / jtElem.offsetHeight)
      const brightness = visPercent < 100 ? visPercent : 100
      const opacity = visPercent < 100 ? visPercent / 100 : 1

      this.jtStyle.filter = `brightness(${brightness}%)`
      this.containerStyle.opacity = opacity
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted: function () {
    const sr = ScrollReveal()
    sr.reveal('h1', { duration: 1000 })
    sr.reveal('#scrollDown', { delay: 200, duration: 800 })
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

h1 {
  color: $white;
  margin-bottom: 0;
}

.jumbotron {
  padding: 2em;
  display: flex;
  height: 100vh;
  border-radius: 0;
  margin-bottom: 0;
  background-image: url("../assets/img/crowd.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;

  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1 1 auto;
    text-align: center;
    overflow: hidden;

    #scrollDown p {
      font-size: $font-size-sm;
      color: $white;
      text-transform: uppercase;
      margin-bottom: 0.2em;
    }
  }
}

[v-cloak] {
  visibility: hidden;
}

.pulse {
  -webkit-animation: mymove 5s infinite;
  animation: pulse 5s infinite;
}

@keyframes pulse {
    0%, 50%, 100% {
	    transform: translateY(10px);
    }
    25%, 75% {
      transform: translateY(0);
    }
}
</style>
