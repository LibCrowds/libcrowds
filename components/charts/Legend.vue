<template>
  <ul class="ct-legend">
    <li
      v-for="(item, idx) in items"
      :key="idx"
      :class="`ct-series-${idx}`">
      {{ item }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>
