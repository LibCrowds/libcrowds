<template>
  <div id="presenter">

    <libcrowds-viewer-presenter
      v-if="presenter === 'libcrowds-viewer'"
      :project="project">
    </libcrowds-viewer-presenter>

    <default-presenter
      v-else
      :project="project">
    </default-presenter>

  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import LibcrowdsViewerPresenter from '@/components/presenters/LibcrowdsViewer'
import DefaultPresenter from '@/components/presenters/Default'

export default {
  data: function () {
    return {
      project: null,
      presenter: this.collectionConfig.presenter
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  components: {
    LibcrowdsViewerPresenter,
    DefaultPresenter
  },

  metaInfo: {
    title: 'Task Presenter'
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.project = data.project
    },

    /**
     * Clear core data.
     */
    clearData () {
      this.project = {}
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`/project/${to.params.shortname}/`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.clearData()
    pybossaApi.get(`/project/${to.params.shortname}/`).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>
