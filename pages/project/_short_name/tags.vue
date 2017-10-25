<template>
  <b-card>
    <div slot="header">
      <h6 class="mb-1">Tags</h6>
      <p class="text-muted mb-0">
        <small>
          Tags can be used to filter and organise projects.
        </small>
      </p>
    </div>

    <div
      v-for="tag in tags"
      :key="tag.type"
      class="mb-2">
      <label>{{ tag.type }}</label>
      <multiselect
        label="name"
        track-by="name"
        v-model="selectedValues[`tag:${tag.short_type}`]"
        placeholder="Select one"
        :show-labels="false"
        :options="tag.options">
      </multiselect>
    </div>

    <div slot="footer" class="d-flex flex-row">
      <b-btn
        class="ml-auto"
        variant="success"
        @click="submit">
        Update
      </b-btn>
    </div>

  </b-card>
</template>

<script>
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { tags } from '@/mixins/tags'
import { notifications } from '@/mixins/notifications'

export default {
  layout: 'project-dashboard',

  mixins: [ fetchProjectAndCollection, tags, notifications ],

  data () {
    return {
      selectedValues: {}
    }
  },

  head () {
    return {
      title: 'Tags'
    }
  },

  computed: {
    project () {
      return this.$store.state.project
    }
  },

  methods: {
    /**
     * Update the project's tags.
     */
    async submit () {
      for (let key in this.selectedValues) {
        this.project.info[key] = this.selectedValues[key].name
      }
      try {
        await this.$axios.$put(`/api/project/${this.project.id}`, {
          info: this.project.info
        })
      } catch (err) {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
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
