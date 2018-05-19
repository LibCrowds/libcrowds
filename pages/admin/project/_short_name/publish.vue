<template>
  <card-base
    :title="title"
    :description="description"
    docs="/projects/publish/">

    <p slot="guidance">
      Projects will be published automatically following generation. However,
      just in case something goes wrong with the process this page is provided
      to manually publish the project.
    </p>
    <hr class="my-1">

    <b-card-body v-if="project && project.published">
      <b-alert show variant="success">
        This project is already published!
      </b-alert>
    </b-card-body>
    <b-card-body v-else-if="canPublish">
      <p>
        Once a project is published it will appear publically and volunteers
        will be able to contribute.
      </p>
      <p>
        Projects cannot be unpublished, so you should make sure that the
        project is configured correctly before continuing.
      </p>
      <p class="mb-0">
        If the project was generated from a template then it should be safe to
        go ahead.
      </p>
    </b-card-body>
    <b-card-body v-else>
      <b-alert show variant="warning">
        You cannot publish this project as it doesn't have any tasks yet.
        If you created the project via the interface please try deleting and
        recreating it.
      </b-alert>
    </b-card-body>
    <b-card-footer>
      <div class="d-flex">
        <b-btn
          variant="success"
          class="ml-auto"
          :disabled="!canPublish"
          @click="publish">
          Publish
        </b-btn>
      </div>
    </b-card-footer>

  </card-base>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import { fetchProjectByName } from '@/mixins/fetchProjectByName'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectByName, metaTags ],

  data () {
    return {
      title: 'Publish',
      description: 'Publish the project.'
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/project/${params.short_name}`
    return app.$axios.$get(endpoint).then(data => {
      return {
        nTasks: data.project.n_tasks
      }
    }).catch(err => {
      error(err)
    })
  },

  computed: {
    project () {
      return this.$store.state.currentProject
    },

    canPublish () {
      return (
        !isEmpty(this.project) &&
        !this.project.published &&
        this.nTasks > 0
      )
    }
  },

  components: {
    CardBase
  },

  methods: {
    /**
     * Publish the project.
     */
    publish () {
      this.$swal({
        title: `Confirm`,
        text: 'Are you sure you want to publish this project?',
        type: 'question',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const endpoint = `/project/${this.project.short_name}/publish`
          return this.$axios.$get(endpoint).then(data => {
            return this.$axios.$post(endpoint, {
              csrf: data.csrf
            })
          })
        }
      }).then(result => {
        if (result) {
          this.$notifications.flash(result)
          this.$router.push({
            name: 'admin-project-short_name-details',
            params: {
              short_name: this.project.short_name
            }
          })
        }
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    }
  }
}
</script>
