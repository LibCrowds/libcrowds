<template>
  <footer id="app-footer" class="footer invert-navbar">
    <div class="container py-3">

      <section>
        <a
          :href="platform.url"
          class="brand-link my-2"
          v-if="config.platform">
          Part of the {{ config.platform.name }} crowdsourcing platform
        </a>
        <p v-html="copyright" class="my-2"></p>
        <ul class="list-inline my-2">
          <li class="list-inline-item m-0">
            <a :href="twitterUrl" class="text-muted">
              <icon name="twitter"></icon>
            </a>
          </li>
          <li class="list-inline-item mx-3">
            <a :href="mailto" class="text-muted">
              <icon name="envelope"></icon>
           </a>
          </li>
          <li class="list-inline-item m-0">
            <a :href="config.githubUrl" class="text-muted">
              <icon name="github"></icon>
           </a>
          </li>
        </ul>
      </section>

      <section class="hidden-md-down my-2">
        <h5 class="list-title">Help</h5>
        <ul class="list-unstyled">
          <li class="list-item">
            <router-link :to="{ name: 'tos' }">
              Terms
            </router-link>
          </li>
          <li class="list-item">
            <router-link :to="{ name: 'privacy' }">
              Privacy
            </router-link>
          </li>
          <li class="list-item">
            <router-link :to="{ name: 'cookies' }">
              Cookies
            </router-link>
          </li>
          <li class="list-item">
            <router-link :to="{ name: 'api' }">
              API
            </router-link>
          </li>
        </ul>
      </section>

    </div>
  </footer>
</template>

<script>
import config from '@/config'
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/envelope'

export default {
  data: function () {
    return {
      config: config,
      twitterUrl: `https://twitter.com/${config.contact.twitter}`,
      mailto: `mailto:${config.contact.email}`,
      copyright: `&copy; ${config.company}, ${new Date().getFullYear()}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars';
@import '~bootstrap/scss/bootstrap';

#app-footer.footer {
  background-color: darken($gray-dark, 5%);
  letter-spacing: 0.8px;
  color: $gray-light;
  font-size: $font-size-sm;
  line-height: 2;

  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;

      @include media-breakpoint-up(lg) {
        flex-direction: row;
        text-align: left;
      }
  }

  .list-title {
    margin-bottom: 1em;
    text-transform: uppercase;
    font-size: $font-size-sm;
  }

  a {
    color: $gray-lighter;
  }

  .brand-link {
    font-family: $headings-font-family;
  }

  #bg-img-attribution {
    font-size: $font-size-xs;
  }
}
</style>
