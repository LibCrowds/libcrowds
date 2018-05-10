<template>
  <div class="h-100">

    <!-- Task presenter -->
    <component
      v-if="task"
      :is="presenter"
      :project="currentProject"
      :project-template="currentTemplate"
      :collection="currentCollection"
      :task="task"
      @help="$refs.help.show()"
      @info="$refs.info.show()"
      @share="$refs.share.show()"
      @tags="$refs.tags.show()"
      @submit="onSubmit">
    </component>

    <!-- Share model -->
    <b-modal
      lazy
      ref="share"
      v-if="task"
      title="Share"
      size="lg"
      ok-only
      :header-text-variant="darkPresenterModals ? 'white' : null"
      :header-bg-variant="darkPresenterModals ? 'dark' : null"
      :body-bg-variant="darkPresenterModals ? 'dark' : null"
      :body-text-variant="darkPresenterModals ? 'white' : null"
      :footer-bg-variant="darkPresenterModals ? 'dark' : null"
      :footer-text-variant="darkPresenterModals ? 'white' : null">
      <b-container :id="shareModalId" class="py-2">
        <span v-html="shareText"></span>
        <b-input-group-append class="mb-2 d-flex">
          <b-form-input
            id="share-input"
            readonly
            :value="task.info.link">
          </b-form-input>
          <clipboard-button
            :container-id="shareModalId"
            :content="task.info.link">
          </clipboard-button>
        </b-input-group-append>
        <p class="mb-1 text-uppercase text-center">
          <small>
            <span v-if="task.info.link">
              Or
            </span>
            share this project via
          </small>
        </p>
        <social-media-buttons
          class="text-center"
          :tweet="description"
          :shareUrl="shareUrl">
        </social-media-buttons>
      </b-container>
    </b-modal>

    <!-- Tutorial modal -->
    <b-modal
      show
      lazy
      ref="help"
      title="Tutorial"
      size="lg"
      ok-only
      :header-text-variant="darkPresenterModals ? 'white' : null"
      :header-bg-variant="darkPresenterModals ? 'dark' : null"
      :body-bg-variant="darkPresenterModals ? 'dark' : null"
      :body-text-variant="darkPresenterModals ? 'white' : null"
      :footer-bg-variant="darkPresenterModals ? 'dark' : null"
      :footer-text-variant="darkPresenterModals ? 'white' : null">
      <b-container
        class="py-2 px-3"
        v-html="tutorial">
      </b-container>
    </b-modal>

    <!-- Info modal (currently only for tasks with a manifest, i.e. IIIF) -->
    <b-modal
      show
      lazy
      ref="info"
      title="Info"
      size="lg"
      ok-only
      :header-text-variant="darkPresenterModals ? 'white' : null"
      :header-bg-variant="darkPresenterModals ? 'dark' : null"
      :body-bg-variant="darkPresenterModals ? 'dark' : null"
      :body-text-variant="darkPresenterModals ? 'white' : null"
      :footer-bg-variant="darkPresenterModals ? 'dark' : null"
      :footer-text-variant="darkPresenterModals ? 'white' : null">
      <b-container class="py-2 px-3" v-if="manifest">
        <ul v-if="manifest.metadata" class="list-unstyled">
          <li
            v-for="item in manifest.metadata"
            :key="item.label"
            class="mb-1">
            <strong>{{ item.label }}: </strong>
            <span v-html="item.value"></span>
          </li>
        </ul>
        <div class="text-center">
          <img v-if="manifest.logo" :src="manifest.logo" class="my-2">
          <p v-if="manifest.attribution" v-html="manifest.attribution"></p>
          <a
            v-if="manifest.license"
            :href="manifest.license"
            v-html="manifest.license">
          </a>
        </div>
      </b-container>
      <b-container class="py-2 px-3" v-else>
        <p class="text-center">
          No additional information is available for this task.
        </p>
      </b-container>
    </b-modal>

    <!-- Tags modal -->
    <b-modal
      show
      lazy
      ref="tags"
      title="Tags"
      size="lg"
      ok-only
      :header-text-variant="darkPresenterModals ? 'white' : null"
      :header-bg-variant="darkPresenterModals ? 'dark' : null"
      :body-bg-variant="darkPresenterModals ? 'dark' : null"
      :body-text-variant="darkPresenterModals ? 'white' : null"
      :footer-bg-variant="darkPresenterModals ? 'dark' : null"
      :footer-text-variant="darkPresenterModals ? 'white' : null"
      body-class="overflow-visible">
      <b-container class="py-2 px-3">
        <p>
          Begin typing in the box below to search for existing tags or to add
          your own. The tags will be used to generate shareable albums.
        </p>
        <multiselect
          v-model="selectedTags"
          id="ajax"
          label="name"
          track-by="id"
          placeholder="Type to search"
          open-direction="bottom"
          :options="foundTags"
          :multiple="true"
          :searchable="true"
          :loading="tagSearchLoading"
          :internal-search="false"
          :limit="10"
          :show-no-results="false"
          :hide-selected="true"
          :custom-label="getTagLabel"
          :taggable="true"
          @tag="addTag"
          @search-change="asyncFindTags">
        </multiselect>
      </b-container>
    </b-modal>

  </div>
</template>

<script>
import marked from 'marked'
import { projectMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { hideCookieConsent } from '@/mixins/hideCookieConsent'
import { computeShareUrl } from '@/mixins/computeShareUrl'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import ClipboardButton from '@/components/buttons/Clipboard'
import isEmpty from 'lodash/isEmpty'
import IIIFAnnotationPresenter from '@/components/presenters/IIIFAnnotation'
import Z3950Presenter from '@/components/presenters/Z3950'

export default {
  layout ({ params, store }) {
    return params.presenter === 'iiif-annotation'
      ? 'collection-fullscreen-dark'
      : 'collection-tabs'
  },

  mixins: [
    fetchCollectionByName,
    projectMetaTags,
    hideCookieConsent,
    computeShareUrl
  ],

  data () {
    return {
      task: null,
      manifest: null,
      shareModalId: 'presenter-share-modal',
      tagSearchLoading: false,
      foundTags: [],
      selectedTags: []
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
        template = {}
      }
      store.dispatch('UPDATE_CURRENT_TEMPLATE', template)
    }).catch(err => {
      error(err)
    })
  },

  components: {
    SocialMediaButtons,
    ClipboardButton
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
    },

    shareText () {
      return marked(this.currentCollection.info.presenter_options.share_text)
    },

    darkPresenterModals () {
      const presenter = this.$route.params.presenter
      return this.darkMode || presenter === 'iiif-annotation'
    },

    tutorial () {
      const help = this.currentTemplate.tutorial || ''
      return marked(help)
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
          this.task = null
          this.handleCompletion()
        } else {
          this.task = data
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
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
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
          }).catch(err => {
            if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
              this.$nuxt.error(err)
            }
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
    },

    /**
     * Validate the project template.
     */
    validateTemplate () {
      if (Object.keys(this.currentTemplate).length === 0) {
        this.$notifications.error({
          'message': `Sorry, this project is not linked to a valid template.
            <br>This should be fixed by an administrator.`
        })
        this.$router.push({
          name: 'collection-short_name-projects',
          params: {
            short_name: this.currentCollection.short_name
          }
        })
      }
    },

    /**
     * Search the category for current tags.
     * @param {String} query
     *   The query string.
     */
    asyncFindTags (query) {
      this.tagSearchLoading = true
      const catShortName = this.currentCollection.short_name
      const endpoint = `/lc/categories/${catShortName}/tags`
      this.$axios.$get(endpoint, {
        params: {
          query: query
        }
      }).then(data => {
        this.foundTags = data.tags
        this.tagSearchLoading = false
      })
    },

    /**
     * Get the label to display for a tag.
     * @param {Object} tag
     *   The tag.
     */
    getTagLabel (tag) {
      return tag['body']['value']
    },

    /**
     * Add a new tag.
     * @param {String} value
     *   The tag value.
     */
    addTag (value) {
      const catShortName = this.currentCollection.short_name
      const endpoint = `/lc/categories/${catShortName}/tags/add`
      const type = this.task.info.hasOwnProperty('tileSource')
        ? 'iiif'
        : 'image'
      const target = this.task.info.hasOwnProperty('tileSource')
        ? this.task.info.tileSource
        : this.task.info.url

      this.$axios.$post(endpoint, {
        value: value,
        target: target,
        type: type
      }).then(data => {
        this.$notifications.flash(data)
        if (data.tag) {
          this.selectedTags.push(data.tag)
        }
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  },

  mounted () {
    this.validateTemplate()
    this.loadTask()
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', [])
  },

  watch: {
    task (val) {
      // Load manifest
      if (!val.length || !val.info.hasOwnProperty('manifest')) {
        this.manifest = null
      } else {
        this.$axios.$get(val.info.manifest, {
          headers: {
            'Content-type': 'text/plain' // to avoid CORS preflight
          }
        }).then(data => {
          this.manifest = data
        })
      }

      // Get current tags for the item
      const catShortName = this.currentCollection.short_name
      const endpoint = `/lc/categories/${catShortName}/tags`
      const target = val.info.hasOwnProperty('tileSource')
        ? val.info.tileSource
        : val.info.url
      this.$axios.$get(endpoint, {
        params: {
          target: target
        }
      }).then(data => {
        this.selectedTags = data.tags
      })
    }
  }
}
</script>
