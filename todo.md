- Fix Practice View Page so its not so ugly
- Set the primary and secondary colors to be the purple

- Have it be specifically made for language learning,
  so that it can compete against quizlet

- Starter island creator for who you are, your hobbies, what you do for work

- Dropdowns for each island created
- Choose to drill all of them or just section by section
- Link them to other islands
  Type: Question, Statment, Command
- Unlimeted generations with premium
- Only allow generation of 3 islands with free version
- Add the ability to drill each island
- Add ability to generate with ai

- Make specifiically for spanish learning
- Add ability for forums and practicing with other people like tandem
- Also notes in phone

## Advanced

- Add ability to add images to each island
- Click on the text for the translation

## Learn Todo

- Tailwind
- React 19
- React hook form
- react-query
- Nextjs
- Drizzle
- Stripe
- Cursor
- Whats your email? part of the flow

## MVP DTOD

- Undo stash to add stuff for rate limiting
- Coors to prevent cross origing request to endpoint

- Form refactor

  - Refactor to be server action
    - Add validation and error handling
    - Add better loading state
      - Message saying that it might take some time
      - Something to fill in the white space
    - Add better error handling
  - Refactor to be react hook form
  - Refactor to be nextjs server actions with a uuid that saves the world to the database
  - Refactor the response object to just be an array with {category: string, cards: string[]} so that we don't have to update
    response object everytime

- Fix loading state for form, Fix form clear, add validation

  - refactor to use react-hook-form
  - refactor to use nextjs server actions with a uuid that saves the world to the database
  - refactor the response object to just be an array with {category: string, cards: string[]} so that we don't have to update
    response object everytime
  - Maybe do form action stuff
  - Make it so instead of email it asks for user to create an account
  - On account creation, use clerk webhook to get the user id and save it to the database
    - create their world deck for them
    - Redirect to the dashboard page

- Add google analytics
- Make sure api rate limit is working correctly
- Make the flashcard count per category work, in the select [x]
- Make sure shadcn styles are working correcly, add custom touch to it
- Make sure landing page is working correctly
- Just make everything free for now to get user sign ups, add in pricing stuff later
- Make the study workflow page work
- Make it so the user can see their decks, practice them, can crud them. Crud with AI generation
  - Page that shows all the decks, on the deck page, can see all the cards in the deck, and can crud the cards
  - Little star icon for appending to the deck with ai. Choose how many cards to generate, can preview the cards and choose to append more or all
  - CRUD decks, and the cards in the deck
  - Sound for card pronunciation
  - Can mark card as easy, medium, hard then sort by that (In the future would be spaced repetition algorithm)
- Learn how openai token usage and cost works, and try to use the least amount of tokens possible, make sure quota is working correctly
  - How many requests should the user be able to make?
  - What model should we use
  - How to prevent abuse?
- Can see their progress
- Update the home page to just be more of an about page, don't show the pricing stuff
- Make a side bar for reporting bugs and feature requests, make it clear that this is a beta version
- Refactor form to use react hook form
- Add tests
- DEPLOY

- We are recieivng a large volume of requests error message

## done

- Add in api endpoint for generating cards with validation
- Add in I am not a robot captcha

## More ideas

- User can share and (Sell their decks?)
- User gets points for the amount of cards they've studied
- Chrome extension for saving flashcards
- Study tips section about active recall
- Using eleven labs to generate audio
- Youtube video each day explaining new concepts I learned like web dev Cody

- LinkedIn posts of this content and building my saas app in publix
