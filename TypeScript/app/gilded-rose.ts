export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

interface ItemStrategy {
  update(item: Item): void;
}

class NormalItem implements ItemStrategy {
  update(item: Item): void {
    const degradation = item.sellIn <= 0 ? 2 : 1;
    item.quality = Math.max(0, item.quality - degradation);
    item.sellIn -= 1;
  }
}

class AgedBrie implements ItemStrategy {
  update(item: Item): void {
    const increase = item.sellIn <= 0 ? 2 : 1;
    item.quality = Math.min(50, item.quality + increase);
    item.sellIn -= 1;
  }
}

class Sulfuras implements ItemStrategy {
  update(item: Item): void {
    // Legendary item: never sold, never changes
  }
}

class BackstagePass implements ItemStrategy {
  update(item: Item): void {
    if (item.sellIn <= 0) {
      item.quality = 0;
    } else if (item.sellIn <= 5) {
      item.quality = Math.min(50, item.quality + 3);
    } else if (item.sellIn <= 10) {
      item.quality = Math.min(50, item.quality + 2);
    } else {
      item.quality = Math.min(50, item.quality + 1);
    }
    item.sellIn -= 1;
  }
}

const STRATEGIES: Record<string, ItemStrategy> = {
  "Aged Brie": new AgedBrie(),
  "Sulfuras, Hand of Ragnaros": new Sulfuras(),
  "Backstage passes to a TAFKAL80ETC concert": new BackstagePass(),
};

const DEFAULT_STRATEGY: ItemStrategy = new NormalItem();

const CONJURED_PREFIX = "Conjured ";

class Conjured implements ItemStrategy {
  constructor(private base: ItemStrategy) {}

  update(item: Item): void {
    const qualityBefore = item.quality;
    this.base.update(item);
    const delta = item.quality - qualityBefore;
    if (delta !== 0) {
      item.quality = Math.max(0, Math.min(50, qualityBefore + delta * 2));
    }
  }
}

function getStrategy(name: string): ItemStrategy {
  if (name.startsWith(CONJURED_PREFIX)) {
    const baseName = name.slice(CONJURED_PREFIX.length);
    return new Conjured(STRATEGIES[baseName] ?? DEFAULT_STRATEGY);
  }
  return STRATEGIES[name] ?? DEFAULT_STRATEGY;
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      getStrategy(item.name).update(item);
    }
    return this.items;
  }
}
