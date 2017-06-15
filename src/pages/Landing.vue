<template>
  <div id="landing">

    <crowd-container>
      <div></div>
      <h1>
        Crowdsourcing projects from<br>the British Library
      </h1>
      <a id="scrollDown" href="#">
        <p>Scroll Down</p>
        <div class="pulse">
          <icon name="angle-down" scale="2"></icon>
        </div>
      </a>
    </crowd-container>

  </div>
</template>

<script>
import 'vue-awesome/icons/angle-down'
import getScrollTop from '@/utils/get-scroll-top.js'
import CrowdContainer from '@/components/layouts/CrowdContainer'

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

  components: {
    CrowdContainer
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

#scrollDown p {
  font-size: $font-size-sm;
  color: $white;
  text-transform: uppercase;
  margin-bottom: 0.2em;
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
