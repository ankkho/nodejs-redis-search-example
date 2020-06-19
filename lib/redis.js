import * as redis from 'redis'
import { promisify } from 'util'
import * as rediSearchClient from 'redisearchclient'
import * as redisearch from 'redis-redisearch'

redisearch(redis)

const { REDIS_HOST, REDIS_PORT } = process.env
const indexName = 'activities'

const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  no_ready_check: true,
  retry_unfulfilled_commands: true,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a keyNameindividual error
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  },
})

redisClient.on('ready', function () {
  logger.info('Connection with redis is ready!')
})

redisClient.on('connect', function () {
  logger.info('Connected with redis')
})

redisClient.on('reconnecting', function () {
  logger.info('Reconnecting with redis...')
})

redisClient.on('end', function (error) {
  logger.error('Connection ended with redis', error)
})

redisClient.on('warning', function (error) {
  logger.warn('Warning from Redis', error)
})

// ------

const redisSearch = destination => {
  try {
    return rediSearchClient(redisClient, `${destination}:${indexName}`)
  } catch (error) {
    logger.error('Something went wrong: redisSearch', error.message)
  }
}

const searchRecord = ({ query, destination }) => {
  try {
    return new Promise((resolve, reject) =>
      redisSearch(destination).search(`@title:(${query}*)`, (err, res) =>
        err ? reject(err) : resolve(res.results)
      )
    )
  } catch (error) {
    logger.error('Something went wrong: searchRecord', error.message)
  }
}

export {
  setAsync,
  getAsync,
  existsAsync,
  searchRecord,
}
