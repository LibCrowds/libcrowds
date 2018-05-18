<template>
  <b-dropdown
    :text="btnText"
    :variant="btnVariant"
    :size="btnSize"
    :disabled="processing">
    <b-dropdown-item-button
      v-for="item in items"
      :key="item.type + 'json'"
      @click="download(item.type, 'json')">
      {{ item.dataset }} JSON
    </b-dropdown-item-button>
    <b-dropdown-divider class="my-1"></b-dropdown-divider>
    <b-dropdown-item-button
      v-for="item in items"
      :key="item.type + 'csv'"
      @click="download(item.type, 'csv')">
      {{ item.dataset }} CSV
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
import { exportFile } from '@/mixins/exportFile'

export default {
  mixins: [ exportFile ],

  data () {
    return {
      items: [
        { dataset: 'Tasks', type: 'task' },
        { dataset: 'Contributions', type: 'task_run' },
        { dataset: 'Results', type: 'result' }
      ],
      processing: false
    }
  },

  props: {
    project: {
      type: Object,
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
    endpoint () {
      return `/project/${this.project.short_name}/tasks/export`
    }
  },

  methods: {
    /**
     * Download the data.
     *
     * The <b-dropdown-item-button> tag does not support href attributes,
     * so let's keep the old method of re-exporting the downloaded file
     * for now. If memory usage becomes an issue we might want to have
     * another look at this.
     * @param {String} type
     *   The download type.
     * @param {String} format
     *   The download format.
     */
    download (type, format) {
      this.processing = true
      if (this.$ga) {
        this.$ga.event({
          eventCategory: 'Downloads',
          eventAction: `${type}_${format}`,
          eventLabel: this.project.name,
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
        this.exportFile(data, `${this.project.short_name}_${type}`, 'zip')
        this.processing = false
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>