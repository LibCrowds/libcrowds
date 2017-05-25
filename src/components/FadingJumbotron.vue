<template>
  <div id="landing">
    <div class="jumbotron" :style="jtStyle" ref="jt">
      <div class="container" :style="containerStyle">
        <div></div>
        <h1>{{ header }}</h1>
        <a :href="scrollAnchor">
          <p>Scroll Down</p>
          <transition name="pulse">
            <span class="fa fa-chevron-down fa-2x"></span>
          </transition>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import getScrollTop from '@/utils/get-scroll-top.js'

export default {
  data: function () {
    return {
      jtStyle: {
        backgroundImage: `url("${this.bgImg}")`,
        filter: 'brightness(100%)'
      },
      containerStyle: {
        opacity: 1
      },
      header: this.header,
      scrollAnchor: this.scrollAnchor
    }
  },
  props: [
    'bgImg',
    'scrollAnchor',
    'header'
  ],
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
}

.jumbotron {
  padding: 0;
  display: flex;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;

  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1 1 auto;
    text-align: center;

    p {
      color: $white;
      text-transform: uppercase;
    }
  }
}

.pulse {
  color: blue;
	animation: pulse 5s infinite;
}

@keyframes pulse {
    0%, 50%, 100% {
	    transform: translateY(0);
    }
    25%, 75% {
      transform: translateY(10px);
    }
}
</style>
