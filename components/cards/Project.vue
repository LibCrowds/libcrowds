<template>
  <b-card
    no-body
    v-if="collection.info.presenter"
    class="project-card"
    :bg-variant="darkMode ? 'dark' : null"
    :text-variant="darkMode ? 'white' : null">
    <nuxt-link
      v-if="projectIncomplete"
      :to="{
        name: 'collection-short_name-projects-id-presenter',
        params: {
          short_name: collection.short_name,
          id: project.id,
          presenter: collection.info.presenter
        }
      }">
      <div class="avatar-wrapper">
        <project-avatar
          :project="project">
        </project-avatar>
      </div>
    </nuxt-link>
    <div v-else class="avatar-wrapper">
      <project-avatar
        :project="project">
      </project-avatar>
    </div>

    <div class="card-body project-details p-0">
      <div class="card-title mb-0">
        <nuxt-link
          v-if="projectIncomplete"
          :to="{
            name: 'collection-short_name-projects-id-presenter',
            params: {
              short_name: collection.short_name,
              id: project.id,
              presenter: collection.info.presenter
            }
          }">
          <h4 class="card-title mb-1 px-2 pt-2">
            {{ project.name }}
          </h4>
        </nuxt-link>
        <h4 v-else class="card-title mb-1 px-2 pt-2">
          {{ project.name }}
        </h4>
        <div v-if="hasStats">
          <b-btn
            v-b-modal="statsModalId"
            class="project-stats-btn d-none d-lg-block"
            :variant="darkMode ? 'dark' : 'info'">
            Stats
            <icon name="bar-chart"></icon>
          </b-btn>
        </div>
      </div>
      <p class="card-text project-description mb-0 px-2 pb-1">
        {{ project.description }}
      </p>
      <div class="mb-0 px-2 pt-1">
        <project-filters-list
          v-if="project.info.filters"
          class="d-none d-md-block"
          :project-filters="project.info.filters"
          :collection="collection"
          @click="onProjectFilterClick">
        </project-filters-list>
      </div>

      <div class="progress-container" :id="progressBarId"></div>

      <div class="card-footer mt-1 px-2 py-1">
        <span
          v-if="hasStats"
          class="card-stat text-muted mb-2 mb-lg-0 mt-lg-0 d-none d-lg-block">
          {{ project.stats.overall_progress }}% complete
        </span>
        <span
          v-if="hasStats"
          class="card-stat text-muted mb-2 mb-lg-0 d-none d-lg-block">
          <icon name="tasks"></icon> {{ project.stats.n_tasks | intComma }}
          {{ 'task' | pluralize(project.stats.n_tasks) }}
        </span>
        <span
          v-if="hasStats"
          class="card-stat text-muted mb-2 mb-lg-0 d-none d-lg-block">
          <icon name="users"></icon>Join {{ project.stats.n_volunteers | intComma }}
          {{ 'volunteer' | pluralize(project.stats.n_volunteers) }}
        </span>
        <div class="footer-buttons my-1 mt-lg-0">
          <b-btn
            block
            v-b-modal="statsModalId"
            class="d-lg-none mb-1"
            :variant="darkMode ? 'dark' : 'info'">
            Stats
          </b-btn>
          <project-contrib-button
            block
            :collection="collection"
            :project="project">
          </project-contrib-button>
        </div>
      </div>
    </div>

    <project-stats-modal
      v-if="hasStats"
      :project="project"
      :collection="collection"
      :modal-id="statsModalId">
    </project-stats-modal>

  </b-card>
</template>

<script>
import 'vue-awesome/icons/bar-chart'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/tasks'
import ProgressBar from 'progressbar.js'
import ProjectAvatar from '@/components/avatars/Project'
import ProjectContribButton from '@/components/buttons/ProjectContrib'
import ProjectStatsModal from '@/components/modals/ProjectStats'
import ProjectFiltersList from '@/components/lists/ProjectFilters'

export default {
  data () {
    return {
      progressBarId: `progress-${this.project.id}`,
      statsModalId: `project-stats-modal-${this.project.id}`
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    },
    collection: {
      type: Object,
      required: true
    }
  },

  components: {
    ProjectStatsModal,
    ProjectContribButton,
    ProjectAvatar,
    ProjectFiltersList
  },

  computed: {
    hasStats () {
      return this.project.hasOwnProperty('stats')
    },

    projectIncomplete () {
      return this.hasStats
        ? this.project.stats.overall_progress < 100
        : 0
    }
  },

  methods: {
    /**
     * Handle a project filters click.
     */
    onProjectFilterClick (type, value) {
      this.$emit('filter', type, value)
    }
  },

  mounted () {
    if (
      process.browser &&
      this.hasStats
    ) {
      const bar = new ProgressBar.Line(`#${this.progressBarId}`, {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: 1400,
        color: '#d0e5d0',
        trailColor: 'rgba(0, 0, 0, 0.125)',
        trailWidth: 0.5,
        svgStyle: {
          width: '100%',
          height: '100%'
        }
      })
      bar.animate(this.project.stats.overall_progress / 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.card.project-card {
  text-align: center;
  flex-direction: column;
  overflow-y: hidden;
  margin-bottom: $spacer;
  margin-left: auto;
  margin-right: auto;
  max-width: 300px;

  @include media-breakpoint-up(lg) {
    max-width: 100%;
    max-height: 250px;
    text-align: left;
    flex-direction: row;
  }

  .card-body {

    @include media-breakpoint-up(lg) {
      flex: 1 1 0%;
    }

    .card-title {
      display: flex;
      font-size: $font-size-lg;

      a {
        width: 100%;
        color: inherit;
        flex: 1 1 auto;
        display: flex;
        justify-content: center;

        @include hover-focus {
          text-decoration: none;
        }

        @include media-breakpoint-up(lg) {
          display: block;
        }
      }
    }

    .card-text {
      font-size: $font-size-sm;
    }

    .card-footer {
      border-top: none;
      background-color: transparent;

      .footer-buttons {
        @include media-breakpoint-down(md) {
          width: 100%;
        }
      }
    }

    &:not(first-child) {
      border-top: $card-border-width solid $card-border-color;

      .card-footer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;

        .btn {
          margin-top: 0;
        }
      }

      @include media-breakpoint-up(lg) {
        display: flex;
        flex-direction: column;
        border-top: none;
        border-left: $card-border-width solid $card-border-color;

        .card-footer {
          flex-direction: row;
        }
      }
    }
  }

  .project-description {
    flex: 1 1 auto;
    overflow-y: auto;
  }

  .avatar-wrapper {
    position: relative;
    overflow: hidden;
    line-height: 0;
    flex-shrink: 2;
    width: auto;
    height: 250px;

    @include media-breakpoint-up(lg) {
      width: 250px;
    }
  }

  .card-stat {
    font-size: $font-size-xs;
    display: flex;
    align-items: center;

    svg {
      margin-right: 0.5em;
    }
  }

  .project-stats-btn {
    display: flex;
    border-left: 1px solid $gray-300;
    border-bottom: 1px solid $gray-300;
    border-top: 0;
    border-right: 0;
    background: $white;
    color: $gray-600;
    font-size: $font-size-xs;
    text-transform: uppercase;

    svg {
      margin-left: 0.5rem;
    }
  }

  .progress-container {
    height: 4px;
    position: relative;
    margin-bottom: 0.5rem;
  }

  &.bg-dark {
    .project-stats-btn {
      color: $white;
      border-color: $black;
      background-color: transparent;
    }
  }

  &.bg-light {
    background-color: $white !important;

    .card-footer {
      background-color: $white;
    }

    .project-stats-btn {
      background-color: $white;
    }
  }
}

.badge-list .badge {
    background-color: #035f59 !important;}
</style>
