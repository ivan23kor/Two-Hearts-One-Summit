import * as THREE from 'three';

export class Player {
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.group = new THREE.Group();

        this.position = { x: 0, y: 0, z: 0 };
        this.isUsingBodyHold = false;
        this.bodyHoldPoints = {
            feet: { x: 0, y: -2.0, z: 0 },
            knees: { x: 0, y: -1.3, z: 0 },
            hips: { x: 0, y: -0.3, z: 0 },
            hands: { x: 0, y: -0.7, z: 0 },
            elbows: { x: 0, y: -0.1, z: 0 },
            shoulders: { x: 0, y: 0.3, z: 0 }
        };

        this.createPlayerMesh();
        this.createBodyHoldIndicators();
    }

    createPlayerMesh() {
        // Create a spider-like humanoid climber with elongated limbs

        // Head (smaller, more compact)
        const headGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.25);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac }); // Skin tone
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.set(0, 0.6, 0);
        this.group.add(this.head);

        // Body (much shorter and compact, spider-like)
        const bodyGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.25);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: this.color });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.set(0, 0.1, 0);
        this.group.add(this.body);

        // Upper arms (elongated)
        const upperArmGeometry = new THREE.BoxGeometry(0.12, 0.8, 0.12);
        const armMaterial = new THREE.MeshLambertMaterial({ color: this.color });

        this.leftUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
        this.leftUpperArm.position.set(-0.3, 0.3, 0);
        this.group.add(this.leftUpperArm);

        this.rightUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
        this.rightUpperArm.position.set(0.3, 0.3, 0);
        this.group.add(this.rightUpperArm);

        // Forearms (very elongated)
        const forearmGeometry = new THREE.BoxGeometry(0.1, 1.0, 0.1);

        this.leftForearm = new THREE.Mesh(forearmGeometry, armMaterial);
        this.leftForearm.position.set(-0.7, -0.1, 0);
        this.group.add(this.leftForearm);

        this.rightForearm = new THREE.Mesh(forearmGeometry, armMaterial);
        this.rightForearm.position.set(0.7, -0.1, 0);
        this.group.add(this.rightForearm);

        // Hands (larger, spider-like)
        const handGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.08);
        const handMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });

        this.leftHand = new THREE.Mesh(handGeometry, handMaterial);
        this.leftHand.position.set(-0.7, -0.7, 0);
        this.group.add(this.leftHand);

        this.rightHand = new THREE.Mesh(handGeometry, handMaterial);
        this.rightHand.position.set(0.7, -0.7, 0);
        this.group.add(this.rightHand);

        // Upper legs (elongated)
        const upperLegGeometry = new THREE.BoxGeometry(0.15, 0.9, 0.15);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2f4f4f }); // Dark gray pants

        this.leftUpperLeg = new THREE.Mesh(upperLegGeometry, legMaterial);
        this.leftUpperLeg.position.set(-0.15, -0.3, 0);
        this.group.add(this.leftUpperLeg);

        this.rightUpperLeg = new THREE.Mesh(upperLegGeometry, legMaterial);
        this.rightUpperLeg.position.set(0.15, -0.3, 0);
        this.group.add(this.rightUpperLeg);

        // Lower legs (very elongated)
        const lowerLegGeometry = new THREE.BoxGeometry(0.12, 1.2, 0.12);

        this.leftLowerLeg = new THREE.Mesh(lowerLegGeometry, legMaterial);
        this.leftLowerLeg.position.set(-0.15, -1.3, 0);
        this.group.add(this.leftLowerLeg);

        this.rightLowerLeg = new THREE.Mesh(lowerLegGeometry, legMaterial);
        this.rightLowerLeg.position.set(0.15, -1.3, 0);
        this.group.add(this.rightLowerLeg);

        // Feet (larger, more grippy-looking)
        const footGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.25);
        const footMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 }); // Dark climbing shoes

        this.leftFoot = new THREE.Mesh(footGeometry, footMaterial);
        this.leftFoot.position.set(-0.15, -2.0, 0.05);
        this.group.add(this.leftFoot);

        this.rightFoot = new THREE.Mesh(footGeometry, footMaterial);
        this.rightFoot.position.set(0.15, -2.0, 0.05);
        this.group.add(this.rightFoot);

        // Add multiple eyes for spider-like appearance
        const eyeGeometry = new THREE.BoxGeometry(0.04, 0.04, 0.04);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

        // Main eyes
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.08, 0.05, 0.13);
        this.head.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.08, 0.05, 0.13);
        this.head.add(rightEye);

        // Secondary smaller eyes
        const smallEyeGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);

        const leftEye2 = new THREE.Mesh(smallEyeGeometry, eyeMaterial);
        leftEye2.position.set(-0.05, 0.1, 0.13);
        this.head.add(leftEye2);

        const rightEye2 = new THREE.Mesh(smallEyeGeometry, eyeMaterial);
        rightEye2.position.set(0.05, 0.1, 0.13);
        this.head.add(rightEye2);

        // Add climbing gear
        this.addClimbingGear();

        // Enable shadows
        this.group.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }

    addClimbingGear() {
        // Climbing helmet
        const helmetGeometry = new THREE.BoxGeometry(0.45, 0.3, 0.35);
        const helmetMaterial = new THREE.MeshLambertMaterial({
            color: this.color,
            transparent: true,
            opacity: 0.8
        });
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.position.set(0, 0.1, 0);
        this.head.add(helmet);

        // Climbing harness
        const harnessGeometry = new THREE.TorusGeometry(0.35, 0.05, 8, 8);
        const harnessMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const harness = new THREE.Mesh(harnessGeometry, harnessMaterial);
        harness.rotation.x = Math.PI / 2;
        harness.position.set(0, 0, 0);
        this.body.add(harness);
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
        // Spider-like climbing animation with elongated limbs
        const duration = 0.3;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);

            // Animate the new limb structure
            switch (direction) {
                case 'up':
                    this.leftUpperArm.rotation.z = Math.sin(progress * Math.PI) * 0.3;
                    this.rightUpperArm.rotation.z = -Math.sin(progress * Math.PI) * 0.3;
                    this.leftForearm.rotation.z = Math.sin(progress * Math.PI) * 0.2;
                    this.rightForearm.rotation.z = -Math.sin(progress * Math.PI) * 0.2;
                    break;
                case 'left':
                    this.leftUpperArm.rotation.z = Math.sin(progress * Math.PI) * 0.5;
                    this.leftForearm.rotation.z = Math.sin(progress * Math.PI) * 0.3;
                    break;
                case 'right':
                    this.rightUpperArm.rotation.z = -Math.sin(progress * Math.PI) * 0.5;
                    this.rightForearm.rotation.z = -Math.sin(progress * Math.PI) * 0.3;
                    break;
                case 'down':
                    this.leftUpperLeg.rotation.z = Math.sin(progress * Math.PI) * 0.2;
                    this.rightUpperLeg.rotation.z = -Math.sin(progress * Math.PI) * 0.2;
                    break;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Reset to neutral position
                this.leftUpperArm.rotation.z = 0;
                this.rightUpperArm.rotation.z = 0;
                this.leftForearm.rotation.z = 0;
                this.rightForearm.rotation.z = 0;
                this.leftUpperLeg.rotation.z = 0;
                this.rightUpperLeg.rotation.z = 0;
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