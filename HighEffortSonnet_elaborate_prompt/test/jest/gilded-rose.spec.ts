import { Item, GildedRose } from '@/gilded-rose';

const AGED_BRIE = 'Aged Brie';
const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const BACKSTAGE_PASS = 'Backstage passes to a TAFKAL80ETC concert';
const CONJURED = 'Conjured Mana Cake';
const CONJURED_AGED_BRIE = 'Conjured Aged Brie';
const CONJURED_SULFURAS = 'Conjured Sulfuras, Hand of Ragnaros';
const CONJURED_BACKSTAGE_PASS = 'Conjured Backstage passes to a TAFKAL80ETC concert';

function update(name: string, sellIn: number, quality: number): Item {
  const item = new Item(name, sellIn, quality);
  new GildedRose([item]).updateQuality();
  return item;
}

describe('Gilded Rose', () => {
  describe('Normal items', () => {
    describe('before sell date (sellIn > 0)', () => {
      it('degrades quality by 1 per day', () => {
        expect(update('Normal Item', 5, 10).quality).toBe(9);
      });

      it('decreases sellIn by 1 per day', () => {
        expect(update('Normal Item', 5, 10).sellIn).toBe(4);
      });

      it('does not degrade quality below 0 when quality is already 0', () => {
        expect(update('Normal Item', 5, 0).quality).toBe(0);
      });

      it('degrades quality from 1 to 0, not below', () => {
        expect(update('Normal Item', 5, 1).quality).toBe(0);
      });
    });

    describe('on sell date (sellIn = 0)', () => {
      it('degrades quality by 2', () => {
        expect(update('Normal Item', 0, 10).quality).toBe(8);
      });

      it('does not degrade below 0 when quality is 1', () => {
        expect(update('Normal Item', 0, 1).quality).toBe(0);
      });

      it('stays at 0 when quality is already 0', () => {
        expect(update('Normal Item', 0, 0).quality).toBe(0);
      });

      it('decreases sellIn to -1', () => {
        expect(update('Normal Item', 0, 10).sellIn).toBe(-1);
      });
    });

    describe('after sell date (sellIn < 0)', () => {
      it('degrades quality by 2', () => {
        expect(update('Normal Item', -1, 10).quality).toBe(8);
      });

      it('does not degrade below 0 when quality is 1', () => {
        expect(update('Normal Item', -1, 1).quality).toBe(0);
      });

      it('stays at 0 when quality is already 0', () => {
        expect(update('Normal Item', -1, 0).quality).toBe(0);
      });

      it('decreases sellIn further', () => {
        expect(update('Normal Item', -1, 10).sellIn).toBe(-2);
      });
    });
  });

  describe('Aged Brie', () => {
    describe('before sell date (sellIn > 0)', () => {
      it('increases quality by 1 per day', () => {
        expect(update(AGED_BRIE, 5, 10).quality).toBe(11);
      });

      it('decreases sellIn by 1 per day', () => {
        expect(update(AGED_BRIE, 5, 10).sellIn).toBe(4);
      });

      it('does not exceed quality 50', () => {
        expect(update(AGED_BRIE, 5, 50).quality).toBe(50);
      });

      it('increases from 49 to 50 (at the cap)', () => {
        expect(update(AGED_BRIE, 5, 49).quality).toBe(50);
      });
    });

    describe('on sell date (sellIn = 0)', () => {
      it('increases quality by 2', () => {
        expect(update(AGED_BRIE, 0, 10).quality).toBe(12);
      });

      it('does not exceed 50 when quality would reach 51', () => {
        expect(update(AGED_BRIE, 0, 49).quality).toBe(50);
      });

      it('stays at 50 when already at max', () => {
        expect(update(AGED_BRIE, 0, 50).quality).toBe(50);
      });

      it('caps at 50 when quality would reach exactly 50 from first increment then stays', () => {
        expect(update(AGED_BRIE, 0, 48).quality).toBe(50);
      });
    });

    describe('after sell date (sellIn < 0)', () => {
      it('increases quality by 2', () => {
        expect(update(AGED_BRIE, -1, 10).quality).toBe(12);
      });

      it('does not exceed 50 when quality is 49', () => {
        expect(update(AGED_BRIE, -1, 49).quality).toBe(50);
      });

      it('stays at 50 when already at max', () => {
        expect(update(AGED_BRIE, -1, 50).quality).toBe(50);
      });
    });
  });

  describe('Sulfuras, Hand of Ragnaros', () => {
    it('never changes sellIn when positive', () => {
      expect(update(SULFURAS, 5, 80).sellIn).toBe(5);
    });

    it('never changes sellIn when zero', () => {
      expect(update(SULFURAS, 0, 80).sellIn).toBe(0);
    });

    it('never changes sellIn when negative', () => {
      expect(update(SULFURAS, -1, 80).sellIn).toBe(-1);
    });

    it('never changes quality', () => {
      expect(update(SULFURAS, 0, 80).quality).toBe(80);
    });

    it('keeps quality at 80 regardless of sellIn', () => {
      expect(update(SULFURAS, 5, 80).quality).toBe(80);
      expect(update(SULFURAS, -1, 80).quality).toBe(80);
    });
  });

  describe('Backstage passes to a TAFKAL80ETC concert', () => {
    describe('when more than 10 days remain (sellIn > 10)', () => {
      it('increases quality by 1', () => {
        expect(update(BACKSTAGE_PASS, 11, 20).quality).toBe(21);
      });

      it('decreases sellIn by 1', () => {
        expect(update(BACKSTAGE_PASS, 11, 20).sellIn).toBe(10);
      });

      it('does not exceed quality 50', () => {
        expect(update(BACKSTAGE_PASS, 11, 50).quality).toBe(50);
      });
    });

    describe('when exactly 10 days remain (sellIn = 10)', () => {
      it('increases quality by 2', () => {
        expect(update(BACKSTAGE_PASS, 10, 20).quality).toBe(22);
      });

      it('does not exceed quality 50', () => {
        expect(update(BACKSTAGE_PASS, 10, 49).quality).toBe(50);
      });

      it('stays at 50 when already at max', () => {
        expect(update(BACKSTAGE_PASS, 10, 50).quality).toBe(50);
      });
    });

    describe('when 6 to 10 days remain (6 <= sellIn <= 10)', () => {
      it('increases quality by 2 when sellIn = 6', () => {
        expect(update(BACKSTAGE_PASS, 6, 20).quality).toBe(22);
      });

      it('increases quality by 2 when sellIn = 8', () => {
        expect(update(BACKSTAGE_PASS, 8, 20).quality).toBe(22);
      });
    });

    describe('when exactly 5 days remain (sellIn = 5)', () => {
      it('increases quality by 3', () => {
        expect(update(BACKSTAGE_PASS, 5, 20).quality).toBe(23);
      });

      it('does not exceed quality 50 when quality is 48', () => {
        expect(update(BACKSTAGE_PASS, 5, 48).quality).toBe(50);
      });

      it('does not exceed quality 50 when quality is 49', () => {
        expect(update(BACKSTAGE_PASS, 5, 49).quality).toBe(50);
      });

      it('stays at 50 when already at max', () => {
        expect(update(BACKSTAGE_PASS, 5, 50).quality).toBe(50);
      });
    });

    describe('when 1 to 5 days remain (1 <= sellIn <= 5)', () => {
      it('increases quality by 3 when sellIn = 1', () => {
        expect(update(BACKSTAGE_PASS, 1, 20).quality).toBe(23);
      });

      it('increases quality by 3 when sellIn = 3', () => {
        expect(update(BACKSTAGE_PASS, 3, 20).quality).toBe(23);
      });
    });

    describe('on the concert day (sellIn = 0)', () => {
      it('quality drops to 0', () => {
        expect(update(BACKSTAGE_PASS, 0, 20).quality).toBe(0);
      });

      it('quality drops to 0 even from a high quality', () => {
        expect(update(BACKSTAGE_PASS, 0, 50).quality).toBe(0);
      });

      it('sellIn decreases to -1', () => {
        expect(update(BACKSTAGE_PASS, 0, 20).sellIn).toBe(-1);
      });
    });

    describe('after the concert (sellIn < 0)', () => {
      it('quality is 0', () => {
        expect(update(BACKSTAGE_PASS, -1, 0).quality).toBe(0);
      });
    });
  });

  describe('Conjured items (normal)', () => {
    describe('before sell date (sellIn > 0)', () => {
      it('degrades quality by 2 per day', () => {
        expect(update(CONJURED, 5, 10).quality).toBe(8);
      });

      it('decreases sellIn by 1 per day', () => {
        expect(update(CONJURED, 5, 10).sellIn).toBe(4);
      });

      it('does not degrade below 0 when quality is 1', () => {
        expect(update(CONJURED, 5, 1).quality).toBe(0);
      });

      it('stays at 0 when quality is already 0', () => {
        expect(update(CONJURED, 5, 0).quality).toBe(0);
      });

      it('degrades quality from 2 to 0 (not below)', () => {
        expect(update(CONJURED, 5, 2).quality).toBe(0);
      });
    });

    describe('on sell date (sellIn = 0)', () => {
      it('degrades quality by 4', () => {
        expect(update(CONJURED, 0, 10).quality).toBe(6);
      });

      it('does not degrade below 0 when quality is 3', () => {
        expect(update(CONJURED, 0, 3).quality).toBe(0);
      });

      it('stays at 0 when quality is already 0', () => {
        expect(update(CONJURED, 0, 0).quality).toBe(0);
      });

      it('decreases sellIn to -1', () => {
        expect(update(CONJURED, 0, 10).sellIn).toBe(-1);
      });
    });

    describe('after sell date (sellIn < 0)', () => {
      it('degrades quality by 4', () => {
        expect(update(CONJURED, -1, 10).quality).toBe(6);
      });

      it('does not degrade below 0 when quality is 2', () => {
        expect(update(CONJURED, -1, 2).quality).toBe(0);
      });

      it('stays at 0 when quality is already 0', () => {
        expect(update(CONJURED, -1, 0).quality).toBe(0);
      });
    });
  });

  describe('Conjured Aged Brie', () => {
    describe('before sell date (sellIn > 0)', () => {
      it('increases quality by 2 per day', () => {
        expect(update(CONJURED_AGED_BRIE, 5, 10).quality).toBe(12);
      });

      it('decreases sellIn by 1 per day', () => {
        expect(update(CONJURED_AGED_BRIE, 5, 10).sellIn).toBe(4);
      });

      it('does not exceed quality 50', () => {
        expect(update(CONJURED_AGED_BRIE, 5, 50).quality).toBe(50);
      });

      it('caps at 50 when quality would exceed it', () => {
        expect(update(CONJURED_AGED_BRIE, 5, 49).quality).toBe(50);
      });
    });

    describe('on sell date (sellIn = 0)', () => {
      it('increases quality by 4', () => {
        expect(update(CONJURED_AGED_BRIE, 0, 10).quality).toBe(14);
      });

      it('does not exceed quality 50', () => {
        expect(update(CONJURED_AGED_BRIE, 0, 48).quality).toBe(50);
      });

      it('stays at 50 when already at max', () => {
        expect(update(CONJURED_AGED_BRIE, 0, 50).quality).toBe(50);
      });
    });

    describe('after sell date (sellIn < 0)', () => {
      it('increases quality by 4', () => {
        expect(update(CONJURED_AGED_BRIE, -1, 10).quality).toBe(14);
      });

      it('does not exceed quality 50', () => {
        expect(update(CONJURED_AGED_BRIE, -1, 49).quality).toBe(50);
      });
    });
  });

  describe('Conjured Sulfuras, Hand of Ragnaros', () => {
    it('never changes sellIn', () => {
      expect(update(CONJURED_SULFURAS, 5, 80).sellIn).toBe(5);
    });

    it('never changes quality', () => {
      expect(update(CONJURED_SULFURAS, 0, 80).quality).toBe(80);
    });
  });

  describe('Conjured Backstage passes', () => {
    describe('when more than 10 days remain (sellIn > 10)', () => {
      it('increases quality by 2', () => {
        expect(update(CONJURED_BACKSTAGE_PASS, 11, 20).quality).toBe(22);
      });

      it('does not exceed quality 50', () => {
        expect(update(CONJURED_BACKSTAGE_PASS, 11, 50).quality).toBe(50);
      });
    });

    describe('when 10 or fewer days remain (sellIn <= 10)', () => {
      it('increases quality by 4 when sellIn = 10', () => {
        expect(update(CONJURED_BACKSTAGE_PASS, 10, 20).quality).toBe(24);
      });

      it('does not exceed quality 50', () => {
        expect(update(CONJURED_BACKSTAGE_PASS, 10, 47).quality).toBe(50);
      });
    });

    describe('when 5 or fewer days remain (sellIn <= 5)', () => {
      it('increases quality by 6 when sellIn = 5', () => {
        expect(update(CONJURED_BACKSTAGE_PASS, 5, 20).quality).toBe(26);
      });

      it('does not exceed quality 50', () => {
        expect(update(CONJURED_BACKSTAGE_PASS, 5, 45).quality).toBe(50);
      });
    });

    describe('on the concert day (sellIn = 0)', () => {
      it('quality drops to 0', () => {
        expect(update(CONJURED_BACKSTAGE_PASS, 0, 20).quality).toBe(0);
      });
    });

    describe('after the concert (sellIn < 0)', () => {
      it('quality is 0', () => {
        expect(update(CONJURED_BACKSTAGE_PASS, -1, 0).quality).toBe(0);
      });
    });

    it('decreases sellIn by 1', () => {
      expect(update(CONJURED_BACKSTAGE_PASS, 5, 20).sellIn).toBe(4);
    });
  });
});
