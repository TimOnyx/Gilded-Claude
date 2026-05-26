import { Item, GildedRose } from '@/gilded-rose';

function updateItem(name: string, sellIn: number, quality: number): Item {
  const gildedRose = new GildedRose([new Item(name, sellIn, quality)]);
  return gildedRose.updateQuality()[0];
}

describe('Gilded Rose', () => {

  describe('Normal items', () => {
    it('decreases quality by 1 before sell by date', () => {
      const item = updateItem('+5 Dexterity Vest', 10, 20);
      expect(item.quality).toBe(19);
    });

    it('decreases sellIn by 1', () => {
      const item = updateItem('+5 Dexterity Vest', 10, 20);
      expect(item.sellIn).toBe(9);
    });

    it('decreases quality by 2 after sell by date (sellIn = 0)', () => {
      const item = updateItem('+5 Dexterity Vest', 0, 20);
      expect(item.quality).toBe(18);
    });

    it('decreases quality by 2 when sellIn is already negative', () => {
      const item = updateItem('+5 Dexterity Vest', -1, 20);
      expect(item.quality).toBe(18);
    });

    it('does not decrease quality below 0', () => {
      const item = updateItem('+5 Dexterity Vest', 10, 0);
      expect(item.quality).toBe(0);
    });

    it('does not decrease quality below 0 after sell by date', () => {
      const item = updateItem('+5 Dexterity Vest', 0, 0);
      expect(item.quality).toBe(0);
    });

    it('quality does not go below 0 when quality is 1 and expired', () => {
      const item = updateItem('+5 Dexterity Vest', 0, 1);
      expect(item.quality).toBe(0);
    });

    it('decreases quality by 1 on the last day before expiry (sellIn = 1)', () => {
      const item = updateItem('+5 Dexterity Vest', 1, 20);
      expect(item.quality).toBe(19);
    });

    it('works with different item names', () => {
      const item = updateItem('Elixir of the Mongoose', 5, 7);
      expect(item.quality).toBe(6);
      expect(item.sellIn).toBe(4);
    });
  });

  describe('Aged Brie', () => {
    it('increases quality by 1 before sell by date', () => {
      const item = updateItem('Aged Brie', 10, 20);
      expect(item.quality).toBe(21);
    });

    it('decreases sellIn by 1', () => {
      const item = updateItem('Aged Brie', 10, 20);
      expect(item.sellIn).toBe(9);
    });

    it('increases quality by 2 after sell by date (sellIn = 0)', () => {
      const item = updateItem('Aged Brie', 0, 20);
      expect(item.quality).toBe(22);
    });

    it('increases quality by 2 when sellIn is already negative', () => {
      const item = updateItem('Aged Brie', -1, 20);
      expect(item.quality).toBe(22);
    });

    it('does not increase quality above 50', () => {
      const item = updateItem('Aged Brie', 10, 50);
      expect(item.quality).toBe(50);
    });

    it('does not increase quality above 50 after sell by date', () => {
      const item = updateItem('Aged Brie', 0, 50);
      expect(item.quality).toBe(50);
    });

    it('increases to 50 but not above when at 49 and expired', () => {
      const item = updateItem('Aged Brie', 0, 49);
      expect(item.quality).toBe(50);
    });

    it('increases quality from 0', () => {
      const item = updateItem('Aged Brie', 2, 0);
      expect(item.quality).toBe(1);
    });

    it('on last day before expiry (sellIn = 1), increases by 1', () => {
      const item = updateItem('Aged Brie', 1, 20);
      expect(item.quality).toBe(21);
    });
  });

  describe('Sulfuras, Hand of Ragnaros', () => {
    it('never changes quality', () => {
      const item = updateItem('Sulfuras, Hand of Ragnaros', 0, 80);
      expect(item.quality).toBe(80);
    });

    it('never changes sellIn', () => {
      const item = updateItem('Sulfuras, Hand of Ragnaros', 0, 80);
      expect(item.sellIn).toBe(0);
    });

    it('quality stays at 80 with negative sellIn', () => {
      const item = updateItem('Sulfuras, Hand of Ragnaros', -1, 80);
      expect(item.quality).toBe(80);
      expect(item.sellIn).toBe(-1);
    });

    it('quality stays at 80 with positive sellIn', () => {
      const item = updateItem('Sulfuras, Hand of Ragnaros', 5, 80);
      expect(item.quality).toBe(80);
      expect(item.sellIn).toBe(5);
    });
  });

  describe('Backstage passes to a TAFKAL80ETC concert', () => {
    const name = 'Backstage passes to a TAFKAL80ETC concert';

    it('increases quality by 1 when sellIn > 10', () => {
      const item = updateItem(name, 15, 20);
      expect(item.quality).toBe(21);
    });

    it('increases quality by 1 when sellIn is exactly 11', () => {
      const item = updateItem(name, 11, 20);
      expect(item.quality).toBe(21);
    });

    it('increases quality by 2 when sellIn is 10', () => {
      const item = updateItem(name, 10, 20);
      expect(item.quality).toBe(22);
    });

    it('increases quality by 2 when sellIn is 6', () => {
      const item = updateItem(name, 6, 20);
      expect(item.quality).toBe(22);
    });

    it('increases quality by 3 when sellIn is 5', () => {
      const item = updateItem(name, 5, 20);
      expect(item.quality).toBe(23);
    });

    it('increases quality by 3 when sellIn is 1', () => {
      const item = updateItem(name, 1, 20);
      expect(item.quality).toBe(23);
    });

    it('drops quality to 0 after concert (sellIn = 0)', () => {
      const item = updateItem(name, 0, 20);
      expect(item.quality).toBe(0);
    });

    it('quality stays 0 when sellIn is already negative', () => {
      const item = updateItem(name, -1, 20);
      expect(item.quality).toBe(0);
    });

    it('decreases sellIn by 1', () => {
      const item = updateItem(name, 10, 20);
      expect(item.sellIn).toBe(9);
    });

    it('does not increase quality above 50 (sellIn > 10)', () => {
      const item = updateItem(name, 15, 50);
      expect(item.quality).toBe(50);
    });

    it('does not increase quality above 50 (sellIn = 10, quality = 49)', () => {
      const item = updateItem(name, 10, 49);
      expect(item.quality).toBe(50);
    });

    it('does not increase quality above 50 (sellIn = 5, quality = 49)', () => {
      const item = updateItem(name, 5, 49);
      expect(item.quality).toBe(50);
    });

    it('does not increase quality above 50 (sellIn = 5, quality = 48)', () => {
      const item = updateItem(name, 5, 48);
      expect(item.quality).toBe(50);
    });

    it('does not increase quality above 50 (sellIn = 10, quality = 50)', () => {
      const item = updateItem(name, 10, 50);
      expect(item.quality).toBe(50);
    });
  });

  describe('Multiple items', () => {
    it('updates all items independently', () => {
      const gildedRose = new GildedRose([
        new Item('+5 Dexterity Vest', 10, 20),
        new Item('Aged Brie', 2, 0),
        new Item('Sulfuras, Hand of Ragnaros', 0, 80),
        new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
      ]);
      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(19);
      expect(items[0].sellIn).toBe(9);
      expect(items[1].quality).toBe(1);
      expect(items[1].sellIn).toBe(1);
      expect(items[2].quality).toBe(80);
      expect(items[2].sellIn).toBe(0);
      expect(items[3].quality).toBe(21);
      expect(items[3].sellIn).toBe(14);
    });
  });

  describe('Conjured normal items', () => {
    it('decreases quality by 2 before sell by date', () => {
      const item = updateItem('Conjured Mana Cake', 10, 20);
      expect(item.quality).toBe(18);
    });

    it('decreases sellIn by 1', () => {
      const item = updateItem('Conjured Mana Cake', 10, 20);
      expect(item.sellIn).toBe(9);
    });

    it('decreases quality by 4 after sell by date (sellIn = 0)', () => {
      const item = updateItem('Conjured Mana Cake', 0, 20);
      expect(item.quality).toBe(16);
    });

    it('decreases quality by 4 when sellIn is already negative', () => {
      const item = updateItem('Conjured Mana Cake', -1, 20);
      expect(item.quality).toBe(16);
    });

    it('does not decrease quality below 0', () => {
      const item = updateItem('Conjured Mana Cake', 10, 0);
      expect(item.quality).toBe(0);
    });

    it('does not decrease quality below 0 after sell by date', () => {
      const item = updateItem('Conjured Mana Cake', 0, 0);
      expect(item.quality).toBe(0);
    });

    it('quality does not go below 0 when quality is 1 and not expired', () => {
      const item = updateItem('Conjured Mana Cake', 5, 1);
      expect(item.quality).toBe(0);
    });

    it('quality does not go below 0 when quality is 3 and expired', () => {
      const item = updateItem('Conjured Mana Cake', 0, 3);
      expect(item.quality).toBe(0);
    });

    it('quality does not go below 0 when quality is 1 and expired', () => {
      const item = updateItem('Conjured Mana Cake', 0, 1);
      expect(item.quality).toBe(0);
    });
  });

  describe('Conjured Aged Brie', () => {
    it('increases quality by 2 before sell by date', () => {
      const item = updateItem('Conjured Aged Brie', 10, 20);
      expect(item.quality).toBe(22);
    });

    it('decreases sellIn by 1', () => {
      const item = updateItem('Conjured Aged Brie', 10, 20);
      expect(item.sellIn).toBe(9);
    });

    it('increases quality by 4 after sell by date (sellIn = 0)', () => {
      const item = updateItem('Conjured Aged Brie', 0, 20);
      expect(item.quality).toBe(24);
    });

    it('does not increase quality above 50', () => {
      const item = updateItem('Conjured Aged Brie', 10, 50);
      expect(item.quality).toBe(50);
    });

    it('does not increase quality above 50 after sell by date', () => {
      const item = updateItem('Conjured Aged Brie', 0, 50);
      expect(item.quality).toBe(50);
    });

    it('caps at 50 when increase would exceed it', () => {
      const item = updateItem('Conjured Aged Brie', 10, 49);
      expect(item.quality).toBe(50);
    });

    it('caps at 50 when expired increase would exceed it', () => {
      const item = updateItem('Conjured Aged Brie', 0, 48);
      expect(item.quality).toBe(50);
    });
  });

  describe('Conjured Sulfuras, Hand of Ragnaros', () => {
    it('never changes quality', () => {
      const item = updateItem('Conjured Sulfuras, Hand of Ragnaros', 0, 80);
      expect(item.quality).toBe(80);
    });

    it('never changes sellIn', () => {
      const item = updateItem('Conjured Sulfuras, Hand of Ragnaros', 0, 80);
      expect(item.sellIn).toBe(0);
    });
  });

  describe('Conjured Backstage passes to a TAFKAL80ETC concert', () => {
    const name = 'Conjured Backstage passes to a TAFKAL80ETC concert';

    it('increases quality by 2 when sellIn > 10', () => {
      const item = updateItem(name, 15, 20);
      expect(item.quality).toBe(22);
    });

    it('increases quality by 4 when sellIn is 10', () => {
      const item = updateItem(name, 10, 20);
      expect(item.quality).toBe(24);
    });

    it('increases quality by 6 when sellIn is 5', () => {
      const item = updateItem(name, 5, 20);
      expect(item.quality).toBe(26);
    });

    it('drops quality to 0 after concert (sellIn = 0)', () => {
      const item = updateItem(name, 0, 20);
      expect(item.quality).toBe(0);
    });

    it('quality stays 0 when sellIn is already negative', () => {
      const item = updateItem(name, -1, 20);
      expect(item.quality).toBe(0);
    });

    it('decreases sellIn by 1', () => {
      const item = updateItem(name, 10, 20);
      expect(item.sellIn).toBe(9);
    });

    it('does not increase quality above 50 (sellIn = 5, quality = 46)', () => {
      const item = updateItem(name, 5, 46);
      expect(item.quality).toBe(50);
    });

    it('does not increase quality above 50 (sellIn = 10, quality = 48)', () => {
      const item = updateItem(name, 10, 48);
      expect(item.quality).toBe(50);
    });

    it('does not increase quality above 50 (sellIn > 10, quality = 49)', () => {
      const item = updateItem(name, 15, 49);
      expect(item.quality).toBe(50);
    });
  });

  describe('Empty inventory', () => {
    it('handles empty item list', () => {
      const gildedRose = new GildedRose([]);
      const items = gildedRose.updateQuality();
      expect(items).toEqual([]);
    });

    it('handles default constructor', () => {
      const gildedRose = new GildedRose();
      const items = gildedRose.updateQuality();
      expect(items).toEqual([]);
    });
  });
});
