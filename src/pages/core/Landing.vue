<template>
  <div id="landing">
    <basic-layout>

      <transition appear>
        <div id="app-hero">
          <div class="header-container text-center">
            <p id="site-tagline">{{ siteConfig.tagline }}</p>
          </div>
        </div>
      </transition>

      <section id="contribute" class="bg-faded">
        <div class="container py-4">
          <div class="card-deck">
            <collection-card
              v-for="(config, key) in collectionConfigs"
              :key="key"
              :collection-config="config"
              :collection-name="key">
            </collection-card>
          </div>
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
import CollectionCard from '@/components/collection/Card'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import LeaderboardModal from '@/components/modals/Leaderboard'
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
    CollectionCard
  },

  computed: {
    topUsersTaskRuns: function () {
      const scores = this.topUsers.map((user) => user.score)
      const sum = scores.reduce(function (acc, val) {
        return acc + val
      }, 0)
      return getNumberWithCommas(sum)
    },
    collectionConfigs: function () {
      const configs = {}
      for (const key of this.siteConfig.collections) {
        configs[key] = require(`../../settings/collections/${key}/config`)
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
    top: 175px;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;

    h1#brand {
      position: relative;
      margin: 0;
      padding: 1.5rem 2.75rem;
      letter-spacing: 1.15px;
      font-size: 2rem;
      font-family: $font-family-base;
      font-weight: 400;
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

    #site-tagline {
      margin-top: 10px;
      font-size: $font-size-sm;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
  }

  #app-hero {
    height: 500px;
    top: 50px;
    width: auto;
    overflow: hidden;
    position: relative;
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('../../assets/img/app-background.jpg');
  }

  project-cards {
    display: inline-block;
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

  .section-header {
    position: relative;
    text-align: center;

    h2 {
      margin: 0;
      line-height: 0.5;
      font-size: $font-size-lg;
      font-family: $font-family-base;
      text-transform: uppercase;
    }

    &:before,
    &:after {
      content: "";
      position: absolute;
      height: 3px;
      top: 0;
      width: 100px;
    }

    &:before {
      right: 100%;
      margin-right: 15px;
    }

    &:after {
      left: 100%;
      margin-left: 15px;
    }
  }

  #top-users {
    color: $gray-dark;
  }
}
</style>
