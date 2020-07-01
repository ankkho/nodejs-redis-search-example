const logger = require('pino')()

const filterResults = (data) => {
  if (data.length) {
    return data.map(val => {
      const { doc: { id, title, summary, authorName, rating } } = val;

      return ({
        title,
        summary,
        id,
        authorName,
        rating
      })
    })
  }

  return {}
}

export {
  logger,
  filterResults
}