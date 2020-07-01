import { searchRecord, createIndex, redisSearch, indexName } from '../lib/redis'
import { logger, filterResults } from '../utils'

async function searchByTitle(ctx) {

  if (!ctx.request.query.title) {
    return ctx.send(401, {
      message: "Please provide a title as query param"
    })
  }

  const { title: query } = ctx.request.query
  const response = await searchRecord({ query })

  return ctx.ok({
    results: filterResults(response)
  })
}

export default searchByTitle