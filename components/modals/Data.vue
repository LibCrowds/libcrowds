<template>
  <b-modal :id="modalId" title="Download">
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
          @click="download(data.item.type, data.item.format)">
          Download
        </b-btn>
      </template>
    </b-table>

  </b-modal>
</template>

<script>
import pybossa from '@/api/pybossa'
import exportFile from '@/utils/exportFile'

export default {
  data: function () {
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
    /**
     * Download the data.
     * @param {String} type
     *   The download type.
     * @param {String} format
     *   The download format.
     */
    download (type, format) {
      pybossa.exportData(this.project.short_name, type, format).then(r => {
        exportFile(r.data, `${this.project.short_name}_${type}`, format)
      })
    }
  }
}
</script>
