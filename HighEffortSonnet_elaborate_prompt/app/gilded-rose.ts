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

const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const AGED_BRIE = 'Aged Brie';
const BACKSTAGE_PASS = 'Backstage passes to a TAFKAL80ETC concert';

const MAX_QUALITY = 50;
const MIN_QUALITY = 0;

function clampQuality(quality: number): number {
  return Math.min(MAX_QUALITY, Math.max(MIN_QUALITY, quality));
}

function baseName(name: string): string {
  return name.startsWith('Conjured ') ? name.slice('Conjured '.length) : name;
}

function qualityRate(name: string): number {
  return name.startsWith('Conjured ') ? 2 : 1;
}

function updateNormalItem(item: Item, rate: number = 1): void {
  item.sellIn -= 1;
  const degradeBy = item.sellIn < 0 ? 2 : 1;
  item.quality = clampQuality(item.quality - degradeBy * rate);
}

function updateAgedBrie(item: Item, rate: number = 1): void {
  item.sellIn -= 1;
  const increaseBy = item.sellIn < 0 ? 2 : 1;
  item.quality = clampQuality(item.quality + increaseBy * rate);
}

function updateBackstagePass(item: Item, rate: number = 1): void {
  item.sellIn -= 1;
  if (item.sellIn < 0) {
    item.quality = MIN_QUALITY;
    return;
  }
  const increaseBy = item.sellIn < 5 ? 3 : item.sellIn < 10 ? 2 : 1;
  item.quality = clampQuality(item.quality + increaseBy * rate);
}

function updateItem(item: Item): void {
  const base = baseName(item.name);
  const rate = qualityRate(item.name);

  if (base === SULFURAS) return;
  if (base === AGED_BRIE) return updateAgedBrie(item, rate);
  if (base === BACKSTAGE_PASS) return updateBackstagePass(item, rate);

  updateNormalItem(item, rate);
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      updateItem(item);
    }
    return this.items;
  }
}
