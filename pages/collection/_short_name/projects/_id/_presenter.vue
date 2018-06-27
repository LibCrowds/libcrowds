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
      @help="showModal('help')"
      @info="showModal('info')"
      @share="showModal('share')"
      @tags="showModal('tags')"
      @reject="showModal('reject')"
      @submit="submit">
    </component>

    <!-- Tutorial modal -->
    <b-modal
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

    <!-- Share model -->
    <b-modal
      lazy
      v-if="task"
      ref="share"
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
        <span v-html="shareModalText"></span>
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

    <!-- Info modal (currently only for tasks with a manifest, i.e. IIIF) -->
    <b-modal
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
      :footer-text-variant="darkPresenterModals ? 'white' : null"
      @show="loadManifest">
      <b-container class="py-2 px-3" v-if="Object.keys(manifest).length === 0">
        <p class="text-center text-muted">
          No additional information is available for this item.
        </p>
      </b-container>
      <b-container class="py-2 px-3" v-else>
        <ul v-if="manifest.metadata" class="list-unstyled">
          <li
            v-for="item in manifest.metadata"
            :key="item.label"
            class="mb-1">
            <strong>{{ item.label }}: </strong>
            <span v-html="item.value"></span>
          </li>
        </ul>
        <div class="text-center" v-if="manifest.related">
          <b-btn
            v-for="(related, idx) in toArray(manifest.related)" :key="idx"
            class="m-2"
            variant="info"
            :href="related.id || related['@id']">
            {{ related.label }}
          </b-btn>
        </div>
        <div class="text-center">
          <img v-if="manifest.logo"
            :src="manifest.logo" class="my-2">
          <p
            v-if="manifest.attribution"
            v-html="manifest.attribution">
          </p>
          <a
            v-if="manifest.license"
            :href="manifest.license"
            v-html="manifest.license">
          </a>
        </div>
      </b-container>
    </b-modal>

    <!-- Tags modal -->
    <b-modal
      lazy
      v-if="task"
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
      <b-container
        class="py-2 px-3"
        v-if="currentCollection.info.annotations.tags">
        <p>
          The tags added below will help researchers locate items of
          particular interest by being used to generate keywords that can
          be searched via the
          <nuxt-link
            :to="{
              name: 'collection-short_name-browse',
              params: {
                short_name: currentCollection.short_name
              }
            }">
            Browse
          </nuxt-link> page.
        </p>
        <p>
          For programmatic research purposes the data will also be available
          via the API at
          <a :href="currentCollection.info.annotations.tags" target="_blank">
            {{ currentCollection.info.annotations.tags }}
          </a>
        </p>
        <p>
          Tags can be added by anyone but, once confirmed, can only be deleted
          by administrators. If you have spotted a tag that you think is
          incorrect or should be removed for any reason please contact
          <a :href="`mailto:${localConfig.email}`">
            {{ localConfig.email }}.
          </a>
        </p>
        <p>
          By default, a new tag will be added for each word. To create tags
          that comprise multiple words please follow the convention of adding
          a hyphen between words (e.g. my-long-tag).
        </p>
        <p>
          <h6 class="mb-1">Current tags:</h6>
          <item-tags-list
            :container-iri="currentCollection.info.annotations.tags"
            :source-iri="task.info.url"
            :scope-iri="task.info.manifest"
            type="Image">
          </item-tags-list>
        </p>
        <p>
          Begin typing in the box below to add tags.
        </p>
        <Select-tags
          :container-iri="currentCollection.info.annotations.tags"
          :source-iri="task.info.url"
          :scope-iri="task.info.manifest"
          type="Image">
        </select-tags>
      </b-container>
      <b-container class="py-2 px-3" v-else>
        <p>
          Tagging is currently disabled for this collection microsite as the
          link to a suitable place to store the tags has not been configured.
        </p>
        <p>
          To help resolve this, please let us know by contacting
          <a :href="`mailto:${localConfig.email}`">
            {{ localConfig.email }}
          </a>
        </p>
      </b-container>
    </b-modal>

    <!-- Reject model -->
    <b-modal
      lazy
      v-if="task"
      ref="reject"
      title="Reject"
      size="lg"
      @ok="reject"
      :header-text-variant="darkPresenterModals ? 'white' : null"
      :header-bg-variant="darkPresenterModals ? 'dark' : null"
      :body-bg-variant="darkPresenterModals ? 'dark' : null"
      :body-text-variant="darkPresenterModals ? 'white' : null"
      :footer-bg-variant="darkPresenterModals ? 'dark' : null"
      :footer-text-variant="darkPresenterModals ? 'white' : null">
      <b-container class="py-2">
        <span v-html="rejectModalText"></span>
        <b-form-select
          v-model="rejectedReason"
          :options="rejectOptions">
        </b-form-select>
      </b-container>
    </b-modal>

  </div>
</template>

<script>
import marked from 'marked'
import localConfig from '@/local.config'
import { projectMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { hideCookieConsent } from '@/mixins/hideCookieConsent'
import { computeShareUrl } from '@/mixins/computeShareUrl'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import ClipboardButton from '@/components/buttons/Clipboard'
import isEmpty from 'lodash/isEmpty'
import IIIFAnnotationPresenter from '@/components/presenters/IIIFAnnotation'
import Z3950Presenter from '@/components/presenters/Z3950'
import SelectTags from '@/components/data/SelectTags'
import ItemTagsList from '@/components/lists/ItemTags'

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
      manifest: {},
      shareModalId: 'presenter-share-modal',
      tagSearchLoading: false,
      foundTags: [],
      selectedTags: [],
      tutorialShown: false,
      localConfig: localConfig,
      rejectedReason: null
    }
  },

  components: {
    SocialMediaButtons,
    ClipboardButton,
    SelectTags,
    ItemTagsList
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

    shareModalText () {
      return marked(this.currentCollection.info.presenter_options.share_text)
    },

    rejectModalText () {
      const text = this.currentCollection.info.presenter_options.reject_text
      if (typeof text !== 'undefined') {
        return marked(text)
      }
    },

    rejectOptions () {
      let opts = [{
        value: 'invalid-task',
        text: 'Invalid Task'
      }]
      if (Array.isArray(this.currentTemplate.task.reject)) {
        opts = this.currentTemplate.task.reject.map(item => {
          return {
            value: item.replace(/\s+/g, '-').toLowerCase(),
            text: item
          }
        })
      }
      this.rejectedReason = opts[0]['value']
      return opts
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
     * Show a modal, also tracking the event.
     */
    showModal (name) {
      if (this.$ga) {
        this.$ga.event({
          eventCategory: 'Project Toolbar',
          eventAction: `${name}_shown`,
          eventLabel: this.currentCollection.name,
          eventValue: 1
        })
      }
      this.$refs[name].show()
    },

    /**
     * Submit the task.
     * @param {String|Number} projectId
     *   The project ID.
     * @param {String|Number} taskId
     *   The task ID.
     * @param {Object} answer
     *   The answer data.
     */
    submit (projectId, taskId, answer) {
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
     * Reject the task.
     */
    reject () {
      this.submit(this.currentProject.id, this.task.id, {
        reject: this.rejectedReason
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
     * Show tutorial, unless disabled by the current user.
     *
     * For some bizarre reason (or more likely one I haven't figured out yet),
     * this function will cause the modal at the top of this page to be
     * displayed, the refs seem to be ignored! Thought it might be because this
     * is run from the mounted hook but apparently not. So, just keep the
     * tutorial modal at the top of this page for now.
     */
    showInitialTutorial () {
      if (typeof this.currentUser.info === 'undefined' ||
        !this.currentUser.info.hasOwnProperty('hide_tutorials') ||
        this.currentUser.info.hide_tutorials === false
      ) {
        this.$refs.help.show()
      }
    },

    /**
     * Load a manifest into the info modal, if available.
     */
    loadManifest () {
      const currentManifestUri = this.task ? this.task.info.manifest : null
      if (!currentManifestUri) {
        this.manifest = {}
      } else if (
        currentManifestUri === this.manifest['id'] ||
        currentManifestUri === this.manifest['@id']
      ) {
        return
      }

      this.$axios.$get(currentManifestUri, {
        headers: {
          'Content-type': 'text/plain' // to avoid CORS preflight
        }
      }).then(data => {
        this.manifest = data
      })
    },

    /**
     * Return the item in an Array if it is not already.
     * @param {*} item
     *   The item to check for arrayiness.
     */
    toArray (item) {
      return Array.isArray(item) ? item : [item]
    }
  },

  mounted () {
    this.validateTemplate()
    this.loadTask()
    this.showInitialTutorial()
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', [])
  }
}
</script>
