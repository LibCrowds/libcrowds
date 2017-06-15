<template>
  <nav id="core-menu">

    <b-link class="nav-brand" to="/"><h1>{{ config.brand }}</h1></b-link>

    <b-list-group>
      <b-list-group-item active>Home</b-list-group-item>
      <b-list-group-item to="#">
        Projects
      </b-list-group-item>
      <b-list-group-item to="#">
        Statistics
      </b-list-group-item>
      <b-list-group-item to="#">
        Data
      </b-list-group-item>
    </b-list-group>

    <div id="sidebar-icons">
      <a :href="config.githubUrl" target="_blank">
        <icon name="github"></icon>
      </a>
      <a :href="twitterUrl" target="_blank">
        <icon name="twitter"></icon>
      </a>
    </div>

  </nav>
</template>
<script>
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/twitter'
import config from '@/config'

export default {
  data: function () {
    return {
      config: config
    }
  },

  computed: {
    twitterUrl () {
      return `https://twitter.com/${config.contact.twitter}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

#core-menu {
  background-color: rgba($black, 0.85);
  display: flex;
  overflow-y: auto;

  .nav-brand {
    color: $white;
    margin-bottom: 0;
  }

  .list-group {
    .list-group-item {
      color: $white;
      border: none;
      background: transparent;

      &.active {
        color: $brand-primary;
      }
    }
  }

  #sidebar-icons {
    margin-bottom: 1rem;

    a {
      margin: 0.5rem;
      color: white;
    }
  }

  @include media-breakpoint-up(md) {
    align-items: center;
    flex-direction: column;
    width: 350px;
    border-right: 1px solid $gray;
    justify-content: space-between;

    .nav-brand {
      margin-top: 6rem;
    }

    .list-group {

      .list-group-item {
        justify-content: center;
        line-height: 1.5;
        font-size: 2rem;
      }
    }
  }
}

#company-logo {
  height: 100px;
}
</style>
