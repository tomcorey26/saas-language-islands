Core Features

- CRUD operations for decks and flashcards (In progress)
- Generate a deck of flashcards for a language with AI
- Listen to the flashcard audio, https://chatgpt.com/g/g-p-6830d38038b481919c372062694b024e-language-islands/c/6830d3a1-2608-8010-9ffd-655047444f72
- Study the deck with a space repetition UI system that is fun and engaging

5/23/2025
What I learned:
You have to export the enum types from the drizzle shema for them to work
Db migrations are like git commits for the db
It is a marathon not a spring, just pick 1 feature and finish it each day
I should be keeping track of the services I am using and the costs
I learned about parallel routes and how they can be used to render pages as slots, they need a default tsx to be renderd correctly

<!-- - Just have one subscription tier for now to start, Maybe
  put others behind a toggle -->

- Swap to using gemini for the flashcard generation

- Click and study. Doulingo style flow that allows you to study the phrases in the deck using the games reccomended by polyglots
- Or just regular study mode
- Have default study decks that are the most popular phrases for each language

- TODO: Fix issue with timeout for flashcard creation. Might have to pay for vercel
- Follow the tutorial and apply to project
- Refactor to do in a more nextjs server rendered way for the decks page. Maybe try vibe coding it for an example
- Update versions

- login
- Add stuff in place to only allow the user to delete the deck if they are the owner
- Do the whole tutorial, understand it, and make updates to the app based on it
- Add custom styling to shadcn
- Add pre-generated decks with the most common words and phrases for each language, have a button that allows the user to just mindlessly pick that
- Add that as one of the premium features

- Migrate to using supabase

- Add basically the elevator pitch to the home page, explain why this is better then other flashcard apps, cite polyglots,
- Create a functional dashboard

  - Switch between languages in the deck study,
    configure what languages you want
  - Can edit and create decks with the ai
  - View decks
  - Create decks
  - Delete decks
  - Study decks,
    - Just make the same as espanol deck
  - View stats
  - Add flashcards to deck
  - Delete flashcards from deck

- Save the users deck into the db after it is generated with an id
- Redirect to serverside generated page with id
- On save & study click, after webhook. Assign deck to userId
- On dashbaord, show them the premium option with a modal

- Add in the thing that saves the world to the database
- Maybe use a different ai model for the flashcards
- Do something that pre-renders the captcha
- Make marketing page mobile friendly

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
- Add the ability to drill each island
- Add ability to generate with ai

- Add ability for forums and practicing with other people like tandem

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
