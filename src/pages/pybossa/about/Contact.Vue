<template>
  <section>
    <p>
      Visit the <a :href="config.discourseUrl">{{ config.brand }} forum</a>
      to ask any questions, report issues, or to just let us know what
      you've discovered.
    </p>
    <p>
      Alternatively, you can get in touch via:
    </p>
    <ul class="list-unstyled">
      <li>
        <strong>Twitter: </strong>
        <a :href="'https://twitter.com/' + config.contact.twitter">
          @{{ config.contact.twitter }}
        </a>
      </li>
      <li>
        <strong>Email: </strong>
        <a :href="'mailto:' + config.contact.email">
          {{ config.contact.email }}
        </a>
      </li>
    </ul>
  </section>
</template>

<script>
import config from '@/config'

export default {
  data: function () {
    return {
      config: config
    }
  }
}
</script>
