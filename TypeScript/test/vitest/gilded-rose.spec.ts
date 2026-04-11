import { expect, describe, it } from 'vitest';
import { Item, GildedRose } from '@/gilded-rose';

describe('Gilded Rose - Normal Items', () => {
  it('decreases quality by 1 before sell date', () => {
    const gildedRose = new GildedRose([new Item('Normal Item', 5, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(19);
    expect(items[0].sellIn).toBe(4);
  });

  it('decreases quality by 2 after sell date', () => {
    const gildedRose = new GildedRose([new Item('Normal Item', 0, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(18);
    expect(items[0].sellIn).toBe(-1);
  });

  it('quality never becomes negative', () => {
    const gildedRose = new GildedRose([new Item('Normal Item', 5, 1)]);
    gildedRose.updateQuality();
    gildedRose.updateQuality();
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it('quality never becomes negative after sell date', () => {
    const gildedRose = new GildedRose([new Item('Normal Item', 0, 1)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it('decreases sell in by 1 each day', () => {
    const gildedRose = new GildedRose([new Item('Normal Item', 10, 20)]);
    gildedRose.updateQuality();
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(8);
  });
});

describe('Gilded Rose - Aged Brie', () => {
  it('increases quality by 1 before sell date', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 5, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(21);
    expect(items[0].sellIn).toBe(4);
  });

  it('increases quality by 2 after sell date', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 0, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(22);
    expect(items[0].sellIn).toBe(-1);
  });

  it('quality never exceeds 50', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 5, 49)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });

  it('quality never exceeds 50 after sell date', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 0, 49)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });

  it('caps at 50 even if multiple increases would exceed', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 0, 48)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });

  it('decreases sell in by 1 each day', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 10, 20)]);
    gildedRose.updateQuality();
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(8);
  });
});

describe('Gilded Rose - Sulfuras', () => {
  it('never changes quality', () => {
    const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 5, 80)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(80);
  });

  it('never changes sell in', () => {
    const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 5, 80)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(5);
  });

  it('quality stays at 80 after multiple updates', () => {
    const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 5, 80)]);
    gildedRose.updateQuality();
    gildedRose.updateQuality();
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(80);
    expect(items[0].sellIn).toBe(5);
  });

  it('sell in stays at 0 when at sell date', () => {
    const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 0, 80)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(0);
  });

  it('never decreases below 80', () => {
    const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', -5, 80)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(80);
  });
});

describe('Gilded Rose - Backstage passes', () => {
  it('increases quality by 1 when more than 10 days', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(21);
    expect(items[0].sellIn).toBe(14);
  });

  it('increases quality by 2 when 10 days or less', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(22);
    expect(items[0].sellIn).toBe(9);
  });

  it('increases quality by 2 when between 6 and 10 days', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 6, 20),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(22);
    expect(items[0].sellIn).toBe(5);
  });

  it('increases quality by 3 when 5 days or less', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(23);
    expect(items[0].sellIn).toBe(4);
  });

  it('increases quality by 3 when 1 day left', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 1, 20),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(23);
    expect(items[0].sellIn).toBe(0);
  });

  it('drops to 0 after concert', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
    expect(items[0].sellIn).toBe(-1);
  });

  it('quality never exceeds 50 in window > 10 days', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 15, 50),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });

  it('quality never exceeds 50 in window <= 10 days', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });

  it('quality never exceeds 50 in window <= 5 days', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 5, 48),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });

  it('quality reaches 0 after concert even if high', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 0, 50),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });
});

describe('Gilded Rose - Conjured Items', () => {
  it('decreases quality by 2 before sell date', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 5, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(18);
    expect(items[0].sellIn).toBe(4);
  });

  it('decreases quality by 4 after sell date', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 0, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(16);
    expect(items[0].sellIn).toBe(-1);
  });

  it('quality never becomes negative before sell date', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 5, 1)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it('quality never becomes negative after sell date', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 0, 2)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it('handles different conjured item types', () => {
    const gildedRose = new GildedRose([
      new Item('Conjured Potion', 5, 20),
      new Item('Conjured Leather Armor', 10, 30),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(18);
    expect(items[0].sellIn).toBe(4);
    expect(items[1].quality).toBe(28);
    expect(items[1].sellIn).toBe(9);
  });

  it('transitions from before to after sell date correctly', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 1, 10)]);
    gildedRose.updateQuality();
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(4);
    expect(items[0].sellIn).toBe(-1);
  });

  it('degrades correctly multiple days before sell date', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 5, 20)]);
    gildedRose.updateQuality();
    gildedRose.updateQuality();
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(14);
    expect(items[0].sellIn).toBe(2);
  });

  it('handles conjured item with low quality', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 5, 3)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(1);
  });

  it('handles conjured item with exact quality for degradation', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 5, 2)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it('conjured at sell date with low quality', () => {
    const gildedRose = new GildedRose([new Item('Conjured Mana Cake', 0, 3)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });
});

describe('Gilded Rose - Multiple Items', () => {
  it('updates multiple items correctly', () => {
    const gildedRose = new GildedRose([
      new Item('Normal Item', 10, 10),
      new Item('Aged Brie', 10, 10),
      new Item('Sulfuras, Hand of Ragnaros', 10, 80),
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(9);
    expect(items[1].quality).toBe(11);
    expect(items[2].quality).toBe(80);
  });
});

describe('Gilded Rose - Edge Cases', () => {
  it('handles item with 0 quality and negative sellin', () => {
    const gildedRose = new GildedRose([new Item('Normal Item', -5, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it('handles quality at max for normal items', () => {
    const gildedRose = new GildedRose([new Item('Normal Item', 10, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it('transitions from before to after sell date correctly', () => {
    const gildedRose = new GildedRose([new Item('Normal Item', 1, 10)]);
    gildedRose.updateQuality();
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(7);
    expect(items[0].sellIn).toBe(-1);
  });

  it('handles backstage pass transitioning from >10 to <=10 days', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 11, 20),
    ]);
    gildedRose.updateQuality();
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(23);
    expect(items[0].sellIn).toBe(9);
  });

  it('handles backstage pass transitioning from <=10 to <=5 days', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 6, 20),
    ]);
    gildedRose.updateQuality();
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(25);
    expect(items[0].sellIn).toBe(4);
  });
});
