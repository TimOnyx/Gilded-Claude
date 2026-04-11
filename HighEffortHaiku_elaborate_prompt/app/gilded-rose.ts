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
    for (let i = 0; i < this.items.length; i++) {
      this.updateItem(this.items[i]);
    }
    return this.items;
  }

  private updateItem(item: Item) {
    this.updateQualityForItem(item);
    this.updateSellInForItem(item);
    this.updateQualityAfterSellDate(item);
  }

  private updateQualityForItem(item: Item) {
    if (this.isSulfuras(item)) {
      return;
    }

    if (this.isAgedBrie(item)) {
      this.increaseQuality(item);
    } else if (this.isBackstagePass(item)) {
      this.updateBackstagePassQuality(item);
    } else if (this.isConjured(item)) {
      this.decreaseQuality(item, 2);
    } else {
      this.decreaseQuality(item, 1);
    }
  }

  private updateSellInForItem(item: Item) {
    if (!this.isSulfuras(item)) {
      item.sellIn = item.sellIn - 1;
    }
  }

  private updateQualityAfterSellDate(item: Item) {
    if (item.sellIn >= 0) {
      return;
    }

    if (this.isSulfuras(item)) {
      return;
    }

    if (this.isAgedBrie(item)) {
      this.increaseQuality(item);
    } else if (this.isBackstagePass(item)) {
      item.quality = 0;
    } else if (this.isConjured(item)) {
      this.decreaseQuality(item, 2);
    } else {
      this.decreaseQuality(item, 1);
    }
  }

  private updateBackstagePassQuality(item: Item) {
    this.increaseQuality(item);

    if (item.sellIn < 11) {
      this.increaseQuality(item);
    }

    if (item.sellIn < 6) {
      this.increaseQuality(item);
    }
  }

  private increaseQuality(item: Item, amount: number = 1) {
    const maxQuality = this.isSulfuras(item) ? 80 : 50;
    item.quality = Math.min(item.quality + amount, maxQuality);
  }

  private decreaseQuality(item: Item, amount: number = 1) {
    item.quality = Math.max(item.quality - amount, 0);
  }

  private isSulfuras(item: Item): boolean {
    return item.name === 'Sulfuras, Hand of Ragnaros';
  }

  private isAgedBrie(item: Item): boolean {
    return item.name === 'Aged Brie';
  }

  private isBackstagePass(item: Item): boolean {
    return item.name === 'Backstage passes to a TAFKAL80ETC concert';
  }

  private isConjured(item: Item): boolean {
    return item.name.includes('Conjured');
  }
}
