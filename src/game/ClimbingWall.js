import * as THREE from 'three';

export class ClimbingWall {
    constructor() {
        this.group = new THREE.Group();
        this.holds = new Map(); // Map of "x,y" -> hold object
        this.wallWidth = 20;
        this.wallHeight = 30;

        console.log('[ClimbingWall] Creating wall...');
        this.createWall();
        console.log('[ClimbingWall] Generating holds...');
        this.generateHolds();
        console.log(`[ClimbingWall] Constructor complete. Total holds: ${this.holds.size}`);
    }

    createWall() {
        // Create simple orange background wall
        const wallGeometry = new THREE.PlaneGeometry(this.wallWidth, this.wallHeight);
        const wallMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF7A00 // Orange background
        });

        this.wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        this.wallMesh.position.set(0, this.wallHeight / 2, -0.5);
        this.group.add(this.wallMesh);
    }


    generateHolds() {
        // Create holds that require cooperation
        this.createCooperativeRoute();
    }

    createCooperativeRoute() {
        // Starting holds - one for each player
        this.addHold(-2, 2, 'red');   // Red player start
        this.addHold(2, 2, 'blue');   // Blue player start

        // Create alternating holds going up the wall
        const holds = [
            // Intermediate holds to make first moves possible
            { x: -2, y: 3, color: 'red' },
            { x: -2, y: 4, color: 'red' },
            { x: 2, y: 3, color: 'blue' },
            { x: 2, y: 4, color: 'blue' },
            
            // Level 1
            { x: -3, y: 6, color: 'blue' },
            { x: 3, y: 6, color: 'red' },
            
            // Level 2
            { x: -1, y: 10, color: 'red' },
            { x: 1, y: 10, color: 'blue' },
            
            // Level 3
            { x: -4, y: 14, color: 'blue' },
            { x: 4, y: 14, color: 'red' },
            
            // Level 4
            { x: -2, y: 18, color: 'red' },
            { x: 2, y: 18, color: 'blue' },
            
            // Level 5
            { x: 0, y: 22, color: 'red' },
            { x: -1, y: 24, color: 'blue' },
            { x: 1, y: 24, color: 'red' },
            
            // Summit - both players need to reach
            { x: -1, y: 28, color: 'red' },
            { x: 1, y: 28, color: 'blue' }
        ];

        holds.forEach(hold => {
            this.addHold(hold.x, hold.y, hold.color);
        });
    }

    addHold(x, y, playerColor = null) {
        // If no color specified, randomly assign red or blue
        if (!playerColor) {
            playerColor = Math.random() < 0.5 ? 'red' : 'blue';
        }
        
        const hold = this.createHoldMesh(playerColor);
        hold.position.set(x, y, 0);

        this.group.add(hold);
        const key = `${Math.round(x)},${Math.round(y)}`;
        this.holds.set(key, {
            position: { x, y },
            playerColor: playerColor,
            mesh: hold
        });
        
        console.log(`[ClimbingWall] Added ${playerColor} hold at (${x}, ${y}) with key: ${key}`);
    }

    createHoldMesh(playerColor = null) {
        // Small sphere geometry for all holds - no sharp edges
        const geometry = new THREE.SphereGeometry(0.2, 12, 12);
        
        // Only red and blue holds
        let color;
        if (playerColor === 'red') {
            color = 0xff4444; // Red holds for red player
        } else if (playerColor === 'blue') {
            color = 0x4444ff; // Blue holds for blue player
        } else {
            // Random assignment if not specified
            color = Math.random() < 0.5 ? 0xff4444 : 0x4444ff;
        }

        const material = new THREE.MeshBasicMaterial({ color: color });
        const hold = new THREE.Mesh(geometry, material);
        
        return hold;
    }

    hasHoldAt(x, y) {
        const key = `${Math.round(x)},${Math.round(y)}`;
        return this.holds.has(key);
    }

    getHoldAt(x, y) {
        const key = `${Math.round(x)},${Math.round(y)}`;
        return this.holds.get(key);
    }

    getHoldsInRange(x, y, range = 1) {
        const nearbyHolds = [];

        for (const [key, hold] of this.holds) {
            const distance = Math.sqrt(
                Math.pow(hold.position.x - x, 2) +
                Math.pow(hold.position.y - y, 2)
            );

            if (distance <= range) {
                nearbyHolds.push(hold);
            }
        }

        return nearbyHolds;
    }

    highlightHold(x, y, color = 0xffff00) {
        const hold = this.getHoldAt(x, y);
        if (hold && hold.mesh) {
            hold.mesh.material.emissive.setHex(color);
            hold.mesh.material.emissiveIntensity = 0.3;
        }
    }

    unhighlightHold(x, y) {
        const hold = this.getHoldAt(x, y);
        if (hold && hold.mesh) {
            hold.mesh.material.emissive.setHex(0x000000);
            hold.mesh.material.emissiveIntensity = 0;
        }
    }

    update(deltaTime) {
        // Animate holds or add any dynamic behavior here
        // For now, we'll add a subtle pulsing effect to special holds
        const time = Date.now() * 0.001;

        for (const [key, hold] of this.holds) {
            if (hold.type === 'summit') {
                const pulse = Math.sin(time * 2) * 0.1 + 0.9;
                hold.mesh.material.emissiveIntensity = pulse * 0.2;
                hold.mesh.material.emissive.setHex(0xffd700);
            }
        }
    }
}