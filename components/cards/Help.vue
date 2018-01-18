<template>
  <b-card class="help-card" no-body>
    <b-card-body>

      <slot></slot>

      <p v-if="localConfig.docs">
        See the
        <a :href="localConfig.docs" target="_blank">full documentation</a>
        for further guidance.
      </p>
    </b-card-body>
  </b-card>
</template>

<script>
import localConfig from '@/local.config'

export default {
  data () {
    return {
      localConfig: localConfig
    }
  }
}
</script>

<style lang="scss">
.help-card {
  border-left: none;
  border-right: none;
  border-top: none;
}
</style>