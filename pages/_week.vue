<template>
  <div class="Week_Wrap pb-12 px-5">
    <Snacbar />
    <EditDialog />

    <p class="text-center mb-0 display-3 mb-5 mt-5">
      {{ new Date().getMonth() + 1 }}月{{ date.date }}日
    </p>
    <v-card
      class="mx-auto mb-12"
      max-width="500"
      v-for="(metting, index) in meetings"
      :key="index"
    >
      <v-btn
        fab
        color="blue darken-3"
        @click="editMeeting(metting)"
        dark
        absolute
        top
        right
        elevation="3"
        v-if="isMaster"
      >
        <v-icon style="font-size: 2rem;">mdi-pencil</v-icon>
      </v-btn>

      <v-card-text class="pb-6">
        <div>{{ index + 1 }}限目</div>
        <p class="display-1 text--primary">
          {{ metting.name }}
        </p>
        <p>
          {{ studyTime(index) }}
        </p>

        <v-card color="#333" class="mx-auto" max-width="350">
          <v-card-text>
            <v-text-field
              disabled
              class="mt-0"
              v-model="metting.id"
              type="password"
              label="ミーティングID"
            ></v-text-field>

            <v-btn
              fab
              color="blue darken-3"
              @click="clipboardId(metting.id)"
              dark
              small
              absolute
              top
              right
              elevation="3"
              :disabled="!metting.id ? true : false"
            >
              <v-icon style="font-size: 1.5rem;">mdi-content-copy</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card color="#333" class="mx-auto mt-10" max-width="350">
          <v-card-text>
            <v-text-field
              disabled
              class="mt-0"
              v-model="metting.password"
              type="password"
              label="パスワード"
            ></v-text-field>

            <v-btn
              fab
              color="blue darken-3"
              @click="clipboardPass(metting.password)"
              dark
              small
              absolute
              top
              right
              elevation="3"
              :disabled="!metting.password ? true : false"
            >
              <v-icon style="font-size: 1.5rem;">mdi-content-copy</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <v-btn
      fixed
      dark
      fab
      bottom
      right
      color="blue lighten-2"
      @click="logout"
      class="mt-5"
    >
      <v-icon style="font-size: 2rem;">mdi-logout</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Snacbar from '~/components/Snackbar.vue'
import EditDialog from '~/components/EditDialog.vue'
import { auth, firestore } from '@/plugins/firebase'
import { IMeeting } from '@/store/meeting'
import { IDate } from '@/store/date'

type Data = {
  isMaster: boolean
}

const clipbord = (text: string): boolean => {
  try {
    navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    return false
  }
}

export default Vue.extend({
  head() {
    let week = ''
    switch (this.$route.params.week) {
      case 'monday':
        week = '月曜日'
        break

      case 'tuesday':
        week = '火曜日'
        break

      case 'wednesday':
        week = '水曜日'
        break

      case 'thursday':
        week = '木曜日'
        break

      case 'friday':
        week = '金曜日'
        break

      case 'saturday':
        week = '土曜日'
        break

      default:
        break
    }
    return {
      title: `ZoomHAL / ${week}`
    }
  },

  components: {
    Snacbar,
    EditDialog
  },

  data() {
    return {
      isMaster: false
    }
  },

  computed: {
    meetings(): IMeeting {
      return this.$store.state.meeting.meetings
    },

    date(): IDate {
      const dateList = this.$store.state.date.date
      const targetDate = dateList
        .filter((object: IDate) => {
          return object.week == this.$route.params.week
        })
        .shift()

      return targetDate
    }
  },

  created() {
    this.$store.commit('meeting/RESET_MEETINGS')

    const date = new Date()
    const dayOfWeek = date.getDay()
    const dayOfWeekStr = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ][dayOfWeek]

    this.$store.commit('date/SEARCH_DATE', dayOfWeekStr)
  },

  mounted() {
    this.$nextTick(async () => {
      await auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          this.$store.dispatch('meeting/getMeeting', this.$route.params.week)

          const isUser = await firestore
            .collection('users')
            .where('id', '==', user.uid)
            .get()

          if (!isUser.empty) this.isMaster = true
        } else this.$router.push('/')
      })
    })
  },

  methods: {
    studyTime(num: number) {
      switch (num) {
        case 0:
          return '9:50 ~ 11:30'
          break

        case 1:
          return '11:35 ~ 13:05'
          break

        case 2:
          return '13:55 ~ 15:25'
          break

        case 3:
          return '15:40 ~ 17:10'
          break

        case 4:
          return '17:20 ~ 18:50'
          break

        default:
          break
      }
    },

    clipboardId(id: string) {
      const isCopy = clipbord(id)
      if (isCopy)
        this.$store.commit('snackbar/SET_SNACKBAR', {
          bool: true,
          text: 'コピーしました'
        })
      else
        this.$store.commit('snackbar/SET_SNACKBAR', {
          bool: true,
          text: 'コピーに失敗しました'
        })
    },

    clipboardPass(pass: string) {
      const isCopy = clipbord(pass)
      if (isCopy)
        this.$store.commit('snackbar/SET_SNACKBAR', {
          bool: true,
          text: 'コピーしました'
        })
      else
        this.$store.commit('snackbar/SET_SNACKBAR', {
          bool: true,
          text: 'コピーに失敗しました'
        })
    },

    editMeeting(meeting: IMeeting) {
      this.$store.commit('editMeeting/SET_DIALOG', true)
      this.$store.commit('editMeeting/SET_WEEK', this.$route.params.week)
      this.$store.commit('editMeeting/SET_TURN', meeting.turn)
    },

    logout() {
      auth.signOut().then(() => {
        this.$router.push('/')
      })
    }
  }
})
</script>

<style>
.Week_Wrap {
  position: absolute;
  top: 10%;
  width: 100vw;
}

.Week_Wrap .v-text-field__details {
  display: none;
}
</style>
