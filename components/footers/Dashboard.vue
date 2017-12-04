<template>
  <footer id="dashboard-footer" class="footer">
    <div class="container-fluid">
      <ul class="list-inline my-2 d-flex flex-row align-items-center">
        <li
          v-if="localConfig.twitter"
          class="list-inline-item mx-1">
          <a
            :href="`https://twitter.com/${localConfig.twitter}`"
            class="text-muted">
            <icon name="twitter"></icon>
          </a>
        </li>
        <li
          v-if="localConfig.email"
          class="list-inline-item mx-1">
          <a :href="`mailto:${localConfig.email}`" class="text-muted">
            <icon name="envelope"></icon>
          </a>
        </li>
        <li
          v-if="localConfig.github"
          class="list-inline-item mx-1">
          <a :href="localConfig.github" class="text-muted">
            <icon name="github"></icon>
          </a>
        </li>
      </ul>
      <p v-html="copyright" class="my-2 mx-1 float-right text-muted"></p>
    </div>
  </footer>
</template>

<script>
import localConfig from '@/local.config'
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/envelope'

export default {
  data () {
    return {
      localConfig: localConfig,
      copyright: `&copy; ${localConfig.company}, ${new Date().getFullYear()}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/style/settings';

#dashboard-footer {
  background: $white;
  font-size: $font-size-sm;
  border-top: 1px solid $gray-300;

  .container-fluid {
    display: flex;
    justify-content: space-between;

    ul > li > a {
      display: flex;
    }
  }
}
</style>
