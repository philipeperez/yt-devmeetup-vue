// import * as firebase from 'firebase'
//
// export default {
//   state: {
//     user: null,
//   },
//
//   mutations: {
//     registerUserForMeetup: (state, payload) => {
//       const id = payload.id
//       if(state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >=0 )
//         return
//
//       state.user.registeredMeetups.push(id)
//       state.user.fbKeys[id] = payload.fbKey
//     },
//     unregisterUserFromMeetup: (state, payload) => {
//       const registeredMeetups = state.user.registeredMeetups
//       registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
//       Reflect.deleteProperty(state.user.fbKeys, payload)
//     },
//
//     setUser: (state, payload) => state.user = payload
//   },
//
//   actions: {
//     registerUserForMeetup({commit, state}, payload) {
//       commit('setLoading', true)
//       firebase.database().ref(`users/${state.user.id}`).child('registrations').push(payload)
//         .then(data => {
//           commit('setLoading', false)
//           commit('registerUserForMeetup', { id: payload, fbKey: data.key })
//         })
//         .catch(err => {
//           console.log(err)
//           commit('setLoading', false)
//         })
//     },
//
//     unregisterUserFromMeetup({commit, state}, payload) {
//       commit('setLoading', true)
//       const user = state.user
//       if(!user.fbKeys) {
//         commit('setLoading', false)
//         return
//       }
//
//       const fbKey = user.fbKeys[payload]
//       firebase.database().ref(`users/${user.id}/registrations`).child(fbKey).remove()
//         .then(() => {
//           commit('setLoading', false)
//           commit('unregisterUserFromMeetup', payload)
//         })
//         .catch(err => {
//           console.log(err)
//           commit('setLoading', false)
//         })
//     },
//
//     signUserUp: ({commit}, payload) => {
//       commit('setLoading', true)
//       commit('clearError')
//       firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
//         .then(user => {
//           const newUser = {
//             id: user.uid,
//             registeredMeetups: [],
//             fbKeys: {}
//           }
//           commit('setUser', newUser)
//           commit('setLoading', false)
//         })
//         .catch(err => {
//           commit('setLoading', false)
//           commit('setError', err)
//           console.log(err)
//         })
//     },
//
//     signUserIn: ({commit}, payload) => {
//       commit('setLoading', true)
//       commit('clearError')
//       firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
//         .then(user => {
//           const newUser = {
//             id: user.uid,
//             registeredMeetups: [],
//             fbKeys: {}
//           }
//           commit('setUser', newUser)
//           commit('setLoading', false)
//         })
//         .catch(err => {
//           commit('setLoading', false)
//           commit('setError', err)
//           console.log(err)
//         })
//     },
//
//     autoSignIn: ({commit}, payload) => commit('setUser', { id: payload.uid, registeredMeetups: [], fbKeys: {} }),
//
//     fetchUserData: ({commit, state}) => {
//       commit('setLoading', true)
//       firebase.database().ref(`users/${state.user.id}/registrations`).once('value')
//         .then(data => {
//           const dataPairs = data.val()
//           let registeredMeetups = []
//           let swappedPairs = {}
//           for(let key in dataPairs) {
//             registeredMeetups.push(dataPairs[key])
//             swappedPairs[dataPairs[key]] = key
//           }
//           const updateUser = {
//             id: state.user.id,
//             registeredMeetups: registeredMeetups,
//             fbKeys: swappedPairs
//           }
//           commit('setLoading', false)
//           commit('setUser', updateUser)
//         })
//         .catch(err => {
//           console.log(err)
//           commit('setLoading', false)
//         })
//     },
//
//     logout: ({commit}) => {
//       firebase.auth().signOut()
//       commit('setUser', null)
//     }
//   }
// }
