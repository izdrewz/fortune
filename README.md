# Fortunes

Private two-person fortune vending machine game.

## Features

- Two persistent accounts
- Private two-person room
- Realtime messages across different devices
- Synced cookie collections
- 73% Normal
- 6% Broken
- 5% Hard
- 5% Shiny
- 1% Legendary
- 5% Personality
- 5% Country
- Personality sticker unlocks
- Country stamp unlocks
- Shared special fortunes
- Shared notes
- YOM requests
- Achievements
- Collection comparison
- Installable web app / PWA
- CSS placeholders for missing artwork

## Add the supplied cookie art

Save the two provided images as:

assets/cookies/normal-closed.png
assets/cookies/normal-open.png

The game overlays its own white fortune strip and title over the
existing text in normal-open.png.

Missing variants currently reuse the normal cookie with visual effects
or generated placeholders.

## Firebase

Create a Firebase project.

Keep it on the free/Spark configuration and do not attach billing if
you want a hard £0 setup.

Enable:

Authentication -> Sign-in method -> Email/Password

and:

Firestore Database

Then create a Firebase Web App under:

Project settings -> Your apps

Copy the configuration into:

firebase-config.js

## Security rules

Open:

Firestore Database -> Rules

Replace the contents with firestore.rules and publish them.

Do not skip this step.

## GitHub Pages

Upload the repository to GitHub.

Open:

Repository -> Settings -> Pages

Select:

Deploy from a branch

Branch:

main

Directory:

/ (root)

GitHub will provide the game URL.

## First use

Person 1:

1. Create account
2. Create room
3. Copy invite link

Person 2:

1. Open invite
2. Create account
3. Enter their name
4. Join room

After that both accounts have access to the same cookies, chat,
collectibles, achievements and YOM history.

## Replacing placeholder artwork later

The code intentionally keeps game data separate from artwork.

The currently required cookie images are:

assets/cookies/normal-closed.png
assets/cookies/normal-open.png

New art can later be added for:

assets/cookies/broken-closed.png
assets/cookies/broken-open.png
assets/cookies/hard.png
assets/cookies/shiny-closed.png
assets/cookies/shiny-open.png
assets/cookies/legendary-closed.png
assets/cookies/legendary-open.png

Personality stickers and country stamps currently render as styled
text/emoticon placeholders, so the game remains fully playable before
those image assets exist.
