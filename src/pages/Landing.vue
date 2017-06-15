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

    <site-footer></site-footer>
  </div>
</template>

<script>
import 'vue-awesome/icons/angle-down'
import CrowdContainer from '@/components/layouts/CrowdContainer'
import SiteFooter from '@/components/SiteFooter'

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
    CrowdContainer,
    SiteFooter
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
