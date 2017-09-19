<template>
  <div id="presenter">
    <component
      :is="presenter"
      v-if="project"
      :project="project"
      :currentUser="currentUser"
      :collectionConfig="collectionConfig">
    </component>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import LibcrowdsViewerPresenter from '@/components/presenters/LibcrowdsViewer'
import Z3950Presenter from '@/components/presenters/Z3950'
import DefaultPresenter from '@/components/presenters/Default'

export default {
  data: function () {
    return {
      project: null,
      title: '',
      description: '',
      navItems: [
        {
          id: 'back-to-contribute',
          text: 'Back',
          route: {
            name: 'collection-contribute',
            params: {
              collectionname: this.collectionConfig.key
            }
          }
        }
      ]
    }
  },

  metaInfo () {
    return {
      title: this.title,
      meta: [
        {
          name: 'description',
          content: this.description
        }
      ]
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  },

  computed: {
    presenter: function () {
      const presenters = {
        'libcrowds-viewer': LibcrowdsViewerPresenter,
        'z3950': Z3950Presenter,
        default: DefaultPresenter
      }
      return this.collectionConfig.presenter
        ? presenters[this.collectionConfig.presenter]
        : presenters.default
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.project = data.project
      this.title = this.project.name
      this.description = this.project.description
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`/project/${to.params.shortname}/`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    pybossaApi.get(`/project/${to.params.shortname}/`).then(r => {
      this.setData(r.data)
      next()
    })
  },

  mounted () {
    this.$emit('navupdated', this.navItems)
  }
}
</script>
