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
    
    <section id="data">
      <div class="jumbotron">
        <div class="container text-center">
          <div class="row py-2">
            <div class="col-sm-12">
              <h2 class="display-3">Open Data</h2>
            </div>
          </div>
          <div class="row py-3">
            <div class="col-md-6 offset-md-3">
              <p class="lead">
                All datasets generated from the experimental crowdsourcing 
                projects hosted on this platform are made available under a
                <a :href="config.dataLicense.url" target="_blank">
                  {{ config.dataLicense.name }}
                </a> license. Datasets can be downloaded in JSON or CSV 
                formats. Visit the data page for each project website to find 
                out more.
              </p>
            </div>
          </div>
          <b-button
            variant="outline-white">
            Choose a project
          </b-button>
        </div>
      </div>
    </section>
    
    <section id="community" class="bg-faded" v-if="config.discourseUrl.length">
      <div class="container py-5 text-center">
        <div class="row">
          <div class="col-sm-12">
            <h3 class="text-uppercase font-weight-bold display-4">
              {{ config.brand }} Community
            </h3>
            <hr class="bw-3">
            <p class="text-left">
              Discovered something interesting? Got a suggestion for a cool
              new project? Developing something using our crowdsourced data?
              Our community forum is the place to discuss your thoughts
              and ideas with {{ config.brand }} volunteers, researchers and
              developers.
            </p>
          </div>
        </div>
        <b-button
          variant="secondary">
          Choose a project
        </b-button>
      </div>
    </section>

    <site-footer></site-footer>
  </div>
</template>

<script>
import 'vue-awesome/icons/angle-down'
import config from '@/config'
import CrowdContainer from '@/components/layouts/CrowdContainer'
import SiteFooter from '@/components/SiteFooter'

export default {
  data: function () {
    return {
      config: config,
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

.btn-outline-white {
  @include button-outline-variant($white, $black);
}

#scrollDown p {
  font-size: $font-size-sm;
  color: $white;
  text-transform: uppercase;
  margin-bottom: 0.2em;
}

#data {
  .jumbotron {
    margin-bottom: 0;
    color: $white;
    background: url('../assets/img/code.png') no-repeat left fixed;
  }
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
