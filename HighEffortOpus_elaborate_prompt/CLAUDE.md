# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

This is the **Gilded Rose Refactoring Kata** (TypeScript version). The goal is to refactor the legacy `updateQuality()` method in `app/gilded-rose.ts` while preserving existing behavior, then add support for "Conjured" items. The full requirements spec is at `GildedRoseRequirements.md`.

## Key Constraint

**Do not modify the `Item` class** — only the `GildedRose.updateQuality()` method and any new code you add. The `Item` class is off-limits per the kata rules.

## Commands

```sh
npm install              # install dependencies
npm run test:jest        # run Jest tests (test/jest/)
npm run test:jest:watch  # run Jest tests in watch mode
npm run test:mocha       # run Mocha tests with coverage (test/mocha/)
npm run test:vitest      # run Vitest tests with coverage (test/vitest/)
npx ts-node test/golden-master-text-test.ts      # run golden master text fixture (default 2 days)
npx ts-node test/golden-master-text-test.ts 30   # run golden master for N days
```

There is no dedicated lint or build command — the kata focuses on refactoring and testing.

## Architecture

- **`app/gilded-rose.ts`** — The sole production code file. Contains `Item` (data class) and `GildedRose` (with the `updateQuality()` method to refactor). This is where all refactoring work happens.
- **`test/golden-master-text-test.ts`** — Text-based fixture that prints item state over multiple days. Used for approval/snapshot testing and TextTest integration.
- **`test/jest/`** — Jest test files. `gilded-rose.spec.ts` has a starter unit test; `approvals.spec.ts` has snapshot-based approval tests.
- **`test/vitest/`** and **`test/mocha/`** — Equivalent starter tests for those frameworks.

The path alias `@/*` maps to `app/*` (configured in `tsconfig.json` and mirrored in jest/vitest/mocha configs). Tests import using `@/gilded-rose`.

## Business Rules (from requirements)

- Normal items: quality degrades by 1/day; by 2/day after sellIn < 0
- Quality is never negative and never exceeds 50 (except Sulfuras at 80)
- **Aged Brie**: quality increases over time
- **Sulfuras**: never sold, quality never changes (always 80)
- **Backstage passes**: quality increases by 1 when sellIn > 10, by 2 when sellIn <= 10, by 3 when sellIn <= 5, drops to 0 after concert
- **Conjured items** (not yet implemented): degrade in quality twice as fast as normal items
