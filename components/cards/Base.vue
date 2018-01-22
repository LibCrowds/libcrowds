<template>
  <b-card class="card-base" no-body>
    <b-row
      slot="header"
      class="mb-0 d-flex align-items-center">
      <b-col>
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            {{ description }}
          </small>
        </p>
      </b-col>
      <b-col xs="12" md="6" class="my-1 my-md-0" v-if="$slots.controls">
        <slot name="controls"></slot>
      </b-col>
    </b-row>

    <template v-if="$slots.guidance">
      <b-card-body>
        <slot name="guidance"></slot>
        <p v-if="localConfig.docs" class="mb-0">
          <small>
            See the
            <a :href="localConfig.docs" target="_blank">full documentation</a>
            for further guidance.
          </small>
        </p>
      </b-card-body>
      <hr>
    </template>

    <slot></slot>

  </b-card>
</template>

<script>
import localConfig from '@/local.config'

export default {
  data () {
    return {
      localConfig: localConfig
    }
  },

  props: {
    title: {
      type: String,
      default: null
    },
    description: {
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