<template>
  <b-btn
    :to="{
      name: 'collection-presenter',
      params: {
        shortname: shortname
      }
    }"
    :block="block"
    :size="size"
    :variant="variant">
    Contribute
  </b-btn>
</template>

<script>
export default {
  props: {
    shortname: {
      type: String,
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
          'draft',
          'publish',
          'can_contribute',
          'cannot_contribute'
        ]
        return value in valid
      }
    }
  }
}
</script>
