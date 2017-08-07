<template>
  <div class="basic-layout">
    <app-navbar></app-navbar>
    <main>
      <slot></slot>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'

export default {
  components: {
    AppNavbar,
    AppFooter
  }
}
</script>
