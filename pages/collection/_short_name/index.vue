<template>
  <div id="collection-index">
    <transition appear>
      <b-container class="full-height text-center">
        <div class="header-content">
          <div class="d-flex justify-content-center align-items-center">
            <img
              id="collection-logo"
              v-if="hasLogo"
              class="d-inline-block"
              alt="British Library"
              :src="collection.info.logo">
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
      </b-container>
    </transition>

    <section id="intro" class="opaque-navbar">
      <b-container class="py-3 py-md-4 text-center">
        <p id="site-lead" class="mb-0 px-1">
          {{ collection.description }}
        </p>
        <hr class="my-3 w-75">
        <p class="lead mb-0 px-1">
          Your contributions will have a direct impact on enabling future
          research at {{ localConfig.company }}.
        </p>
        <hr class="mt-3 w-75">
      </b-container>
    </section>

    <section
      v-if="localConfig.flarum.url && collection.info.forum.tag"
      id="social-proof"
      class="opaque-navbar">
      <b-container>
        <b-row>
          <b-col
            xs="12" md="6"
            v-if="collection.info.forum.tag"
            class="pb-3 pb-md-4 d-flex flex-column justify-content-between">
            <span>
              <h5 class="text-center">Recent forum posts</h5>
              <p
                v-if="loadingForumDiscussions"
                class="text-muted text-center">
                <small>
                  Loading...
                </small>
              </p>
              <p
                v-else-if="!forumDiscussions.length"
                class="text-muted text-center">
                <small>
                  No recent forum posts
                </small>
              </p>
              <ul v-else>
                <li
                  v-for="discussion in forumDiscussions"
                  :key="discussion.id"
                  class="list-unstyled mb-1">
                  <h6 class="mb-0">
                    <a :href="getDiscussionUrl(discussion.id)">
                      {{ discussion.attributes.title }}
                    </a>
                  </h6>
                  <p class="text-muted mb-0">
                    <small>
                      Last activity:
                      {{ discussion.attributes.lastTime | moment('calendar') }}
                    </small>
                  </p>
                  <ul class="list-inline text-muted mb-1">
                    <li class="list-inline-item my-1 mr-2">
                      <small class="d-flex align-items-center">
                        <icon name="comment" class="mr-1"></icon>
                        {{ discussion.attributes.commentsCount }}
                        comments
                      </small>
                    </li>
                    <li class="list-inline-item my-1">
                      <small class="d-flex align-items-center">
                        <icon name="users" class="mr-1"></icon>
                        {{ discussion.attributes.participantsCount }}
                        {{ 'participant' | pluralize(discussion.attributes.participantsCount) }}
                      </small>
                    </li>
                  </ul>
                </li>
              </ul>
            </span>
            <span>
              <div class="text-center">
                <b-btn
                  :variant="darkMode ? 'dark' : 'outline-dark'"
                  class="mt-md-2"
                  :href="`${localConfig.flarum.url}/t/${collection.info.forum.tag}`">
                  Visit the forum
                </b-btn>
              </div>
            </span>
          </b-col>
          <b-col
            xs="12" md="6"
            class="pb-3 pb-md-4 d-flex flex-column justify-content-between">
            <span>
              <h5 class="text-center">Recent contributions</h5>
              <p
                v-if="loadingActivityFeed"
                class="text-muted text-center">
                <small>
                  Loading...
                </small>
              </p>
              <p
                v-else-if="!activityFeed.length"
                class="text-muted text-center">
                <small>
                  No recent contributions
                </small>
              </p>
              <ul v-else>
                <li
                  v-for="(item, index) in activityFeed"
                  :key="index"
                  class="list-unstyled">
                  <h6 class="mb-0">
                    {{ item.name }} contributed to
                    <nuxt-link
                      :to="{
                        name: 'collection-short_name-projects-id-presenter',
                        params: {
                          short_name: collection.short_name,
                          id: item.project_id,
                          presenter: collection.info.presenter
                        }
                      }">
                      {{ item.project_name }}
                    </nuxt-link>
                  </h6>
                  <p class="text-muted mt-0 mb-1">
                    <small class="text-muted">
                      {{ item.updated | moment('calendar') }}
                    </small>
                  </p>
                </li>
              </ul>
            </span>
            <span>
              <div class="text-center">
                <b-btn
                  :variant="darkMode ? 'dark' : 'outline-dark'"
                  class="mt-md-2"
                  :to="{
                    name: 'collection-short_name-projects',
                    params: {
                      short_name: collection.short_name
                    }
                  }">
                  Choose a project
                </b-btn>
              </div>
            </span>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section
      id="featured-projects"
      class="opaque-navbar"
      v-if="featured.length">
      <b-container class="w-75 text-center pb-4">
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
          :variant="darkMode ? 'dark' : 'success'"
          size="lg"
          :to="{
            name: 'collection-short_name-projects',
            params: {
              short_name: collection.short_name
            }
          }">
          Browse all projects
        </b-btn>
      </b-container>
    </section>

    <section id="data">
      <b-jumbotron class="code-bg">
        <b-container class="py-2 py-md-4 w-75 text-center">
          <h3 class="display-5">Open Data</h3>
          <p class="lead my-2 my-md-3 text-sm-left">
            All datasets generated from the experimental crowdsourcing
            projects hosted by {{ collection.brand }} are made available under a
            <a
              :href="dataLicenses[collection.info.license].url"
              target="_blank">
              {{ collection.info.license }}
            </a>
            license and can be downloaded by anyone in JSON or
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
        </b-container>
      </b-jumbotron>
    </section>

    <section id="final-cta" class="opaque-navbar">
      <b-container class="pt-4 pb-3 text-center">
        <h3 class="display-5 text-uppercase mb-0">Get Involved</h3>
        <p class="lead my-3">
          Your contributions will have a direct impact on enabling future
          research at {{ localConfig.company }}.
        </p>
        <b-btn
          :variant="darkMode ? 'dark' : 'success'"
          size="lg"
          :to="{
            name: 'collection-short_name-projects',
            params: {
              short_name: collection.short_name
            }
          }">
          Get Started
        </b-btn>
      </b-container>
    </section>

    <section id="social-media" class="opaque-navbar">
      <b-container class="pb-4 text-center">
        <hr class="mt-0 mb-3">
        <social-media-buttons
          :tweet="tweet"
          :shareUrl="shareUrl">
        </social-media-buttons>
      </b-container>
    </section>
  </div>
</template>

<script>
import 'vue-awesome/icons/star'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/comment'
import localConfig from '@/local.config'
import { collectionMetaTags } from '@/mixins/metaTags'
import { licenses } from '@/mixins/licenses'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { computeShareUrl } from '@/mixins/computeShareUrl'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import ProjectCard from '@/components/cards/Project'

export default {
  layout: 'collection-default',

  mixins: [
    fetchCollectionByName,
    computeShareUrl,
    licenses,
    collectionMetaTags
  ],

  data () {
    return {
      localConfig: localConfig,
      featured: [],
      forumDiscussions: [],
      activityFeed: [],
      loadingActivityFeed: true,
      loadingForumDiscussions: true
    }
  },

  methods: {
    /**
     * Load featured projects.
     *
     * If there are no featured projects for this collection then load
     * the three most recently created incomplete projects instead.
     */
    loadFeatured () {
      this.$axios.$get('/api/project', {
        params: {
          category_id: this.collection.id,
          featured: true,
          all: 1,
          stats: 1
        }
      }).then(projectsData => {
        if (!projectsData.length) {
          // Load three most recent by default
          return this.$axios.$get('/api/project', {
            params: {
              category_id: this.collection.id,
              orderby: 'created',
              desc: 1,
              limit: 100,
              all: 1,
              stats: 1
            }
          })
        } else {
          return projectsData
        }
      }).then(projectsData => {
        this.featured = projectsData.filter(project => {
          return Number(project.stats.overall_progress) < 100
        }).slice(0, 3)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    },

    /**
     * Get recent forum posts for the topic linked to this collection.
     *
     * Filters out any stick posts then returns the top five.
     */
    loadForumDiscussions () {
      if (
        !localConfig.flarum ||
        !localConfig.flarum.url ||
        !this.collection.info.forum.tag
      ) {
        this.loadingForumDiscussions = false
        return
      }
      return this.$axios.$get(`${localConfig.flarum.url}/api/discussions`, {
        params: {
          'filter[q]': `tag:${this.collection.info.forum.tag}`
        }
      }).then(response => {
        this.forumDiscussions = response.data.filter(discussion => {
          return !discussion.attributes.isSticky
        }).slice(0, 5)
        this.loadingForumDiscussions = false
      }).catch(err => {
        // This is most likely a CORS issue with the forum endpoint
        if (process.env.NODE_ENV !== 'development') {
          this.$notifications.flash({
            status: 'error',
            message: `Error loading latest forum discussions: ${err.message}`
          })
        }
        this.loadingForumDiscussions = false
        this.forumDiscussions = []
      })
    },

    /**
     * Load recent activity.
     *
     * Returns a summary of user contributions for projects belonging to
     * this collection microsite.
     */
    loadActivityFeed () {
      this.$axios.$get('/account').then(data => {
        this.activityFeed = data.update_feed.map(item => {
          // Convert UNIX timestamps
          item.updated = new Date(item.updated * 1000)
          return item
        }).filter(item => {
          this.loadingActivityFeed = false
          return (
            item.action_updated === 'UserContribution' &&
            item.category_id === this.collection.id
          )
        }).slice(0, 5)
      }).catch(err => {
        this.loadingActivityFeed = false
        this.$notifications.flash({
          status: 'error',
          message: 'Failed to load recent activity'
        })
        console.error(err)
      })
    },

    /**
     * Return the URL for a forum discussion.
     */
    getDiscussionUrl (id) {
      if (localConfig.flarum && localConfig.flarum.url) {
        return `${localConfig.flarum.url}/d/${id}`
      }
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
    },

    description () {
      return this.collection.description
    },

    tweet () {
      return `Come and play ${this.collection.name} and help enable future ` +
        `research.`
    }
  },

  components: {
    SocialMediaButtons,
    ProjectCard
  },

  mounted () {
    this.loadFeatured()
    this.loadForumDiscussions()
    this.loadActivityFeed()
  }
}
</script>

<style lang="scss" scoped>
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

  #social-proof {
    font-family: $headings-font-family;
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

  #intro,
  #final-cta,
  #social-media,
  #social-proof {
    background: $white;
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
      background-attachment: fixed;
      background-position: center;
      background-size: cover;
      margin-bottom: 0;
    }
  }
}

.dark-mode {
  #collection-index {
    #intro,
    #final-cta,
    #social-media,
    #social-proof {
      background: $gray-900;
      color: $gray-200;
    }

    #ribbon {
      background: $gray-900;

      svg {
        color: $gray-200;
      }

      &:after {
        border-color: $gray-900 $gray-900 transparent $gray-900;
      }
    }

    #featured-projects {
      color: $gray-200;
      background-image: url('~/assets/img/dark-wall.png');
      border: 1px solid $gray-900;
    }
  }
}
</style>
