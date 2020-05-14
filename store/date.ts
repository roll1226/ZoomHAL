import * as Vuex from 'vuex'
import { firestore } from '@/plugins/firebase'

export interface IDate {
  week: string
  date: string
}

interface IState {
  date: Array<IDate>
}

export const state = (): IState => ({
  date: []
})

export const mutations = {
  SEARCH_DATE(state: IState, payload: string) {
    state.date = []
    const date = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ]

    const dateTime = new Date()

    const nowDateList = []
    for (let index = 0; index < 7; index++) {
      const nowDate = new Date(dateTime.setDate(dateTime.getDate() + 1))
      nowDateList.push(nowDate.getDate())
    }

    const afterWeek = date.indexOf(payload)
    const nowWeek = date.splice(afterWeek)

    const countWeek = nowWeek.length - 1
    for (let index = 0; index < countWeek; index++) {
      nowWeek.push(date[index])
    }

    for (let index = 0; index < 7; index++) {
      const date = {
        week: nowWeek[index],
        date: String(nowDateList[index])
      }

      state.date.push(date)
    }
  }
}
