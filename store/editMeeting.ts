import * as Vuex from 'vuex'

interface ICommit {
  commit: Vuex.Commit
  dispatch: Vuex.Dispatch
}

interface IState {
  isDialog: boolean
  week: string
  turn: number
}

export const state = (): IState => ({
  isDialog: false,
  week: '',
  turn: 0
})

export const mutations = {
  SET_DIALOG(state: IState, payload: boolean) {
    state.isDialog = payload
  },

  SET_WEEK(state: IState, payload: string) {
    state.week = payload
  },

  SET_TURN(state: IState, payload: number) {
    state.turn = payload
  }
}

export const actions = {}
