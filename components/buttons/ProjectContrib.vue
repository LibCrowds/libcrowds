<template>
  <b-btn
    :to="{
      name: 'collection-key-presenter',
      params: {
        key: collection.key,
        shortname: project.shortname
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
    },
    status: {
      type: String,
      default: 'can_contribute',
      validator: value => {
        const valid = [
          'completed',
          'can_contribute',
          'cannot_contribute'
        ]
        return valid.indexOf(value) > -1
      }
    }
  },

  computed: {
    disabled () {
      return this.status !== 'can_contribute'
    }
  }
}
</script>
