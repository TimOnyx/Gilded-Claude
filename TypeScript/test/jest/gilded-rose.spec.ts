import { Item, GildedRose } from '@/gilded-rose';

describe('Gilded Rose', () => {

  describe('Normal items', () => {
    it('degrades quality by 1 before sell date', () => {
      const gildedRose = new GildedRose([new Item('Elixir', 10, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(19);
      expect(items[0].sellIn).toBe(9);
    });

    it('degrades quality by 2 after sell date', () => {
      const gildedRose = new GildedRose([new Item('Elixir', 0, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(18);
    });

    it('quality never goes negative', () => {
      const gildedRose = new GildedRose([new Item('Elixir', 5, 0)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(0);
    });
  });

  describe('Aged Brie', () => {
    it('increases quality over time', () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 5, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(11);
    });

    it('increases quality by 2 after sell date', () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 0, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(12);
    });

    it('quality never exceeds 50', () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 5, 50)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(50);
    });
  });

  describe('Sulfuras', () => {
    it('never changes quality or sellIn', () => {
      const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 0, 80)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(80);
      expect(items[0].sellIn).toBe(0);
    });
  });

  describe('Backstage passes', () => {
    it('increases quality by 1 when sellIn > 10', () => {
      const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(21);
    });

    it('increases quality by 2 when sellIn <= 10', () => {
      const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(22);
    });

    it('increases quality by 3 when sellIn <= 5', () => {
      const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(23);
    });

    it('drops quality to 0 after concert', () => {
      const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(0);
    });

    it('quality never exceeds 50', () => {
      const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(50);
    });
  });

  describe('Conjured items', () => {
    it('degrades quality by 2 before sell date', () => {
      const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 10, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(18);
      expect(items[0].sellIn).toBe(9);
    });

    it('degrades quality by 4 after sell date', () => {
      const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 0, 20)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(16);
    });

    it('quality never goes negative', () => {
      const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 5, 1)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(0);
    });

    it('quality never goes negative when expired with low quality', () => {
      const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 0, 3)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(0);
    });
  });

});
