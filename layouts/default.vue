<template>
  <v-app dark>
    <ZoomHead />
    <nuxt />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import ZoomHead from '~/components/ZoomHead.vue'
export default Vue.extend({
  components: {
    ZoomHead
  }
})
</script>

<style>
body {
  background: #121212;
}
</style>
