<template>
  <nav id="core-menu">  

    <b-link class="nav-brand" to="/"><h1>{{ config.brand }}</h1></b-link>
    
    <b-list-group>
      <b-list-group-item active>Home</b-list-group-item>
      <b-list-group-item to="#">
        Playbills
      </b-list-group-item>
      <b-list-group-item to="#">
        Convert-a-Card
      </b-list-group-item>
    </b-list-group>
  
    <div id="sidebar-icons">
      <b-link to="/"><icon name="github"></icon></b-link>
      <b-link to="/"><icon name="twitter"></icon></b-link>
    </div>
  
  </nav>
</template>
<script>
import config from '@/config'
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/twitter'

export default {
  data: function () {
    return {
      config: config
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

#core-menu {
  display: flex;
  
  .nav-brand {
    color: $white;
  }
  
  .list-group {
    .list-group-item {
      color: $white;
      border: none;
      background: transparent;
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
        line-height: 2;
        font-size: 2rem;
      }
    }
  }
}

#company-logo {
  height: 100px;
}
</style>
