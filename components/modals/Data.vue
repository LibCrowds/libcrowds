<template>
  <b-modal
    lazy
    :id="modalId"
    :header-text-variant="darkMode ? 'white' : null"
    :header-bg-variant="darkMode ? 'dark' : null"
    :body-bg-variant="darkMode ? 'dark' : null"
    :body-text-variant="darkMode ? 'white' : null"
    :footer-bg-variant="darkMode ? 'dark' : null"
    :footer-text-variant="darkMode ? 'white' : null"
    title="Download">
    <b-table
      responsive
      striped
      hover
      show-empty
      :dark="darkMode"
      :items="items"
      :fields="fields">
      <template slot="action" slot-scope="data">
        <b-btn
          variant="success"
          size="sm"
          block
          @click="download(data.item.type, data.item.format)">
          Download
        </b-btn>
      </template>
    </b-table>
  </b-modal>
</template>

<script>
import { exportFile } from '@/mixins/exportFile'

export default {
  mixins: [ exportFile ],

  data () {
    return {
      fields: {
        dataset: {
          label: 'Dataset'
        },
        format: {
          label: 'Format',
          class: 'text-center',
          formatter: value => {
            return value.toUpperCase()
          }
        },
        action: {
          label: 'Action',
          class: 'text-center'
        }
      }
    }
  },

  props: {
    modalId: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    eventLabel: {
      type: String,
      required: true
    },
    filenamePrefix: {
      type: String,
      required: true
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  },

  methods: {
    /**
     * Download the data.
     * @param {String} type
     *   The download type.
     * @param {String} format
     *   The download format.
     */
    download (type, format) {
      if (this.$ga) {
        this.$ga.event({
          eventCategory: 'Downloads',
          eventAction: `${type}_${format}`,
          eventLabel: this.eventLabel,
          eventValue: 1
        })
      }

      this.$axios.$get(this.endpoint, {
        responseType: 'arraybuffer',
        params: {
          type: type,
          format: format
        }
      }).then(data => {
        this.exportFile(data, `${this.filenamePrefix}_${type}`, 'zip')
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
