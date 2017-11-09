<template>
  <b-card>
    <div slot="header">
      <h6 class="mb-1">{{ title }}</h6>
      <p class="text-muted mb-0">
        <small>
          Tags can be used to filter and organise projects (the available tags
          for a collection are set via the Admin interface).
        </small>
      </p>
    </div>

    <span v-if="hasTags">
      <div
        v-for="tag in collection.info.tags"
        :key="tag"
        class="mb-2">
        <label>{{ tag | capitalize }}</label>
        <b-form-input
          type="text"
          v-model="project.info.tags[tag]">
        </b-form-input>
      </div>
    </span>

    <p v-else class="lead my-2 text-center">
      No tags have been enabled for this collection.
    </p>

    <div slot="footer" class="d-flex flex-row">
      <b-btn
        class="ml-auto"
        variant="success"
        :disabled="processing"
        @click="submit">
        Update
      </b-btn>
    </div>

  </b-card>
</template>

<script>
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { notifications } from '@/mixins/notifications'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection, notifications ],

  middleware: 'is-admin',

  data () {
    return {
      title: 'Tags',
      processing: false
    }
  },

  head () {
    return {
      title: this.title
    }
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    project () {
      if (!this.$store.state.currentProject.info.tags) {
        this.$store.state.currentProject.info.tags = {}
      }
      return this.$store.state.currentProject
    },

    hasTags () {
      return this.collection.info.tags && this.collection.info.tags.length > 0
    }
  },

  methods: {
    /**
     * Update the project's tags.
     */
    async submit () {
      this.processing = true
      try {
        await this.$axios.$put(`/api/project/${this.project.id}`, {
          info: this.project.info
        })
      } catch (err) {
        this.$nuxt.error(err)
      } finally {
        this.processing = false
      }
      this.notify({
        type: 'success',
        title: 'Success',
        message: 'Tags updated'
      })
    }
  }
}
</script>
