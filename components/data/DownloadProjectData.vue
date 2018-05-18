<template>
  <b-dropdown
    :text="btnText"
    :variant="btnVariant"
    :size="btnSize">
    <b-dropdown-item-button
      v-for="item in items"
      :key="item.dataset"
      @click="download(item.type, 'json')">
      {{ item.dataset }} JSON
    </b-dropdown-item-button>
    <b-dropdown-divider class="my-1"></b-dropdown-divider>
    <b-dropdown-item-button
      v-for="item in items"
      :key="item.dataset"
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
      ]
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
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>