<template>
  <b-card class="card-base" no-body>
    <b-row
      slot="header"
      class="mb-0 d-flex align-items-center">
      <b-col xs="12" md="6">
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            {{ help }}
          </small>
        </p>
      </b-col>
      <b-col class="my-1 my-md-0">
        <slot name="controls"></slot>
      </b-col>
    </b-row>

    <slot></slot>

  </b-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    help: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>
.card-base {
  overflow-x: auto;
}
</style>