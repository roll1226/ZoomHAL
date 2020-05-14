<template>
  <v-snackbar v-model="snackbar" :timeout="2500" top right>
    {{ text }}
    <v-btn color="pink" text @click="close">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    snackbar: {
      get() {
        return this.$store.state.snackbar.isSnackbar
      },

      set(bool: boolean) {
        this.$store.commit('snackbar/SET_SNACKBAR', { bool, text: '' })
      }
    },

    text() {
      return this.$store.state.snackbar.snackbarText
    }
  },

  methods: {
    close() {
      this.$store.commit('snackbar/SET_SNACKBAR', { bool: false, text: '' })
    }
  }
})
</script>
