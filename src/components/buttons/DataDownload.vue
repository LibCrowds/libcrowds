<template>
  <b-btn
    class="mx-1"
    size="sm"
    variant="outline-success"
    @click="download()">
    <slot></slot>
  </b-btn>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import FileSaver from 'file-saver'

export default {
  props: [
    'projectShortName',
    'type',
    'format'
  ],

  methods: {
    download () {
      pybossaApi.get(`/project/${this.projectShortName}/tasks/export`, {
        responseType: 'arraybuffer',
        params: {
          type: this.type,
          format: this.format
        }
      }).then(res => {
        const blob = new Blob([res.data], {type: 'application/zip'})
        const fn = `${this.projectShortName}_${this.type}_${this.format}.zip`
        FileSaver.saveAs(blob, fn)
      })
    }
  }
}
</script>
