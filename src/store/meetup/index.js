// import * as firebase from 'firebase'
//
// export default {
//   state: {
//     loadedMeetups: [
//       // {
//       //   imageUrl: 'https://goo.gl/b2kwMQ',
//       //   id: 'klsdf',
//       //   title: 'Meetup in New York',
//       //   date: new Date(),
//       //   location: 'New York',
//       //   description: 'The big Apple!!!'
//       // },
//       //
//       // {
//       //   imageUrl: 'https://goo.gl/n5bpxe',
//       //   id: 'kjdnfjknf',
//       //   title: 'Meetup in Paris',
//       //   date: new Date(),
//       //   location: 'Paris',
//       //   description: 'It\'s Paris!!!'
//       // }
//     ]
//   },
//
//   mutations: {
//     setLoadedMeetups: (state, payload) => state.loadedMeetups = payload,
//     createMeetup: (state, payload) => state.loadedMeetups.push(payload),
//     updateMeetup: (state, payload) => {
//       const meetup = state.loadedMeetups.find(meetup => meetup.id === payload.id)
//
//       if(payload.title)
//         meetup.title = payload.title
//
//       if(payload.description)
//         meetup.description = payload.description
//
//       if(payload.date)
//         meetup.date = payload.date
//     }
//   },
//
//   actions: {
//     loadMeetups({commit}) {
//       commit('setLoading', true)
//       firebase.database().ref('meetups').once('value')
//         .then(data => {
//           const meetups = []
//           const obj = data.val()
//
//           for(let key in obj) {
//             meetups.push({
//               id: key,
//               title: obj[key].title,
//               description: obj[key].description,
//               imageUrl: obj[key].imageUrl,
//               date: obj[key].date,
//               location: obj[key].location,
//               creatorId: obj[key].creatorId
//             })
//           }
//           commit('setLoadedMeetups', meetups)
//           commit('setLoading', false)
//         })
//         .catch(err => {
//           commit('setLoading', false)
//           console.log(err)
//         })
//     },
//     createMeetup: ({commit, state}, payload) => {
//       const meetup = {
//         title: payload.title,
//         location: payload.location,
//         description: payload.description,
//         date: payload.date.toISOString(),
//         creatorId: state.user.id
//       }
//
//       let imageUrl
//       let key
//       firebase.database().ref('meetups').push(meetup)
//         .then(data => {
//           key = data.key
//           return key
//         })
//         .then(key => {
//           const fileName = payload.image.name
//           const ext = fileName.slice(fileName.lastIndexOf('.'))
//           return firebase.storage().ref(`meetups/${key}.${ext}`).put(payload.image)
//         })
//         .then(fileData => {
//           imageUrl = fileData.metadata.downloadURLs[0]
//           return firebase.database().ref('meetups').child(key).update({ imageUrl: imageUrl })
//         })
//         .then(() => {
//           commit('createMeetup', {
//             ...meetup,
//             imageUrl: imageUrl,
//             id: key
//           })
//         })
//         .catch(err => console.log(err))
//     },
//
//     updateMeetupData: ({commit}, payload) => {
//       commit('setLoading', true)
//       const updateObj = {}
//       if(payload.title)
//         updateObj.title = payload.title
//
//       if(payload.description)
//         updateObj.description = payload.description
//
//       if(payload.date)
//         updateObj.date = payload.date
//       firebase.database().ref('meetups').child(payload.id).update(updateObj)
//         .then(() => {
//           commit('setLoading', false)
//           commit('updateMeetup', payload)
//         })
//         .catch(err => {
//           console.log(err)
//           commit('setLoading', false)
//         })
//     }
//   },
//
//   getters: {
//     loadedMeetups: state => state.loadedMeetups.sort((meetupA, meetupB) => { return meetupA.date > meetupB.date}),
//     featuredMeetups: (state, getters) => getters.loadedMeetups.slice(0, 5),
//     loadedMeetup: state => meetupId => state.loadedMeetups.find(meetup => meetup.id === meetupId)
//   }
// }
