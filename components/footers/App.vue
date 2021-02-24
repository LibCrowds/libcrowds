<template>
  <footer id="app-footer" :class="darkMode ? 'footer footer-dark' : 'footer'">
    <div class="container pt-3 pb-2">

      <section>
        <nuxt-link
          :to="{ name: 'index' }"
          @click.native="scrollIfCurrent">
          Part of the {{ localConfig.brand }} crowdsourcing platform
        </nuxt-link>
        <p v-html="copyright" class="my-2 text-white"></p>
        <ul class="list-inline mt-2 mb-0">
          <li
            v-if="localConfig.twitter"
            class="list-inline-item mx-1">
            <a
              :href="`https://twitter.com/${localConfig.twitter}`">
              <icon name="twitter"></icon>
              <span class="sr-only">Twitter</span>
            </a>
          </li>
          <li
            v-if="localConfig.email"
            class="list-inline-item mx-1">
            <a :href="`mailto:${localConfig.email}`" >
              <icon name="envelope"></icon>
              <span class="sr-only">Email</span>
           </a>
          </li>
          <li
            v-if="localConfig.github"
            class="list-inline-item mx-1">
            <a :href="localConfig.github">
              <icon name="github"></icon>
              <span class="sr-only">GitHub</span>
            </a>
          </li>
        </ul>
      </section>

      <section class="d-none d-lg-block" v-if="localConfig.footer">
        <p class="list-title text-white" >{{ localConfig.footer.title }}</p>
        <ul class="list-unstyled">
          <li
            v-for="(item, index) in localConfig.footer.items"
            :key="index"
            class="list-item">
            <a :href="item.url" target="_blank">
              {{ item.text }}
            </a>
          </li>
        </ul>
      </section>

      <section class="d-none d-lg-block">
        <p class="list-title text-white">Collections</p>
        <ul class="list-unstyled">
          <li
            v-for="collection in collections.slice(0, 5)"
            :key="collection.id"
            class="list-item">
            <nuxt-link
              :to="{
                name: 'collection-short_name',
                params: {
                  short_name: collection.short_name
                }
              }"
              @click.native="scrollIfCurrent">
              {{ collection.name }}
            </nuxt-link>
          </li>
        </ul>
      </section>

      <section class="d-none d-lg-block">
        <p class="list-title text-white">Help</p>
        <ul class="list-unstyled">
          <li class="list-item" v-if="localConfig.docs">
            <a :href="localConfig.docs" target="_blank">Docs</a>
          </li>
          <li class="list-item">
            <nuxt-link
              :to="{
                name: 'help-tos'
              }"
              @click.native="scrollIfCurrent">
              Terms
            </nuxt-link>
          </li>
          <li class="list-item">
            <nuxt-link
              :to="{
                name: 'help-privacy'
              }"
              @click.native="scrollIfCurrent">
              Privacy
            </nuxt-link>
          </li>
          <li class="list-item">
            <nuxt-link
              :to="{
                name: 'help-cookies'
              }"
              @click.native="scrollIfCurrent">
              Cookies
            </nuxt-link>
          </li>
          <li class="list-item">
            <nuxt-link
              :to="{
                name: 'help-api'
              }"
              @click.native="scrollIfCurrent">
              API
            </nuxt-link>
          </li>
        </ul>
      </section>
    </div>
  </footer>
</template>

<script>
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/envelope'
import localConfig from '@/local.config'

export default {
  data () {
    return {
      localConfig: localConfig,
      copyright: `&copy; ${localConfig.company}, ${new Date().getFullYear()}`
    }
  },

  props: {
    collections: {
      type: Array,
      required: true
    }
  },

  methods: {
    /**
     * Scroll to the top if the link clicked is for the current page.
     * @param {Object} evt
     *   The event.
     */
    scrollIfCurrent (evt) {
      if (process.browser && evt.target.href === window.location.href) {
        const VueScrollTo = require('vue-scrollto')
        VueScrollTo.scrollTo('body')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#app-footer {
  background-color: $gray-1000;
  letter-spacing: 0.8px;
  color: $gray-600;
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
    color: $gray-300;
  }

  .brand-link {
    font-family: $headings-font-family;
  }
}
</style>
