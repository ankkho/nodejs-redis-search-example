import redis from 'redis'
import rediSearchClient from 'redisearchclient'
import redisearch from 'redis-redisearch'
import { logger } from '../utils'

redisearch(redis)

const { REDIS_HOST: host, REDIS_PORT: port } = process.env
const indexName = 'books'

const redisClient = redis.createClient({
  host,
  port,
  no_ready_check: true,
  retry_unfulfilled_commands: true,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection')
    } else if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted')
    } else if (options.attempt > 10) {
      return undefined
    }

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

const redisSearch = rediSearchClient(redisClient, indexName)

// ------------------------------------------------------------------------------------------------------------------------

const searchRecord = ({ query }) => {
  try {
    logger.info(`incoming search query: ${query}`)

    return new Promise((resolve, reject) =>
      redisSearch.search(`@title:(${query}*)`, (err, res) =>
        err ? reject(err) : resolve(res.results)
      )
    )
  } catch (error) {
    logger.error('Something went wrong: searchRecord', error.message)
  }
}

export {
  indexName,
  redisSearch,
  searchRecord,
}
