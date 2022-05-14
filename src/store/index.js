import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 存储所有组件需要共享的数据
  state: {
    // 用于登陆成功之后保存用户信息,初始值尝试读取本地存储
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  getters: {},
  // 用来修改store里的值
  mutations: {
    // 储存用户数据
    setUser (state, payload) {
      // 将payload转换为json在存储
      state.user = JSON.parse(payload)
      // 将payload数据进行本地存储
      window.localStorage.setItem('user', payload)
    }
  },
  // 异步功能
  actions: {},
  modules: {}
})
