# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

- **Start development server**: `uv run dev` (opens at localhost:3000)
- **Build for production**: `uv run build` 
- **Preview production build**: `uv run preview`

## Architecture Overview

Two Hearts One Summit is a cooperative 3D climbing game built with Three.js where couples help each other reach the summit while answering relationship questions.

### Core Game Loop
- Two players connect via 6-character room codes using mock multiplayer (localStorage-based)
- Players move independently but must use each other's bodies as climbing holds
- Body hold interactions trigger relationship questions from "36 Questions to Fall in Love"
- Questions gate progress - both players must engage before continuing climbing
- Victory condition: both players reach summit together

### Key Systems
- **Three.js Rendering**: Scene contains climbing wall geometry, player sprites, lighting
- **Mock Multiplayer**: LocalStorage simulates real-time communication between browser tabs/windows
- **Body Hold System**: 6 attachment points per player (feet, knees, hips, hands, elbows, shoulders)
- **Question Engine**: Progressive difficulty relationship questions with turn-taking logic

## Code Structure

```
src/
├── game/                   # Core game logic
│   ├── Game.js            # Main game controller and scene setup
│   ├── Player.js          # Player sprites, body holds, movement
│   ├── ClimbingWall.js    # Wall geometry and hold placement
│   ├── QuestionManager.js # 36 Questions database and logic
│   └── InputManager.js    # Keyboard/touch controls
├── network/
│   └── ConnectionManager.js # Mock multiplayer via localStorage
└── utils/
    └── EventEmitter.js    # Event system for game components
```

## Key Technical Details

### Body Hold System
- Players can only move to positions with climbing holds OR within 1.5 units of partner's body
- `canUsePartnerAsBodyHold()` calculates closest attachment point and enables move
- Body holds are highlighted visually when in use
- Each hold interaction can trigger relationship questions

### Mock Multiplayer Implementation  
- Room creation generates 6-char codes stored in localStorage
- Real-time sync via `window.addEventListener('storage')` events
- Messages queued in `messages_${roomCode}` localStorage keys
- Production would replace with Socket.io server

### Question Integration
- Questions triggered by body hold interactions in `checkBodyHoldInteraction()`
- UI overlay shows question text, category, progress (question N/36)
- Turn-taking ensures both players participate equally
- Continue button hides overlay and resumes climbing

## Development Workflow

- **Two-tab testing**: Open `localhost:3000` in two browser tabs, create room in one, join in other
- **Mobile testing**: Game includes touch controls for mobile browsers
- **No backend**: Fully client-side, uses localStorage for persistence
- **Build assets**: Vite bundles to `/dist` with source maps enabled

## Important Notes

- Uses ES6 modules throughout - all imports must include `.js` extension
- Three.js optimized via Vite config for faster dev builds  
- Camera positioned for side-view of climbing wall at (0, 10, 25)
- Game designed for relationship building, not competition - emphasize cooperation