import * as THREE from 'three';

export class ClimbingWall {
    constructor() {
        this.group = new THREE.Group();
        this.holds = new Map(); // Map of "x,y" -> hold object
        this.wallWidth = 20;
        this.wallHeight = 30;

        this.createWall();
        this.generateHolds();
    }

    createWall() {
        // Create the main wall surface
        const wallGeometry = new THREE.PlaneGeometry(this.wallWidth, this.wallHeight);
        const wallMaterial = new THREE.MeshLambertMaterial({
            color: 0x8b4513, // Brown rock color
            transparent: true,
            opacity: 0.9
        });

        this.wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        this.wallMesh.position.set(0, this.wallHeight / 2, -0.5);
        this.group.add(this.wallMesh);

        // Add some visual texture with random darker patches
        this.createWallTexture();
    }

    createWallTexture() {
        // Add random rock texture patches
        for (let i = 0; i < 20; i++) {
            const patchGeometry = new THREE.PlaneGeometry(
                Math.random() * 3 + 1,
                Math.random() * 3 + 1
            );
            const patchMaterial = new THREE.MeshLambertMaterial({
                color: 0x654321,
                transparent: true,
                opacity: 0.3
            });

            const patch = new THREE.Mesh(patchGeometry, patchMaterial);
            patch.position.set(
                (Math.random() - 0.5) * this.wallWidth,
                Math.random() * this.wallHeight,
                -0.4
            );

            this.group.add(patch);
        }
    }

    generateHolds() {
        // Create holds that require cooperation
        this.createCooperativeRoute();
    }

    createCooperativeRoute() {
        // Starting holds (both players can start here)
        this.addHold(-2, 2, 'start');
        this.addHold(2, 2, 'start');

        // First cooperation point - gap that requires partner assistance
        this.addHold(-3, 6, 'normal');
        this.addHold(3, 8, 'normal');

        // Middle section with scattered holds
        this.addHold(-1, 10, 'normal');
        this.addHold(1, 12, 'normal');
        this.addHold(-4, 14, 'normal');
        this.addHold(4, 16, 'normal');

        // Another cooperation section
        this.addHold(-2, 18, 'normal');
        this.addHold(2, 20, 'normal');

        // Near the top - requires both players to work together
        this.addHold(0, 24, 'normal');

        // Summit - both players must reach together
        this.addHold(-1, 28, 'summit');
        this.addHold(1, 28, 'summit');

        // Add some intermediate holds that are only reachable with partner help
        this.addHold(-6, 8, 'partner_only');
        this.addHold(6, 12, 'partner_only');
        this.addHold(-5, 20, 'partner_only');
        this.addHold(5, 24, 'partner_only');
    }

    addHold(x, y, type = 'normal') {
        const hold = this.createHoldMesh(type);
        hold.position.set(x, y, 0);

        this.group.add(hold);
        this.holds.set(`${Math.round(x)},${Math.round(y)}`, {
            position: { x, y },
            type: type,
            mesh: hold
        });
    }

    createHoldMesh(type) {
        let geometry, material;

        switch (type) {
            case 'start':
                // Large jug hold - easy to grip
                geometry = new THREE.CylinderGeometry(0.3, 0.5, 0.4, 8);
                material = new THREE.MeshLambertMaterial({ color: 0x00ff00 }); // Green
                break;

            case 'summit':
                // Large celebration hold
                geometry = new THREE.CylinderGeometry(0.4, 0.6, 0.5, 8);
                material = new THREE.MeshLambertMaterial({ color: 0xffd700 }); // Gold
                break;

            case 'partner_only':
                // Small crimp hold - requires precision
                geometry = new THREE.CylinderGeometry(0.15, 0.25, 0.2, 6);
                material = new THREE.MeshLambertMaterial({ color: 0xff6600 }); // Orange
                break;

            default: // normal
                // Realistic climbing hold shapes
                const holdShapes = [
                    // Jug hold
                    () => new THREE.CylinderGeometry(0.2, 0.35, 0.3, 8),
                    // Crimp hold
                    () => new THREE.BoxGeometry(0.6, 0.15, 0.25),
                    // Sloper hold
                    () => new THREE.SphereGeometry(0.25, 8, 6),
                    // Pinch hold
                    () => new THREE.CylinderGeometry(0.1, 0.2, 0.4, 6),
                    // Edge hold
                    () => new THREE.BoxGeometry(0.8, 0.1, 0.2)
                ];

                const randomShape = holdShapes[Math.floor(Math.random() * holdShapes.length)];
                geometry = randomShape();

                // Realistic hold colors
                const holdColors = [
                    0x8B4513, // Brown
                    0x696969, // Dark gray
                    0x2F4F4F, // Dark slate gray
                    0x708090, // Slate gray
                    0x778899, // Light slate gray
                    0x5F5F5F  // Charcoal
                ];

                const randomColor = holdColors[Math.floor(Math.random() * holdColors.length)];
                material = new THREE.MeshLambertMaterial({
                    color: randomColor,
                    roughness: 0.8,
                    metalness: 0.1
                });
                break;
        }

        const hold = new THREE.Mesh(geometry, material);
        hold.castShadow = true;
        hold.receiveShadow = true;

        // Add some random rotation for natural look
        if (type === 'normal') {
            hold.rotation.x = (Math.random() - 0.5) * 0.5;
            hold.rotation.y = (Math.random() - 0.5) * 0.5;
            hold.rotation.z = (Math.random() - 0.5) * 0.5;
        }

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