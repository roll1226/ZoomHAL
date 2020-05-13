<template>
  <v-dialog v-model="dialog" width="550">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title primary-title>
        ミーティング編集
      </v-card-title>

      <v-card-text>
        <div>{{ turn }}限目</div>

        <v-text-field label="科目名" v-model="name"></v-text-field>

        <v-text-field label="ミーティングID" v-model="id"></v-text-field>

        <v-text-field
          label="パスワード"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          color="purple"
          text
          @click="clear"
          :disabled="disabledClear"
        >
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

        <v-btn
          color="primary"
          text
          @click="edit"
          :disabled="!disabled"
        >
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

type Data = {
  showPassword: boolean
  name: string
  id: string
  password: string
  loading: boolean
}

export default Vue.extend({
  data(): Data {
    return {
      showPassword: false,
      name: '',
      id: '',
      password: '',
      loading: false
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
    },

    async edit() {
      this.loading = true
      try {
        const week = await firestore.collection(this.week)
        const meeting = await week.where('turn', '==', this.turn).get()

        await week.doc(meeting.docs[0].id).update({
          name: this.name,
          id: this.id,
          password: this.password,
          updatedAt: timestamp
        })

        this.$store.commit('meeting/SWAP_MEETING', {
          name: this.name,
          id: this.id,
          password: this.password,
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
