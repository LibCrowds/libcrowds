<template>
  <div id="landing">
    <basic-layout>

    <section>
      <div class="header-container">
        <h1>{{ siteConfig.brand }}</h1>
        <div id="intro-buttons" class="mt-2"></div>
      </div>
      <div id="hero">
        <div class="container text-center layer parallex" data-depth="0.60">
        </div>
        <div id="hero-layer-1" class="layer parallex" data-depth="0.80"></div>
        <div id="hero-layer-2" class="layer parallex" data-depth="1.00"></div>
      </div>
    </section>

      <section id="projects">

        <div class="bg-dark-brown py-4">

          <section
            v-for="(config, key) in projectConfigs"
            :key="key"
            :style="{ backgroundImage: `url('${config.bgImg}')` }"
            class="project-section bg-dark-brown py-4 my-5 container">

            <div class="container py-3 py-md-4 text-center">
              <div class="row sr">
                <div class="col-sm-10 offset-sm-1">
                  <h4>{{ config.name }}</h4>
                  <p class="mb-0">
                    {{ config.tagline }}
                  </p>
                </div>
              </div>
              <hr class="my-2 w-75 sr">
              <div class="row sr">
                <div class="col-sm-10 offset-sm-1">
                  <b-button
                    variant="outline-white"
                    :to="{
                      name: 'project-home',
                      params: {
                        projectname: key
                      }
                    }">
                    Contribute
                  </b-button>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div id="projects-bottom">
          <div id="paint-bottom"></div>
        </div>
      </section>


      <section
        id="top-users"
        class="bg-white invert-navbar"
        v-if="topUsers.length > 1">
        <div class="container py-4">
          <div class="row">
            <div class="col-lg-5 offset-lg-1 pt-2 text-center">
              <h3 class="text-uppercase font-weight-bold">
                Most Active Volunteers
              </h3>
              <hr class="wide w-50 my-2">
              <p class="text-uppercase lead pb-2">
                To date, our top {{ topUsers.length }} volunteers have made
                {{ topUsersTaskRuns }} contributions!
              </p>
            </div>
            <div class="col-lg-5 offset-lg-1 hidden-md-down">
              <img src="../../assets/img/wreath.png" alt="Wreath" class="img-fluid">
              <span id="wreath"></span>
            </div>
          </div>
          <div class="row text-center mt-4">
            <div class="col-lg-12 pt-1">
              <ul class="list-unstyled">
                <li
                  :key="user.id"
                  class="text-center d-inline-block mx-1"
                  v-for="user in topUsers">
                  <router-link :to="{
                      name: 'profile',
                      params: {
                        username: user.name
                      }
                    }"
                    class="my-1">
                    <div class="my-1">
                      <user-avatar
                        :user="user"
                        tooltipTriggers="hover">
                      </user-avatar>
                    </div>
                  </router-link>
                  <p class="badge badge-info">{{ user.score }}</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="row text-center mt-1">
            <div class="col-sm-12 col-lg-5 offset-lg-1 push-lg-6 mt-3">
              <b-btn
                variant="black-underline"
                v-b-modal="leaderboardModalId">
                <icon name="eye"></icon> View the leaderboard
              </b-btn>
            </div>
          </div>
        </div>
      </section>

      <section id="social-media" class="bg-white invert-navbar">
        <div class="container pb-5 text-center">
          <hr class="mt-0 mb-4">
          <social-media-buttons>
          </social-media-buttons>
        </div>
      </section>

      <leaderboard-modal :modalId="leaderboardModalId"></leaderboard-modal>

    </basic-layout>
  </div>
</template>

<script>
import ScrollReveal from 'scrollreveal'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/star'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/television'
import 'vue-awesome/icons/list'
import siteConfig from '@/settings/siteConfig'
import pybossaApi from '@/api/pybossa'
import BasicLayout from '@/components/layouts/Basic'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import LeaderboardModal from '@/components/modals/Leaderboard'
import ProjectCard from '@/components/project/Card'
import UserAvatar from '@/components/user/Avatar'
import getNumberWithCommas from '@/utils/get-number-with-commas'
import mapValues from 'lodash/mapValues'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      stats: {},
      topUsers: [],
      leaderboardModalId: 'leaderboard-modal'
    }
  },

  components: {
    BasicLayout,
    SocialMediaButtons,
    LeaderboardModal,
    UserAvatar,
    ProjectCard
  },

  computed: {
    topUsersTaskRuns: function () {
      const scores = this.topUsers.map((user) => user.score)
      const sum = scores.reduce(function (acc, val) {
        return acc + val
      }, 0)
      return getNumberWithCommas(sum)
    },
    projectConfigs: function () {
      const configs = {}
      for (const key of this.siteConfig.projects) {
        configs[key] = require(`../../settings/projects/${key}/config`)
      }
      return configs
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.topUsers = data.top_users
      this.stats = mapValues(data.stats, (n) => getNumberWithCommas(n))
    },

    /**
     * Init scroll reveal.
     */
    scrollReveal () {
      ScrollReveal().reveal('.sr', {
        duration: 600 },
      50)
    },

    /**
     * Handle parallex animations.
     */
    translateParallex (evt) {
      let topDistance = window.pageYOffset
      let layers = document.querySelectorAll('.parallex')
      for (let i = 0; i < layers.length; i++) {
        let depth = layers[i].getAttribute('data-depth')
        let movement = -(topDistance * depth)
        let translate3d = 'translate3d(0, ' + movement + 'px, 0)'
        layers[i].style['-webkit-transform'] = translate3d
        layers[i].style['-moz-transform'] = translate3d
        layers[i].style['-ms-transform'] = translate3d
        layers[i].style['-o-transform'] = translate3d
        layers[i].style.transform = translate3d
      }
    }
  },

  created () {
    let data = {}
    pybossaApi.get(`/`).then(r => {
      data = r.data
      return pybossaApi.get('stats/')
    }).then(r => {
      data.stats = r.data.stats
      this.setData(data)
    })
  },

  mounted () {
    this.scrollReveal()
    window.addEventListener('scroll', this.translateParallex)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.translateParallex)
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#landing {
  .header-container {
    position: absolute;
    color: white;
    text-align: center;
    width: 100%;
    top: 100px;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;

    h1 {
      position: relative;
      margin: 0;
      padding: 1.5rem 2.75rem;
      letter-spacing: 1px;
      font-size: 2.2rem;
      font-family: $font-family-base;
      font-weight: 900;
      text-transform: uppercase;

      &:before,
      &:after {
        -moz-transition: width 0.85s ease;
        -webkit-transition: width 0.85s ease;
        -ms-transition: width 0.85s ease;
        transition: width 0.85s ease;
        -moz-transition-delay: 0.25s;
        -webkit-transition-delay: 0.25s;
        -ms-transition-delay: 0.25s;
        transition-delay: 0.25s;
        background: #fff;
        content: '';
        display: block;
        height: 2px;
        position: absolute;
        width: 100%;
      }

      &:before {
        top: 0;
        left: 0;
      }

      &:after {
        bottom: 0;
        right: 0;
      }
    }
  }

  #hero {
    min-height: 500px;
    height: 90vh;
    overflow: hidden;
    position: relative;
  }

  .layer {
    background-position: bottom center;
    background-size: auto;
    background-repeat: no-repeat;
    width: 100%;
    min-height: 500px;
    height: 90vh;
    position: fixed;
    z-index: -1;
  }

  #hero-layer-1 {
    background-image: url('../../assets/img/app-background.jpg');
  }

  #hero-layer-2 {
    background-image: url('../../assets/img/paint-top.png');
  }

  #paint-bottom {
    height: 100%;
    background-position: top center;
    background-size: auto;
    background-repeat: no-repeat;
    background-image: url('../../assets/img/paint-bottom.png');
  }

  #projects-bottom {
    height: 300px;
    background-color: $white;
  }


  .project-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: $white;
    min-height: 400px;
    box-shadow: rgba($white, 0.25) 0px 0px 15px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  #site-lead {
    font-family: $font-family-serif;
    font-size: 3rem;
    line-height: 1.1;

    @include media-breakpoint-up(sm) {
      font-size: 4rem;
    }
  }

  @include media-breakpoint-up(sm) {
    h2 {
      font-size: 4rem;
    }
    h3 {
      font-size: 3.5rem;
    }
  }

  .bg-white {
    background-color: $white;
  }

  .btn-bg-white {
    &:not(:hover):not(:focus):not(.active) {
        background-color: $white;
    }
  }

  hr.wide {
    border-width: 3px;
  }

  .btn-outline-white {
    @include button-outline-variant($white, $black);
  }

  .bg-dark-brown {
    background-color: $dark-brown;
  }

  .btn-black-underline  {
    color: $black;
    background: none;
    border-bottom: 3px solid rgba($black, 0);
    display: inline-block;
    transition: border-bottom 500ms;

    @include hover-focus {
      border-bottom: 3px solid rgba($black, 1);
    }
  }

  #top-users {
    color: $gray-dark;
  }
}
</style>
