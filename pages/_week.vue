<template>
  <div class="Week_Wrap pb-12 px-5">
    <Snacbar />

    <p class="text-center mb-0 display-3 mb-5 mt-5">
      {{ new Date().getMonth() + 1 }}月{{ date.date }}日
    </p>

    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <EditDialog />
      <v-card
        class="mx-auto mb-12"
        max-width="500"
        v-for="(meeting, index) in meetings"
        :key="index"
      >
        <v-btn
          fab
          color="blue darken-3"
          @click="editMeeting(meeting)"
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
            {{ meeting.name }}
          </p>
          <p>
            {{ studyTime(index) }}
          </p>

          <template v-if="!meeting.multiple">
            <v-card color="#333" class="mx-auto" max-width="350">
              <v-card-text>
                <v-text-field
                  disabled
                  class="mt-0"
                  v-model="meeting.id"
                  type="password"
                  label="ミーティングID"
                ></v-text-field>

                <v-btn
                  fab
                  color="blue darken-3"
                  @click="clipboardId(meeting.id)"
                  dark
                  small
                  absolute
                  top
                  right
                  elevation="3"
                  :disabled="!meeting.id ? true : false"
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
                  v-model="meeting.password"
                  type="password"
                  label="パスワード"
                ></v-text-field>

                <v-btn
                  fab
                  color="blue darken-3"
                  @click="clipboardPass(meeting.password)"
                  dark
                  small
                  absolute
                  top
                  right
                  elevation="3"
                  :disabled="!meeting.password ? true : false"
                >
                  <v-icon style="font-size: 1.5rem;">mdi-content-copy</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </template>

          <div v-else>
            <v-tabs
              v-model="tab"
              background-color="transparent"
              color="#fff"
              grow
            >
              <v-tab
                :label="subject.name"
                v-for="(subject, index) in meeting.subjects"
                :key="`multiple-${index}`"
              >
                {{ subject.name }}
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item
                :label="subject.name"
                v-for="(subject, index) in meeting.subjects"
                :key="`multiple-${index}-second`"
                class="pt-10"
              >
                <v-card color="#333" class="mx-auto" max-width="350">
                  <v-card-text>
                    <v-text-field
                      disabled
                      class="mt-0"
                      v-model="subject.id"
                      type="password"
                      label="ミーティングID"
                    ></v-text-field>

                    <v-btn
                      fab
                      color="blue darken-3"
                      @click="clipboardId(subject.id)"
                      dark
                      small
                      absolute
                      top
                      right
                      elevation="3"
                      :disabled="!subject.id ? true : false"
                    >
                      <v-icon style="font-size: 1.5rem;"
                        >mdi-content-copy</v-icon
                      >
                    </v-btn>
                  </v-card-text>
                </v-card>

                <v-card color="#333" class="mx-auto mt-10" max-width="350">
                  <v-card-text>
                    <v-text-field
                      disabled
                      class="mt-0"
                      v-model="subject.password"
                      type="password"
                      label="パスワード"
                    ></v-text-field>

                    <v-btn
                      fab
                      color="blue darken-3"
                      @click="clipboardPass(subject.password)"
                      dark
                      small
                      absolute
                      top
                      right
                      elevation="3"
                      :disabled="!subject.password ? true : false"
                    >
                      <v-icon style="font-size: 1.5rem;"
                        >mdi-content-copy</v-icon
                      >
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </div>
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
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Snacbar from '~/components/Snackbar.vue'
import EditDialog from '~/components/EditDialog.vue'
import Loading from '~/components/Loading.vue'
import { auth, firestore } from '@/plugins/firebase'
import { IMeeting } from '@/store/meeting'
import { IDate } from '@/store/date'

type Data = {
  isMaster: boolean
  tab: number
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
    EditDialog,
    Loading
  },

  data(): Data {
    return {
      isMaster: false,
      tab: 0
    }
  },

  computed: {
    meetings(): IMeeting {
      return this.$store.state.meeting.meetings
    },

    loading(): boolean {
      return this.$store.state.meeting.loading
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
