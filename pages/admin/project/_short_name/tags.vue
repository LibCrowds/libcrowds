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

    <span v-if="tags.length">
      <div
        v-for="(tag, index) in tags"
        :key="index"
        class="mb-2">
        <label>{{ tag.type }}</label>
        <multiselect
          label="name"
          track-by="name"
          :id="tag.key"
          placeholder="Select one"
          :show-labels="false"
          v-model="currentTagsModel[tag.key]"
          :options="tag.options"
          @input="onTagChange">
        </multiselect>
      </div>
    </span>

    <p v-else class="lead my-2 text-center">
      No tags have been specified for this collection.
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
import { computeTags } from '@/mixins/computeTags'
import { notifications } from '@/mixins/notifications'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection, computeTags, notifications ],

  middleware: 'is-admin',

  data () {
    return {
      title: 'Tags',
      currentTagsModel: {},
      processing: false
    }
  },

  head () {
    return {
      title: this.title
    }
  },

  computed: {
    project () {
      return this.$store.state.currentProject
    }
  },

  methods: {
    /**
     * Handle a tag being selected or removed.
     * @param {Object} tag
     *   The tag.
     * @param {Object} key
     *   The component ID (which should be the tag key).
     */
    onTagChange (tag, key) {
      if (!tag) {
        delete this.project.info[key]
      } else {
        this.project.info[key] = tag.name
      }
      this.updateCurrentTagsModel()
    },

    /**
     * Update the current tags.
     */
    updateCurrentTagsModel () {
      const updatedTags = {}
      for (let tag of this.tags) {
        updatedTags[tag.key] = tag.options.filter(option => {
          return option.name === this.project.info[tag.key]
        })[0]
      }
      this.currentTagsModel = updatedTags
    },

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
  },

  mounted () {
    this.updateCurrentTagsModel()
  }
}
</script>
