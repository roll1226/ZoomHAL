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
  multiple: boolean
}

type Meetings = {
  id: string
  password: string
  name: string
}

export interface IMeetings {
  subjects: Array<Meetings>
  turn: number
  multiple: boolean
}

interface IState {
  meetings: Array<IMeeting | IMeetings>
  loading: boolean
}

export const state = (): IState => ({
  meetings: [],
  loading: true
})

export const mutations = {
  SET_MEETINGS(state: IState, payload: IMeeting) {
    state.meetings.push(payload)
  },

  RESET_MEETINGS(state: IState) {
    state.meetings = []
    state.loading = true
  },

  SET_LOADING(state: IState, payload: boolean) {
    state.loading = payload
  },

  SWAP_MEETING(state: IState, payload: IMeeting) {
    state.meetings[payload.turn - 1] = {
      name: payload.name,
      id: payload.id,
      password: payload.password,
      turn: payload.turn,
      multiple: false
    }
    const book = state.meetings
    state.meetings = []
    state.meetings = book
  },

  SWAP_MEETINGS(
    state: IState,
    payload: { turn: number; meetings: Array<Meetings> }
  ) {
    state.meetings[payload.turn - 1] = {
      subjects: payload.meetings,
      turn: payload.turn,
      multiple: true
    }
    const book = state.meetings
    state.meetings = []
    state.meetings = book
  }
}

export const actions = {
  async getMeeting(dispatch: ICommit, payload: string) {
    const weekMeeting = firestore.collection(payload)
    const weeks = await weekMeeting.orderBy('turn', 'asc').get()

    for (let index = 0; index < weeks.size; index++) {
      const weeksData = weeks.docs[index].data()
      if (weeksData.multiple) {
        const multipleMeetings = await weekMeeting
          .doc(weeks.docs[index].id)
          .collection('subjects')
          .get()

        const week: IMeetings = {
          subjects: multipleMeetings.docs[0].data().subjects as Array<Meetings>,
          turn: weeksData.turn,
          multiple: weeksData.multiple
        }

        dispatch.commit('SET_MEETINGS', week)
      } else {
        const week: IMeeting = {
          id: weeksData.id,
          name: weeksData.name,
          password: weeksData.password,
          turn: weeksData.turn,
          multiple: weeksData.multiple
        }

        dispatch.commit('SET_MEETINGS', week)
      }
    }
    dispatch.commit('SET_LOADING', false)
  }
}
