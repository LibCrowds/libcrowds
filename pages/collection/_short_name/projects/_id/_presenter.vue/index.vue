<template>
  <component
    :is="presenter"
    :project="currentProject"
    :project-template="currentTemplate"
    :collection="currentCollection"
    :tasks="tasks"
    @submit="onSubmit"
    @taskliked="onTaskLiked">
  </component>
</template>

<script>
import marked from 'marked'
import { projectMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import isEmpty from 'lodash/isEmpty'
import IIIFAnnotationPresenter from '@/components/presenters/IIIFAnnotation'
import Z3950Presenter from '@/components/presenters/Z3950'

export default {
  layout ({ params, store }) {
    return params.presenter === 'iiif-annotation'
      ? 'collection-fullscreen-dark'
      : 'presenter-tabs'
  },

  mixins: [ fetchCollectionByName, projectMetaTags ],

  data () {
    return {
      tasks: []
    }
  },

  fetch ({ params, app, error, store }) {
    return app.$axios.$get('/api/category', {
      params: {
        short_name: params.short_name
      }
    }).then(collectionData => {
      if (!collectionData || collectionData.length !== 1) {
        error({ statusCode: 404 })
        return
      }
      store.dispatch('UPDATE_CURRENT_COLLECTION', collectionData[0])
      return app.$axios.$get('/api/project', {
        params: {
          id: params.id,
          all: 1
        }
      })
    }).then(projectData => {
      if (!projectData || projectData.length !== 1) {
        error({ statusCode: 404 })
        return
      }
      store.dispatch('UPDATE_CURRENT_PROJECT', projectData[0])

      // Load template
      let template = store.state.currentCollection.info.templates.find(t => {
        return t.id === projectData[0].info.template_id
      })
      if (typeof template === 'undefined') {
        error({statusCode: 500, message: 'Invalid project template'})
      } else {
        store.dispatch('UPDATE_CURRENT_TEMPLATE', template)
      }
    }).catch(err => {
      error(err)
    })
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    currentProject () {
      return this.$store.state.currentProject
    },

    currentTemplate () {
      return this.$store.state.currentTemplate
    },

    title () {
      return this.currentProject.name
    },

    description () {
      return this.currentProject.description
    },

    presenter () {
      const presenters = {
        'iiif-annotation': IIIFAnnotationPresenter,
        'z3950': Z3950Presenter
      }
      return presenters[this.currentCollection.info.presenter]
    },

    currentUser () {
      return this.$store.state.currentUser
    }
  },

  methods: {
    /**
     * Load the next set of tasks.
     */
    loadTask () {
      const url = `/api/project/${this.currentProject.id}/newtask`
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
      const msg = this.currentProject.overall_progress === 100
        ? this.currentCollection.info.celebrations.currentProject
        : this.currentCollection.info.celebrations.user
      this.$confetti.start({
        shape: this.currentCollection.info.celebrations.confetti
      })
      this.$swal({
        html: marked(msg)
      }).then(() => {
        this.$confetti.stop()
      }).catch(err => {
        console.debug(err)
        this.$confetti.stop()
      })
      this.$router.push({
        name: 'collection-short_name-projects',
        params: {
          short_name: this.currentCollection.short_name
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
          this.$notifications.success({ message: 'Removed from favourites' })
        }).catch(err => {
          this.$nuxt.error(err)
        })
      } else {
        this.$axios.$delete(`/api/favorite/${taskId}`).then(() => {
          this.$notifications.success({ message: 'Added to favourites' })
        }).catch(err => {
          this.$nuxt.error(err)
        })
      }
    },

    /**
     * Show notifications depending on user progress.
     */
    trackUserProgress () {
      const url = `/api/project/${this.currentProject.short_name}/userprogress`
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
          this.$notifications.answerSaved()
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
            eventAction: this.currentProject.name,
            eventLabel: this.currentCollection.name,
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
