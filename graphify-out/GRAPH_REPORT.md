# Graph Report - D:\Full_Stack_Projects\Saas-Project\DreamLand  (2026-04-22)

## Corpus Check
- 13 files · ~231,717 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 32 nodes · 24 edges · 12 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `handleFileSelect()` - 4 edges
2. `handleAuthClick()` - 3 edges
3. `processFile()` - 2 edges
4. `handleDrop()` - 2 edges
5. `handleChange()` - 2 edges
6. `signIn()` - 2 edges
7. `signOut()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `handleAuthClick()` --calls--> `signOut()`  [INFERRED]
  D:\Full_Stack_Projects\Saas-Project\DreamLand\components\Navbar.tsx → D:\Full_Stack_Projects\Saas-Project\DreamLand\lib\puter.action.ts
- `handleAuthClick()` --calls--> `signIn()`  [INFERRED]
  D:\Full_Stack_Projects\Saas-Project\DreamLand\components\Navbar.tsx → D:\Full_Stack_Projects\Saas-Project\DreamLand\lib\puter.action.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.36
Nodes (4): handleChange(), handleDrop(), handleFileSelect(), processFile()

### Community 1 - "Community 1"
Cohesion: 0.4
Nodes (3): handleAuthClick(), signIn(), signOut()

### Community 2 - "Community 2"
Cohesion: 0.4
Nodes (0): 

### Community 3 - "Community 3"
Cohesion: 0.67
Nodes (0): 

### Community 4 - "Community 4"
Cohesion: 1.0
Nodes (0): 

### Community 5 - "Community 5"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 4`** (2 nodes): `visualizerId.tsx`, `visualizerId()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (2 nodes): `Button()`, `Button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (1 nodes): `react-router.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (1 nodes): `type.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (1 nodes): `routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `welcome.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `constants.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `handleAuthClick()` (e.g. with `signOut()` and `signIn()`) actually correct?**
  _`handleAuthClick()` has 2 INFERRED edges - model-reasoned connections that need verification._