# Emoji Word Games

Random words for Pictionary, Catchphrase, Charades, Holidays, Subjects, Get to Know You, Wordplay, Movies and Individuals - every word comes with an emoji.

Live app: https://leatheerr.github.io/emoji-word-games/

Same games and categories as randomwordgenerator.com/pictionary.php, with original word lists (70 per category) and a Shuffle button. Teacher's Station edition.

## Editing the word lists

Lists live in `data/*.js` - one `EMOJI text` item per line. After editing, run `node build.js` to check counts/duplicates and regenerate `words.js`.