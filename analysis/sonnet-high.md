# Code Analysis — `app/app.ts`

## Purpose

Inventory system for a shop. Items have three properties:
- `name` — identifier
- `sellIn` — days remaining until sell-by date
- `quality` — value/freshness score (capped at 50, min 0)

The `update()` method runs once per day and applies degradation/appreciation rules per item type. Three special item types are handled by name:

| Dutch name    | Behaviour                                                                 |
|---------------|---------------------------------------------------------------------------|
| `Aged Brie`  | Quality increases over time (ages well, like Aged Brie)                   |
| `Backstage passes to a TAFKAL80ETC concert`   | Quality increases as event approaches, drops to 0 after sell date         |
| `Sulfuras, Hand of Ragnaros`      | Legendary item — quality and sellIn never change                          |

All other items degrade normally: −1/day, −2/day after sell-by passes.

---

## Code Smells

### 1. Magic strings scattered throughout
Item types are identified by raw string literals (`'Aged Brie'`, `'Backstage passes to a TAFKAL80ETC concert'`, `'Sulfuras, Hand of Ragnaros'`) in at least 8 places. A typo silently breaks behaviour with no compiler or runtime error.

### 2. Deep nesting (up to 5 levels)
The `update()` method is a pyramid of nested `if` blocks. The actual logic is hard to follow — conditions like "not not Backstage passes to a TAFKAL80ETC concert" require mental inversion to parse.

### 3. All logic in one method — no polymorphism
Every item type is handled with `if/else` branches inside a single loop. Adding a new item type requires modifying `update()`, violating the Open/Closed Principle. The classic fix is a strategy per item type.

### 4. Redundant quality-zeroing expression (line 57)
```ts
this.items[i].quality = this.items[i].quality - this.items[i].quality
```
This is just `quality = 0`. The unusual expression obscures intent and may confuse reviewers into thinking something more complex is happening.

### 5. No named constants for bounds and thresholds
The values `50`, `11`, `6`, and `0` appear inline. Their meaning (max quality, ticket tiers) is not captured anywhere.

### 6. Array-index loop over a typed array
`for (let i = 0; i < this.items.length; i++)` with `this.items[i]` repeated 20+ times. `for...of` or `.map()` would be cleaner and remove the index noise.

### 9. No input validation
`Item` quality is unbounded at construction — nothing prevents `new Item('foo', 5, 999)`. The cap of 50 is only enforced inside `update()`.

---

## Design Observations

### Primitive obsession / anemic domain model
`Item` is a plain data bag with no behaviour. All rules live in `App`. Grouping update logic with the item type it belongs to (via subclassing or a strategy) would isolate each rule set and make them independently testable.

### `App` owns what `Item` should own
The `quality` and `sellIn` update rules are properties of each item type, not of the inventory. `App` should delegate to items, not inspect their names.

### The kata shape
This is recognisably the **Gilded Rose** refactoring kata. The implementation intentionally embeds all the complexity in one hard-to-change method. The expected next step is a refactor — likely introducing polymorphism, a type registry, or a strategy map — without changing observable behaviour.

---

## Suggested Backlog Items

1. **Extract item-type constants** — eliminate magic strings first (low risk, high readability gain)
2. **Introduce item strategies** — one class/function per item type with a shared interface
3. **Add quality boundary enforcement at construction** — guard in `Item` constructor
4. **Add/expand test coverage** — verify all item types across sell-date boundaries before refactoring
