<template>
  <div class="libcrowds-viewer-presenter">

    <libcrowds-viewer
      v-if="taskOpts.length"
      :confirm-on-submit="false"
      :buttons="buttons"
      :task-opts="taskOpts"
      :browsable="false"
      :selections-editable="false"
      :before-submit="checkSubmission"
      show-help-on-mount
      @submit="onSubmit"
      @taskliked="onTaskLiked"
      @taskchange="onTaskChange">

      <div slot="share">
        <span v-html="shareText"></span>
        <b-input-group-button class="mb-2" slot="right">
          <b-form-input
            id="share-input"
            v-if="viewerShareUrl"
            readonly
            :value="viewerShareUrl">
          </b-form-input>
          <b-btn variant="primary">Copy to Clipboard</b-btn>
        </b-input-group-button>
        <p class="mb-1 text-uppercase text-center">
          <small>
            <span v-if="viewerShareUrl">
              Or
            </span>
            share this project
          </small>
        </p>
        <social-media-buttons
          class="text-center"
          :tweet="project.description"
          :shareUrl="shareUrl">
        </social-media-buttons>
      </div>

      <span slot="help" v-html="help"></span>

    </libcrowds-viewer>
  </div>
</template>

<script>
import marked from 'marked'
import pluralize from 'pluralize'
import isEmpty from 'lodash/isEmpty'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import { computeShareUrl } from '@/mixins/computeShareUrl'

export default {
  mixins: [
    computeShareUrl
  ],

  data () {
    return {
      viewerShareUrl: null
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
    },
    tasks: {
      type: Array,
      required: true
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    shareText () {
      return marked(this.collection.info.presenter_options.share_text)
    },

    taskOpts () {
      return this.tasks.map((task) => {
        let opts = task.info
        opts.id = task.id
        opts.manifest = opts.info // Fix for LibCrowds Viewer < 4.0.0

        if (!isEmpty(this.currentUser) && task.fav_user_ids) {
          opts.liked = task.fav_user_ids.indexOf(this.currentUser.id) > -1
        }

        return opts
      })
    },

    buttons () {
      let buttons = {
        note: marked(this.collection.info.presenter_options.note_button),
        submit: marked(this.collection.info.presenter_options.submit_button)
      }
      if (isEmpty(this.currentUser)) {
        buttons.like = false
      }
      return buttons
    },

    help () {
      const help = this.project.info.help || ''
      return marked(help)
    }
  },

  components: {
    SocialMediaButtons
  },

  methods: {
    /**
     * Handle the task liked event.
     * @param {Object} taskData
     *   The task data.
     */
    onTaskLiked (taskData) {
      this.$emit('taskliked', taskData.id, taskData.liked)
    },

    /**
     * Handle the task changed event.
     * @param {Object} oldTask
     *   The old task.
     * @param {Object} newTask
     *   The new task.
     */
    onTaskChange (oldTask, newTask) {
      const tasks = this.tasks.filter(task => {
        return task.id === newTask.id
      })
      if (tasks.length === 1 && tasks[0].info.shareUrl) {
        this.viewerShareUrl = tasks[0].info.shareUrl
      } else {
        this.viewerShareUrl = null
      }
      console.log('share url', this.viewerShareUrl)
    },

    /**
     * Submit an answer.
     * @param {Object} taskData
     *   The task data.
     */
    onSubmit (taskData) {
      this.$emit('submit', this.project.id, taskData.id, taskData.annotations)
    },

    /**
     * Check the submission before processing.
     *
     * This can be used, for example, to make sure we have n annotations.
     */
    checkSubmission (taskData) {
      const nAnnotations = taskData.annotations.filter(annotation => {
        return annotation.purpose !== 'commenting'
      }).length
      const mode = taskData.mode
      const tag = taskData.tag
      const nRequired = this.project.info.annotations_required || 1

      const showConfirm = (htmlMessage) => {
        return new Promise((resolve, reject) => {
          this.$swal({
            title: 'Are you sure?',
            html: htmlMessage,
            type: 'question',
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: 'Yes, save and continue',
            cancelButtonText: 'No, go back'
          }).then(result => {
            if (result.value) {
              resolve()
            } else if (result.dismiss) {
              reject(new Error('Submission cancelled'))
            }
            resolve()
          })
        })
      }

      return new Promise((resolve, reject) => {
        if (mode === 'select' && nAnnotations < nRequired) {
          return showConfirm(
            `Each image usually contains at least ${nRequired}
            ${pluralize(tag, nRequired)}.
            <br>
            You have outlined ${nAnnotations}.<br>
            Are you sure you want to save this answer?`
          ).then(() => {
            resolve()
          }).catch(err => {
            console.info(err)
          })
        } else if (mode === 'transcribe' && nAnnotations < 1) {
          return showConfirm(
            `You have not added any transcriptions.<br>
            Are you sure you want to submit this answer?`
          ).then(() => {
            resolve()
          }).catch(err => {
            console.info(err)
          })
        } else {
          resolve()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.libcrowds-viewer-presenter {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .lv-sidebar-footer {
    p {
      margin-bottom: 0;
    }
  }

  // Remove after https://github.com/LibCrowds/libcrowds-viewer/issues/284
  .lv-modal .lv-modal-body svg {
    margin: 0;
  }
}
</style>
