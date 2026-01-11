📘 Product Requirements Document (PRD)
======================================

**Mitzvah Match-Up**
--------------------

**Version:** 1.0**Audience:** 5th Grade Students**Product Type:** Educational Memory Game

1\. Product Overview
--------------------

### 1.1 Product Description

**Mitzvah Match-Up** is a single-player educational memory matching game designed to help 5th-grade students memorize mitzvos and their core attributes.

The game uses classic **concentration-style mechanics** (flip two cards to find matches) combined with **progressive difficulty**, **feedback explanations**, and **scaffolded learning levels**.

### 1.2 Educational Objective

Students should be able to recall the following for each mitzvah:

*   Hebrew name
    
*   English name
    
*   Who the mitzvah applies to
    
*   When the mitzvah applies
    
*   Where the mitzvah applies
    
*   Punishment (when applicable)
    

Learning model: **Recognition → Recall → Reinforcement**

2\. Target Users
----------------

### 2.1 Primary User

*   Age: 9–11 (5th grade)
    
*   Reading level: Elementary / middle school
    
*   Learning style: Visual + repetition-based
    

### 2.2 Secondary Users

*   Parents
    
*   Teachers
    
*   Tutors
    
*   Homeschool educators
    

3\. Core Game Concept
---------------------

### 3.1 Game Type

Classic memory match (Concentration).

### 3.2 Player Goal

Clear the board by finding all correct card pairs.

4\. Data Definitions
--------------------

### 4.1 Mitzvah Entity (Source of Truth)

Each mitzvah record **must** include:

FieldTypeRequiredmitzvah\_idstringyeshebrew\_namestringyesenglish\_namestringyeswho\_appliesstringyeswhen\_appliesstringyeswhere\_appliesstringyespunishmentstringoptional

### 4.2 Canonical Data Format (JSON)

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "mitzvah_id": "M014",    "hebrew_name": "שמירת שבת",    "english_name": "Observing Shabbos",    "who_applies": "Every Jewish person",    "when_applies": "Every week on Shabbos",    "where_applies": "Everywhere",    "punishment": "Kares / Skila (depending on violation)"  }   `

5\. Card System
---------------

### 5.1 Card Types

Each card represents **exactly one mitzvah attribute**.

Allowed card types:

*   hebrew\_name
    
*   english\_name
    
*   who\_applies
    
*   when\_applies
    
*   where\_applies
    
*   punishment
    

### 5.2 Card Object Schema

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "card_id": "uuid",    "mitzvah_id": "M014",    "card_type": "hebrew_name",    "display_text": "שמירת שבת",    "is_face_up": false,    "is_matched": false  }   `

6\. Match Rules
---------------

### 6.1 Valid Match Definition

A match is valid when:

*   Both cards share the same mitzvah\_id
    
*   AND the card types form the **allowed pair for the current level**
    

### 6.2 Match Pairings by Level

LevelCard ACard B1hebrew\_nameenglish\_name2english\_namewho\_applies3english\_namewhen\_applies4english\_namewhere\_applies5english\_namepunishment

7\. Level System
----------------

### 7.1 Level Progression

LevelFocusCards Shown1Hebrew ↔ English8–122Add Who10–143Add When12–164Add Where14–185Add Punishment16–20

### 7.2 Level Unlock Conditions

A level unlocks when:

*   All matches are completed**OR**
    
*   Accuracy ≥ 70%
    

8\. Gameplay Flow
-----------------

### 8.1 Start Game

1.  Player selects a level
    
2.  Game loads appropriate mitzvos
    
3.  Cards are generated according to level rules
    
4.  Cards are shuffled and placed face-down in a grid
    

### 8.2 Turn Logic

1.  Player clicks first card → flips face-up
    
2.  Player clicks second card → flips face-up
    
3.  System evaluates match:
    
    *   ✅ Correct → mark matched
        
    *   ❌ Incorrect → flip both back after delay
        

### 8.3 End Game

Game ends when all matches are found.

9\. Feedback & Learning Reinforcement
-------------------------------------

### 9.1 Incorrect Match Feedback

On incorrect match:

*   Display a short educational popup
    
*   1–2 simple sentences
    
*   Reinforces correct association
    

**Example:**

> “This mitzvah only applies in Eretz Yisrael.”

### 9.2 Correct Match Feedback (Optional)

*   Gentle animation
    
*   Soft positive sound
    

10\. Scoring System
-------------------

### 10.1 Base Scoring

*   Correct match: **+10 points**
    
*   Incorrect match: **0 points**
    

### 10.2 Combo Bonus

*   2 correct in a row: **+5 bonus**
    
*   3+ streak: **+10 bonus**
    

### 10.3 Timer (Optional)

*   Timer enabled per level
    
*   Faster completion = higher score
    
*   Timer can be disabled for study mode
    

11\. UI / UX Requirements
-------------------------

### 11.1 Visual Design

*   Large readable text
    
*   High contrast
    
*   Minimal distractions
    
*   Friendly animations
    

### 11.2 Accessibility

*   No flashing
    
*   No harsh sounds
    
*   Touch-friendly
    
*   Simple language
    

12\. Technical Requirements
---------------------------

### 12.1 MVP Tech Options

*   Vanilla HTML / CSS / JavaScript
    
*   React
    
*   Scratch
    
*   Google Slides (offline prototype)
    

### 12.2 Functional Requirements

*   Deterministic match validation
    
*   Random shuffle per session
    
*   Stateless per game (v1)
    
*   Load data from JSON / CSV
    

13\. Non-Goals (v1)
-------------------

*   Multiplayer
    
*   Leaderboards
    
*   Authentication
    
*   Free-text answers
    
*   Adaptive difficulty
    

14\. Success Metrics
--------------------

### 14.1 Learning Metrics

*   Accuracy improvement
    
*   Reduced incorrect matches
    
*   Faster completion time
    

### 14.2 Engagement Metrics

*   Session length
    
*   Replay frequency
    
*   Level completion rate
    

15\. Future Enhancements (Out of Scope)
---------------------------------------

*   Audio pronunciation
    
*   Daily challenges
    
*   Parent / teacher dashboards
    
*   Adaptive learning
    
*   Printable cards
    

16\. Constraints
----------------

*   Must be understandable by a 5th grader
    
*   Must function offline (MVP)
    
*   Must avoid halachic ambiguity
    
*   Must rely strictly on provided data
    

17\. LLM Summary Instruction
----------------------------

> Build a single-player educational memory game where:
> 
> *   Cards represent mitzvah attributes
>     
> *   Matching rules change by level
>     
> *   Feedback reinforces learning
>     
> *   Difficulty increases gradually
>     
> *   UI is kid-friendly and accessible
>