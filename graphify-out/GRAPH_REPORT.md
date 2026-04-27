# Graph Report - .  (2026-04-24)

## Corpus Check
- 26 files · ~237,924 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 94 nodes · 91 edges · 23 communities detected
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Puter Hosting Integration|Puter Hosting Integration]]
- [[_COMMUNITY_2D Floor Plan Concepts|2D Floor Plan Concepts]]
- [[_COMMUNITY_3D Apartment Layout|3D Apartment Layout]]
- [[_COMMUNITY_Project Management Home|Project Management Home]]
- [[_COMMUNITY_File Upload Interface|File Upload Interface]]
- [[_COMMUNITY_Puter Authentication & Actions|Puter Authentication & Actions]]
- [[_COMMUNITY_AI Generation Pipeline|AI Generation Pipeline]]
- [[_COMMUNITY_App Root & Layout|App Root & Layout]]
- [[_COMMUNITY_AI Rendering Design|AI Rendering Design]]
- [[_COMMUNITY_Basic Floor Plan Elements|Basic Floor Plan Elements]]
- [[_COMMUNITY_Auth & Core Architecture|Auth & Core Architecture]]
- [[_COMMUNITY_Light Mode Branding|Light Mode Branding]]
- [[_COMMUNITY_UI Components (Buttons)|UI Components (Buttons)]]
- [[_COMMUNITY_Dark Mode Branding|Dark Mode Branding]]
- [[_COMMUNITY_Basic Room Types|Basic Room Types]]
- [[_COMMUNITY_React Router Config|React Router Config]]
- [[_COMMUNITY_Type Definitions|Type Definitions]]
- [[_COMMUNITY_Vite Configuration|Vite Configuration]]
- [[_COMMUNITY_Route Definitions|Route Definitions]]
- [[_COMMUNITY_Welcome Page|Welcome Page]]
- [[_COMMUNITY_Project Constants|Project Constants]]
- [[_COMMUNITY_SSR Architecture|SSR Architecture]]
- [[_COMMUNITY_3D Floor Plan Analysis|3D Floor Plan Analysis]]

## God Nodes (most connected - your core abstractions)
1. `1194 Copperstone Terrace Floor Plan` - 9 edges
2. `uploadImageToHosting()` - 7 edges
3. `createProject()` - 5 edges
4. `handleFileSelect()` - 4 edges
5. `Living Room` - 4 edges
6. `Master Bedroom` - 4 edges
7. `handleUploadComplete()` - 3 edges
8. `handleAuthClick()` - 3 edges
9. `generate3DView()` - 3 edges
10. `getOrCreateHosingConfig()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `handleUploadComplete()` --calls--> `createProject()`  [INFERRED]
  app\routes\home.tsx → lib\puter.action.ts
- `uploadImageToHosting()` --calls--> `imageUrlToPngBlob()`  [INFERRED]
  lib\puter.hosting.ts → lib\utils.ts
- `uploadImageToHosting()` --calls--> `getImageExtension()`  [INFERRED]
  lib\puter.hosting.ts → lib\utils.ts
- `loader()` --calls--> `listProjects()`  [INFERRED]
  app\routes\home.tsx → lib\puter.action.ts
- `runGeneration()` --calls--> `generate3DView()`  [INFERRED]
  app\routes\visualizerId.tsx → lib\ai.action.ts

## Hyperedges (group relationships)
- **Project Creation and Hosting Flow** — home_handleuploadcomplete, puter_createproject, hosting_manager [EXTRACTED 0.95]
- **AI Rendering Pipeline** — visualizer_rungeneration, ai_generate3dview, const_render_prompt [EXTRACTED 1.00]

## Communities

### Community 0 - "Puter Hosting Integration"
Cohesion: 0.27
Nodes (11): createProject(), getOrCreateHosingConfig(), uploadImageToHosting(), createHostingSlug(), dataUrlToBlob(), fetchBlobFromUrl(), getHostedUrl(), getImageExtension() (+3 more)

### Community 1 - "2D Floor Plan Concepts"
Cohesion: 0.27
Nodes (10): Balcony, Bathroom (Master), Bathroom, Bedroom (Primary), Bedroom (Secondary), Den, 1194 Copperstone Terrace Floor Plan, Kitchen (+2 more)

### Community 2 - "3D Apartment Layout"
Cohesion: 0.22
Nodes (9): Outdoor Balcony, Dining Area, Guest Bathroom, Home Office Workspace, Kitchen, Living Room, Master Bathroom, Master Bedroom (+1 more)

### Community 3 - "Project Management Home"
Cohesion: 0.25
Nodes (6): handleUploadComplete(), loader(), Puter Hosting Manager, listProjects(), createProject, DesignItem Interface

### Community 4 - "File Upload Interface"
Cohesion: 0.36
Nodes (4): handleChange(), handleDrop(), handleFileSelect(), processFile()

### Community 5 - "Puter Authentication & Actions"
Cohesion: 0.33
Nodes (3): handleAuthClick(), signIn(), signOut()

### Community 6 - "AI Generation Pipeline"
Cohesion: 0.4
Nodes (3): fetchAsDataUrl(), generate3DView(), runGeneration()

### Community 7 - "App Root & Layout"
Cohesion: 0.4
Nodes (0): 

### Community 8 - "AI Rendering Design"
Cohesion: 0.5
Nodes (4): generate3DView, AI-First Design Pattern, DreamLand Render Prompt, runGeneration

### Community 9 - "Basic Floor Plan Elements"
Cohesion: 0.5
Nodes (4): Balcony, Dining Space, Kitchen, Living Area

### Community 10 - "Auth & Core Architecture"
Cohesion: 0.67
Nodes (3): Authentication Management, App Root Component, AuthContext Interface

### Community 11 - "Light Mode Branding"
Cohesion: 0.67
Nodes (2): React Router Branding, Stylized R Icon

### Community 12 - "UI Components (Buttons)"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Dark Mode Branding"
Cohesion: 1.0
Nodes (2): React Router Dark Logo, React Router Framework

### Community 14 - "Basic Room Types"
Cohesion: 1.0
Nodes (2): Bathroom, Bedroom

### Community 15 - "React Router Config"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Type Definitions"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Vite Configuration"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Route Definitions"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Welcome Page"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Project Constants"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "SSR Architecture"
Cohesion: 1.0
Nodes (1): Server-Side Rendering

### Community 22 - "3D Floor Plan Analysis"
Cohesion: 1.0
Nodes (1): 3D Apartment Floor Plan

## Knowledge Gaps
- **27 isolated node(s):** `DesignItem Interface`, `AuthContext Interface`, `App Root Component`, `runGeneration`, `DreamLand Render Prompt` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `UI Components (Buttons)`** (2 nodes): `Button()`, `Button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dark Mode Branding`** (2 nodes): `React Router Dark Logo`, `React Router Framework`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Basic Room Types`** (2 nodes): `Bathroom`, `Bedroom`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `React Router Config`** (1 nodes): `react-router.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Type Definitions`** (1 nodes): `type.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Configuration`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Route Definitions`** (1 nodes): `routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Welcome Page`** (1 nodes): `welcome.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Project Constants`** (1 nodes): `constants.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SSR Architecture`** (1 nodes): `Server-Side Rendering`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `3D Floor Plan Analysis`** (1 nodes): `3D Apartment Floor Plan`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createProject()` connect `Puter Hosting Integration` to `Project Management Home`, `Puter Authentication & Actions`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `handleUploadComplete()` connect `Project Management Home` to `Puter Hosting Integration`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `uploadImageToHosting()` (e.g. with `createProject()` and `isHostedUrl()`) actually correct?**
  _`uploadImageToHosting()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `createProject()` (e.g. with `handleUploadComplete()` and `getOrCreateHosingConfig()`) actually correct?**
  _`createProject()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `DesignItem Interface`, `AuthContext Interface`, `App Root Component` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._