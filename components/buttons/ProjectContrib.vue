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
    :variant="variant"
    :disabled="disabled">
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
          'can_contribute',
          'cannot_contribute'
        ]
        return valid.indexOf(value) > -1
      }
    }
  },

  computed: {
    disabled: function () {
      return this.status !== 'can_contribute'
    }
  }
}
</script>
