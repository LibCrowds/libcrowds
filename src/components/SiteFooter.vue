<template>
  <footer id="site-footer" class="footer">
    <div class="container">
      
      <section>
        <router-link :to="{ path: '/' }">
          <p class="brand-link">
            {{ siteConfig.name }} is part of the LibCrowds crowdsourcing platform
          </p>
        </router-link>
        <li class="list-inline-item" v-html="copyright"></li>
      </section>
      
      <section class="my-3 my-md-0">
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
      
      <ul class="list-inline">
        <li class="list-inline-item mx-2">
          <a :href="twitterUrl">
            <icon name="twitter"></icon>
          </a>
        </li>
        <li class="list-inline-item mx-2">
          <a :href="mailto">
            <icon name="envelope"></icon>
         </a>
        </li>
        <li class="list-inline-item mx-2">
          <a :href="githubUrl">
            <icon name="github"></icon>
         </a>
        </li>
      </ul>
      
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
      siteConfig: this.$store.state.siteConfig,
      twitterUrl: `https://twitter.com/${config.contact.twitter}`,
      mailto: `mailto:${config.contact.email}`,
      copyright: `&copy; ${config.company}, ${new Date().getFullYear()}`,
      githubUrl: config.githubUrl
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

#site-footer.footer {
  padding-top: 2rem;
  padding-bottom: 2rem;
  background-color: darken($gray-dark, 5%);
  letter-spacing: 0.8px;
  color: $gray-light;
  font-size: $font-size-sm;
  
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    
    @include media-breakpoint-up(md) {
      align-items: baseline;
      flex-direction: row;
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
}
</style>
