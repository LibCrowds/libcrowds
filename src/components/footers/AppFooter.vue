<template>
  <footer id="collection-footer" class="footer">
    <div class="container pt-3 pb-2">

      <section>
        <router-link
          :to="{ name: 'landing' }"
          @click.native="scrollIfCurrent">
          Part of the {{ siteConfig.brand }} crowdsourcing platform
        </router-link>
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
            <a :href="siteConfig.githubUrl" class="text-muted">
              <icon name="github"></icon>
           </a>
          </li>
        </ul>
      </section>

      <section class="hidden-md-down">
        <h5 class="list-title">Projects</h5>
        <ul class="list-unstyled">
          <li
            v-for="(config, key) in siteConfig.collections"
            :key="key"
            class="list-item">
            <router-link
              :to="{
                name: 'collection-home',
                params: {
                  collectionname: key
                }
              }"
              @click.native="scrollIfCurrent">
              {{ config.name }}
            </router-link>
          </li>
        </ul>
      </section>

      <section class="hidden-md-down">
        <h5 class="list-title">Help</h5>
        <ul class="list-unstyled">
          <li class="list-item">
            <router-link
              :to="{
                name: 'help-tos'
              }"
              @click.native="scrollIfCurrent">
              Terms
            </router-link>
          </li>
          <li class="list-item">
            <router-link
              :to="{
                name: 'help-privacy'
              }"
              @click.native="scrollIfCurrent">
              Privacy
            </router-link>
          </li>
          <li class="list-item">
            <router-link
              :to="{
                name: 'help'
              }"
              @click.native="scrollIfCurrent">
              Cookies
            </router-link>
          </li>
          <li class="list-item">
            <router-link
              :to="{
                name: 'help-api'
              }"
              @click.native="scrollIfCurrent">
              API
            </router-link>
          </li>
        </ul>
      </section>

    </div>
  </footer>
</template>

<script>
import jump from 'jump.js'
import siteConfig from '@/siteConfig'
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/envelope'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      twitterUrl: `https://twitter.com/${siteConfig.contact.twitter}`,
      mailto: `mailto:${siteConfig.contact.email}`,
      copyright: `&copy; ${siteConfig.company}, ${new Date().getFullYear()}`
    }
  },

  methods: {
    scrollIfCurrent: function (evt) {
      if (evt.target.href === window.location.href) {
        jump('body')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#collection-footer.footer {
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
