import { Item, GildedRose } from "@/gilded-rose";

function updateItem(name: string, sellIn: number, quality: number): Item {
  const gildedRose = new GildedRose([new Item(name, sellIn, quality)]);
  return gildedRose.updateQuality()[0];
}

describe("Gilded Rose", () => {
  describe("Normal items", () => {
    it("decreases quality by 1 before sell date", () => {
      const item = updateItem("+5 Dexterity Vest", 10, 20);
      expect(item.quality).toBe(19);
    });

    it("decreases sellIn by 1", () => {
      const item = updateItem("+5 Dexterity Vest", 10, 20);
      expect(item.sellIn).toBe(9);
    });

    it("decreases quality by 2 after sell date", () => {
      const item = updateItem("+5 Dexterity Vest", 0, 20);
      expect(item.quality).toBe(18);
    });

    it("decreases quality by 2 when sellIn is already negative", () => {
      const item = updateItem("+5 Dexterity Vest", -1, 20);
      expect(item.quality).toBe(18);
    });

    it("does not decrease quality below 0", () => {
      const item = updateItem("+5 Dexterity Vest", 10, 0);
      expect(item.quality).toBe(0);
    });

    it("does not decrease quality below 0 after sell date", () => {
      const item = updateItem("+5 Dexterity Vest", 0, 0);
      expect(item.quality).toBe(0);
    });

    it("decreases quality from 1 to 0 after sell date (not negative)", () => {
      const item = updateItem("+5 Dexterity Vest", 0, 1);
      expect(item.quality).toBe(0);
    });

    it("boundary: sellIn 1 -> 0 degrades quality by 1 (not yet expired)", () => {
      const item = updateItem("+5 Dexterity Vest", 1, 10);
      expect(item.sellIn).toBe(0);
      expect(item.quality).toBe(9);
    });

    it("boundary: sellIn 0 -> -1 degrades quality by 2 (just expired)", () => {
      const item = updateItem("+5 Dexterity Vest", 0, 10);
      expect(item.sellIn).toBe(-1);
      expect(item.quality).toBe(8);
    });

    it("works with different item names", () => {
      const item = updateItem("Elixir of the Mongoose", 5, 7);
      expect(item.quality).toBe(6);
      expect(item.sellIn).toBe(4);
    });
  });

  describe("Aged Brie", () => {
    it("increases quality by 1 before sell date", () => {
      const item = updateItem("Aged Brie", 10, 20);
      expect(item.quality).toBe(21);
    });

    it("decreases sellIn by 1", () => {
      const item = updateItem("Aged Brie", 10, 20);
      expect(item.sellIn).toBe(9);
    });

    it("increases quality by 2 after sell date", () => {
      const item = updateItem("Aged Brie", 0, 20);
      expect(item.quality).toBe(22);
    });

    it("increases quality by 2 when sellIn is already negative", () => {
      const item = updateItem("Aged Brie", -1, 20);
      expect(item.quality).toBe(22);
    });

    it("does not increase quality above 50", () => {
      const item = updateItem("Aged Brie", 10, 50);
      expect(item.quality).toBe(50);
    });

    it("does not increase quality above 50 after sell date", () => {
      const item = updateItem("Aged Brie", 0, 50);
      expect(item.quality).toBe(50);
    });

    it("increases quality from 49 to 50 before sell date", () => {
      const item = updateItem("Aged Brie", 10, 49);
      expect(item.quality).toBe(50);
    });

    it("increases quality from 49 to 50 after sell date (capped, not 51)", () => {
      const item = updateItem("Aged Brie", 0, 49);
      expect(item.quality).toBe(50);
    });

    it("increases quality from 0", () => {
      const item = updateItem("Aged Brie", 2, 0);
      expect(item.quality).toBe(1);
    });
  });

  describe("Sulfuras, Hand of Ragnaros", () => {
    it("quality never changes", () => {
      const item = updateItem("Sulfuras, Hand of Ragnaros", 0, 80);
      expect(item.quality).toBe(80);
    });

    it("sellIn never changes", () => {
      const item = updateItem("Sulfuras, Hand of Ragnaros", 0, 80);
      expect(item.sellIn).toBe(0);
    });

    it("quality stays 80 with positive sellIn", () => {
      const item = updateItem("Sulfuras, Hand of Ragnaros", 10, 80);
      expect(item.quality).toBe(80);
      expect(item.sellIn).toBe(10);
    });

    it("quality stays 80 with negative sellIn", () => {
      const item = updateItem("Sulfuras, Hand of Ragnaros", -1, 80);
      expect(item.quality).toBe(80);
      expect(item.sellIn).toBe(-1);
    });
  });

  describe("Backstage passes to a TAFKAL80ETC concert", () => {
    const name = "Backstage passes to a TAFKAL80ETC concert";

    it("increases quality by 1 when sellIn > 10", () => {
      const item = updateItem(name, 15, 20);
      expect(item.quality).toBe(21);
    });

    it("boundary: increases quality by 1 when sellIn is 11", () => {
      const item = updateItem(name, 11, 20);
      expect(item.quality).toBe(21);
    });

    it("boundary: increases quality by 2 when sellIn is 10", () => {
      const item = updateItem(name, 10, 20);
      expect(item.quality).toBe(22);
    });

    it("increases quality by 2 when sellIn is between 6 and 10", () => {
      const item = updateItem(name, 8, 20);
      expect(item.quality).toBe(22);
    });

    it("boundary: increases quality by 2 when sellIn is 6", () => {
      const item = updateItem(name, 6, 20);
      expect(item.quality).toBe(22);
    });

    it("boundary: increases quality by 3 when sellIn is 5", () => {
      const item = updateItem(name, 5, 20);
      expect(item.quality).toBe(23);
    });

    it("increases quality by 3 when sellIn is between 1 and 5", () => {
      const item = updateItem(name, 3, 20);
      expect(item.quality).toBe(23);
    });

    it("increases quality by 3 when sellIn is 1", () => {
      const item = updateItem(name, 1, 20);
      expect(item.quality).toBe(23);
    });

    it("drops quality to 0 when sellIn is 0 (concert day)", () => {
      const item = updateItem(name, 0, 20);
      expect(item.quality).toBe(0);
    });

    it("quality stays 0 when sellIn is already negative", () => {
      const item = updateItem(name, -1, 20);
      expect(item.quality).toBe(0);
    });

    it("decreases sellIn by 1", () => {
      const item = updateItem(name, 10, 20);
      expect(item.sellIn).toBe(9);
    });

    it("does not increase quality above 50 when sellIn > 10", () => {
      const item = updateItem(name, 15, 50);
      expect(item.quality).toBe(50);
    });

    it("does not increase quality above 50 when sellIn is 10 (caps at 50)", () => {
      const item = updateItem(name, 10, 49);
      expect(item.quality).toBe(50);
    });

    it("does not increase quality above 50 when sellIn is 5 (caps at 50)", () => {
      const item = updateItem(name, 5, 49);
      expect(item.quality).toBe(50);
    });

    it("quality 48 goes to 50 when sellIn is 5 (capped from would-be 51)", () => {
      const item = updateItem(name, 5, 48);
      expect(item.quality).toBe(50);
    });

    it("drops quality to 0 even when quality was 50", () => {
      const item = updateItem(name, 0, 50);
      expect(item.quality).toBe(0);
    });
  });

  describe("multiple items", () => {
    it("processes all items independently", () => {
      const gildedRose = new GildedRose([
        new Item("+5 Dexterity Vest", 10, 20),
        new Item("Aged Brie", 2, 0),
        new Item("Sulfuras, Hand of Ragnaros", 0, 80),
        new Item("Backstage passes to a TAFKAL80ETC concert", 5, 20),
      ]);
      const items = gildedRose.updateQuality();

      expect(items[0].quality).toBe(19);
      expect(items[0].sellIn).toBe(9);

      expect(items[1].quality).toBe(1);
      expect(items[1].sellIn).toBe(1);

      expect(items[2].quality).toBe(80);
      expect(items[2].sellIn).toBe(0);

      expect(items[3].quality).toBe(23);
      expect(items[3].sellIn).toBe(4);
    });

    it("handles empty item list", () => {
      const gildedRose = new GildedRose([]);
      const items = gildedRose.updateQuality();
      expect(items).toEqual([]);
    });
  });

  describe("Conjured normal items", () => {
    it("degrades quality by 2 before sell date", () => {
      const item = updateItem("Conjured Mana Cake", 10, 20);
      expect(item.quality).toBe(18);
    });

    it("decreases sellIn by 1", () => {
      const item = updateItem("Conjured Mana Cake", 10, 20);
      expect(item.sellIn).toBe(9);
    });

    it("degrades quality by 4 after sell date", () => {
      const item = updateItem("Conjured Mana Cake", 0, 20);
      expect(item.quality).toBe(16);
    });

    it("degrades quality by 4 when sellIn is already negative", () => {
      const item = updateItem("Conjured Mana Cake", -1, 20);
      expect(item.quality).toBe(16);
    });

    it("does not decrease quality below 0", () => {
      const item = updateItem("Conjured Mana Cake", 10, 0);
      expect(item.quality).toBe(0);
    });

    it("does not decrease quality below 0 after sell date", () => {
      const item = updateItem("Conjured Mana Cake", 0, 1);
      expect(item.quality).toBe(0);
    });

    it("boundary: sellIn 1 -> 0 degrades quality by 2 (not yet expired)", () => {
      const item = updateItem("Conjured Mana Cake", 1, 10);
      expect(item.sellIn).toBe(0);
      expect(item.quality).toBe(8);
    });

    it("boundary: sellIn 0 -> -1 degrades quality by 4 (just expired)", () => {
      const item = updateItem("Conjured Mana Cake", 0, 10);
      expect(item.sellIn).toBe(-1);
      expect(item.quality).toBe(6);
    });
  });

  describe("Conjured Aged Brie", () => {
    it("increases quality by 2 before sell date", () => {
      const item = updateItem("Conjured Aged Brie", 10, 20);
      expect(item.quality).toBe(22);
    });

    it("increases quality by 4 after sell date", () => {
      const item = updateItem("Conjured Aged Brie", 0, 20);
      expect(item.quality).toBe(24);
    });

    it("does not increase quality above 50", () => {
      const item = updateItem("Conjured Aged Brie", 10, 50);
      expect(item.quality).toBe(50);
    });

    it("caps at 50 when increase would exceed it", () => {
      const item = updateItem("Conjured Aged Brie", 10, 49);
      expect(item.quality).toBe(50);
    });

    it("caps at 50 after sell date when increase would exceed it", () => {
      const item = updateItem("Conjured Aged Brie", 0, 48);
      expect(item.quality).toBe(50);
    });
  });

  describe("Conjured Sulfuras", () => {
    it("quality never changes", () => {
      const item = updateItem("Conjured Sulfuras, Hand of Ragnaros", 0, 80);
      expect(item.quality).toBe(80);
    });

    it("sellIn never changes", () => {
      const item = updateItem("Conjured Sulfuras, Hand of Ragnaros", 0, 80);
      expect(item.sellIn).toBe(0);
    });
  });

  describe("Conjured Backstage passes", () => {
    const name = "Conjured Backstage passes to a TAFKAL80ETC concert";

    it("increases quality by 2 when sellIn > 10", () => {
      const item = updateItem(name, 15, 20);
      expect(item.quality).toBe(22);
    });

    it("increases quality by 4 when sellIn is 10", () => {
      const item = updateItem(name, 10, 20);
      expect(item.quality).toBe(24);
    });

    it("increases quality by 6 when sellIn is 5", () => {
      const item = updateItem(name, 5, 20);
      expect(item.quality).toBe(26);
    });

    it("drops quality to 0 when sellIn is 0 (concert day)", () => {
      const item = updateItem(name, 0, 20);
      expect(item.quality).toBe(0);
    });

    it("quality stays 0 when sellIn is already negative", () => {
      const item = updateItem(name, -1, 20);
      expect(item.quality).toBe(0);
    });

    it("does not increase quality above 50", () => {
      const item = updateItem(name, 5, 48);
      expect(item.quality).toBe(50);
    });
  });

  describe("item identity", () => {
    it("does not change item name", () => {
      const item = updateItem("+5 Dexterity Vest", 10, 20);
      expect(item.name).toBe("+5 Dexterity Vest");
    });

    it("returns the same items array", () => {
      const items = [new Item("foo", 5, 10)];
      const gildedRose = new GildedRose(items);
      const result = gildedRose.updateQuality();
      expect(result).toBe(items);
    });
  });
});
