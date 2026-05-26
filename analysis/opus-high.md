# Code Analysis: `app/app.ts`

Prepared for backlog refinement.

## 1. Purpose

This is a variant of the well-known **Gilded Rose kata**. It models a shop's daily inventory update.

- `Item` holds a `name`, a `sellIn` (days remaining before the sell-by date) and a `quality` (value of the item).
- `App.update()` is called once per day and mutates every item in the inventory according to a set of business rules.

The business rules encoded in the current implementation:


| Item name                                   | Likely real-world analog | Behavior                                                                                                  |
| --------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| *(default)*                                 | Normal goods             | `quality` decreases by 1 per day, by 2 per day once `sellIn < 0`. Clamped at 0.                           |
| `Aged Brie`                                 | Aged Brie                | `quality` increases by 1 per day, by 2 per day once expired. Capped at 50.                                |
| `Backstage passes to a TAFKAL80ETC concert` | Backstage passes         | `quality` +1 per day normally; +2 when `sellIn < 11`; +3 when `sellIn < 6`; drops to 0 once `sellIn < 0`. |
| `Sulfuras, Hand of Ragnaros`                | Sulfuras (legendary)     | Never ages, never changes quality.`sellIn` is also never decremented.                                     |

Invariants the rules imply (but which are **not enforced structurally** in the code):

- `0 ≤ quality ≤ 50` for all items except `Sulfuras, Hand of Ragnaros` (which may sit above 50, e.g. at 80).
- `Sulfuras, Hand of Ragnaros` is immutable.

## 2. Code Smells

### 2.1 Deeply nested conditionals

`update()` nests up to 5 levels of `if` blocks. The control flow is a decision tree expressed entirely through negated string comparisons, which is hard to read and harder to change safely.

### 2.2 Negated equality as primary branching

Almost every branch is of the form `name != 'X'`. The reader must invert the logic mentally to understand which path applies to which item type. Positive `switch`/dispatch on `name` would be far clearer.

### 2.3 Magic strings

Item identifiers (`'Aged Brie'`, `'Backstage passes to a TAFKAL80ETC concert'`, `'Sulfuras, Hand of Ragnaros'`) are scattered as string literals throughout the method. A typo anywhere silently changes behavior — there is no compile-time safety. These should be constants or an enum/union type.

### 2.4 Magic numbers

`50` (quality cap), `11` and `6` (backstage-pass thresholds), `0` (quality floor) appear inline with no named meaning.

### 2.5 Duplicate guard clauses

`if (quality < 50)` is repeated three times in the `Backstage passes to a TAFKAL80ETC concert` branch. The cap should be enforced **once**, after the quality change.

### 2.6 Dead/odd expression: `quality = quality - quality`

Line 57 sets quality to 0 via `quality - quality`. This is functionally correct but needlessly obscure and would behave unexpectedly for non-numeric values. Should be `quality = 0`.

### 2.7 Untyped constructor parameters

```ts
constructor(name, sellIn, quality) { ... }
```

The class fields are typed, but the constructor parameters are not — they fall back to implicit `any`. A caller could construct `new Item(42, "tomorrow", null)` with no complaint from TypeScript.

### 2.8 Anemic domain model

`Item` is a pure data bag. All behavior lives in `App.update()`, which means each new item type requires editing one growing god-method — a textbook **Open/Closed Principle** violation.

### 2.9 Mutation + shared reference

`update()` mutates `this.items` in place **and** returns the same array. Callers cannot tell from the signature whether they receive a new snapshot or a live reference; in reality it is live, so mutating the result mutates internal state.

### 2.10 Imperative index loop

`for (let i = 0; i < this.items.length; i++)` with repeated `this.items[i].X` access is noisy. `for (const item of this.items)` would both read better and avoid repeated indexing.

## 3. Design Observations

### 3.1 A single method owns all product variants

Each new kind of item — "Conjured", a new legendary, a seasonal promo — requires editing `update()` and adding another nested branch. This scales poorly and is a high-risk area for regressions.

A more sustainable design would move per-item behavior behind a single abstraction, e.g.:

- **Polymorphism**: `Item` subclasses (`StandardItem`, `AgedItem`, `EventPassItem`, `LegendaryItem`), each with its own `tick()`.
- **Strategy map**: `name` → update-strategy function, with a default strategy for standard items.
- **Rule table**: declarative `{ qualityDelta, cap, floor, expiredMultiplier, immutable }` per item type, evaluated by one generic engine.

Any of the three would remove the nested `if` pyramid and make adding items a localized change.

### 3.2 Ordering of sellIn decrement is load-bearing

`sellIn` is decremented **between** the pre-expiry quality update and the post-expiry quality update. That ordering is intentional (it is what makes "double decay after expiry" work), but nothing in the code documents this. Refactors that reorder these steps will silently change semantics.

### 3.3 Quality clamping is inconsistent

The cap of 50 is checked in *some* branches, the floor of 0 is checked in *others*. A single post-update clamp for non-legendary items would be safer and simpler.

### 3.4 No separation between "read rules" and "apply rules"

Because the update both decides what to do and mutates state in one pass, it is difficult to unit-test rules in isolation or to replay a day's updates deterministically.

### 3.5 No tests present

The folder contains only `app.ts`, `package.json`, `tsconfig.json`. Before any refactor, a characterization-test suite (snapshot the output of `update()` across a broad set of starting states) is essential — the kata is famous for subtle edge cases that are easy to break.

## 4. Non-Obvious Gotchas

These are worth flagging explicitly in refinement because they will bite a refactor that doesn't account for them:

1. **`Sulfuras, Hand of Ragnaros` immutability is implicit.** It is achieved purely by *skipping* the decrement branches. Any new code path that mutates `quality` or `sellIn` must remember to exclude `Sulfuras, Hand of Ragnaros` — there is no central guard. A legendary item can therefore be silently broken by an unrelated change.
2. **`Backstage passes to a TAFKAL80ETC concert` bonus stacks additively.** At `sellIn = 5` the code runs +1, then another +1 (sellIn < 11), then another +1 (sellIn < 6), totaling +3. This is correct but depends on all three branches executing in the same iteration — a reader might assume they are mutually exclusive.
3. **Expired `Backstage passes to a TAFKAL80ETC concert` → 0.** Handled via `quality = quality - quality` on line 57, not an explicit assignment. Easy to miss when skimming.
4. **`Aged Brie` after expiry gains +2/day.** The pre-expiry block adds +1, and the post-expiry block adds another +1. There is no comment calling this out.
5. **`update()` return value aliases internal state.** Callers may inadvertently mutate the class's own array.
6. **Quality is never defensively clamped.** If an item starts with `quality = 100` (legal only for `Sulfuras, Hand of Ragnaros`) but has a non-legendary name, it will drift downward one point at a time rather than snapping into the legal `[0, 50]` range.
7. **Implicit `any` in the constructor** means `Item` can be instantiated with nonsense types without TypeScript complaining. Worth fixing before a larger refactor, so downstream tooling can actually help.

## 5. Suggested Refinement Outcomes

For discussion during refinement, not prescriptive:

- Agree on a **characterization-test** story before any refactor.
- Decide on the **target design** (polymorphism vs. strategy map vs. rule table).
- Extract **item-name constants** / a discriminated union type.
- Fix trivially safe issues as a pre-refactor pass: typed constructor, `quality = 0` instead of `quality - quality`, consistent clamping.
- Document the two load-bearing ordering rules (sellIn decrement, `Sulfuras, Hand of Ragnaros` exclusion) so that the intent survives the refactor.

(usage 12%)
