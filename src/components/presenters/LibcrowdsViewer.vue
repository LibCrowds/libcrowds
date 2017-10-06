<template>
  <div class="libcrowds-viewer-presenter">

    <libcrowds-viewer
      :confirm-on-submit="false"
      :buttons="buttons"
      :taskOpts="taskOpts"
      :navigation="navigation"
      :message-bus="messageBus"
      :browsable="false"
      :selections-editable="false"
      @submit="onSubmit"
      @taskliked="onTaskLiked">
    </libcrowds-viewer>

  </div>
</template>

<script>
import Vue from 'vue'
import isEmpty from 'lodash/isEmpty'
import capitalize from '@/utils/capitalize'

export default {
  data: function () {
    return {
      messageBus: new Vue()
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    },
    tasks: {
      type: Array,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    },
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  computed: {
    taskOpts: function () {
      return this.tasks.map((task) => {
        let opts = task.info
        opts.id = task.id
        if (!isEmpty(this.currentUser) && task.fav_user_ids) {
          opts.liked = task.fav_user_ids.indexOf(this.currentUser.id) > -1
        }
        return opts
      })
    },
    buttons: function () {
      let buttons = {
        note: 'Seen something interesting?<br>Add a note',
        submit: 'Save and Continue'
      }
      if (isEmpty(this.currentUser)) {
        buttons.like = false
      }
      return buttons
    },
    navigation: function () {
      const names = ['home', 'about', 'contribute', 'data']
      const nav = names.map(name => {
        return {
          label: capitalize(name),
          url: this.$router.resolve({
            name: `collection-${name}`,
            params: {
              collectionname: this.collectionConfig.key
            }
          }).href
        }
      })
      nav[0].label = this.collectionConfig.name
      nav[0].brand = true
      if (this.collectionConfig.forumUrl) {
        nav.splice(3, 0, {
          label: 'Discuss',
          url: this.collectionConfig.forumUrl
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
