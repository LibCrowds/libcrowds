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
import pybossaApi from '@/api/pybossa'
import capitalize from '@/utils/capitalize'

export default {
  data: function () {
    return {
      tasks: [],
      messageBus: new Vue()
    }
  },

  props: {
    project: {
      type: Object,
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
        submit: 'Save'
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
     * Load the next set of tasks.
     *
     * Always keep between 10 and 20 in the queue.
     */
    loadTasks () {
      if (this.tasks.length > 10) {
        return
      }
      const endpoint = `/api/project/${this.project.id}/newtask`
      let q = 'limit=20'
      if (this.tasks.length) {
        const lastTask = this.tasks[this.tasks.length - 1]
        q += `&last_id=${lastTask.id}`
      }
      const url = `${endpoint}?${q}`
      pybossaApi.get(url).then(r => {
        this.tasks = Array.isArray(r.data) ? r.data : [r.data]
      })
    },

    /**
     * Remove a task from the queue by ID.
     * @param {String|Number} id
     *   The task ID.
     */
    removeTask (id) {
      const idx = this.tasks.map((task) => { return task.id }).indexOf(id)
      if (idx > -1) {
        this.tasks.splice(idx, 1)
      }
    },

    /**
     * Handle the task liked event.
     * @param {Object} task
     *   The task.
     */
    onTaskLiked (task) {
      if (task.liked) {
        pybossaApi.post(`/api/favorites`, { task_id: task.id }).then(() => {
          this.messageBus.$emit('success', 'Task liked')
        })
      } else {
        pybossaApi.delete(`/api/favorites/${task.id}`).then(() => {
          this.messageBus.$emit('success', 'Task unliked!')
        })
      }
    },

    /**
     * Handle the submit event.
     * @param {Object} taskData
     *   The task data returned from LibCrowds Viewer.
     */
    onSubmit (taskData) {
      const taskrun = JSON.stringify({
        'project_id': this.project.id,
        'task_id': taskData.id,
        'info': taskData.annotations
      })
      pybossaApi.post(`/api/taskrun`, taskrun).then(r => {
        this.removeTask(taskData.id)
        this.loadTasks()
        this.messageBus.$emit('success', 'Answer saved, thanks!')
      })
    }
  },

  created () {
    this.loadTasks()
  }
}
</script>

<style lang="scss">
.libcrowds-viewer-presenter {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 9999999;
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
