# Code Analysis Report: app/app.ts

## Purpose
Inventory management system (Gilded Rose kata). Updates item quality/sellIn daily based on item type:
- **Aged Brie**: increases in quality over time
- **Backstage passes to a TAFKAL80ETC concert**: increase in value as event approaches, drop to 0 after
- **Sulfuras, Hand of Ragnaros**: never degrades, never expires
- Other items: degrade in quality after sellIn passes

---

## Code Smells

### 1. Magic Strings (Lines 22, 24, 31, 45, 49-50, 52, 57, 59)
**Issue:** Item types hardcoded as strings scattered throughout logic  
**Risk:** Adding new item types requires modifying core method; typos silently break behavior  
**Fix:** Create enum or item type classes

### 2. Nested Conditionals (Up to 6 levels deep)
**Issue:** Lines 22-64 are deep nesting hell — business logic buried under conditions  
**Risk:** Easy to miss branches; hard to verify all paths  
**Fix:** Extract business rules into separate methods per item type

### 3. Duplicate Logic
**Issue:** Quality decrease logic appears in multiple places (lines 23-26, 51-54)  
**Risk:** Inconsistent updates; changes need made in multiple spots  
**Fix:** Extract into helper method

### 4. Magic Numbers (0, 50, 11, 6)
**Issue:** Quality bounds (0, 50) and ticket tier thresholds (11, 6) unexplained  
**Risk:** No clear why these specific values; hard to adjust if requirements change  
**Fix:** Name as constants with clear meaning

### 5. Type Safety Missing (Line 6)
**Issue:** Constructor params have no types  
**Risk:** Accepts any values; no compile-time validation  
**Fix:** `constructor(name: string, sellIn: number, quality: number)`

### 6. Mixed Concerns
**Issue:** Boundary checking, logic, and mutation all in one pass  
**Risk:** Hard to test business rules independently; side effects everywhere  
**Fix:** Separate rule application from validation

---

## Design Issues

### 1. No Polymorphism
**Problem:** All items handled by one massive if-else chain  
**Impact:** Violates Open/Closed Principle (open for extension, closed for modification)  
**Better approach:** Item subclasses or strategy pattern for type-specific rules

### 2. Single Responsibility Violation
**Problem:** App.update() handles: iteration, type detection, AND all business rules  
**Impact:** Can't test one item type without testing all  
**Better approach:** Each item type → its own updater

### 3. Inconsistent State Transitions
**Problem:** Some items skip sellIn decrement (Sulfuras, Hand of Ragnaros, line 45-47)  
**Impact:** Hidden state rules that aren't documented  
**Better approach:** Explicit rules per item type

---

## Non-Obvious Behaviors (⚠️ Important)

### 1. Backstage passes to a TAFKAL80ETC concert Quality Drop (Line 57)
```typescript
this.items[i].quality = this.items[i].quality - this.items[i].quality
```
**Subtlety:** This *always* sets quality to 0 (math: `x - x = 0`). Unclear why not direct assignment.

### 2. Aged Brie Double Increase
- Increases quality before sellIn expires (line 30)
- **Also** increases after sellIn expires (line 61)
- Never decreases — gets better with age

### 3. Sulfuras, Hand of Ragnaros Never Expires
- sellIn never decremented (skipped at line 45-46)
- Quality never changed
- Only item with these rules

### 4. Ticket Tier Escalation (Lines 32-41)
- At 11 days left: +1 quality bonus
- At 6 days left: another +1 bonus
- At 0 days: quality → 0
- Max quality enforced as 50 throughout

### 5. Quality Ceiling Not Enforced Uniformly
- Most increments check `quality < 50` before incrementing
- But line 61 (Aged Brie after expiry) also checks — this is the only place Aged Brie quality *could* exceed 50

---

## Refactoring Priorities

**High:** Extract magic strings → constants or enum  
**High:** Break nested conditionals into readable method hierarchy  
**Medium:** Add type annotations  
**Medium:** Document unexplained thresholds (why 11? why 6?)  
**Low:** Consider polymorphic design if supporting many item types planned

---

## Questions for Refinement

1. Are the tier thresholds (11, 6 for tickets) documented somewhere?
2. Why `quality - quality` instead of direct 0 assignment?
3. Is Sulfuras, Hand of Ragnaros truly immutable, or should it follow normal rules?
4. What happens if quality exceeds 50 (via constructor)? Should constructor validate?
5. Any plans to add item types? (Affects refactoring scope)

(1% usage)