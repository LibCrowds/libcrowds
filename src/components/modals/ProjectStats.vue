<template>
  <b-modal :id="modalId" title="Project Stats" @shown="fetchData">

    <loading
      v-if="loading"
      text="Loading statistics">
    </loading>

    {{ stats }}

  </b-modal>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      loading: true,
      stats: {}
    }
  },

  components: {
    Loading
  },

  props: {
    modalId: {
      type: String,
      required: true
    },
    project: {
      type: Object,
      required: true
    }
  },

  methods: {
    fetchData () {
      pybossaApi.get(`/project/${this.project.short_name}/stats`).then(r => {
        this.loading = false
        this.stats = r.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
