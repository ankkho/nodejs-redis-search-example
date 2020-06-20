import { redisSearch, indexName } from './lib/redis'
import { logger } from './utils'

const books = [{
  id: 1,
  title: "Do Androids Dream of Electric Sheep? (Blade Runner, #1)",
  summary: "It was January 2021, and Rick Deckard had a license to kill. Somewhere among the hordes of humans out there, lurked several rogue androids.Deckard's assignment--find them and then...",
  authorName: "Philip K. Dick",
  rating: 4
}, {
  id: 2,
  title: "The Hitchhiker's Guide to the Galaxy (Hitchhiker's Guide to the Galaxy, #1)",
  summary: "Seconds before the Earth is demolished to make way for a galactic freeway, Arthur Dent is plucked off the planet by his friend Ford Prefect, a researcher for the revised edition of The Hitchhiker's Guide to the Galaxy who, for the last fifteen years, has been posing as an out-of-work actor.",
  authorName: "Douglas Adams",
  rating: 4
}, {
  id: 3,
  title: "Something Wicked This Way Comes (Green Town, #2)",
  summary: "One of Ray Bradbury’s best-known and most popular novels, Something Wicked This Way Comes, now featuring a new introduction and material about its longstanding influence on culture and genre.",
  authorName: "Ray Bradbury",
  rating: 3
}, {
  id: 4,
  title: "Pride and Prejudice and Zombies (Pride and Prejudice and Zombies, #1)",
  summary: "“It is a truth universally acknowledged that a zombie in possession of brains must be in want of more brains. So begins Pride and Prejudice and Zombies, an expanded edition of the beloved Jane Austen novel featuring all-new scenes of bone-crunching zombie mayhem. ",
  authorName: "Seth Grahame-Smith",
  rating: 3
}, {
  id: 5,
  title: "The Curious Incident of the Dog in the Night-Time",
  summary: "Christopher John Francis Boone knows all the countries of the world and their capitals and every prime number up to 7,057. He relates well to animals but has no understanding of human emotions. He cannot stand to be touched. And he detests the color yellow.",
  authorName: "Mark Haddon",
  rating: 4
}, {
  id: 6,
  title: "I Was Told There'd Be Cake",
  summary: "From the author of the novel, The Clasp, hailed by Michael Chabon, Heidi Julavits, and J. Courtney Sullivan. Wry, hilarious, and profoundly genuine, this debut collection of literary essays from Sloane Crosley is a celebration of fallibility and haplessness in all their glory.",
  authorName: "Sloane Crosley",
  rating: 3
}]

const addRecords = () => books.map((val, index) => {
  redisSearch.add(indexName, val, (err, resp) => {
    if (err) {
      logger.error("Error occured while adding records to index: ", err)
    }
    const { id, title } = val
    logger.info(`Book with title: ${title} and ID: ${id} has been added to index`)

    if (index === 5) {
      process.exit(0)
    }
  })
})

redisSearch.createIndex([
  redisSearch.fieldDefinition.numeric('id', false),
  redisSearch.fieldDefinition.numeric('rating', false),
  redisSearch.fieldDefinition.text('title'),
  redisSearch.fieldDefinition.text('summary'),
  redisSearch.fieldDefinition.text('authorName')
], (err, resp) => {
  if (err) {
    logger.error('Error occured while creating index:', err)
  }
  logger.info(`Index with name: ${indexName} has been created`, resp)
  addRecords()
})


