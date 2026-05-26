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

interface ItemUpdateRule {
  updateQuality(item: Item): void;
}

const NormalItemRule: ItemUpdateRule = {
  updateQuality(item: Item): void {
    const degradeRate = item.sellIn <= 0 ? 2 : 1;
    item.quality = Math.max(0, item.quality - degradeRate);
    item.sellIn -= 1;
  },
};

const AgedBrieRule: ItemUpdateRule = {
  updateQuality(item: Item): void {
    const increaseRate = item.sellIn <= 0 ? 2 : 1;
    item.quality = Math.min(50, item.quality + increaseRate);
    item.sellIn -= 1;
  },
};

const SulfurasRule: ItemUpdateRule = {
  updateQuality(_item: Item): void {
    // Legendary item: never changes
  },
};

const BackstagePassRule: ItemUpdateRule = {
  updateQuality(item: Item): void {
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
  },
};

function conjuredRule(baseRule: ItemUpdateRule): ItemUpdateRule {
  return {
    updateQuality(item: Item): void {
      const qualityBefore = item.quality;
      baseRule.updateQuality(item);
      const delta = item.quality - qualityBefore;
      if (delta !== 0) {
        item.quality = Math.max(0, Math.min(50, qualityBefore + delta * 2));
      }
    },
  };
}

const SPECIAL_ITEMS: ReadonlyMap<string, ItemUpdateRule> = new Map([
  ['Aged Brie', AgedBrieRule],
  ['Sulfuras, Hand of Ragnaros', SulfurasRule],
  ['Backstage passes to a TAFKAL80ETC concert', BackstagePassRule],
]);

const CONJURED_PREFIX = 'Conjured ';

function getRuleForItem(item: Item): ItemUpdateRule {
  const specialRule = SPECIAL_ITEMS.get(item.name);
  if (specialRule) return specialRule;

  if (item.name.startsWith(CONJURED_PREFIX)) {
    const baseName = item.name.slice(CONJURED_PREFIX.length);
    const baseRule = SPECIAL_ITEMS.get(baseName) ?? NormalItemRule;
    return conjuredRule(baseRule);
  }

  return NormalItemRule;
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality(): Array<Item> {
    for (const item of this.items) {
      getRuleForItem(item).updateQuality(item);
    }
    return this.items;
  }
}
