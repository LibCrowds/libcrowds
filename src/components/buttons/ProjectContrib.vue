<template>
  <b-btn
    :to="{
      name: 'collection-presenter',
      params: {
        shortname: shortname
      }
    }"
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
      default: 'md'
    },
    variant: {
      type: String,
      default: 'success'
    }
  }
}
</script>
