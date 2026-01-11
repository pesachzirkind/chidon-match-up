# Implementation Plan

[Overview]
Convert the memory flip card game to a direct-match selection game where all cards are visible and matched pairs disappear, with a timer tracking completion time.

The current game operates as a traditional memory/flip game where cards start face-down and players flip two at a time to find matching pairs. The new implementation fundamentally changes the gameplay: all cards are visible from the start showing their content, players click to select two cards they believe are a match, correct matches cause the cards to disappear (fade out), and a timer tracks how long it takes to find all matches.

This change transforms the game from a memory-based challenge to a knowledge-based quiz format, more suitable for testing understanding of mitzvah relationships rather than spatial memory. The timer adds a competitive element and allows players to track their improvement over multiple attempts.

[Types]
Modify the Card interface and GameState to support selection-based gameplay with timer tracking.

**File: `src/types/index.ts`**

1. **Card interface changes:**
   - Remove `is_face_up: boolean` (no longer needed - cards always visible)
   - Add `is_selected: boolean` (tracks if card is currently selected for matching)
   - Keep `is_matched: boolean` (but matched cards will be hidden, not just greyed)

2. **GameState interface changes:**
   - Rename `flippedCards: Card[]` to `selectedCards: Card[]`
   - Add `startTime: number | null` (timestamp when timer started)
   - Add `elapsedTime: number` (elapsed seconds since game start)
   - Keep existing fields: currentLevel, cards, matchedPairs, totalPairs, score, combo, moves, gameStatus, feedbackMessage, feedbackMitzvah

3. **GameAction type changes:**
   - Rename `FLIP_CARD` to `SELECT_CARD`
   - Add `UPDATE_TIMER` action type: `{ type: 'UPDATE_TIMER'; payload: { elapsedTime: number } }`

**Updated Card interface:**
```typescript
export interface Card {
  card_id: string;
  mitzvah_id: string;
  card_type: CardType;
  display_text: string;
  is_selected: boolean;  // NEW - replaces is_face_up
  is_matched: boolean;
}
```

**Updated GameState interface:**
```typescript
export interface GameState {
  currentLevel: number | null;
  cards: Card[];
  selectedCards: Card[];      // RENAMED from flippedCards
  matchedPairs: number;
  totalPairs: number;
  score: number;
  combo: number;
  moves: number;
  startTime: number | null;   // NEW
  elapsedTime: number;        // NEW
  gameStatus: 'idle' | 'playing' | 'checking' | 'complete';
  feedbackMessage: string | null;
  feedbackMitzvah: Mitzvah | null;
}
```

**Updated GameAction type:**
```typescript
export type GameAction =
  | { type: 'START_GAME'; payload: { level: number; cards: Card[]; totalPairs: number } }
  | { type: 'SELECT_CARD'; payload: { cardId: string } }  // RENAMED from FLIP_CARD
  | { type: 'CHECK_MATCH' }
  | { type: 'MATCH_SUCCESS' }
  | { type: 'MATCH_FAILURE'; payload: { message: string; mitzvah: Mitzvah } }
  | { type: 'CLEAR_SELECTED' }  // RENAMED from CLEAR_FLIPPED
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'UPDATE_TIMER'; payload: { elapsedTime: number } }  // NEW
  | { type: 'RESET_GAME' };
```

[Files]
Modify existing files to support the new selection-based gameplay and timer feature.

**Files to modify:**
1. `src/types/index.ts` - Type definitions as described above
2. `src/context/GameContext.tsx` - Reducer logic for selection and timer
3. `src/hooks/useGameLogic.ts` - Hook logic for selection and timer interval
4. `src/components/Card/Card.tsx` - Display logic (always visible, selection highlight)
5. `src/components/Card/Card.css` - Remove flip styles, add selection/disappear styles
6. `src/components/ScoreBoard/ScoreBoard.tsx` - Add timer display
7. `src/components/GameBoard/GameBoard.tsx` - Pass timer, filter hidden cards
8. `src/components/GameOver/GameOver.tsx` - Display elapsed time in results
9. `src/utils/cardGenerator.ts` - Initialize cards with `is_selected: false` instead of `is_face_up: false`

**No new files needed.**
**No files to delete.**

[Functions]
Modify functions to handle card selection instead of flipping, and add timer management.

**File: `src/utils/cardGenerator.ts`**
- Function: `generateCardsForLevel`
  - Change: Replace `is_face_up: false` with `is_selected: false` when creating Card objects

**File: `src/context/GameContext.tsx`**
- Function: `gameReducer`
  - Modify `START_GAME` case: Initialize `startTime: Date.now()`, `elapsedTime: 0`, `selectedCards: []`
  - Rename `FLIP_CARD` to `SELECT_CARD`: Toggle `is_selected` on card, add to `selectedCards` (max 2)
  - Modify `MATCH_SUCCESS`: Set `is_matched: true` (cards will be hidden by component)
  - Rename `CLEAR_FLIPPED` to `CLEAR_SELECTED`: Clear `is_selected` on non-matched cards
  - Add `UPDATE_TIMER` case: Update `elapsedTime` from payload
  - Modify `RESET_GAME`: Reset timer state

**File: `src/hooks/useGameLogic.ts`**
- Function: `useGameLogic`
  - Rename internal function `flipCard` to `selectCard`
  - Add `useEffect` for timer interval: setInterval every 1000ms while playing
  - Dispatch `UPDATE_TIMER` with calculated elapsed time
  - Clean up interval on unmount or game complete
  - Return `selectCard` instead of `flipCard`, return `elapsedTime`

**File: `src/components/Card/Card.tsx`**
- Function: `Card` component
  - Remove flip state logic (`is_face_up` checks)
  - Add selection state: highlight border when `is_selected`
  - Return `null` when `is_matched` (hide card completely)
  - Update click handler: only disabled if already selected or matched

**File: `src/components/ScoreBoard/ScoreBoard.tsx`**
- Function: `ScoreBoard` component
  - Add `elapsedTime: number` prop
  - Add timer display showing MM:SS format
  - Create helper function `formatTime(seconds: number): string`

**File: `src/components/GameBoard/GameBoard.tsx`**
- Function: `GameBoard` component
  - Add `elapsedTime: number` prop
  - Pass `elapsedTime` to ScoreBoard
  - Remove filtering (let Card handle visibility)

**File: `src/components/GameOver/GameOver.tsx`**
- Function: `GameOver` component
  - Add `elapsedTime: number` prop
  - Display formatted time in stats grid
  - Optional: Add time-based performance message

**File: `src/App.tsx`**
- Function: `GameApp` component
  - Rename `flipCard` to `selectCard` in destructured values
  - Pass `elapsedTime` to GameBoard and GameOver

[Classes]
No class modifications required. The codebase uses functional components exclusively.

[Dependencies]
No new dependencies required. The timer functionality will be implemented using native JavaScript `Date.now()` and React's `useEffect` with `setInterval`.

[Testing]
Manual testing approach for the changes.

**Test scenarios:**
1. Start a game - verify all cards are visible immediately (no face-down cards)
2. Click one card - verify it shows selection highlight (border/shadow change)
3. Click same card again - verify it deselects
4. Click second card (matching pair) - verify both cards fade out and disappear
5. Click second card (non-matching) - verify feedback modal appears, cards deselect after closing
6. Timer - verify it starts at 0:00 when game begins
7. Timer - verify it increments every second during gameplay
8. Timer - verify it stops when all matches found
9. Game over - verify elapsed time is displayed in final stats
10. Play again - verify timer resets to 0:00

**Edge cases:**
- Rapidly clicking multiple cards
- Clicking matched (hidden) cards should have no effect
- Timer continues during feedback modal display

[Implementation Order]
Implement changes in dependency order to minimize breaking changes during development.

1. **Update types** (`src/types/index.ts`)
   - Add new fields to Card and GameState interfaces
   - Update GameAction type
   - This may cause TypeScript errors in other files temporarily

2. **Update card generator** (`src/utils/cardGenerator.ts`)
   - Change `is_face_up: false` to `is_selected: false`
   - Quick fix to align with new Card interface

3. **Update game context/reducer** (`src/context/GameContext.tsx`)
   - Update initial state with new fields
   - Rename and modify action handlers
   - Add timer action handler
   - Update state references from flippedCards to selectedCards

4. **Update game logic hook** (`src/hooks/useGameLogic.ts`)
   - Rename flipCard to selectCard
   - Add timer useEffect with interval
   - Return new values (selectCard, elapsedTime)

5. **Update Card component and CSS** (`src/components/Card/Card.tsx`, `Card.css`)
   - Remove flip animation and face-down rendering
   - Add selection highlight styles
   - Add matched card hiding (return null)
   - Update click handler logic

6. **Update ScoreBoard** (`src/components/ScoreBoard/ScoreBoard.tsx`)
   - Add timer prop and display
   - Add formatTime helper

7. **Update GameBoard** (`src/components/GameBoard/GameBoard.tsx`)
   - Add elapsedTime prop
   - Pass to ScoreBoard

8. **Update GameOver** (`src/components/GameOver/GameOver.tsx`)
   - Add elapsedTime prop
   - Display formatted time in results

9. **Update App** (`src/App.tsx`)
   - Rename flipCard to selectCard
   - Pass elapsedTime to components

10. **Testing and refinement**
    - Test all scenarios listed above
    - Adjust animations and timing as needed
