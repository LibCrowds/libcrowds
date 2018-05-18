<template>
  <b-btn
    :variant="btnVariant"
    :size="btnSize"
    :disabled="processing"
    :href="downloadLink"
    download
    @click="trackEvent">
    {{ btnText }}
  </b-btn>
</template>

<script>
import localConfig from '@/local.config'

export default {
  data () {
    return {
      processing: false
    }
  },

  props: {
    containerIri: {
      type: String,
      required: true
    },
    scope: {
      type: String,
      required: true
    },
    btnText: {
      type: String,
      default: 'Download'
    },
    btnVariant: {
      type: String,
      default: 'success'
    },
    btnSize: {
      type: String,
      default: 'sm'
    }
  },

  computed: {
    downloadLink () {
      const baseURL = localConfig.explicates.baseURL
      const parts = this.containerIri.split('/')
      const collectionId = parts[parts.length - 2]
      return `${baseURL}/export/${collectionId}/?zip=1`
    }
  },

  methods: {
    /**
     * Track Google Analytics event.
     */
    trackEvent () {
      if (this.$ga) {
        this.$ga.event({
          eventCategory: 'Downloads',
          eventAction: `${this.scope}-annotations_json`,
          eventLabel: this.iri,
          eventValue: 1
        })
      }
    }
  }
}
</script>