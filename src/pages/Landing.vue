<template>

  <div id="landing">

    <transition appear>
      <div class="container full-height">
        <h1 id="tagline">{{ config.tagline }}</h1>
        <div id="intro-buttons" class="my-3">
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
        <hr class="my-4 w-75 sr">
        <div class="row sr">
          <div class="col-sm-10 offset-sm-1">
            <p class="lead my-2">
              {{ config.description }}
            </p>
          </div>
        </div>
        <hr class="my-4 w-75 sr">
        <div class="row">
          <div class="col-md-4 my-3 sr">
            <icon name="desktop" scale="4"></icon>
            <p class="my-1">{{ stats.n_published_projects }}</p>
            <p>Projects</p>
          </div>
          <div class="col-md-4 my-3 sr">
            <icon name="tasks" scale="4"></icon>
            <p class="my-1">{{ stats.n_task_runs }}</p>
            <p>Contributions</p>
          </div>
          <div class="col-md-4 my-3 sr">
            <icon name="users" scale="4"></icon>
            <p class="my-1">{{ stats.n_total_users }}</p>
            <p>Volunteers</p>
          </div>
        </div>
    </div>
</section>

  </div>

</template>

<script>
import ScrollReveal from 'scrollreveal'
import 'vue-awesome/icons/desktop'
import 'vue-awesome/icons/tasks'
import 'vue-awesome/icons/users'
import config from '@/config'
import pybossaApi from '@/api/pybossa'

export default {

  data: function () {
    return {
      config: config,
      stats: {}
    }
  },

  metaInfo: {
    title: config.tagline,
    meta: [
      { name: 'description', content: config.description }
    ]
  },

  methods: {
    fetchStats () {
      pybossaApi.get('stats/').then(r => {
        this.stats = r.data.stats
      })
    },
    scrollReveal () {
      const sr = ScrollReveal()
      sr.reveal('.sr', { delay: 400, duration: 600 }, 75)
    }
  },

  mounted () {
    this.fetchStats()
    this.scrollReveal()
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
}
</style>
