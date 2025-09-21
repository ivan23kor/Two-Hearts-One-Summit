import * as THREE from 'three';

export class Player {
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.group = new THREE.Group();

        this.position = { x: 0, y: 0, z: 0 };
        this.isUsingBodyHold = false;
        this.bodyHoldPoints = {
            feet: { x: 0, y: -0.8, z: 0 },
            knees: { x: 0, y: -0.4, z: 0 },
            hips: { x: 0, y: -0.2, z: 0 },
            hands: { x: 0, y: 0.7, z: 0 },
            elbows: { x: 0, y: 0.3, z: 0 },
            shoulders: { x: 0, y: 0.1, z: 0 }
        };

        this.createPlayerMesh();
        this.createBodyHoldIndicators();
    }

    createPlayerMesh() {
        // Create simple climber with circular body and articulated limbs
        
        // Main body - Circle (red or blue depending on player)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: this.color });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.set(0, 0, 0);
        this.body.rotation.x = Math.PI / 2; // Make it face forward
        this.group.add(this.body);

        // Head (small circle above body)
        const headGeometry = new THREE.SphereGeometry(0.15, 12, 12);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac }); // Skin tone
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.set(0, 0.4, 0);
        this.group.add(this.head);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.05, 0.05, 0.12);
        this.head.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.05, 0.05, 0.12);
        this.head.add(rightEye);

        // Left Arm System (facing up for climbing)
        this.createArm('left', -0.25, 0.1, this.color);
        
        // Right Arm System (facing up for climbing) 
        this.createArm('right', 0.25, 0.1, this.color);
        
        // Left Leg System
        this.createLeg('left', -0.15, -0.2);
        
        // Right Leg System
        this.createLeg('right', 0.15, -0.2);

        // Enable shadows
        this.group.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }
    
    createArm(side, startX, startY, color) {
        const limbMaterial = new THREE.MeshLambertMaterial({ color: color });
        const handMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        
        // Upper arm (shoulder to elbow) - angled upward for climbing
        const upperArmGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
        const upperArm = new THREE.Mesh(upperArmGeometry, limbMaterial);
        
        // Position upper arm at an upward angle
        const upperArmX = startX + (side === 'left' ? -0.15 : 0.15);
        const upperArmY = startY + 0.15;
        upperArm.position.set(upperArmX, upperArmY, 0);
        upperArm.rotation.z = side === 'left' ? Math.PI / 4 : -Math.PI / 4; // Angled up
        this.group.add(upperArm);
        this[side + 'UpperArm'] = upperArm;
        
        // Elbow joint (small sphere)
        const elbowGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const elbow = new THREE.Mesh(elbowGeometry, limbMaterial);
        const elbowX = startX + (side === 'left' ? -0.25 : 0.25);
        const elbowY = startY + 0.3;
        elbow.position.set(elbowX, elbowY, 0);
        this.group.add(elbow);
        this[side + 'Elbow'] = elbow;
        
        // Forearm (elbow to hand) - continuing upward
        const forearmGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8);
        const forearm = new THREE.Mesh(forearmGeometry, limbMaterial);
        const forearmX = startX + (side === 'left' ? -0.35 : 0.35);
        const forearmY = startY + 0.5;
        forearm.position.set(forearmX, forearmY, 0);
        forearm.rotation.z = side === 'left' ? Math.PI / 6 : -Math.PI / 6; // Slightly angled
        this.group.add(forearm);
        this[side + 'Forearm'] = forearm;
        
        // Hand
        const handGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const hand = new THREE.Mesh(handGeometry, handMaterial);
        const handX = startX + (side === 'left' ? -0.4 : 0.4);
        const handY = startY + 0.7;
        hand.position.set(handX, handY, 0);
        this.group.add(hand);
        this[side + 'Hand'] = hand;
    }
    
    createLeg(side, startX, startY) {
        const limbMaterial = new THREE.MeshLambertMaterial({ color: 0x4444aa }); // Blue pants
        const footMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 }); // Dark shoes
        
        // Upper leg (hip to knee)
        const upperLegGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8);
        const upperLeg = new THREE.Mesh(upperLegGeometry, limbMaterial);
        upperLeg.position.set(startX, startY - 0.2, 0);
        this.group.add(upperLeg);
        this[side + 'UpperLeg'] = upperLeg;
        
        // Knee joint
        const kneeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const knee = new THREE.Mesh(kneeGeometry, limbMaterial);
        knee.position.set(startX, startY - 0.4, 0);
        this.group.add(knee);
        this[side + 'Knee'] = knee;
        
        // Lower leg (knee to foot)
        const lowerLegGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
        const lowerLeg = new THREE.Mesh(lowerLegGeometry, limbMaterial);
        lowerLeg.position.set(startX, startY - 0.6, 0);
        this.group.add(lowerLeg);
        this[side + 'LowerLeg'] = lowerLeg;
        
        // Foot
        const footGeometry = new THREE.BoxGeometry(0.08, 0.06, 0.15);
        const foot = new THREE.Mesh(footGeometry, footMaterial);
        foot.position.set(startX, startY - 0.8, 0.05);
        this.group.add(foot);
        this[side + 'Foot'] = foot;
    }


    createBodyHoldIndicators() {
        this.bodyHoldMeshes = {};

        Object.keys(this.bodyHoldPoints).forEach(point => {
            const indicatorGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const indicatorMaterial = new THREE.MeshLambertMaterial({
                color: 0xffff00,
                transparent: true,
                opacity: 0.0 // Initially invisible
            });

            const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
            indicator.position.copy(this.bodyHoldPoints[point]);

            this.bodyHoldMeshes[point] = indicator;
            this.group.add(indicator);
        });
    }

    setPosition(x, y, z) {
        this.position = { x, y, z };
        this.group.position.set(x, y, z);
    }

    getPosition() {
        return { ...this.position };
    }

    getBodyHoldPosition(holdPoint) {
        const worldPos = new THREE.Vector3();
        this.bodyHoldMeshes[holdPoint].getWorldPosition(worldPos);
        return {
            x: worldPos.x,
            y: worldPos.y,
            z: worldPos.z
        };
    }

    highlightBodyHolds(highlight = true) {
        Object.values(this.bodyHoldMeshes).forEach(mesh => {
            mesh.material.opacity = highlight ? 0.6 : 0.0;
        });
    }

    highlightSpecificBodyHold(holdPoint, highlight = true) {
        if (this.bodyHoldMeshes[holdPoint]) {
            this.bodyHoldMeshes[holdPoint].material.opacity = highlight ? 0.8 : 0.0;
            if (highlight) {
                this.bodyHoldMeshes[holdPoint].material.color.setHex(0x00ff00);
            } else {
                this.bodyHoldMeshes[holdPoint].material.color.setHex(0xffff00);
            }
        }
    }

    playClimbingAnimation(direction) {
        // Simple climbing animation with articulated limbs
        const duration = 0.4;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const wave = Math.sin(progress * Math.PI);

            // Animate the articulated limbs
            switch (direction) {
                case 'up':
                    // Arms reach higher during upward movement
                    if (this.leftUpperArm) this.leftUpperArm.rotation.z += wave * 0.2;
                    if (this.rightUpperArm) this.rightUpperArm.rotation.z -= wave * 0.2;
                    if (this.leftForearm) this.leftForearm.rotation.z += wave * 0.1;
                    if (this.rightForearm) this.rightForearm.rotation.z -= wave * 0.1;
                    break;
                case 'left':
                    // Left side movement
                    if (this.leftUpperArm) this.leftUpperArm.rotation.z += wave * 0.4;
                    if (this.leftForearm) this.leftForearm.rotation.z += wave * 0.3;
                    if (this.leftUpperLeg) this.leftUpperLeg.rotation.z += wave * 0.2;
                    break;
                case 'right':
                    // Right side movement
                    if (this.rightUpperArm) this.rightUpperArm.rotation.z -= wave * 0.4;
                    if (this.rightForearm) this.rightForearm.rotation.z -= wave * 0.3;
                    if (this.rightUpperLeg) this.rightUpperLeg.rotation.z -= wave * 0.2;
                    break;
                case 'down':
                    // Legs move during downward movement
                    if (this.leftUpperLeg) this.leftUpperLeg.rotation.z += wave * 0.3;
                    if (this.rightUpperLeg) this.rightUpperLeg.rotation.z -= wave * 0.3;
                    if (this.leftLowerLeg) this.leftLowerLeg.rotation.z -= wave * 0.2;
                    if (this.rightLowerLeg) this.rightLowerLeg.rotation.z += wave * 0.2;
                    break;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    showEmote(type) {
        // Create a simple emote indicator above the player
        const emoteGeometry = new THREE.PlaneGeometry(0.5, 0.5);
        let emoteTexture;

        // Create a simple colored square for different emotes
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 32;
        const ctx = canvas.getContext('2d');

        switch (type) {
            case 'heart':
                ctx.fillStyle = '#ff69b4';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.fillText('💖', 6, 22);
                break;
            case 'question':
                ctx.fillStyle = '#87ceeb';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.fillText('?', 12, 22);
                break;
            default:
                ctx.fillStyle = '#ffff00';
                ctx.fillRect(0, 0, 32, 32);
                break;
        }

        emoteTexture = new THREE.CanvasTexture(canvas);
        emoteTexture.magFilter = THREE.NearestFilter;
        emoteTexture.minFilter = THREE.NearestFilter;

        const emoteMaterial = new THREE.MeshBasicMaterial({
            map: emoteTexture,
            transparent: true
        });

        const emote = new THREE.Mesh(emoteGeometry, emoteMaterial);
        emote.position.set(0, 1.5, 0);
        emote.lookAt(this.group.position.clone().add(new THREE.Vector3(0, 0, 1)));

        this.group.add(emote);

        // Remove emote after 2 seconds
        setTimeout(() => {
            this.group.remove(emote);
            emoteTexture.dispose();
            emoteMaterial.dispose();
        }, 2000);
    }

    update(deltaTime) {
        // Add subtle idle animation
        const time = Date.now() * 0.001;
        this.group.position.y = this.position.y + Math.sin(time * 2) * 0.02;

        // Slight head bobbing
        this.head.rotation.y = Math.sin(time * 1.5) * 0.05;
    }
}