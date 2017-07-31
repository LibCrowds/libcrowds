<template>
  <div id="data-download">

    <b-dropdown
      right
      text="Download"
      size="sm"
      variant="outline-success">
      <b-dropdown-item @click="download('task', 'csv')">
        Tasks CSV
      </b-dropdown-item>
      <b-dropdown-item @click="download('task', 'json')">
        Tasks JSON
      </b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item @click="download('task_run', 'csv')">
        Task Runs CSV
      </b-dropdown-item>
      <b-dropdown-item @click="download('task_run', 'json')">
        Task Runs JSON
      </b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item @click="download('result', 'csv')">
        Results CSV
      </b-dropdown-item>
      <b-dropdown-item @click="download('result', 'json')">
        Results JSON
      </b-dropdown-item>
    </b-dropdown>

  </div>
</template>

<script>
import FileSaver from 'file-saver'
import pybossaApi from '@/api/pybossa'

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Download the data.
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
