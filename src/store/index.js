import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadedMeetups: [
      // {
      //   imageUrl: 'https://goo.gl/b2kwMQ',
      //   id: 'klsdf',
      //   title: 'Meetup in New York',
      //   date: new Date(),
      //   location: 'New York',
      //   description: 'The big Apple!!!'
      // },
      //
      // {
      //   imageUrl: 'https://goo.gl/n5bpxe',
      //   id: 'kjdnfjknf',
      //   title: 'Meetup in Paris',
      //   date: new Date(),
      //   location: 'Paris',
      //   description: 'It\'s Paris!!!'
      // }
    ],
    user: null,
    loading: false,
    error: null
  },

  mutations: {
    registerUserForMeetup: (state, payload) => {
      const id = payload.id
      if(state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >=0 )
        return

      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup: (state, payload) => {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setLoadedMeetups: (state, payload) => state.loadedMeetups = payload,
    createMeetup: (state, payload) => state.loadedMeetups.push(payload),
    updateMeetup: (state, payload) => {
      const meetup = state.loadedMeetups.find(meetup => meetup.id === payload.id)

      if(payload.title)
        meetup.title = payload.title

      if(payload.description)
        meetup.description = payload.description

      if(payload.date)
        meetup.date = payload.date
    },
    setUser: (state, payload) => state.user = payload,
    setLoading: (state, payload) => state.loading = payload,
    setError: (state, payload) => state.error = payload,
    clearError: state => state.error = null
  },

  actions: {
    registerUserForMeetup({commit, state}, payload) {
      commit('setLoading', true)
      firebase.database().ref(`users/${state.user.id}`).child('registrations').push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', { id: payload, fbKey: data.key })
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
        })
    },

    unregisterUserFromMeetup({commit, state}, payload) {
      commit('setLoading', true)
      const user = state.user
      if(!user.fbKeys) {
        commit('setLoading', false)
        return
      }

      const fbKey = user.fbKeys[payload]
      firebase.database().ref(`users/${user.id}/registrations`).child(fbKey).remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserFromMeetup', payload)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
        })
    },

    loadMeetups({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
        .then(data => {
          const meetups = []
          const obj = data.val()

          for(let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              location: obj[key].location,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          console.log(err)
        })
    },
    createMeetup: ({commit, state}, payload) => {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: state.user.id
      }

      let imageUrl
      let key
      firebase.database().ref('meetups').push(meetup)
        .then(data => {
          key = data.key
          return key
        })
        .then(key => {
          const fileName = payload.image.name
          const ext = fileName.slice(fileName.lastIndexOf('.'))
          return firebase.storage().ref(`meetups/${key}.${ext}`).put(payload.image)
        })
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          return firebase.database().ref('meetups').child(key).update({ imageUrl: imageUrl })
        })
        .then(() => {
          commit('createMeetup', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch(err => console.log(err))
    },

    updateMeetupData: ({commit}, payload) => {
      commit('setLoading', true)
      const updateObj = {}
      if(payload.title)
        updateObj.title = payload.title

      if(payload.description)
        updateObj.description = payload.description

      if(payload.date)
        updateObj.date = payload.date
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateMeetup', payload)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
        })
    },

    signUserUp: ({commit}, payload) => {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          const newUser = {
            id: user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err)
          console.log(err)
        })
    },

    signUserIn: ({commit}, payload) => {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          const newUser = {
            id: user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err)
          console.log(err)
        })
    },

    autoSignIn: ({commit}, payload) => commit('setUser', { id: payload.uid, registeredMeetups: [], fbKeys: {} }),

    fetchUserData: ({commit, state}) => {
      commit('setLoading', true)
      firebase.database().ref(`users/${state.user.id}/registrations`).once('value')
        .then(data => {
          const dataPairs = data.val()
          let registeredMeetups = []
          let swappedPairs = {}
          for(let key in dataPairs) {
            registeredMeetups.push(dataPairs[key])
            swappedPairs[dataPairs[key]] = key
          }
          const updateUser = {
            id: state.user.id,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs
          }
          commit('setLoading', false)
          commit('setUser', updateUser)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
        })
    },

    logout: ({commit}) => {
      firebase.auth().signOut()
      commit('setUser', null)
    },

    clearError: ({commit}) => commit('clearError')
  },

  getters: {
    loadedMeetups: state => state.loadedMeetups.sort((meetupA, meetupB) => { return meetupA.date > meetupB.date}),
    featuredMeetups: (state, getters) => getters.loadedMeetups.slice(0, 5),
    loadedMeetup: state => meetupId => state.loadedMeetups.find(meetup => meetup.id === meetupId)
  }
})
