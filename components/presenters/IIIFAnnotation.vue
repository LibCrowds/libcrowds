<template>
  <div class="iiif-annotation-presenter">

    <libcrowds-viewer
      v-if="tasks.length && taskOpts.length"
      :task-opts="taskOpts"
      :sidebar-buttons="sidebarButtons"
      :toolbar-buttons="toolbarButtons"
      :browsable="false"
      :confirm-on-submit="false"
      :selections-editable="false"
      :before-submit="checkSubmission"
      show-help-on-mount
      @submit="onSubmit"
      @toolbarbtnclick="onToolbarBtnClick">

      <span slot="help" v-html="help"></span>

    </libcrowds-viewer>

    <p class="mb-0 text-white d-flex align-items-center
      justify-content-center h-100" v-else>
      Loading...
    </p>

  </div>
</template>

<script>
import marked from 'marked'
import pluralize from 'pluralize'

export default {
  data () {
    return {
      taskTmpl: this.projectTemplate.task
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
    },
    projectTemplate: {
      type: Object,
      required: true,
      validator: (value) => {
        return (
          value.hasOwnProperty('task') &&
          value.task.hasOwnProperty('mode') &&
          value.task.hasOwnProperty('objective') &&
          value.task.hasOwnProperty('guidance')
        )
      }
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    taskOpts () {
      return this.tasks.map(task => {
        const opts = Object.assign(this.taskTmpl, task.info)

        // Build the form for transcribe tasks
        if (opts.hasOwnProperty('fields_schema')) {
          opts['form'] = {
            model: opts.fields_schema.reduce((obj, item) => {
              obj[item.model] = ''
              return obj
            }, {}),
            schema: {
              fields: opts.fields_schema
            }
          }
        }

        // Add the task ID
        opts.id = task.id

        return opts
      })
    },

    sidebarButtons () {
      return {
        note: marked(this.collection.info.presenter_options.note_button),
        submit: marked(this.collection.info.presenter_options.submit_button)
      }
    },

    toolbarButtons () {
      return {
        browse: false,
        'share-alt': 'Share'
      }
    },

    help () {
      const help = this.projectTemplate.tutorial || ''
      return marked(help)
    }
  },

  methods: {
    /**
     * Submit an answer.
     * @param {Object} taskData
     *   The task data.
     */
    onSubmit (taskData) {
      this.$emit('submit', this.project.id, taskData.id, taskData.annotations)
    },

    /**
     * Handle a toolbar button click.
     * @param {String} key
     *   The button key
     */
    onToolbarBtnClick (key) {
      if (key === 'share-alt') {
        this.$emit('share')
      }
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
@import '~assets/style/settings';

.iiif-annotation-presenter {
  width: 100%;
  height: 100%;
  background-color: $black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .lv-sidebar {
    color: $gray-100;
  }

  .lv-sidebar-header {
    padding-top: 2rem;
  }

  .lv-sidebar-footer {
    p {
      margin-bottom: 0;
    }
  }

  .lv-modal .lv-modal-body {
    img {
      max-width: 100%;
    }
  }
}
</style>
