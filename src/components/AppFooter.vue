<template>
  <footer id="app-footer" class="footer invert-navbar">
    <div class="container">

      <section>
        <router-link :to="{ path: '/' }">
          <p class="brand-link">
            Part of the LibCrowds crowdsourcing platform
          </p>
        </router-link>
        <p v-html="copyright"></p>
        <ul class="list-inline">
          <li class="list-inline-item m-0">
            <a :href="twitterUrl">
              <icon name="twitter"></icon>
            </a>
          </li>
          <li class="list-inline-item mx-3">
            <a :href="mailto">
              <icon name="envelope"></icon>
           </a>
          </li>
          <li class="list-inline-item m-0">
            <a :href="config.githubUrl">
              <icon name="github"></icon>
           </a>
          </li>
        </ul>
      </section>

      <section class="hidden-md-down">
        <h5 class="list-title">Sites</h5>
        <ul class="list-unstyled">
          <li class="list-item" v-for="site in config.sites">
            <router-link :to="{ name: 'landing' }">
              {{ site.name }}
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
  padding-top: 2rem;
  padding-bottom: 2rem;
  background-color: darken($gray-dark, 5%);
  letter-spacing: 0.8px;
  color: $gray-light;
  font-size: $font-size-sm;

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
    text-transform: uppercase;
    font-size: $font-size-sm;
  }

  ul {
    margin: 0;
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
