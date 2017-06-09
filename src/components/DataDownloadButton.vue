<template>
  <b-btn
    class="mx-1"
    size="sm"
    variant="outline-success"
    @click="download()">
    {{ btnText }}
  </b-btn>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import FileSaver from 'file-saver'

export default {
  data: function () {
    return {
      btnText: `Download ${this.format.toUpperCase()}`
    }
  },

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
        const fn = `${this.projectShortName}_${this.type}.zip`
        FileSaver.saveAs(blob, fn)
      })
    }
  }
}
</script>
