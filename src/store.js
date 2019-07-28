import Vue from 'vue'
import Vuex from 'vuex'
import globalAxios from 'axios'
import axios from './axios-auth'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    authUser(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId
    },
    storeUser(state, user) {
      state.user = user
    },
    clearAuthData(state){
      state.idToken = null,
        state.userId = null
    }
  },
  actions: {
    setLogoutTimer({ commit }, expirationTime) {
      setTimeout(() => {
        commit('clearAuthData')
      }, expirationTime * 1000)
    },
    signup({ commit, dispatch }, authData) {
      axios.post('/accounts:signUp?key=AIzaSyC4HcfsXY4dgobvOBBv7JGZHCkHjYtqk-8',  { 
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
      .then(response => {
        console.log(response)
        commit('authUser', {
          token: response.data.idToken,
          userId: response.data.localId
        })
        
        const now = new Date();
        const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000)
        localStorage.setItem('token', response.data.idToken)
        localStorage.setItem('expiresIn', expirationDate)

        dispatch('storeUser', authData)
        dispatch('setLogoutTimer', response.data.expiresIn)
      })
      .catch(error => {
        console.log(error)
      })
    },
    login({ commit, dispatch }, authData) {
      axios.post('/accounts:signInWithPassword?key=AIzaSyC4HcfsXY4dgobvOBBv7JGZHCkHjYtqk-8',  {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
      .then(response => {
        console.log(response)

        const now = new Date();
        const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000)
        localStorage.setItem('token', response.data.idToken)
        localStorage.setItem('expiresIn', expirationDate)
        
        commit('authUser', {
          token: response.data.idToken,
          userId: response.data.localId
        })
        
        dispatch('setLogoutTimer', response.data.expiresIn)
      })
      .catch(error => {
        console.log(error)
      })
    },
    logout({ commit }) {
      commit('clearAuthData')
      router.replace('/signin')
    },
    storeUser({ commit, state }, userData) {
      if (!state.idToken) {
        return
      }
      globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
        .then(response => {
        console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    },
    fetchUser({ commit, state }) {
      if (!state.idToken) {
        return
      }
      globalAxios.get('/users.json' + '?auth=' + state.idToken)
      .then(res => {
        console.log(res)
        const data = res.data;
        const users = []
        for(let key in data){
          const user = data[key]
          user.id = key;
          users.push(user)
        }
        console.log(users)
        // this.email = users[0].email
        commit('storeUser', users[0])
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  getters: {
    user(state) {
      return state.user
    },
    isAuthenticated(state) {
      return state.idToken !== null
    }
  }
})