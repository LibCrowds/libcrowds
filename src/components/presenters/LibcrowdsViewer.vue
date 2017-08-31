<template>
  <div class="libcrowds-viewer-presenter">

    <libcrowds-viewer
      :show-related-tasks="true"
      :confirm-on-submit="false"
      :buttons="buttons"
      :taskOpts="taskOpts"
      :navigation="navigation"
      :message-bus="messageBus"
      @submit="onSubmit"
      @taskliked="onTaskLiked">
    </libcrowds-viewer>

  </div>
</template>

<script>
import Vue from 'vue'
import isEmpty from 'lodash/isEmpty'
import pybossaApi from '@/api/pybossa'

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
      return {
        like: !isEmpty(this.currentUser)
      }
    },
    navigation: function () {
      const names = ['home', 'about', 'contribute', 'data']
      const nav = names.map(name => {
        return {
          label: name.charAt(0).toUpperCase() + name.slice(1),
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
     * Load the next 100 tasks.
     */
    loadTasks () {
      const url = `/api/project/${this.project.id}/newtask?limit=100`
      pybossaApi.get(url).then(r => {
        this.tasks = Array.isArray(r.data) ? r.data : [r.data]
      })
    },

    /**
     * Handle the task liked event.
     * @param {Object} task
     *   The task.
     */
    onTaskLiked (task) {
      console.log(task)
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
     * @param {Object} task
     *   The task.
     */
    onSubmit (task) {
      const taskrun = JSON.stringify({
        'project_id': this.project.id,
        'task_id': task.id,
        'info': task.annotations
      })
      pybossaApi.post(`/api/taskrun`, taskrun).then(r => {
        this.messageBus.$emit('success', 'Answer saved, thanks!')
      })
    }
  },

  created () {
    this.loadTasks()
  }
}
</script>

<style>
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
}
</style>
