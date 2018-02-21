// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import store from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'
import EditMeetupDetailsDialog from './components/meetup/Edit/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from './components/meetup/Edit/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from './components/meetup/Edit/EditMeetupTimeDialog.vue'
import RegisterDialog from './components/meetup/Registration/RegisterDialog.vue'

Vue.use(Vuetify)
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    firebase.initializeApp({
      apiKey: 'AIzaSyBgy3sUF7ya04jE7FYZaBdv9V2_rUdWQd4',
      authDomain: 'youtube-devmeetup-701e5.firebaseapp.com',
      databaseURL: 'https://youtube-devmeetup-701e5.firebaseio.com',
      projectId: 'youtube-devmeetup-701e5',
      storageBucket: 'youtube-devmeetup-701e5.appspot.com'
    })
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetups')
  }
})
