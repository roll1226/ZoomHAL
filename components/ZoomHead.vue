<template>
  <v-tabs fixed-tabs dark color="blue darken-3">
    <v-tab
      v-for="(week, index) in weeks"
      :key="index"
      :to="`/${week.displayName}`"
    >
      {{ week.name }}
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import Vue from 'vue'

type Week = {
  displayName: string
  name: string
}

type Data = {
  weeks: Array<Week>
}

export default Vue.extend({
  data(): Data {
    return {
      weeks: [
        { displayName: 'monday', name: '月曜日' },
        { displayName: 'tuesday', name: '火曜日' },
        { displayName: 'wednesday', name: '水曜日' },
        { displayName: 'thursday', name: '木曜日' },
        { displayName: 'friday', name: '金曜日' },
        { displayName: 'saturday', name: '土曜日' }
      ]
    }
  }
})
</script>
