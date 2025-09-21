import * as THREE from 'three';

export class Renderer {
    constructor(container) {
        this.container = container;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.setupRenderer();
        this.setupCamera();
        this.setupEventListeners();
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: false, // Disable antialiasing for pixelated look
            alpha: true
        });

        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(1); // Force 1:1 pixel ratio for pixelated effect
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        // Set clear color to dark blue night sky
        this.renderer.setClearColor(0x1a1a2e, 1);

        // Add pixelated CSS styling
        this.renderer.domElement.style.imageRendering = 'pixelated';
        this.renderer.domElement.style.imageRendering = '-moz-crisp-edges';
        this.renderer.domElement.style.imageRendering = 'crisp-edges';

        this.container.appendChild(this.renderer.domElement);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60, // FOV
            this.width / this.height, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    render(scene) {
        this.renderer.render(scene, this.camera);
    }

    destroy() {
        window.removeEventListener('resize', this.onWindowResize);

        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
    }
}