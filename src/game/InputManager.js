import { EventEmitter } from '../utils/EventEmitter.js';

export class InputManager extends EventEmitter {
    constructor() {
        super();

        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            interact: false
        };

        this.keyMappings = {
            'ArrowUp': 'up',
            'KeyW': 'up',
            'ArrowDown': 'down',
            'KeyS': 'down',
            'ArrowLeft': 'left',
            'KeyA': 'left',
            'ArrowRight': 'right',
            'KeyD': 'right',
            'Space': 'interact',
            'Enter': 'interact'
        };

        this.lastMoveTime = 0;
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
        const action = this.keyMappings[e.code];
        if (action && !this.keys[action]) {
            this.keys[action] = true;
            this.handleInput(action, true);
        }
    }

    handleKeyUp(e) {
        const action = this.keyMappings[e.code];
        if (action) {
            this.keys[action] = false;
            this.handleInput(action, false);
        }
    }

    handleMobileInput(action, pressed) {
        if (pressed && !this.keys[action]) {
            this.keys[action] = true;
            this.handleInput(action, true);
        } else if (!pressed) {
            this.keys[action] = false;
            this.handleInput(action, false);
        }
    }

    handleInput(action, pressed) {
        if (!pressed) return;

        const now = Date.now();


        if (action === 'interact') {
            this.emit('interact');
            return;
        }

        // Implement move delay for deliberate climbing
        if (['up', 'down', 'left', 'right'].includes(action)) {
            if (now - this.lastMoveTime >= this.moveDelay) {
                this.emit('move', action);
                this.lastMoveTime = now;
            }
        }
    }

    getInputState() {
        return { ...this.keys };
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