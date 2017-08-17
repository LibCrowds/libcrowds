<template>
  <nav id="landing-sidenav">
    <ol>
      <li class="nav-item">
        <a class="nav-link" href="#">
          <span class="nav-number">01</span> - Contribute
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">
          <span class="nav-number">02</span> - Discuss
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link"
          href="#">
          <span class="nav-number">03</span> - Research
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link"
          href="#">
          <span class="nav-number">04</span> - Discover
        </a>
      </li>
    </ol>
  </nav>
</template>

<script>

</script>

<style lang="scss">
@import 'src/assets/style/main';

nav#landing-sidenav {
  position: fixed;
  z-index: 100;
  top: 50%;
  right: 0.5rem;
  overflow: visible;
  width: auto;
  height: auto;
  padding-top: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  background-color: transparent;

  ol {
    list-style: none;
  }

  .nav-item {
    font-weight: 400;
    font-size: $font-size-sm;
    opacity: 0.9;
    letter-spacing: 0.9px;
    text-decoration: none !important;

    .nav-number {
      font-weight: 600;
    }

    .nav-link {
      transition: all 250ms linear;
      text-shadow: none;
      color: lighten($gray-light, 25%);

      @include hover-focus {
        color: $brand-success;
        opacity: 1;
        text-decoration: none;
      }
    }

    @include hover-focus {
      opacity: 1;
    }
  }
}
</style>
