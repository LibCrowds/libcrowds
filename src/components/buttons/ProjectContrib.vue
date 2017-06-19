<template>
  <b-btn
    :to="{
      name: 'presenter',
      params: {
        shortname: shortname
      }
    }"
    :size="size"
    variant="outline-success">
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
    }
  }
}
</script>
