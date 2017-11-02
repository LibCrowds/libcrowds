<template>
  <div class="libcrowds-viewer-presenter">

    <libcrowds-viewer
      :confirm-on-submit="false"
      :buttons="buttons"
      :task-opts="taskOpts"
      :browsable="false"
      :selections-editable="false"
      show-help-on-mount
      @submit="onSubmit"
      @taskliked="onTaskLiked">
    </libcrowds-viewer>

  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'

export default {
  props: {
    project: {
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

    taskOpts () {
      return this.tasks.map((task) => {
        let opts = task.info
        opts.id = task.id
        if (!isEmpty(this.currentUser) && task.fav_user_ids) {
          opts.liked = task.fav_user_ids.indexOf(this.currentUser.id) > -1
        }
        opts.shareText = 'Copy the link to bookmark, share on social media ' +
          ' or [discuss this playbill on our forum]' +
          '(https://community.libcrowds.com/d/11-spotted-on-in-the-spotlight).'
        return opts
      })
    },

    buttons () {
      let buttons = {
        note: 'Seen something interesting?<br>Add a note',
        submit: 'Save and Continue'
      }
      if (isEmpty(this.currentUser)) {
        buttons.like = false
      }
      return buttons
    }
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
     * Submit an answer.
     * @param {Object} taskData
     *   The task data.
     */
    onSubmit (taskData) {
      this.$emit('submit', this.project.id, taskData.id, taskData.annotations)
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

  img {
    display: block;
    margin: 2rem auto;
    max-height: 200px;
    max-width: 100%;
  }
}
</style>
