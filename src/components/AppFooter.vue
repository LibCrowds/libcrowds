<template>
  <footer id="app-footer" class="footer">
    <div class="container pt-3 pb-2">

      <section>
        <a
          :href="config.footer.url"
          v-if="config.footer">
          {{ config.footer.text }}
        </a>
        <p v-html="copyright" class="my-2"></p>
        <ul class="list-inline mt-2 mb-0">
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

      <section class="hidden-md-down">
        <h5 class="list-title">Contribute</h5>
        <ul class="list-unstyled">
          <li class="list-item">
            <router-link :to="{ name: 'projects' }">
              Projects
            </router-link>
          </li>
        </ul>
      </section>

      <section class="hidden-md-down">
        <h5 class="list-title">Analysis</h5>
        <ul class="list-unstyled">
          <li class="list-item">
            <router-link :to="{ name: 'results' }">
              Results
            </router-link>
          </li>
          <li class="list-item">
            <router-link :to="{ name: 'statistics' }">
              Statistics
            </router-link>
          </li>
          <li class="list-item">
            <router-link :to="{ name: 'data' }">
              Data
            </router-link>
          </li>
        </ul>
      </section>

      <section class="hidden-md-down">
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
