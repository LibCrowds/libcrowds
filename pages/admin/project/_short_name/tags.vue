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
        v-for="(options, tag) in collection.info.tags"
        :key="tag"
        class="mb-2">
        <label>{{ tag | capitalize }}</label>
        <multiselect
          track-by="tag"
          :id="tag"
          placeholder="Select one"
          v-model="project.info.tags[tag]"
          :options="options">
        </multiselect>
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
import isNull from 'lodash/isNull'
import pickBy from 'lodash/pickBy'
import isEmpty from 'lodash/isEmpty'
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
      const project = this.$store.state.currentProject
      project.info.tags = project.info.tags || {}
      return project
    },

    hasTags () {
      return !isEmpty(this.collection.info.tags)
    }
  },

  methods: {
    /**
     * Update the project's tags.
     */
    async submit () {
      this.processing = true

      // Remove null tags
      this.project.info.tags = pickBy(this.project.info.tags, (value, key) => {
        return !isNull(value)
      })

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
