<template>
  <component
    :is="presenter"
    :project="project"
    :collection="collection"
    :tasks="tasks"
    :options="presenterOptions"
    @submit="onSubmit"
    @taskliked="onTaskLiked">
  </component>
</template>

<script>
import { collectionMetaTags } from '@/mixins/collectionMetaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import isEmpty from 'lodash/isEmpty'
import LibcrowdsViewerPresenter from '@/components/presenters/LibcrowdsViewer'
import Z3950Presenter from '@/components/presenters/Z3950'

export default {
  layout ({ params, store }) {
    const layouts = {
      'libcrowds-viewer': 'collection-fullscreen-dark',
      'z3950': 'collection-tabs'
    }
    return layouts[params.presenter] || 'collection-tabs'
  },

  mixins: [ notifications, fetchCollectionByName, collectionMetaTags ],

  data () {
    return {
      tasks: []
    }
  },

  async asyncData ({ params, app, error }) {
    return app.$axios.$get(`/api/project/${params.id}`).then(data => {
      return {
        project: data
      }
    }).catch(err => {
      error(err)
    })
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    title () {
      return this.project.name
    },

    description () {
      return this.project.description
    },

    presenter () {
      const presenters = {
        'libcrowds-viewer': LibcrowdsViewerPresenter,
        'z3950': Z3950Presenter
      }
      return presenters[this.collection.info.presenter]
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    presenterOptions () {
      return this.collection.info.presenter_options || {}
    }
  },

  methods: {
    /**
     * Load the next set of tasks.
     */
    loadTask () {
      const url = `/api/project/${this.project.id}/newtask`
      this.$axios.$get(url).then(data => {
        if (isEmpty(data)) {
          this.handleCompletion()
        } else {
          this.tasks = Array.isArray(data) ? data : [data]
        }
      }).catch(err => {
        this.$nuxt.error(err)
      })
    },

    /**
     * Handle no tasks remaining.
     */
    handleCompletion () {
      const projectComplete = this.project.overall_progress === 100
      let html = `You have contributed to all available tasks for ` +
                 `<em>${this.project.name}</em>`
      if (projectComplete) {
        html = `<em>${this.project.name}</em> is now complete`
      }
      this.$swal({
        title: 'Thank you!',
        html: html,
        type: 'success'
      })
      this.$router.push({
        name: 'collection-short_name-projects',
        params: {
          short_name: this.collection.short_name
        }
      })
    },

    /**
     * Handle the task liked event.
     * @param {String|Number} id
     *   The task ID.
     * @param {Boolean} liked
     *   True for task liked, false otherwise.
     */
    onTaskLiked (taskId, liked) {
      if (liked) {
        this.axios.$post('/api/favorite', {
          params: {
            task_id: taskId
          }
        }).then(() => {
          this.notifySuccess({ message: 'Removed from favourites' })
        }).catch(err => {
          this.$nuxt.error(err)
        })
      } else {
        this.$axios.$delete(`/api/favorite/${taskId}`).then(() => {
          this.notifySuccess({ message: 'Added to favourites' })
        }).catch(err => {
          this.$nuxt.error(err)
        })
      }
    },

    /**
     * Show notifications depending on user progress.
     */
    trackUserProgress () {
      const url = `/api/project/${this.project.short_name}/userprogress`
      const signinUrl = this.$router.resolve({
        name: 'account-signin',
        query: {
          next: this.$route.path
        }
      }).href
      const signupUrl = this.$router.resolve({
        name: 'account-register',
        query: {
          next: this.$route.path
        }
      }).href

      this.$axios.$get(url).then((data) => {
        if (data.done === 5 && isEmpty(this.currentUser)) {
          this.$swal({
            type: 'info',
            title: 'Thank you!',
            html: `Your answer has been saved.
              <br>
              Did you know that you can also
              <a href="${signupUrl}">sign up</a> or
              <a href="${signinUrl}">sign in</a>
              to track your contributions?`
          })
        } else if (data.done === 1) {
          this.$swal({
            type: 'success',
            title: 'Thank you!',
            html: 'Your contribution has been saved successfully and will ' +
                  'directly help enable future research.'
          })
        } else {
          this.notifyAnswerSaved()
        }
      })
    },

    /**
     * Handle the submit event.
     * @param {String|Number} projectId
     *   The project ID.
     * @param {String|Number} taskId
     *   The task ID.
     * @param {Object} answer
     *   The answer data.
     */
    onSubmit (projectId, taskId, answer) {
      const taskrun = JSON.stringify({
        'project_id': projectId,
        'task_id': taskId,
        'info': answer
      })
      this.$axios.$post(`/api/taskrun`, taskrun).then(data => {
        this.loadTask()
        this.trackUserProgress()
        if (this.$ga) {
          this.$ga.event({
            eventCategory: 'Contributions',
            eventAction: this.project.name,
            eventLabel: this.collection.name,
            eventValue: 1
          })
        }
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  },

  mounted () {
    this.loadTask()
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', [])
  }
}
</script>
