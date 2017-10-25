<template>
  <b-card>
    <div slot="header">
      <h6 class="mb-1">Tags</h6>
      <p class="text-muted mb-0">
        <small>
          Manage the tags used for filtering and organising projects.
        </small>
      </p>

      <div
        v-for="tag in tags"
        :key="tag.type"
        class="mb-2">
        <label>{{ tag.type }}</label>
        <multiselect
          label="name"
          :placeholder="`Filter by ${tag.type.toLowerCase()}`"
          :show-labels="false"
          :multiple="true"
          :options="tag.options">
        </multiselect>
      </div>

    </div>
  </b-card>
</template>

<script>
import { asyncLoadProject } from '@/mixins/asyncLoadProject'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { tags } from '@/mixins/tags'

export default {
  layout: 'project-dashboard',

  mixins: [ asyncLoadProject, fetchCollectionByName, tags ],

  head () {
    return {
      title: `${this.project.name}: Tags`
    }
  },

  computed: {
    collection () {
      return this.$store.state.collection
    }
  }
}
</script>
