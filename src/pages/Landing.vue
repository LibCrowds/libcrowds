<template>

  <div id="landing">

    <transition appear>
      <div class="container full-height">
        <h1 id="tagline">{{ config.tagline }}</h1>
        <div id="intro-buttons" class="mt-2">
          <b-button variant="secondary" :to="{ name: 'about' }">
            Learn More
          </b-button>
          <b-button variant="success" :to="{ name: 'projects' }">
            Get Started
          </b-button>
        </div>
      </div>
    </transition>

    <section id="intro" class="bg-white invert-navbar">
      <div class="container py-5 text-center">
        <div class="row sr">
          <div class="col-sm-10 offset-sm-1">
            <p class="font-family-serif display-4 mb-0">
              Have a direct impact on enabling future research at
              {{ config.company }}.
            </p>
          </div>
        </div>
        <hr class="my-2 w-75 sr">
        <div class="row sr">
          <div class="col-sm-10 offset-sm-1">
            <p class="lead my-1">
              {{ config.description }}
            </p>
          </div>
        </div>
        <hr class="my-2 w-75 sr">
        <div class="row">
          <div class="col-md-4 my-1 sr stat">
            <icon name="projects" scale="4"></icon>
            <p class="mb-0">
              {{ stats.n_published_projects }}
            </p>
            <p>Projects</p>
          </div>
          <div class="col-md-4 my-1 sr stat">
            <icon name="users" scale="4"></icon>
            <p class="mb-0">
              {{ stats.n_total_users }}
            </p>
            <p>Volunteers</p>
          </div>
          <div class="col-md-4 my-1 sr stat">
            <icon name="taskruns" scale="4"></icon>
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
      <div class="container text-center text-lg-left">
        <div class="row">
          <div class="col-lg-5 offset-lg-1 text-uppercase py-4">
            <h2 class="font-weight-bold display-4 pt-1">
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
        <div class="row my-5">
          <div class="col-lg-10 offset-lg-1">
            Load projects here
          </div>
        </div>
      </div>
    </section>

    <section id="data">
      <b-jumbotron>
        <div class="container py-4">
          <div class="row text-center">
            <div class="col-sm-12">
              <h3 class="display-3">Open Data</h3>
            </div>
          </div>
          <div class="row py-3">
            <div class="col-md-8 offset-md-2">
              <p class="lead">
                All datasets generated from the crowdsourcing projects hosted
                on this platform are made available under a
                <a :href="config.dataLicense.url" target="_blank">
                  {{ config.dataLicense.name }}
                </a> license. Datasets can be downloaded by anyone in JSON and
                CSV formats, visit our data page to find out more.
              </p>
            </div>
          </div>
          <div class="row pt-2 text-center">
            <div class="col-sm-12">
              <b-button variant="outline-white" :to="{ name: 'data' }">
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
      v-if="topUsers">
      <div class="container py-4">
        <div class="row">
          <div class="col-lg-5 offset-lg-1 pt-2 text-center">
            <h3 class="text-uppercase font-weight-bold display-4">
              Most Active Volunteers
            </h3>
            <hr class="wide w-50 my-2">
            <p class="text-uppercase lead pb-2">
              To date, our top {{ topUsers.length }} volunteers have made an
              amazing N contributions!
            </p>
            <b-button variant="secondary" :to="{ name: 'projects' }">
              Get Involved
            </b-button>
          </div>
          <div class="col-lg-5 offset-lg-1 hidden-md-down">
            <img src="../assets/img/wreath.png" alt="Wreath" class="img-fluid">
            <span id="wreath"></span>
          </div>
        </div>
        <div class="row text-center mt-4">
          <div class="col-lg-12 pt-1">
            Render Avatar list
          </div>
        </div>
        <div class="row text-center mt-1">
          <div class="col-sm-12 col-lg-5 offset-lg-1 push-lg-6 mt-3">
            <b-btn
              variant="black-underline"
              v-b-modal.lb-modal>
              <icon name="eye"></icon> View the leaderboard
            </b-btn>
          </div>
        </div>
      </div>
    </section>

    <section id="results">
      <b-jumbotron>
        <div class="container py-4">
          <div class="row text-center">
            <div class="col-sm-12">
              <h3 class="display-3">Results</h3>
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
            <h3 class="text-uppercase display-4 mb-0">Get Involved</h3>
            <p class="lead my-3">
              Your contributions will have a direct impact on enabling future
              reasearch at {{ config.company }}.
            </p>
            <b-button
              variant="outline-primary"
              size="lg"
              :to="{ name: 'projects' }">
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

    <leaderboard-modal name="lb-modal"></leaderboard-modal>

  </div>

</template>

<script>
import ScrollReveal from 'scrollreveal'
import 'vue-awesome/icons/star'
import 'vue-awesome/icons/eye'
import config from '@/config'
import pybossaApi from '@/api/pybossa'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import LeaderboardModal from '@/components/modals/Leaderboard'
import project from '@/assets/img/project.svg'
import getNumberWithCommas from '@/utils/get-number-with-commas'
import mapValues from 'lodash/mapValues'

export default {

  data: function () {
    return {
      config: config,
      stats: {},
      featured: [],
      topUsers: [],
      project: project
    }
  },

  metaInfo: {
    title: config.tagline,
    meta: [
      { name: 'description', content: config.description },

      // Facebook Open Graph Markup
      { property: 'og:url', content: window.location.href },
      { property: 'og:title', content: config.tagline },
      { property: 'og:description', content: config.description }
    ]
  },

  components: {
    SocialMediaButtons,
    LeaderboardModal
  },

  methods: {
    fetchData () {
      pybossaApi.get('stats/').then(r => {
        this.stats = mapValues(r.data.stats, (n) => getNumberWithCommas(n))
      })
      pybossaApi.get('/').then(r => {
        if ('featured' in r.data.categories_projects) {
          this.featured = r.data.categories_projects.featured
        }
        this.topUsers = r.data.top_users
      })
    },
    scrollReveal () {
      const sr = ScrollReveal()
      sr.reveal('.sr', { delay: 300, duration: 600 }, 75)
    }
  },

  destroyed () {
    document.querySelector('.navbar').classList.add('sticky-top')
    document.querySelector('.navbar').classList.remove('fixed-top')
  },

  mounted () {
    this.fetchData()
    this.scrollReveal()
    document.querySelector('.navbar').classList.add('fixed-top')
    document.querySelector('.navbar').classList.remove('sticky-top')
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars';
@import '~bootstrap/scss/bootstrap';

#landing {
  .container.full-height {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: $white;
    opacity: 1;
    transition: opacity 800ms;

    &.v-enter,
    &.v-leave-to {
      opacity: 0;
    }
  }

  .bg-white {
    background-color: $white;
  }

  .font-family-serif {
    font-family: $font-family-serif;
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
    background-image: url('../assets/img/white-wall.png');
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
      background: url('../assets/img/code.png') no-repeat left fixed;
      margin-bottom: 0;
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
      background: url('../assets/img/newton.jpg') bottom right / cover fixed;
      margin-bottom: 0;
    }
  }
}
</style>
