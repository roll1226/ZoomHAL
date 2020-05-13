import * as Vuex from 'vuex'

interface ICommit {
  commit: Vuex.Commit
  dispatch: Vuex.Dispatch
}

interface IState {
  isSnackbar: boolean
  snackbarText: string
}

type SnackbarPayload = {
  bool: boolean
  text: string
}

export const state = (): IState => ({
  isSnackbar: false,
  snackbarText: ''
})

export const mutations = {
  SET_SNACKBAR(state: IState, payload: SnackbarPayload) {
    state.isSnackbar = payload.bool
    state.snackbarText = payload.text
  }
}

export const actions = {}
