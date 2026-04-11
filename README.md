Testing Claude code using (The Gilded Rose Refactoring Kata)[https://github.com/emilybache/GildedRose-Refactoring-Kata/tree/main/TypeScript].

2 parameters where used:

- Model (Opus / Sonnet / Haiku)
- Prompt

The prompts can be found in the file `prompt.txt`.

In `tokenUsage.txt` you can see how much % of the session token limit was used on a **Pro** plan.

`tokenUsage.txt` might also contain a quick note on things the AI did.

Some notes:

- Opus gave a reasonable result with the simple prompt while both Haiku and Sonnet added to the already existing mess of if/else statements
- Sonnet used just as much tokens on the elaborate prompt while giving a worse result.
- Haiku ignores the request to split the refactor from the conjuraction implementation. With the elaborate prompt, it did have to remove the conjuration implementation again, as it was breaking the tests it wrote before.