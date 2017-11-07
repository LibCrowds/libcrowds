<template>
  <div id="collection-index">
    <transition appear>
      <div class="container full-height text-center">
        <div class="header-content">
          <div class="d-flex justify-content-center align-items-center">
            <object
              id="collection-logo"
              v-if="hasLogo && collection.info.logo.endsWith('.svg')"
              :data="collection.info.logo"
              class="d-block"
              type="image/svg+xml">
            </object>
            <img
              id="collection-logo"
              v-else-if="hasLogo"
              class="d-inline-block"
              src="collection.info.logo">
            </img>
            <span
              class="mr-2 d-none d-lg-inline-block"
              v-if="hasLogo">
            </span>
            <h1 class="display-3 d-none d-lg-inline-block mb-0">
              {{ collection.name }}
            </h1>
            <span
              class="mr-4 d-none d-lg-inline-block"
              v-if="hasLogo">
            </span>
          </div>
          <h2 id="tagline" class="mt-2 mb-3">
            {{ collection.info.tagline }}
          </h2>
          <div>
            <b-btn
              variant="success"
              size="lg"
              :to="{
                name: 'collection-short_name-projects',
                params: {
                  short_name: collection.short_name
                }
              }">
              Get Started
            </b-btn>
          </div>
        </div>
      </div>
    </transition>

    <section id="intro" class="bg-white invert-navbar">
      <div class="container py-3 py-md-4 text-center">
        <p id="site-lead" class="mb-0 px-1">
          {{ collection.description }}
        </p>
        <hr class="my-3 w-75">
        <p class="lead mb-0 px-1">
          Your contributions will have a direct impact on enabling future
          research at {{ localConfig.company }}.
        </p>
        <hr class="mt-3 w-75">
        <b-btn
          variant="outline-dark"
          class="mt-md-2"
          size="lg"
          :to="{
            name: 'collection-short_name-about',
            params: {
              short_name: collection.short_name
            }
          }">
          Learn More
        </b-btn>
      </div>
    </section>

    <section
      id="featured-projects"
      class="invert-navbar"
      v-if="featured.length">
      <div class="container w-75 text-center pb-4">
        <div class="row text-lg-left">
          <div class="col-lg-5 text-uppercase py-4">
            <h2 class="display-5 font-weight-bold pt-1">
              Featured Projects
            </h2>
            <hr class="wide">
            <p class="mr-lg-6">
              Choose from some of our current favourites.
            </p>
          </div>
          <div class="col d-none d-lg-block">
            <span class="ml-auto" id="ribbon">
              <icon name="star" scale="7"></icon>
            </span>
          </div>
        </div>
        <ul class="list-unstyled">
          <li v-for="project in featured" :key="project.id">
            <project-card
              :collection="collection"
              :project="project">
            </project-card>
          </li>
        </ul>
        <b-btn
          class="mt-2"
          variant="success"
          size="lg"
          :to="{
            name: 'collection-short_name-projects',
            params: {
              short_name: collection.short_name
            }
          }">
          Browse all projects
        </b-btn>
      </div>
    </section>

    <section id="data">
      <b-jumbotron>
        <div class="container py-2 py-md-4 w-75 text-center">
          <h3 class="display-5">Open Data</h3>
          <p class="lead my-2 my-md-3 text-sm-left">
            All datasets generated from the experimental crowdsourcing
            projects hosted on this platform are made available under a
            <a
              :href="collection.info.license"
              target="_blank">
              {{ collection.info.license }} license
            </a>
            and can be downloaded by anyone in JSON or
            CSV formats. Visit the data page to find out more.
          </p>
          <b-btn
            variant="outline-light"
            class="my-1"
            :to="{
              name: 'collection-short_name-data',
              params: {
                short_name: collection.short_name
              }
            }">
            Get the data
          </b-btn>
        </div>
      </b-jumbotron>
    </section>

    <!-- <section id="results" v-if="collectionConfig.resultsComponent">
      <b-jumbotron :style="resultsStyle">
        <div class="container py-2 py-md-4 w-75 text-center">
          <h3 class="display-5">Results</h3>
          <p class="lead my-2 my-md-3 text-sm-left">
            As each {{ collection.info.terminology.task }} is completed,
            {{ collection.info.terminology.taskRun | pluralize }} are
            analysed and the outcome provided via our results page, making
            the efforts of our volunteers immediately apparent.
          </p>
          <b-btn
            variant="outline-light"
            class="my-1"
            :to="{
              key: 'collection-short_name-results'
            }">
            Browse the results
          </b-btn>
        </div>
      </b-jumbotron>
    </section> -->

    <section id="final-cta" class="bg-white invert-navbar">
      <div class="container pt-4 pb-3 text-center">
        <h3 class="display-5 text-uppercase mb-0">Get Involved</h3>
        <p class="lead my-3">
          Your contributions will have a direct impact on enabling future
          research at {{ localConfig.company }}.
        </p>
        <b-btn
          variant="success"
          size="lg"
          :to="{
            name: 'collection-short_name-projects',
            params: {
              short_name: collection.short_name
            }
          }">
          Get Started
        </b-btn>
      </div>
    </section>

    <section id="social-media" class="bg-white invert-navbar">
      <div class="container pb-4 text-center">
        <hr class="mt-0 mb-3">
        <social-media-buttons
          :shareUrl="shareUrl">
        </social-media-buttons>
      </div>
    </section>
  </div>
</template>

<script>
import 'vue-awesome/icons/star'
import localConfig from '@/local.config'
import { loadCollectionFeatured } from '@/mixins/loadCollectionFeatured'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { computeShareUrl } from '@/mixins/computeShareUrl'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import ProjectCard from '@/components/cards/Project'

export default {
  layout: 'collection-default',

  mixins: [
    fetchCollectionByName,
    loadCollectionFeatured,
    computeShareUrl
  ],

  data () {
    return {
      localConfig: localConfig
    }
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    hasLogo () {
      return this.collection.info.logo && this.collection.info.logo.length
    },

    title () {
      return this.collection.info && 'tagline' in this.collection.info
        ? this.collection.info.tagline
        : this.collection.name
    }
  },

  head () {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.collection.description
        }
      ]
    }
  },

  components: {
    SocialMediaButtons,
    ProjectCard
  },

  mounted () {
    this.loadCollectionFeatured()
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/settings';

#collection-index {
  .container.full-height {
    min-height: 400px;
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

    #collection-logo {
      height: 100px;
      width: auto;
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
    color: $gray-1000;
    background-image: url('~/assets/img/white-wall.png');
    box-shadow: 0 0 3px rgba($black, 0.2);
    -webkit-box-shadow: 0 0 3px rgba($black, 0.2);
    border: 1px solid $white;
  }

  #ribbon {
    text-align: center;
    display:block;
    width: 12rem;
    height: 12rem;
    background: $gray-300;
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
      border-color: $gray-300 $gray-300 transparent $gray-300;
    }
  }

  #data {
    .jumbotron {
      color: $white;
      font-weight: 300;
      margin-bottom: 0;
      background-image: url('~/assets/img/code.png');
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: left;
    }
  }

  #top-users {
    color: $gray-1000;
  }

  #results {
    .jumbotron {
      color: $white;
      font-weight: 300;
      background-repeat: no-repeat;
      background-image: url('~/assets/img/newton.jpg');
      background-attachment: fixed;
      background-position: center;
      background-size: cover;
      margin-bottom: 0;
    }
  }
}
</style>
