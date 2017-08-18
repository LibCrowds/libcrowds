<template>
  <div id="collection-home">
    <basic-layout>

      <transition appear>
        <div class="container full-height text-center">
          <div class="header-content">
            <h1 id="tagline">{{ collectionConfig.tagline }}</h1>
            <div id="intro-buttons" class="mt-2">
              <b-button
                variant="secondary"
                :to="{
                  name: 'collection-about',
                  params: {
                    collectionname: collectionConfig.name
                  }
                }">
                Learn More
              </b-button>
              <b-button
                variant="success"
                :to="{
                  name: 'collection-contribute',
                  params: {
                    collectionname: collectionConfig.name
                  }
                }">
                Get Started
              </b-button>
            </div>
          </div>
        </div>
      </transition>

      <section id="intro" class="bg-white invert-navbar">
        <div class="container py-3 py-md-4 text-center">
          <div class="row sr">
            <div class="col-sm-10 offset-sm-1">
              <p id="site-lead" class="mb-0">
                Have a direct impact on enabling future research at
                {{ siteConfig.company }}.
              </p>
            </div>
          </div>
          <hr class="my-2 w-75 sr">
          <div class="row sr">
            <div class="col-sm-10 offset-sm-1">
              <p class="lead my-1">
                {{ collectionConfig.description }}
              </p>
            </div>
          </div>
          <hr class="my-2 w-75 sr">
          <div class="row">
            <div class="col-md-4 my-1 sr stat">
              <icon name="television" scale="3"></icon>
              <p class="mb-0">
                {{ stats.n_published_projects }}
              </p>
              <p>Projects</p>
            </div>
            <div class="col-md-4 my-1 sr stat">
              <icon name="users" scale="3"></icon>
              <p class="mb-0">
                {{ stats.n_total_users }}
              </p>
              <p>Volunteers</p>
            </div>
            <div class="col-md-4 my-1 sr stat">
              <icon name="list" scale="3"></icon>
              <p class="mb-0">
                {{ stats.n_task_runs }}
              </p>
              <p>Contributions</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="featured-projects"
        class="invert-navbar"
        v-if="featured.length">
        <div class="container text-center text-lg-left pb-4">
          <div class="row">
            <div class="col-lg-5 offset-lg-1 text-uppercase py-4">
              <h2 class="font-weight-bold pt-1">
                Featured Projects
              </h2>
              <hr class="wide mr-lg-5">
              <p class="mr-lg-6">
                Choose from some of our current favourites.
              </p>
            </div>
            <div class="col-lg-3 offset-lg-3 hidden-md-down">
              <span id="ribbon">
                <icon name="star" scale="7"></icon>
              </span>
            </div>
          </div>
          <div class="row text-center">
            <div class="col-lg-10 offset-lg-1">
              <ul class="list-unstyled">
                <li v-for="project in featured" :key="project.id">
                  <project-card :project="project"></project-card>
                </li>
              </ul>
              <b-button
                class="mt-2 btn-bg-white"
                variant="success"
                size="lg"
                :to="{
                  name: 'collection-contribute',
                  params: {
                    collectionname: collectionConfig.name
                  }
                }">
                Browse all projects
              </b-button>
            </div>
          </div>
        </div>
      </section>

      <section id="data">
        <span :style="dataStyle"></span>
        <b-jumbotron :style="dataStyle">
          <div class="container py-4">
            <div class="row text-center">
              <div class="col-sm-12">
                <h3>Open Data</h3>
              </div>
            </div>
            <div class="row py-md-3">
              <div class="col-md-8 offset-md-2">
                <p class="lead">
                  All datasets generated from the crowdsourcing projects hosted
                  on this platform are made available under a
                  <a
                    :href="siteConfig.dataLicense.url"
                    target="_blank">
                    {{ siteConfig.dataLicense.name }} license
                  </a>
                  and can be downloaded by anyone in JSON or
                  CSV formats. Visit our data page to find out more.
                </p>
              </div>
            </div>
            <div class="row pt-2 text-center">
              <div class="col-sm-12">
                <b-button
                  variant="outline-white"
                  :to="{
                    name: 'collection-data',
                    params: {
                      collectionname: collectionConfig.name
                    }
                  }">
                  Get the data
                </b-button>
              </div>
            </div>
          </div>
        </b-jumbotron>
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
              <b-button
                variant="secondary"
                :to="{
                  name: 'collection-contribute',
                  params: {
                    collectionname: collectionConfig.name
                  }
                }">
                Get Involved
              </b-button>
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

      <section id="results" v-if="collectionConfig.resultsComponent">
        <b-jumbotron :style="resultsStyle">
          <div class="container py-4">
            <div class="row text-center">
              <div class="col-sm-12">
                <h3>Results</h3>
              </div>
            </div>
            <div class="row py-2">
              <div class="col-md-8 offset-md-2">
                <p class="lead">
                  As each task is completed, contributions are analysed and
                  the outcome provided via our results page, making the
                  efforts of our volunteers immediately apparent.
                </p>
              </div>
            </div>
            <div class="row pt-2 text-center">
              <div class="col-sm-12">
                <b-button variant="outline-white" :to="{ name: 'results' }">
                  See the results
                </b-button>
              </div>
            </div>
          </div>
        </b-jumbotron>
      </section>

      <section id="final-cta" class="bg-white invert-navbar">
        <div class="container pt-5 pb-4">
          <div class="row">
            <div class="col-sm-10 offset-sm-1 text-center">
              <h3 class="text-uppercase mb-0">Get Involved</h3>
              <p class="lead my-3">
                Your contributions will have a direct impact on enabling future
                reasearch at {{ siteConfig.company }}.
              </p>
              <b-button
                variant="success"
                size="lg"
                :to="{
                  name: 'collection-contribute',
                  params: {
                    collectionname: collectionConfig.name
                  }
                }">
                Choose a project
              </b-button>
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
import codeImage from '@/assets/img/code.png'
import newtonImage from '@/assets/img/newton.jpg'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      stats: {},
      featured: [],
      topUsers: [],
      dataStyle: {
        backgroundImage: `url(${codeImage})`
      },
      resultsStyle: {
        backgroundImage: `url(${newtonImage})`
      },
      leaderboardModalId: 'leaderboard-modal'
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  // metaInfo: {
  //   title: this.collectionConfig.tagline,
  //   meta: [
  //     { name: 'description', content: this.collectionConfig.description },

  //     // Facebook Open Graph Markup
  //     { property: 'og:url', content: window.location.href },
  //     { property: 'og:title', content: this.collectionConfig.tagline },
  //     { property: 'og:description', content: this.collectionConfig.description }
  //   ]
  // },

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
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      if ('featured' in data.categories_projects) {
        this.featured = data.categories_projects.featured
      }
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
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#collection-home {
  .container.full-height {
    height: 100vh;
    color: $white;
    opacity: 1;
    transition: opacity 800ms;

    // IE fix for overflowing text in flex container.
    .header-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }

    &.v-enter,
    &.v-leave-to {
      opacity: 0;
    }
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

  @include media-breakpoint-down(xs) {
    #tagline {
      font-size: $font-size-lg;
      line-height: 1.6;
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

  #intro {
    .stat {
      font-weight: 400;
      font-family: $headings-font-family;
      font-size: $font-size-lg;
    }
  }

  #featured-projects {
    color: $gray-dark;
    background-image: url('../../assets/img/white-wall.png');
    box-shadow: 0 0 3px rgba($black, 0.2);
    -webkit-box-shadow: 0 0 3px rgba($black, 0.2);
    border: 1px solid $white;
  }

  #ribbon {
    text-align: center;
    display:block;
    width: 12rem;
    height: 12rem;
    background: $gray-lighter;
    position: absolute;
    top: -1px;

    svg {
      margin-top: 4rem;
      color: darken($body-bg, 3%);
    }

    &:after {
      content: "";
      display: block;
      position: relative;
      width: 0;
      height: 0;
      border-width: 2rem 6rem 4rem 6rem;
      border-style: solid;
      border-color: $gray-lighter $gray-lighter transparent $gray-lighter;
    }
  }

  #data {
    .jumbotron {
      color: $white;
      font-weight: 300;
      margin-bottom: 0;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: left;
    }
  }

  #top-users {
    color: $gray-dark;
  }

  #results {
    .jumbotron {
      color: $white;
      font-weight: 300;
      background-repeat: no-repeat;
      background: url('../../assets/img/newton.jpg');
      background-attachment: fixed;
      background-position: center;
      background-size: cover;
      margin-bottom: 0;
    }
  }
}
</style>
