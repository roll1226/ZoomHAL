<template>
  <div class="login_wrap d-flex justify-center align-center px-5">
    <Snackbar />

    <v-card width="500" :loading="loading" :disabled="loading">
      <v-card-text>
        <p class="display-1 text--primary text-center">
          ズームHAL
        </p>
        <div class="text-center">
          オンライン授業を楽に
        </div>
        <div class="text-center">
          〜 ほぼ自分のために 〜
        </div>
      </v-card-text>

      <!-- <v-divider></v-divider> -->

      <v-card-text class="pb-0">
        <v-text-field
          v-model="userId"
          label="ユーザID"
          append-icon="mdi-account"
          :rules="[rules.isEmail, rules.emailFormat]"
          hint="ゲストID or マスターIDを入力"
        ></v-text-field>
      </v-card-text>

      <v-card-text class="pt-0">
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="パスワード"
          hint="パスワードを入力"
          counter
          :rules="[rules.required, rules.min]"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!disabled" @click="login" color="blue darken-3">
          <v-icon class="mr-1">
            mdi-login
          </v-icon>
          ログイン
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '@/plugins/firebase'
import Snackbar from '@/components/Snackbar.vue'

type Data = {
  showPassword: boolean
  password: string
  userId: string
  rules: {
    required: (value: string) => boolean | string
    min: (v: string) => boolean | string
    isEmail: (v: string) => boolean | string
    emailFormat: (v: string) => true | string
  }
  loading: boolean
}

export default Vue.extend({
  head() {
    return {
      title: `ZoomHAL / ログイン`
    }
  },

  layout: 'login',

  components: {
    Snackbar
  },

  data(): Data {
    return {
      showPassword: false,
      password: '',
      userId: '',
      rules: {
        required: (value) => !!value || '入力してくれ.',
        min: (v) => v.length >= 6 || '6文字以上入力してくれ',
        isEmail: (v) => !!v || 'メールアドレス入力してくれ',
        emailFormat: (v) => {
          const pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
          return (
            pattern.test(v) ||
            'メールアドレスは半角英数字で「XX@XX.XX」の形式にしてくれないとログイン出来ないよー'
          )
        }
      },
      loading: false
    }
  },

  computed: {
    disabled(): boolean {
      if (this.password === '' || this.userId === '') return false
      else return true
    }
  },

  mounted() {
    this.$nextTick(async () => {
      await auth.onAuthStateChanged((user) => {
        if (user) this.$router.push('/monday')
        else this.$router.push('/')
      })
    })
  },

  methods: {
    async login() {
      this.loading = true
      // try {
      //   await auth.signInWithPopup(googleProvider)
      //   this.$router.push('/monday')
      // } catch (error) {}
      try {
        await auth.signInWithEmailAndPassword(this.userId, this.password)
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

        this.$store.commit('snackbar/SET_SNACKBAR', {
          bool: true,
          text: `ログイン出来ました`
        })

        this.$router.push(dayOfWeekStr === 'sunday' ? 'monday' : dayOfWeekStr)

        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false

        this.$store.commit('snackbar/SET_SNACKBAR', {
          bool: true,
          text: `ログインに失敗しました`
        })
      }
    }
  }
})
</script>

<style>
.login_wrap {
  width: 100vw;
  height: 100vh;
}
</style>
