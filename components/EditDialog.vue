<template>
  <v-dialog
    :scrollable="multiple"
    v-model="dialog"
    width="550"
    :persistent="loading"
  >
    <v-card :loading="loading" :disabled="loading">
      <v-card-title primary-title>
        ミーティング編集
      </v-card-title>

      <v-card-text>
        <div>{{ turn }}限目</div>

        <v-row>
          <v-col cols="5">
            <v-switch v-model="multiple" inset label="選択科目"></v-switch>
          </v-col>
        </v-row>

        <template v-if="!multiple">
          <v-text-field label="科目名" v-model="name"></v-text-field>

          <v-text-field label="ミーティングID" v-model="id"></v-text-field>

          <v-text-field
            label="パスワード"
            v-model="password"
            type="text"
          ></v-text-field>
        </template>

        <template v-else>
          <v-select
            v-model="subjects"
            :items="multipleSubject"
            label="クラス数"
          ></v-select>

          <v-card
            color="#333"
            v-for="(subject, index) in subjectsList"
            :key="index"
            class="mt-5 mb-1"
          >
            <v-card-text>
              <v-text-field
                label="科目名"
                v-model="subject.name"
              ></v-text-field>

              <v-text-field
                label="ミーティングID"
                v-model="subject.id"
              ></v-text-field>

              <v-text-field
                label="パスワード"
                v-model="subject.password"
                type="text"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </template>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="purple" text @click="clear" :disabled="disabledClear">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn color="error" text @click="close" :disabled="loading">
          <v-icon>
            mdi-undo-variant
          </v-icon>
        </v-btn>

        <v-btn color="primary" text @click="edit">
          <v-icon>
            mdi-telegram
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { firestore, timestamp } from '@/plugins/firebase'
import { IMeeting } from '@/store/meeting'

type Subjects = {
  id: string
  password: string
  name: string
}

type Data = {
  showPassword: boolean
  name: string
  id: string
  password: string
  loading: boolean
  multiple: boolean
  multipleSubject: Array<number>
  subjects: number
  subjectsList: Array<Subjects>
}

export default Vue.extend({
  data(): Data {
    return {
      showPassword: false,
      name: '',
      id: '',
      password: '',
      loading: false,
      multiple: false,
      multipleSubject: [2, 3, 4],
      subjects: 2,
      subjectsList: [
        {
          id: '',
          password: '',
          name: ''
        },
        {
          id: '',
          password: '',
          name: ''
        }
      ]
    }
  },

  watch: {
    subjects(val: number) {
      const list = {
        id: '',
        password: '',
        name: ''
      }
      this.subjectsList = []

      for (let index = 0; index < val; index++) {
        this.subjectsList.push(list)
      }
    }
  },

  computed: {
    dialog: {
      get(): boolean {
        return this.$store.state.editMeeting.isDialog
      },

      set(bool: boolean) {
        this.closeFunctions(bool)
      }
    },

    week(): string {
      return this.$store.state.editMeeting.week
    },

    turn(): number {
      return this.$store.state.editMeeting.turn
    },

    disabled(): boolean {
      if (this.name === '' || this.id === '' || this.password === '')
        return false
      else return true
    },

    disabledClear(): boolean {
      if (this.name === '' && this.id === '' && this.password === '')
        return false
      else return true
    }
  },

  methods: {
    close() {
      this.closeFunctions(false)
    },

    closeFunctions(bool: boolean) {
      this.$store.commit('editMeeting/SET_DIALOG', bool)
      this.$store.commit('editMeeting/SET_WEEK', '')
      this.$store.commit('editMeeting/SET_TURN', 0)
      this.showPassword = false
      this.name = ''
      this.id = ''
      this.password = ''
      this.loading = false
      this.multiple = false
      this.subjects = 2
      this.subjectsList = [
        {
          id: '',
          password: '',
          name: ''
        },
        {
          id: '',
          password: '',
          name: ''
        }
      ]
    },

    async edit() {
      this.loading = true
      try {
        const week = await firestore.collection(this.week)
        const meeting = await week.where('turn', '==', this.turn).get()

        if (!this.multiple) {
          await week.doc(meeting.docs[0].id).update({
            name: this.name,
            id: this.id,
            password: this.password,
            updatedAt: timestamp,
            multiple: false
          })

          await week
            .doc(meeting.docs[0].id)
            .collection('subjects')
            .doc('subjectsList')
            .update({
              subjects: [
                {
                  id: '',
                  name: '',
                  password: ''
                }
              ],
              updatedAt: timestamp
            })

          this.$store.commit('meeting/SWAP_MEETING', {
            name: this.name,
            id: this.id,
            password: this.password,
            turn: this.turn,
            multiple: false
          })

          this.$store.commit('snackbar/SET_SNACKBAR', {
            bool: true,
            text: `${this.turn}限目を変更しました`
          })
        } else {
          console.log('hoge')

          await week.doc(meeting.docs[0].id).update({
            name: '',
            id: '',
            password: '',
            updatedAt: timestamp,
            multiple: true
          })

          await week
            .doc(meeting.docs[0].id)
            .collection('subjects')
            .doc('subjectsList')
            .update({
              subject: this.subjectsList,
              updatedAt: timestamp
            })

          this.$store.commit('snackbar/SET_SNACKBAR', {
            bool: true,
            text: `${this.turn}限目を変更しました`
          })
        }
        this.closeFunctions(false)
      } catch (error) {
        console.log(error)

        this.$store.commit('snackbar/SET_SNACKBAR', {
          bool: true,
          text: '変更出来ませんでした。'
        })
        this.loading = false
      }
    },

    async clear() {
      this.loading = true
      try {
        const week = await firestore.collection(this.week)
        const meeting = await week.where('turn', '==', this.turn).get()

        await week
          .doc(meeting.docs[0].id)
          .update({ name: '', id: '', password: '', updatedAt: timestamp })

        this.$store.commit('meeting/SWAP_MEETING', {
          name: '',
          id: '',
          password: '',
          turn: this.turn
        })

        this.$store.commit('snackbar/SET_SNACKBAR', {
          bool: true,
          text: `${this.turn}限目を変更しました`
        })

        this.closeFunctions(false)
      } catch (error) {
        this.$store.commit('snackbar/SET_SNACKBAR', {
          bool: true,
          text: '変更出来ませんでした。'
        })
        this.loading = false
      }
    }
  }
})
</script>
