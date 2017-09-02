<template>
  <b-card
    no-block
    class="project-card">
    <router-link
      :to="{
        name: 'collection-presenter',
        params: {
          shortname: project.shortname
        }
      }">
      <div class="thumbnail-wrapper">
        <project-thumbnail
          :project="project">
        </project-thumbnail>
      </div>
    </router-link>

    <div class="card-block project-details p-0">
      <div class="card-title mb-0">
        <router-link
          :to="{
            name: 'collection-presenter',
            params: {
              shortname: project.shortname
            }
          }">
          <h4 class="card-title mb-2 px-2 pt-2">
            {{ project.name }}
          </h4>
        </router-link>
      </div>
      <p class="card-text project-description mb-0 px-2 pb-2">
        {{ project.description }}
      </p>

      <div class="progress-container" :id="progressId"></div>

      <div class="card-footer mt-1 p-2">
        <span class="card-stat text-muted mb-2 mb-lg-0">
          {{ project.overall_progress }}% complete
        </span>
        <span class="card-stat text-muted mb-1 mb-lg-0">
          <icon name="users"></icon> {{ project.n_volunteers }} volunteers
        </span>
        <span class="card-stat text-muted mb-2 mb-lg-0">
          <icon name="tasks"></icon> {{ project.n_tasks }} tasks
        </span>
        <div>
          <project-contrib-button
            :shortname="project.short_name"
            variant="success">
          </project-contrib-button>
        </div>
      </div>
    </div>

  </b-card>
</template>

<script>
import ProgressBar from 'progressbar.js'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/tasks'
import ProjectThumbnail from '@/components/project/Thumbnail'
import ProjectContribButton from '@/components/buttons/ProjectContrib'

export default {
  data: function () {
    return {
      progressId: `progress-${this.project.short_name}`
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  components: {
    ProjectContribButton,
    ProjectThumbnail
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

<style lang="scss">
@import 'src/assets/style/main';

.card.project-card {
  text-align: center;
  flex-direction: column;
  overflow-y: hidden;
  margin-bottom: $spacer-y;
  margin-left: auto;
  margin-right: auto;
  max-width: 300px;

  @include media-breakpoint-up(lg) {
    max-width: 100%;
    text-align: left;
    flex-direction: row;
  }

  .card-block {

    .card-title {
      a {
        color: inherit;

        @include hover-focus {
          text-decoration: none;
        }
      }
    }

    .card-footer {
      border-top: none;
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

  .thumbnail-wrapper {
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
    font-size: $font-size-sm;
    display: flex;
    align-items: center;

    svg {
      margin-right: 0.5em;
    }
  }

  .progress-container {
    height: 4px;
    position: relative;
    margin-bottom: 0.5rem;
  }
}
</style>
