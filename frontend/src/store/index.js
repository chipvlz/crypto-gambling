import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((_modules, modulePath) => {
  // set './app.js' => 'app'
  const paramModules = _modules
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  paramModules[moduleName] = value.default
  return paramModules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store
