<template>
  <b-card
    no-body
    class="project-card">
    <router-link
      :to="{
        name: 'collection-presenter',
        params: {
          shortname: project.short_name
        }
      }">
      <div class="avatar-wrapper">
        <project-avatar
          :project="project">
        </project-avatar>
      </div>
    </router-link>

    <div class="card-body project-details p-0">
      <div class="card-title mb-0">
        <router-link
          :to="{
            name: 'collection-presenter',
            params: {
              shortname: project.short_name
            }
          }">
          <h4 class="card-title mb-1 px-2 pt-2">
            {{ project.name }}
          </h4>
        </router-link>
        <div>
          <b-btn
            v-b-modal="statsModalId"
            class="project-stats-btn d-none d-lg-block"
            variant="info">
            Stats
            <icon name="bar-chart"></icon>
          </b-btn>
        </div>
      </div>
      <p class="card-text project-description mb-0 px-2 pb-1">
        {{ project.description }}
      </p>

      <div class="progress-container" :id="progressId"></div>

      <div class="card-footer mt-1 px-2 py-1">
        <span class="card-stat text-muted mb-2 mb-lg-0 mt-1 mt-lg-0">
          {{ project.overall_progress }}% complete
        </span>
        <span class="card-stat text-muted mb-2 mb-lg-0">
          <icon name="tasks"></icon> {{ project.n_tasks | intComma }}
          {{ collectionConfig.terminology.task | pluralize(project.n_tasks) }}
        </span>
        <span class="card-stat text-muted mb-2 mb-lg-0">
          <icon name="users"></icon> {{ project.n_volunteers | intComma }}
          {{ 'volunteer' | pluralize(project.n_volunteers) }}
        </span>
        <div class="footer-buttons">
          <b-btn
            block
            v-b-modal="statsModalId"
            class="d-lg-none mb-1"
            variant="info">
            Stats
          </b-btn>
          <project-contrib-button
            block
            :shortname="project.short_name"
            variant="success">
          </project-contrib-button>
        </div>
      </div>
    </div>

    <project-stats-modal
      :project="project"
      :collectionConfig="collectionConfig"
      :modalId="statsModalId">
    </project-stats-modal>

  </b-card>
</template>

<script>
import 'vue-awesome/icons/bar-chart'
import ProgressBar from 'progressbar.js'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/tasks'
import ProjectAvatar from '@/components/avatars/Project'
import ProjectContribButton from '@/components/buttons/ProjectContrib'
import ProjectStatsModal from '@/components/modals/ProjectStats'

export default {
  data: function () {
    return {
      progressId: `progress-${this.project.short_name}`,
      statsModalId: `project-stats-modal-${this.project.id}`
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    },
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  components: {
    ProjectStatsModal,
    ProjectContribButton,
    ProjectAvatar
  },

  mounted () {
    const bar = new ProgressBar.Line(`#${this.progressId}`, {
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
    bar.animate(this.project.overall_progress / 100)
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/main';

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
        background-color: $white;

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
    font-size: 0.75rem;
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
    font-size: 0.75rem;
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
}
</style>
