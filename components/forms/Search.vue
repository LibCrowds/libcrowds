<template>
  <b-form :class="darkMode ? 'form-dark' : null">
    <b-form-input
      v-model="value"
      class="search-control"
      size="sm"
      :placeholder="placeholder">
    </b-form-input>
  </b-form>
</template>

<script>
export default {
  props: {
    value: {
      required: true
    },
    placeholder: {
      type: String,
      required: true
    }
  }
}
</script>
