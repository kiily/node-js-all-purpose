'use strict'
const fetch = require('node-fetch');

//http://localhost:3000/stars?page=2

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
  fastify.get('/stars', {
    schema: {
      querystring: {
        page: { type: 'integer' },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            repos: { type: 'array' },
            totalStars: { type: 'integer' }
          }
        }
      }
    }
  }, async function (request, reply) {
    const page = request.query.page || 1

    const response = await fetch(`https://api.github.com/users/kiily/starred?per_page=100&page=${page}`).then(res => res.json())
    const repos = response.map(repo => ({ name: repo.name, url: repo.url }))
    return { repos, totalStars: repos.length }
  })
}
