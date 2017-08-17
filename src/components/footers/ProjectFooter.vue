<template>
  <footer id="project-footer" class="footer">
    <div class="container pt-3 pb-2">

      <section>
        <router-link :to="{ name: 'landing' }">
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
          <li class="list-item">
            <router-link
              :to="{
                name: 'project-contribute',
                params: {
                  projectName: projectConfig.name
                }
              }"
              @click.native="scrollIfCurrent">
              Contribute
            </router-link>
          </li>
        </ul>
      </section>

      <section class="hidden-md-down">
        <h5 class="list-title">Analysis</h5>
        <ul class="list-unstyled">
          <li class="list-item"
            v-if="projectConfig.resultsComponent">
            <router-link
              :to="{
                name: 'project-results',
                params: {
                  projectName: projectConfig.name
                }
              }"
              @click.native="scrollIfCurrent">
              Results
            </router-link>
          </li>
          <li class="list-item">
            <router-link
              :to="{
                name: 'project-statistics',
                params: {
                  projectName: projectConfig.name
                }
              }"
              @click.native="scrollIfCurrent">
              Statistics
            </router-link>
          </li>
          <li class="list-item">
            <router-link
              :to="{
                name: 'project-data',
                params: {
                  projectName: projectConfig.name
                }
              }"
              @click.native="scrollIfCurrent">
              Data
            </router-link>
          </li>
        </ul>
      </section>

      <section class="hidden-md-down">
        <h5 class="list-title">Help</h5>
        <ul class="list-unstyled">
          <li class="list-item">
            <router-link
              :to="{ name: 'tos' }"
              @click.native="scrollIfCurrent">
              Terms
            </router-link>
          </li>
          <li class="list-item">
            <router-link
              :to="{ name: 'privacy' }"
              @click.native="scrollIfCurrent">
              Privacy
            </router-link>
          </li>
          <li class="list-item">
            <router-link
              :to="{ name: 'cookies' }"
              @click.native="scrollIfCurrent">
              Cookies
            </router-link>
          </li>
          <li class="list-item">
            <router-link
              :to="{ name: 'api' }"
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
import siteConfig from '@/settings/siteConfig'
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

  props: {
    projectConfig: {
      type: Object,
      required: true
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

#project-footer.footer {
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
