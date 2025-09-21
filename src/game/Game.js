import * as THREE from 'three';
import { EventEmitter } from '../utils/EventEmitter.js';
import { Renderer } from './Renderer.js';
import { ClimbingWall } from './ClimbingWall.js';
import { Player } from './Player.js';
import { InputManager } from './InputManager.js';
import { QuestionManager } from './QuestionManager.js';

export class Game extends EventEmitter {
    constructor(container, connectionManager) {
        super();

        this.container = container;
        this.connectionManager = connectionManager;

        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        this.renderer = new Renderer(this.container);
        this.climbingWall = new ClimbingWall();
        this.questionManager = new QuestionManager();

        this.players = new Map();
        this.localPlayer = null;

        this.isRunning = false;

        this.init();
    }

    init() {
        this.setupScene();
        this.createPlayers();
        this.setupInput();
        this.setupNetworking();
        this.start();
    }

    setupScene() {
        // Add climbing wall to scene
        this.scene.add(this.climbingWall.group);

        // Setup camera position for side view of climbing wall
        this.renderer.camera.position.set(0, 10, 25);
        this.renderer.camera.lookAt(0, 10, 0);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    createPlayers() {
        // Create local player (Player 1 - red)
        this.localPlayer = new Player(1, 0xff4444);
        this.localPlayer.setPosition(-2, 2, 0);
        this.players.set(1, this.localPlayer);
        this.scene.add(this.localPlayer.group);

        // Create remote player (Player 2 - blue)
        const remotePlayer = new Player(2, 0x4444ff);
        remotePlayer.setPosition(2, 2, 0);
        this.players.set(2, remotePlayer);
        this.scene.add(remotePlayer.group);
    }

    setupInput() {
        this.inputManager = new InputManager();

        this.inputManager.on('move', (direction) => {
            if (this.localPlayer) {
                this.movePlayer(this.localPlayer, direction);
            }
        });

        this.inputManager.on('interact', () => {
            if (this.localPlayer) {
                this.tryPlayerInteraction();
            }
        });
    }

    setupNetworking() {
        this.connectionManager.onMessage((type, data) => {
            this.handleNetworkMessage(type, data);
        });
    }

    movePlayer(player, direction) {
        const moveDistance = 1;
        const currentPos = player.getPosition();
        let newPos = { ...currentPos };

        switch (direction) {
            case 'up':
                newPos.y += moveDistance;
                break;
            case 'down':
                newPos.y = Math.max(0, newPos.y - moveDistance);
                break;
            case 'left':
                newPos.x -= moveDistance;
                break;
            case 'right':
                newPos.x += moveDistance;
                break;
        }

        // Check if move is valid (on a hold or using partner)
        if (this.isValidMove(player, newPos)) {
            player.setPosition(newPos.x, newPos.y, newPos.z);
            player.playClimbingAnimation(direction);

            // Send move to partner
            this.connectionManager.sendMessage('playerMove', {
                playerId: player.id,
                position: newPos
            });

            // Check for body hold interactions
            this.checkBodyHoldInteraction(player);
        }
    }

    isValidMove(player, newPos) {
        // Check if position has a climbing hold
        if (this.climbingWall.hasHoldAt(newPos.x, newPos.y)) {
            return true;
        }

        // Check if player can use partner as body hold
        const partner = this.getPartnerPlayer(player);
        if (partner && this.canUsePartnerAsBodyHold(player, newPos, partner)) {
            return true;
        }

        return false;
    }

    getPartnerPlayer(player) {
        for (const [id, p] of this.players) {
            if (id !== player.id) {
                return p;
            }
        }
        return null;
    }

    canUsePartnerAsBodyHold(player, newPos, partner) {
        const partnerPos = partner.getPosition();
        const distance = Math.sqrt(
            Math.pow(newPos.x - partnerPos.x, 2) +
            Math.pow(newPos.y - partnerPos.y, 2)
        );

        // Check if player is within range of partner's body hold points
        if (distance <= 1.5) {
            // Determine which body hold point is being used
            const bodyHoldPoint = this.getClosestBodyHoldPoint(newPos, partner);
            if (bodyHoldPoint) {
                // Show body hold indicators
                partner.highlightSpecificBodyHold(bodyHoldPoint, true);

                // Store the body hold relationship
                player.usingBodyHold = {
                    partner: partner,
                    holdPoint: bodyHoldPoint
                };

                return true;
            }
        }

        return false;
    }

    getClosestBodyHoldPoint(playerPos, partner) {
        const partnerPos = partner.getPosition();
        const bodyHoldPoints = ['feet', 'knees', 'hips', 'hands', 'elbows', 'shoulders'];

        let closestPoint = null;
        let minDistance = Infinity;

        bodyHoldPoints.forEach(point => {
            const holdWorldPos = partner.getBodyHoldPosition(point);
            const distance = Math.sqrt(
                Math.pow(playerPos.x - holdWorldPos.x, 2) +
                Math.pow(playerPos.y - holdWorldPos.y, 2)
            );

            if (distance < minDistance && distance <= 1) {
                minDistance = distance;
                closestPoint = point;
            }
        });

        return closestPoint;
    }

    checkBodyHoldInteraction(player) {
        const partner = this.getPartnerPlayer(player);
        if (!partner) return;

        // Check if player is using partner as body hold
        if (player.usingBodyHold && player.usingBodyHold.partner === partner) {
            // Trigger a question only if it's a new body hold interaction
            if (!this.lastBodyHoldTime || Date.now() - this.lastBodyHoldTime > 3000) {
                const question = this.questionManager.getProgressiveQuestion();
                this.emit('questionTriggered', question);
                this.lastBodyHoldTime = Date.now();

                // Show visual effects
                player.showEmote('heart');
                partner.showEmote('question');

                // Send interaction to partner
                this.connectionManager.sendMessage('bodyHoldInteraction', {
                    questionId: question.id,
                    holdPoint: player.usingBodyHold.holdPoint
                });
            }
        }
    }

    tryPlayerInteraction() {
        // This could be used for throwing items, placing holds, etc.
        console.log('Player interaction attempted');
    }

    handleNetworkMessage(type, data) {
        switch (type) {
            case 'playerMove':
                this.handleRemotePlayerMove(data);
                break;
        }
    }

    handleRemotePlayerMove(data) {
        const player = this.players.get(data.playerId);
        if (player && player !== this.localPlayer) {
            player.setPosition(data.position.x, data.position.y, data.position.z);
        }
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isRunning) return;

        const deltaTime = this.clock.getDelta();

        // Update game objects
        this.update(deltaTime);

        // Render the scene
        this.renderer.render(this.scene);

        requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
        // Update players
        for (const player of this.players.values()) {
            player.update(deltaTime);
        }

        // Update climbing wall
        this.climbingWall.update(deltaTime);
    }

    destroy() {
        this.isRunning = false;

        if (this.inputManager) {
            this.inputManager.destroy();
        }

        if (this.renderer) {
            this.renderer.destroy();
        }

        this.scene.clear();
    }
}