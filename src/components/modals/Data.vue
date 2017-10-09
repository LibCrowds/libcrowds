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
import FileSaver from 'file-saver'
import pybossaApi from '@/api/pybossa'

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
      pybossaApi.get(`/project/${this.project.short_name}/tasks/export`, {
        responseType: 'arraybuffer',
        params: {
          type: type,
          format: format
        }
      }).then(res => {
        const blob = new Blob([res.data], {type: 'application/zip'})
        const fn = `${this.project.short_name}_${type}_${format}.zip`
        FileSaver.saveAs(blob, fn)
      })
    }
  }
}
</script>
