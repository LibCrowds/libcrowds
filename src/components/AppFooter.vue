<template>
  <footer id="app-footer" class="footer">
    <div class="container">
      <div class="row d-flex flex-row align-items-center">
          <div class="col-lg-4">
              <ul class="list-inline mb-0 hidden-md-down">
                  <li class="list-inline-item"><a href=""><small>Terms</small></a></li>
                  <li class="ml-2 list-inline-item"><a href=""><small>Privacy</small></a></li>
                  <li class="ml-2 list-inline-item"><a href=""><small>Cookies</small></a></li>
                  <li class="ml-2 list-inline-item"><a href=""><small>Licenses</small></a></li>
              </ul>
          </div>
          <div class="col-sm-12 col-lg-4 py-2 text-center">
              <ul class="list-inline mb-0">
                  <li class="list-inline-item m-0">
                    <a :href="'https://twitter.com/' + config.contact.twitter">
                      <span class="fa fa-twitter m-1 p-0"></span>
                    </a>
                  </li>
                   <li class="list-inline-item m-0">
                     <a :href="'mailto:' + config.contact.email">
                       <span class="fa fa-envelope m-1 p-0"></span>
                     </a>
                  </li>
                   <li class="list-inline-item m-0">
                     <a :href="config.githubUrl">
                       <span class="fa fa-github m-1 p-0"></span>
                     </a>
                  </li>
              </ul>
          </div>
          <div class="col-lg-4">
              <ul class="list-inline mb-0 hidden-md-down text-right">
                  <li class="list-inline-item"><a href=""><small>API</small></a></li>
                  <li class="ml-2 list-inline-item"><small>&copy; {{ config.copyright }}</small></li>
              </ul>
          </div>
      </div>
    </div>
  </footer>
</template>

<script>
import config from '@/config'

export default {
  name: 'app-footer',
  data: function () {
    return {
      config: config,
      sitename: this.$store.state.route.params.sitename,
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ]
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.footer {
  background-color: darken($gray-dark, 5%);
  letter-spacing: 0.8px;
  color: $gray-lighter;

  a {
    color: $gray-lighter;
  }
}
</style>
