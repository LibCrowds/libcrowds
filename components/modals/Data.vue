<template>
  <b-modal title="Download" v-model="show">
    <b-table
      responsive
      striped
      hover
      show-empty
      :items="items"
      :fields="fields">
      <template slot="action" scope="data">
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
      },
      items: [
        { dataset: 'Tasks', type: 'task', format: 'csv' },
        { dataset: 'Tasks', type: 'task', format: 'json' },
        { dataset: 'Task Runs', type: 'task_run', format: 'csv' },
        { dataset: 'Task Runs', type: 'task_run', format: 'json' },
        { dataset: 'Results', type: 'result', format: 'csv' },
        { dataset: 'Results', type: 'result', format: 'json' }
      ]
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: false
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
      const sn = this.project.short_name
      if (this.$ga) {
        this.$ga.event({
          eventCategory: 'Downloads',
          eventAction: `${type}_${format}`,
          eventLabel: this.project.name,
          eventValue: 1
        })
      }
      this.$axios.$get(`/project/${sn}/tasks/export`, {
        responseType: 'arraybuffer',
        params: {
          type: type,
          format: format
        }
      }).then(data => {
        this.exportFile(data, `${this.project.short_name}_${type}`, 'zip')
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
