import { EventEmitter } from '../utils/EventEmitter.js';

export class InputManager extends EventEmitter {
    constructor() {
        super();

        // Separate key states for each player
        this.player1Keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            interact: false
        };
        
        this.player2Keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            interact: false
        };

        // Player 1 uses WASD
        this.player1KeyMappings = {
            'KeyW': 'up',
            'KeyS': 'down',
            'KeyA': 'left',
            'KeyD': 'right',
            'Space': 'interact'
        };
        
        // Player 2 uses Arrow Keys
        this.player2KeyMappings = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'Enter': 'interact'
        };

        this.lastMoveTime = { player1: 0, player2: 0 };
        this.moveDelay = 200; // Milliseconds between moves for deliberate climbing

        this.setupEventListeners();
        this.createMobileControls();
    }

    setupEventListeners() {
        // Bind methods to preserve 'this' context
        this.boundKeyDown = this.handleKeyDown.bind(this);
        this.boundKeyUp = this.handleKeyUp.bind(this);

        document.addEventListener('keydown', this.boundKeyDown);
        document.addEventListener('keyup', this.boundKeyUp);

        // Prevent arrow keys from scrolling the page
        this.boundPreventDefault = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        };
        document.addEventListener('keydown', this.boundPreventDefault);
    }

    createMobileControls() {
        // Create on-screen controls for mobile devices
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'mobile-controls';
        controlsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: none;
            z-index: 200;
        `;

        // Create directional pad
        const dPad = document.createElement('div');
        dPad.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(3, 60px);
            gap: 5px;
            margin-bottom: 20px;
        `;

        // Create directional buttons
        const buttons = [
            { text: '↑', action: 'up', pos: '2/3' },
            { text: '←', action: 'left', pos: '1/2' },
            { text: '↓', action: 'down', pos: '2/1' },
            { text: '→', action: 'right', pos: '3/2' }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                grid-area: ${btn.pos};
                background: rgba(255, 255, 255, 0.8);
                border: 2px solid #333;
                border-radius: 10px;
                font-size: 24px;
                font-weight: bold;
                color: #333;
                cursor: pointer;
                user-select: none;
                touch-action: manipulation;
            `;

            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleMobileInput(btn.action, true);
            });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleMobileInput(btn.action, false);
            });

            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.handleMobileInput(btn.action, true);
            });

            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.handleMobileInput(btn.action, false);
            });

            dPad.appendChild(button);
        });

        // Interact button
        const interactButton = document.createElement('button');
        interactButton.textContent = '🤝';
        interactButton.style.cssText = `
            width: 80px;
            height: 80px;
            background: rgba(255, 215, 0, 0.8);
            border: 2px solid #333;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            user-select: none;
            touch-action: manipulation;
        `;

        interactButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleMobileInput('interact', true);
        });

        interactButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleMobileInput('interact', true);
        });

        controlsContainer.appendChild(dPad);
        controlsContainer.appendChild(interactButton);

        document.body.appendChild(controlsContainer);

        // Show mobile controls on touch devices
        if ('ontouchstart' in window) {
            controlsContainer.style.display = 'block';
        }
    }

    handleKeyDown(e) {
        console.log('[Input] Key pressed:', e.code);
        
        // Check Player 1 (WASD)
        const player1Action = this.player1KeyMappings[e.code];
        console.log('[Input] Player 1 mapping:', player1Action, 'Key state before:', this.player1Keys[player1Action]);
        
        if (player1Action && !this.player1Keys[player1Action]) {
            this.player1Keys[player1Action] = true;
            console.log('[Input] Player 1 key activated:', player1Action);
            this.handleInput(player1Action, true, 1);
        }
        
        // Check Player 2 (Arrow Keys)
        const player2Action = this.player2KeyMappings[e.code];
        console.log('[Input] Player 2 mapping:', player2Action, 'Key state before:', this.player2Keys[player2Action]);
        
        if (player2Action && !this.player2Keys[player2Action]) {
            this.player2Keys[player2Action] = true;
            console.log('[Input] Player 2 key activated:', player2Action);
            this.handleInput(player2Action, true, 2);
        }
    }

    handleKeyUp(e) {
        // Check Player 1 (WASD)
        const player1Action = this.player1KeyMappings[e.code];
        if (player1Action) {
            this.player1Keys[player1Action] = false;
            this.handleInput(player1Action, false, 1);
        }
        
        // Check Player 2 (Arrow Keys)
        const player2Action = this.player2KeyMappings[e.code];
        if (player2Action) {
            this.player2Keys[player2Action] = false;
            this.handleInput(player2Action, false, 2);
        }
    }

    handleMobileInput(action, pressed) {
        console.log('[Mobile Input]', action, pressed ? 'PRESSED' : 'RELEASED');
        
        // For mobile, we'll default to Player 1 controls
        if (pressed && !this.player1Keys[action]) {
            this.player1Keys[action] = true;
            this.handleInput(action, true, 1);
            console.log('[Mobile Input] Player 1 action triggered:', action);
        } else if (!pressed) {
            this.player1Keys[action] = false;
            this.handleInput(action, false, 1);
        }
    }

    handleInput(action, pressed, playerId) {
        console.log('[Input]', `Player ${playerId}:`, action, pressed ? 'PRESSED' : 'RELEASED');
        
        if (!pressed) return;

        const now = Date.now();
        const playerKey = `player${playerId}`;

        if (action === 'interact') {
            console.log('[Input] Interact event emitted for player', playerId);
            this.emit('interact', playerId);
            return;
        }

        // Implement move delay for deliberate climbing
        if (['up', 'down', 'left', 'right'].includes(action)) {
            const timeSinceLastMove = now - this.lastMoveTime[playerKey];
            console.log(`[Input] Move delay check: ${timeSinceLastMove}ms >= ${this.moveDelay}ms?`);
            
            if (timeSinceLastMove >= this.moveDelay) {
                console.log('[Input] Move event emitted:', action, 'for player', playerId);
                this.emit('move', action, playerId);
                this.lastMoveTime[playerKey] = now;
            } else {
                console.log('[Input] Move blocked by delay. Wait', this.moveDelay - timeSinceLastMove, 'more ms');
            }
        }
    }

    getInputState() {
        const state = {
            player1: { ...this.player1Keys },
            player2: { ...this.player2Keys }
        };
        console.log('[InputState] Current key states:', state);
        return state;
    }

    destroy() {
        document.removeEventListener('keydown', this.boundKeyDown);
        document.removeEventListener('keyup', this.boundKeyUp);
        document.removeEventListener('keydown', this.boundPreventDefault);

        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) {
            mobileControls.remove();
        }
    }
}