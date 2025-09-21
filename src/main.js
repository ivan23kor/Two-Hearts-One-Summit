import * as THREE from 'three';
import { Game } from './game/Game.js';

class TwoHeartsOneSummit {
    constructor() {
        this.container = document.getElementById('game-container');
        this.game = null;
        this.deferredPrompt = null;
        this.isOnline = navigator.onLine;

        this.init();
        this.initPWA();
    }

    init() {
        this.setupUI();
        this.startGame();
    }

    setupUI() {
        // Question panel continue button
        document.getElementById('continue-climbing').addEventListener('click', () => {
            this.hideQuestionPanel();
        });

        // Help controls
        document.getElementById('hide-help').addEventListener('click', () => {
            document.getElementById('controls-help').style.display = 'none';
        });
    }

    startGame() {
        if (this.game) {
            this.game.destroy();
        }

        this.game = new Game(this.container);
        this.game.on('questionTriggered', (question) => {
            this.showQuestionPanel(question);
        });
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

    // PWA functionality
    async initPWA() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupOfflineDetection();
        this.setupUpdateNotification();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });

                console.log('[PWA] Service Worker registered successfully:', registration.scope);

                // Listen for service worker updates
                registration.addEventListener('updatefound', () => {
                    console.log('[PWA] New service worker found, preparing update...');
                    const newWorker = registration.installing;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[PWA] New version available');
                            this.showUpdateNotification();
                        }
                    });
                });

            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        // Store the install prompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('[PWA] Install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallOption();
        });

        // Handle successful installation
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            this.hideInstallOption();
            this.deferredPrompt = null;
        });
    }

    setupOfflineDetection() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            console.log('[PWA] Back online');
            this.isOnline = true;
            this.hideOfflineNotification();
        });

        window.addEventListener('offline', () => {
            console.log('[PWA] Gone offline');
            this.isOnline = false;
            this.showOfflineNotification();
        });

        // Show offline status if already offline
        if (!this.isOnline) {
            this.showOfflineNotification();
        }
    }

    setupUpdateNotification() {
        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SKIP_WAITING') {
                window.location.reload();
            }
        });
    }

    showInstallOption() {
        // Create install button in the controls help panel
        const controlsHelp = document.getElementById('controls-help');

        if (!document.getElementById('install-app-btn')) {
            const installBtn = document.createElement('button');
            installBtn.id = 'install-app-btn';
            installBtn.textContent = '📱 Install App';
            installBtn.style.marginTop = '10px';
            installBtn.style.backgroundColor = '#4ecdc4';
            installBtn.style.border = '2px solid #4ecdc4';

            installBtn.addEventListener('click', async () => {
                if (this.deferredPrompt) {
                    this.deferredPrompt.prompt();
                    const { outcome } = await this.deferredPrompt.userChoice;
                    console.log('[PWA] Install prompt outcome:', outcome);
                    this.deferredPrompt = null;
                    this.hideInstallOption();
                }
            });

            controlsHelp.appendChild(installBtn);
        }
    }

    hideInstallOption() {
        const installBtn = document.getElementById('install-app-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }

    showOfflineNotification() {
        if (!document.getElementById('offline-indicator')) {
            const indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.className = 'ui-element';
            indicator.style.position = 'absolute';
            indicator.style.top = '20px';
            indicator.style.left = '20px';
            indicator.style.backgroundColor = 'rgba(255, 107, 107, 0.9)';
            indicator.style.zIndex = '200';
            indicator.innerHTML = '🔌 Offline Mode<br><small>Game works offline!</small>';

            document.getElementById('ui-overlay').appendChild(indicator);
        }
    }

    hideOfflineNotification() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    showUpdateNotification() {
        if (!document.getElementById('update-notification')) {
            const notification = document.createElement('div');
            notification.id = 'update-notification';
            notification.className = 'ui-element';
            notification.style.position = 'absolute';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = 'rgba(78, 205, 196, 0.9)';
            notification.style.zIndex = '200';
            notification.innerHTML = `
                <div>🔄 Update Available</div>
                <button id="update-app-btn" style="margin-top: 5px; background: #fff; color: #333;">
                    Update Now
                </button>
                <button id="dismiss-update-btn" style="margin-top: 5px; margin-left: 5px;">
                    Later
                </button>
            `;

            document.getElementById('update-app-btn').addEventListener('click', () => {
                // Send message to service worker to skip waiting
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
                }
            });

            document.getElementById('dismiss-update-btn').addEventListener('click', () => {
                notification.remove();
            });

            document.getElementById('ui-overlay').appendChild(notification);
        }
    }

}

// Start the application
new TwoHeartsOneSummit();