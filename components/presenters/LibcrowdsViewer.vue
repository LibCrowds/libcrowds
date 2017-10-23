<template>
  <div class="libcrowds-viewer-presenter">

    <libcrowds-viewer
      :confirm-on-submit="false"
      :buttons="buttons"
      :task-opts="taskOpts"
      :navigation="navigation"
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
import capitalize from 'capitalize'

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    tasks: {
      type: Array,
      required: true
    },
    collection: {
      type: Object,
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
    },
    navigation () {
      const names = ['home', 'about', 'contribute', 'data']
      const nav = names.map(name => {
        return {
          label: capitalize(name),
          url: this.$router.resolve({
            name: `collection-shortname-${name}`,
            params: {
              key: this.collection.short_name
            }
          }).href
        }
      })
      nav[0].label = this.collection.name
      nav[0].brand = true
      if (this.collection.info.forum) {
        nav.splice(3, 0, {
          label: 'Discuss',
          url: this.collection.info.forum
        })
      }
      return nav
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
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1040;
  background-color: #000;
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
