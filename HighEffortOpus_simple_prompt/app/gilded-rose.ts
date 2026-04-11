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

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      if (item.name === 'Sulfuras, Hand of Ragnaros') {
        continue;
      }

      if (item.name === 'Aged Brie') {
        item.quality += 1;
        if (item.sellIn <= 0) {
          item.quality += 1;
        }
        item.quality = Math.min(item.quality, 50);
      } else if (item.name === 'Backstage passes to a TAFKAL80ETC concert') {
        if (item.sellIn <= 0) {
          item.quality = 0;
        } else if (item.sellIn <= 5) {
          item.quality += 3;
        } else if (item.sellIn <= 10) {
          item.quality += 2;
        } else {
          item.quality += 1;
        }
        item.quality = Math.min(item.quality, 50);
      } else if (item.name.startsWith('Conjured')) {
        item.quality -= 2;
        if (item.sellIn <= 0) {
          item.quality -= 2;
        }
        item.quality = Math.max(item.quality, 0);
      } else {
        item.quality -= 1;
        if (item.sellIn <= 0) {
          item.quality -= 1;
        }
        item.quality = Math.max(item.quality, 0);
      }

      item.sellIn -= 1;
    }

    return this.items;
  }
}
