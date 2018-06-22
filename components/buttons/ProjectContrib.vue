<template>
  <b-btn
    :to="{
      name: 'collection-short_name-projects-id-presenter',
      params: {
        short_name: collection.short_name,
        id: project.id,
        presenter: collection.info.presenter
      }
    }"
    :block="block"
    :size="size"
    :variant="variant"
    :disabled="disabled">
    Contribute
  </b-btn>
</template>

<script>
export default {
  props: {
    collection: {
      type: Object,
      required: true
    },
    project: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'success'
    },
    block: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    disabled () {
      return this.project.hasOwnProperty('stats')
        ? Number(this.project.stats.overall_progress) >= 100
        : false
    }
  }
}
</script>
