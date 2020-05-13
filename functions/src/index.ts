import * as functions from 'firebase-functions'
const { Nuxt } = require('nuxt')
const envs = functions.config().environment

const nuxt = new Nuxt({
  dev: false,
  buildDir: '.nuxt'
})

Object.entries(envs).forEach((key, value) => {
  process.env[`${key}`.toUpperCase()] = String(value)
})

exports.ssr = functions.https.onRequest(async (request, response) => {
  await nuxt.ready()
  return nuxt.render(request, response)
})
