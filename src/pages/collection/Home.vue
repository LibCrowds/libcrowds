<template>
  <div id="collection-home">
    <transition appear>
      <div class="container full-height text-center">
        <div class="header-content">
          <div>
            <div
              id="company-logo"
              class="d-inline-block"
              v-html="siteConfig.logo"
              v-if="siteConfig.logo">
            </div>
            <h1 class="display-3 d-inline-block hidden-md-down mb-0">
              {{ collectionConfig.name }}
            </h1>
          </div>
          <h2 id="tagline" class="mt-2 mb-3">
            {{ collectionConfig.tagline }}
          </h2>
          <div>
            <b-button
              variant="success"
              size="lg"
              :to="{
                name: 'collection-contribute',
                params: {
                  collectionname: collectionConfig.key
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
              {{ collectionConfig.description }}
            </p>
          </div>
        </div>
        <hr class="my-3 w-75 sr">
        <div class="row sr">
          <div class="col-sm-10 offset-sm-1">
            <p class="lead mb-0">
              Your contributions will have a direct impact on enabling future
              research at {{ siteConfig.company }}.
            </p>
          </div>
        </div>
        <hr class="mt-3 w-75 sr">
        <b-button
          variant="secondary"
          class="mt-md-1 sr"
          :to="{
            name: 'collection-about',
            params: {
              collectionname: collectionConfig.key
            }
          }">
          Learn More
        </b-button>
      </div>
    </section>

    <section
      id="featured-projects"
      class="invert-navbar"
      v-if="featured.length">
      <div class="container text-center text-lg-left pb-4">
        <div class="row">
          <div class="col-lg-5 offset-lg-1 text-uppercase py-4">
            <h2 class="display-5 font-weight-bold pt-1">
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
                <project-card
                  :collection-config="collectionConfig"
                  :project="project">
                </project-card>
              </li>
            </ul>
            <b-button
              class="mt-2"
              variant="success"
              size="lg"
              :to="{
                name: 'collection-contribute',
                params: {
                  collectionname: collectionConfig.key
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
              <h3 class="display-5">Open Data</h3>
            </div>
          </div>
          <div class="row py-md-3">
            <div class="col-md-8 offset-md-2">
              <p class="lead">
                All datasets generated from the experimental crowdsourcing
                projects hosted on this platform are made available under a
                <a
                  :href="siteConfig.dataLicense.url"
                  target="_blank">
                  {{ siteConfig.dataLicense.name }} license
                </a>
                and can be downloaded by anyone in JSON or
                CSV formats. Visit the data page to find out more.
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
                    collectionname: collectionConfig.key
                  }
                }">
                Get the data
              </b-button>
            </div>
          </div>
        </div>
      </b-jumbotron>
    </section>

    <section id="results" v-if="collectionConfig.resultsComponent">
      <b-jumbotron :style="resultsStyle">
        <div class="container py-4">
          <div class="row text-center">
            <div class="col-sm-12">
              <h3 class="display-5">Results</h3>
            </div>
          </div>
          <div class="row py-2">
            <div class="col-md-8 offset-md-2">
              <p class="lead">
                As each {{ collectionConfig.terminology.task }} is completed,
                {{ collectionConfig.terminology.taskRun | pluralize }} are
                analysed and the outcome provided via our results page, making
                the efforts of our volunteers immediately apparent.
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
      <div class="container pt-4 pb-3">
        <div class="row">
          <div class="col-sm-10 offset-sm-1 text-center">
            <h3 class="display-5 text-uppercase mb-0">Get Involved</h3>
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
                  collectionname: collectionConfig.key
                }
              }">
              Get Started
            </b-button>
          </div>
        </div>
      </div>
    </section>

    <section id="social-media" class="bg-white invert-navbar">
      <div class="container pb-4 text-center">
        <hr class="mt-0 mb-3">
        <social-media-buttons>
        </social-media-buttons>
      </div>
    </section>
  </div>
</template>

<script>
import ScrollReveal from 'scrollreveal'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/star'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/television'
import 'vue-awesome/icons/list'
import siteConfig from '@/siteConfig'
import pybossaApi from '@/api/pybossa'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import ProjectCard from '@/components/project/Card'
import codeImage from '@/assets/img/code.png'
import newtonImage from '@/assets/img/newton.jpg'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      logo: siteConfig.logo,
      categories: [],
      featured: [],
      dataStyle: {
        backgroundImage: `url(${codeImage})`
      },
      resultsStyle: {
        backgroundImage: `url(${newtonImage})`
      }
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  metaInfo () {
    return {
      title: this.collectionConfig.tagline,
      meta: [
        {
          name: 'description',
          content: this.collectionConfig.description
        }
      ]
    }
  },

  components: {
    SocialMediaButtons,

    ProjectCard
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      // Filter featured projects for this collection
      if ('featured' in data.categories_projects) {
        const validProjectIds = data.categories.map(category => {
          return data.categories_projects[category.short_name]
        }).reduce((a, b) => {
          return a.concat(b)
        }).map(project => {
          return project.id
        })
        this.featured = data.categories_projects.featured.filter(project => {
          return validProjectIds.indexOf(project.id) > -1
        })
      }
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
    let key = this.collectionConfig.key
    let q = `info=collection::${key}&fulltextsearch=1&limit=100`
    let categoryUrl = `/api/category?${q}`

    pybossaApi.get(`/`).then(r => {
      data = r.data
      return pybossaApi.get(categoryUrl)
    }).then(r => {
      data.categories = r.data.filter(category => {
        return category.info.collection === key
      })
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

    #company-logo {
      @include media-breakpoint-up(md) {
        margin-right: 1.5rem;
        margin-left: -1.5rem;
      }

      svg {
        display: block;
      }
    }
  }

  #site-lead {
    font-family: $font-family-base;
    font-size: 2.2rem;
    font-weight: 300;
    line-height: 1.1;

    @include media-breakpoint-up(sm) {
      font-size: 3rem;
    }
  }

  @include media-breakpoint-up(md) {
    .display-5 {
      font-size: 3.5rem;
    }
  }

  #tagline {
    font-size: 2rem;
  }

  .bg-white {
    background-color: $white;
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
