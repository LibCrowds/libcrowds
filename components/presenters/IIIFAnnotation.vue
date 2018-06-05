<template>
  <div class="iiif-annotation-presenter">

    <libcrowds-viewer
      v-if="showViewer"
      :task-opts="taskOpts"
      :sidebar-buttons="sidebarButtons"
      :toolbar-buttons="toolbarButtons"
      :browsable="false"
      :confirm-on-submit="false"
      :selections-editable="false"
      :before-submit="checkSubmission"
      disable-modals
      @submit="onSubmit"
      @toolbarbtnclick="onToolbarBtnClick">
      <b-btn
        v-if="extraTagLink.length"
        slot="footer"
        size="sm"
        variant="link"
        @click="$emit('tags')">
        {{ extraTagLink }}
      </b-btn>
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
  props: {
    project: {
      type: Object,
      required: true
    },
    collection: {
      type: Object,
      required: true
    },
    task: {
      type: Object,
      required: true
    },
    projectTemplate: {
      type: Object,
      required: true,
      validator: this.projectTemplateIsValid
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    taskOpts () {
      const opts = Object.assign(this.projectTemplate.task, this.task.info)

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
      opts.id = this.task.id

      // LibCrowds viewer currently requires an Array of options
      return [opts]
    },

    sidebarButtons () {
      return {
        note: marked(this.collection.info.presenter_options.note_button),
        submit: marked(this.collection.info.presenter_options.submit_button)
      }
    },

    extraTagLink () {
      return this.collection.info.presenter_options.extra_tag_link
    },

    toolbarButtons () {
      return {
        browse: false,
        'share-alt': 'Share',
        'tags': 'Add Tags'
      }
    },

    showViewer () {
      return (
        this.projectTemplateIsValid(this.projectTemplate) &&
        this.taskOpts.length
      )
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
      } else if (key === 'help') {
        this.$emit('help')
      } else if (key === 'info') {
        this.$emit('info')
      } else if (key === 'tags') {
        this.$emit('tags')
      }
    },

    /**
     * Check if a project template is valid.
     * @param {Object} tmpl
     *   The project template.
     */
    projectTemplateIsValid (tmpl) {
      return (
        tmpl.hasOwnProperty('task') &&
        tmpl.task.hasOwnProperty('mode') &&
        tmpl.task.hasOwnProperty('objective') &&
        tmpl.task.hasOwnProperty('guidance')
      )
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
        }).catch(err => {
          if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
            this.$nuxt.error(err)
          }
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
