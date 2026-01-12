# Implementation Plan

[Overview]
Fix the matching logic to use text-based matching instead of mitzvah_id matching for attribute cards.

Currently, the game validates matches by checking if both cards share the same `mitzvah_id`. This causes issues for levels 2-5 where many mitzvos share the same attribute values (e.g., "All People", "All Times", "All Places", "Malkus"). When a user clicks a mitzvah name card and then clicks an attribute card like "All People", the match fails because the cards have different `mitzvah_id` values, even though "All People" IS the correct answer for that mitzvah.

The fix changes the matching logic to:
1. Identify which card is the "name" card (type_a - always a mitzvah name like hebrew_name or english_name)
2. Identify which card is the "attribute" card (type_b - who/when/where/punishment)
3. Validate that the attribute card's `display_text` matches what the name card's mitzvah expects for that attribute type

This approach maintains all existing cards but allows any attribute card with the correct text to match any mitzvah that has that attribute value.

[Types]
Add a `match_key` field to the Card interface to enable text-based matching.

The Card interface in `src/types/index.ts` will be extended with:
```typescript
export interface Card {
  card_id: string;           // UUID generated at runtime
  mitzvah_id: string;        // Reference to parent mitzvah
  card_type: CardType;       // Which attribute this card represents
  display_text: string;      // Text shown on card face
  match_key: string;         // For type_a: the expected attribute value; For type_b: the display_text (normalized)
  is_selected: boolean;      // Whether card is currently selected for matching
  is_matched: boolean;       // Whether card has been matched (will be hidden)
}
```

The `match_key` enables efficient matching:
- For a type_a card (e.g., english_name "Not to eat a Neveilah"), the `match_key` stores the expected attribute value (e.g., "All People" from the mitzvah's `who_applies` field)
- For a type_b card (e.g., who_applies "All People"), the `match_key` is the `display_text` itself

Matching becomes: `card1.match_key === card2.match_key` (with appropriate type checking)

[Files]
Modify three existing files to implement text-based matching.

Files to modify:
1. `src/types/index.ts` - Add `match_key` field to Card interface
2. `src/utils/cardGenerator.ts` - Generate `match_key` values when creating cards
3. `src/hooks/useGameLogic.ts` - Update `validateMatch` function to use `match_key`

No new files need to be created.
No files need to be deleted.

[Functions]
Modify two functions and create one helper function.

Functions to modify:

1. **`generateCardsForLevel`** in `src/utils/cardGenerator.ts`
   - Current: Creates cards with card_id, mitzvah_id, card_type, display_text, is_selected, is_matched
   - Change: Add `match_key` field to each card
   - For type_a card: `match_key = getCardDisplayText(mitzvah, levelConfig.card_type_b)` (the expected attribute value)
   - For type_b card: `match_key = display_text` (the attribute value itself)

2. **`validateMatch`** in `src/hooks/useGameLogic.ts`
   - Current: Returns `card1.mitzvah_id === card2.mitzvah_id && hasTypeA && hasTypeB`
   - Change: Returns `card1.match_key === card2.match_key && hasTypeA && hasTypeB`
   - The function already verifies one card is type_a and one is type_b, so match_key comparison is sufficient

Helper function (no change needed - already exists):
- **`getCardDisplayText`** in `src/utils/cardGenerator.ts` - Already extracts attribute values from mitzvah

[Classes]
No class modifications needed.

This codebase uses functional components and hooks rather than classes. All changes are to functions and interfaces.

[Dependencies]
No dependency changes needed.

All required functionality exists within the current dependencies. The changes are purely to application logic.

[Testing]
Manual testing steps to validate the fix.

Test scenarios:

1. **Level 2 - Who Applies (Primary Test Case)**
   - Start Level 2 (english_name ↔ who_applies)
   - Find two different mitzvos that both have "All People" as who_applies
   - Click on one mitzvah's english_name card
   - Click on any "All People" card (even if it has a different mitzvah_id)
   - Expected: Match should succeed, both cards should be marked as matched

2. **Level 1 - Hebrew ↔ English (Regression Test)**
   - Level 1 should still work correctly since each mitzvah has unique hebrew/english names
   - Verify matches still require correct pairs

3. **Levels 3-5 (When/Where/Punishment)**
   - Test that cards with shared values (All Times, All Places, Malkus, etc.) can correctly match
   - Test that incorrect matches are still rejected (e.g., "Men" should not match a mitzvah with "All People")

4. **Edge Case: Feedback Messages**
   - When a match fails, verify the feedback modal still shows the correct mitzvah information
   - The feedback should reference the first selected card's mitzvah

[Implementation Order]
Sequential steps to implement the fix safely.

1. **Update Types** (`src/types/index.ts`)
   - Add `match_key: string` field to the Card interface
   - This is a non-breaking change as we'll add defaults

2. **Update Card Generator** (`src/utils/cardGenerator.ts`)
   - Modify `generateCardsForLevel` to compute and assign `match_key` values
   - For type_a cards: match_key = expected attribute value from mitzvah
   - For type_b cards: match_key = the display_text (attribute value)

3. **Update Match Validation** (`src/hooks/useGameLogic.ts`)
   - Change `validateMatch` function to compare `match_key` instead of `mitzvah_id`
   - Keep the type checking (hasTypeA && hasTypeB) as-is

4. **Manual Testing**
   - Test Level 2 with shared "All People" values
   - Test all levels for regressions
   - Verify feedback messages work correctly
