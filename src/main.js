import * as THREE from 'three';
import { Game } from './game/Game.js';
import { ConnectionManager } from './network/ConnectionManager.js';

class TwoHeartsOneSummit {
    constructor() {
        this.container = document.getElementById('game-container');
        this.connectionManager = new ConnectionManager();
        this.game = null;

        this.init();
    }

    init() {
        this.setupUI();
        this.setupConnectionManager();
    }

    setupUI() {
        // Room creation/joining
        document.getElementById('create-room').addEventListener('click', () => {
            this.connectionManager.createRoom();
        });

        document.getElementById('join-room').addEventListener('click', () => {
            const code = document.getElementById('room-code').value.trim().toUpperCase();
            if (code.length === 6) {
                this.connectionManager.joinRoom(code);
            }
        });

        // Enter key support for room code
        document.getElementById('room-code').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('join-room').click();
            }
        });

        // Question panel continue button
        document.getElementById('continue-climbing').addEventListener('click', () => {
            this.hideQuestionPanel();
        });

        // Help controls
        document.getElementById('hide-help').addEventListener('click', () => {
            document.getElementById('controls-help').style.display = 'none';
        });
    }

    setupConnectionManager() {
        this.connectionManager.on('roomCreated', (roomCode) => {
            this.showWaiting(roomCode);
        });

        this.connectionManager.on('connected', (roomCode) => {
            this.showConnected(roomCode);
            this.startGame();
        });

        this.connectionManager.on('disconnected', () => {
            this.showMenu();
            if (this.game) {
                this.game.destroy();
                this.game = null;
            }
        });

        this.connectionManager.on('error', (message) => {
            alert(`Connection error: ${message}`);
        });
    }

    showMenu() {
        document.getElementById('menu').style.display = 'block';
        document.getElementById('waiting').style.display = 'none';
        document.getElementById('connected').style.display = 'none';
    }

    showWaiting(roomCode) {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('waiting').style.display = 'block';
        document.getElementById('connected').style.display = 'none';
        document.getElementById('current-room-code').textContent = roomCode;
    }

    showConnected(roomCode) {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('waiting').style.display = 'none';
        document.getElementById('connected').style.display = 'block';
        document.getElementById('room-display').textContent = roomCode;
    }

    startGame() {
        if (this.game) {
            this.game.destroy();
        }

        this.game = new Game(this.container, this.connectionManager);
        this.game.on('questionTriggered', (question) => {
            this.showQuestionPanel(question);
        });

        // Show help controls when game starts
        document.getElementById('controls-help').style.display = 'block';
    }

    showQuestionPanel(question) {
        const panel = document.getElementById('question-panel');
        const questionText = document.getElementById('question-text');
        const instructions = document.getElementById('question-instructions');
        const category = document.getElementById('question-category');
        const number = document.getElementById('question-number');
        const asker = document.getElementById('question-asker');
        const progressFill = document.getElementById('progress-fill');

        // Update question content
        questionText.textContent = question.text;
        instructions.textContent = question.instructions || 'Take turns answering this question, then continue climbing together.';

        // Update meta information
        category.textContent = question.category;
        number.textContent = question.id;
        asker.textContent = question.askingInstructions || '';

        // Update progress bar
        const progress = Math.round((question.id / 36) * 100);
        progressFill.style.width = progress + '%';

        panel.style.display = 'block';
    }

    hideQuestionPanel() {
        document.getElementById('question-panel').style.display = 'none';
    }
}

// Start the application
new TwoHeartsOneSummit();