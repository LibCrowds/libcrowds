<template>
  <div id="index">
    <div id="app-hero" class="main-app-bg">
      <div class="container">
        <span class="d-none d-md-flex"></span>
        <p id="site-tagline">{{ title }}</p>
        <div class="stat-row d-none d-md-flex">
          <div class="stat-circle">
            <span class="stat">
              {{ stats.n_total_users | intComma }}
            </span>
            <icon name="users"></icon>
            <p>Volunteers</p>
          </div>
          <div class="stat-circle">
            <span class="stat">
              {{ stats.n_task_runs | intComma }}
            </span>
            <icon name="list"></icon>
            <p>Contributions</p>
          </div>
          <div class="stat-circle">
            <span class="stat">
              {{ stats.n_published_projects | intComma }}
            </span>
            <icon name="television"></icon>
            <p>Projects</p>
          </div>
        </div>
      </div>
    </div>

    <section id="collections">
      <div class="container py-4">
        <h2 class="mt-4">Project Collections</h2>
        <p class="lead">
          {{ localConfig.description }}
        </p>
        <b-card-group
          deck
          v-for="(batch, index) in batchedCollections"
          :key="index">
          <collection-card
            v-for="collection in batch"
            v-if="collection"
            :key="collection.id"
            :collection="collection">
          </collection-card>
          <div class="card invisible" v-else></div>
        </b-card-group>
      </div>
    </section>

    <section
      id="top-users"
      class="bg-white">
      <div class="container py-4">
        <div class="row">
          <div class="col-lg-5 mx-auto pt-2 text-center">
            <h3 class="text-uppercase font-weight-bold">
              Most Active Volunteers
            </h3>
            <hr class="my-2">
            <p class="text-uppercase lead pb-lg-2">
              To date, our top {{ top10Users.length }} volunteers have made
              {{ top10UsersTaskRuns | intComma }} contributions!
            </p>
            <b-btn
              variant="success"
              size="lg"
              v-scroll-to="'#collections'">
              Get Started
            </b-btn>
          </div>
          <div class="col-lg-5 mx-auto d-none d-lg-block">
            <img
              :src="wreathSrc"
              alt="An image of a wreath"
              class="img-fluid">
            </img>
            <span id="wreath"></span>
          </div>
        </div>
        <div class="row text-center mt-3">
          <div class="col-lg-12 pt-1">
            <ul class="list-unstyled">
              <li
                :key="user.id"
                class="d-inline-block"
                v-for="user in top10Users">
                <div class="text-center mx-1">
                  <nuxt-link
                    :to="{
                      name: 'account-name',
                      params: {
                        name: user.name
                      }
                    }"
                    class="my-1">
                    <div class="my-1">
                      <user-avatar
                        :user="user"
                        tooltip-triggers="hover">
                      </user-avatar>
                    </div>
                  </nuxt-link>
                  <p class="badge badge-info">{{ user.score }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="row text-center mt-2">
          <div class="col-sm-12 col-lg-6 ml-lg-auto">
            <b-btn
              variant="black-underline"
              v-b-modal="leaderboardModalId">
              <icon name="eye"></icon> View the leaderboard
            </b-btn>
          </div>
        </div>
      </div>
    </section>

    <leaderboard-modal
      :top-users="topUsers"
      :modal-id="leaderboardModalId">
    </leaderboard-modal>

  </div>
</template>

<script>
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/television'
import 'vue-awesome/icons/list'
import localConfig from '@/local.config'
import { metaTags } from '@/mixins/metaTags'
import CollectionCard from '@/components/cards/Collection'
import LeaderboardModal from '@/components/modals/Leaderboard'
import UserAvatar from '@/components/avatars/User'
import { batch } from '@/utils/batch'

export default {
  layout: 'default',

  mixins: [ metaTags ],

  data () {
    return {
      title: localConfig.tagline,
      description: localConfig.description,
      localConfig: localConfig,
      leaderboardModalId: 'leaderboard-modal',
      wreathSrc: null
    }
  },

  async asyncData ({ app, error }) {
    return Promise.all([
      app.$axios.$get('/stats'),
      app.$axios.$get('/leaderboard')
    ]).then(([statsData, leaderboardData, categoryData]) => {
      return {
        stats: statsData.stats,
        topUsers: leaderboardData.top_users,
        top10Users: leaderboardData.top_users.slice(0, 10)
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    LeaderboardModal,
    UserAvatar,
    CollectionCard
  },

  computed: {
    top10UsersTaskRuns () {
      const scores = this.top10Users.map((user) => user.score)
      return scores.reduce(function (acc, val) {
        return acc + val
      }, 0)
    },

    batchedCollections () {
      return batch(this.$store.state.publishedCollections, 2, null)
    }
  },

  mounted () {
    this.$modernizr.on('webp', (result) => {
      if (result) {
        this.wreathSrc = require('~/assets/img/wreath.webp')
      } else {
        this.wreathSrc = require('~/assets/img/wreath.png')
      }
    })
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

#index {

  #site-tagline {
    font-weight: 600px;
    font-size: 1.75rem;
    letter-spacing: 0.5px;
    margin: 0;
  }

  #app-hero {
    height: 500px;
    width: auto;
    overflow: hidden;
    position: relative;
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;

    .container {
      color: $white;
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }
  }

  .bg-white {
    background-color: $white;
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
    color: $gray-1000;
  }

  #collections {
    background-color: $gray-100;
  }

  .stat-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .stat-circle {
    position: relative;
    margin: 2em 4em;
    width: 6em;
    height: 6em;
    border-radius: 50%;
    border: 4px solid rgba($white, 0.8);
    border-bottom-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;

    &:nth-child(1) {
      border-color: rgba($green, 0.8);
      border-bottom-color: transparent;
    }

    &:nth-child(2) {
      border-color: rgba($blue, 0.8);
      border-bottom-color: transparent;
    }

    &:nth-child(3) {
      border-color: rgba($orange, 0.8);
      border-bottom-color: transparent;
    }

    .stat {
      font-size: $font-size-lg;
      font-weight: 600;
    }

    svg {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }

    p {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      text-align: center;
      letter-spacing: 0.5px;
      font-size: $font-size-sm;
      text-transform: uppercase;
      bottom: -1.75rem;

      // Fix for centering overflowing text
      &:before {
        content: "";
        margin-left: -100px;
      }

      &:after {
        content: "";
        margin-right: -100px;
      }
    }
  }
}
</style>
