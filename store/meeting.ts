import * as Vuex from 'vuex'
import { firestore } from '@/plugins/firebase'

interface ICommit {
  commit: Vuex.Commit
  dispatch: Vuex.Dispatch
}

export interface IMeeting {
  id: string
  password: string
  name: string
  turn: number
}

interface IState {
  meetings: Array<IMeeting>
}

export const state = (): IState => ({
  meetings: []
})

export const mutations = {
  SET_MEETINGS(state: IState, payload: IMeeting) {
    state.meetings.push(payload)
  },

  RESET_MEETINGS(state: IState) {
    state.meetings = []
  },

  SWAP_MEETING(state: IState, payload: IMeeting) {
    state.meetings[payload.turn - 1] = {
      name: payload.name,
      id: payload.id,
      password: payload.password,
      turn: payload.turn
    }
    const book = state.meetings
    state.meetings = []
    state.meetings = book
  }
}

export const actions = {
  async getMeeting(dispatch: ICommit, payload: string) {
    const weeks = await firestore
      .collection(payload)
      .orderBy('turn', 'asc')
      .get()

    for (let index = 0; index < weeks.size; index++) {
      const weeksData = weeks.docs[index].data()
      const week: IMeeting = {
        id: weeksData.id,
        name: weeksData.name,
        password: weeksData.password,
        turn: weeksData.turn
      }

      dispatch.commit('SET_MEETINGS', week)
    }
  }
}
