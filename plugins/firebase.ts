import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
}

export default !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app()
const firestore = firebase.firestore()
const auth = firebase.auth()
const googleProvider = new firebase.auth.GoogleAuthProvider();
const timestamp = firebase.firestore.FieldValue.serverTimestamp()
const fieldValue = firebase.firestore.FieldValue

export { firestore }
export { auth }
export { googleProvider }
export { timestamp }
export { fieldValue }
