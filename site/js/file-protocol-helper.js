/**
 * File Protocol Helper
 * Handles file:// protocol issues and provides user-friendly guidance
 */

(function(window) {
    'use strict';

    const FileProtocolHelper = {
        /**
         * Check if running under file:// protocol
         */
        isFileProtocol() {
            return window.location.protocol === 'file:';
        },

        /**
         * Check if embedded data is available
         */
        hasEmbeddedData() {
            return typeof window.EMBEDDED_DATA !== 'undefined' && 
                   window.EMBEDDED_DATA && 
                   window.EMBEDDED_DATA.tools && 
                   window.EMBEDDED_DATA.tools.length > 0;
        },

        /**
         * Get local server commands for different environments
         */
        getServerCommands() {
            const commands = [
                {
                    name: 'Python 3',
                    check: 'python3 --version',
                    command: 'python3 -m http.server 8000',
                    description: 'Uses Python 3\'s built-in HTTP server'
                },
                {
                    name: 'Python 2',
                    check: 'python --version',
                    command: 'python -m SimpleHTTPServer 8000',
                    description: 'Uses Python 2\'s built-in HTTP server (legacy)'
                },
                {
                    name: 'Node.js (http-server)',
                    check: 'npx --version',
                    command: 'npx http-server -p 8000',
                    description: 'Uses Node.js http-server package'
                },
                {
                    name: 'Node.js (serve)',
                    check: 'npx --version',
                    command: 'npx serve -p 8000',
                    description: 'Uses Node.js serve package'
                },
                {
                    name: 'PHP',
                    check: 'php --version',
                    command: 'php -S localhost:8000',
                    description: 'Uses PHP\'s built-in web server'
                },
                {
                    name: 'Ruby',
                    check: 'ruby --version',
                    command: 'ruby -run -e httpd . -p 8000',
                    description: 'Uses Ruby\'s built-in HTTP server'
                }
            ];
            return commands;
        },

        /**
         * Copy text to clipboard
         */
        copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text)
                    .then(() => true)
                    .catch(() => this.fallbackCopyToClipboard(text));
            } else {
                return Promise.resolve(this.fallbackCopyToClipboard(text));
            }
        },

        /**
         * Fallback clipboard copy method
         */
        fallbackCopyToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            let success = false;
            try {
                success = document.execCommand('copy');
            } catch (err) {
                console.warn('Fallback copy failed:', err);
            }

            document.body.removeChild(textArea);
            return success;
        },

        /**
         * Show file protocol warning banner
         */
        showWarningBanner() {
            if (!this.isFileProtocol()) return;

            const existingBanner = document.getElementById('file-protocol-warning');
            if (existingBanner) return;

            const banner = document.createElement('div');
            banner.id = 'file-protocol-warning';
            banner.className = 'file-protocol-warning';
            banner.innerHTML = `
                <div class="warning-content">
                    <div class="warning-icon">⚠️</div>
                    <div class="warning-text">
                        <strong>File Protocol Detected</strong>
                        <p>You're viewing this site using file:// protocol, which has limitations due to browser security restrictions.</p>
                        <p class="warning-status">
                            ${this.hasEmbeddedData() ? 
                                '✅ Using embedded data (303 tools available)' : 
                                '⚠️ Data loading may be restricted'}
                        </p>
                        <div class="warning-actions">
                            <button id="show-server-instructions" class="btn-primary">
                                Setup Local Server
                            </button>
                            <button id="dismiss-warning" class="btn-secondary">
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
                <div id="server-instructions" class="server-instructions" style="display: none;">
                    <h3>Quick Server Setup</h3>
                    <p>Choose one of these commands to run a local server from your terminal:</p>
                    <div id="server-commands-list"></div>
                    <p class="instructions-note">
                        After running a command, open your browser to: 
                        <code>http://localhost:8000</code>
                    </p>
                </div>
            `;

            // Add styles if not already present
            if (!document.getElementById('file-protocol-styles')) {
                const styles = document.createElement('style');
                styles.id = 'file-protocol-styles';
                styles.textContent = `
                    .file-protocol-warning {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 1rem;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        z-index: 10000;
                        animation: slideDown 0.3s ease-out;
                    }
                    
                    @keyframes slideDown {
                        from {
                            transform: translateY(-100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    
                    .warning-content {
                        max-width: 1200px;
                        margin: 0 auto;
                        display: flex;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                    
                    .warning-icon {
                        font-size: 2rem;
                        flex-shrink: 0;
                    }
                    
                    .warning-text {
                        flex: 1;
                    }
                    
                    .warning-text strong {
                        display: block;
                        font-size: 1.2rem;
                        margin-bottom: 0.5rem;
                    }
                    
                    .warning-text p {
                        margin: 0.5rem 0;
                        opacity: 0.95;
                    }
                    
                    .warning-status {
                        font-weight: 500;
                        padding: 0.25rem 0.5rem;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 4px;
                        display: inline-block;
                    }
                    
                    .warning-actions {
                        margin-top: 1rem;
                        display: flex;
                        gap: 0.5rem;
                    }
                    
                    .btn-primary, .btn-secondary {
                        padding: 0.5rem 1rem;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 0.9rem;
                        transition: all 0.2s;
                    }
                    
                    .btn-primary {
                        background: white;
                        color: #667eea;
                        font-weight: 500;
                    }
                    
                    .btn-primary:hover {
                        background: #f7f7f7;
                        transform: translateY(-1px);
                    }
                    
                    .btn-secondary {
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                    }
                    
                    .btn-secondary:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }
                    
                    .server-instructions {
                        max-width: 1200px;
                        margin: 1rem auto 0;
                        padding: 1rem;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 8px;
                    }
                    
                    .server-instructions h3 {
                        margin-top: 0;
                        margin-bottom: 1rem;
                    }
                    
                    .server-command {
                        background: rgba(0, 0, 0, 0.2);
                        padding: 1rem;
                        margin: 0.5rem 0;
                        border-radius: 4px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .server-command code {
                        font-family: 'Courier New', monospace;
                        font-size: 0.95rem;
                    }
                    
                    .command-info {
                        flex: 1;
                    }
                    
                    .command-name {
                        font-weight: bold;
                        margin-bottom: 0.25rem;
                    }
                    
                    .command-desc {
                        font-size: 0.85rem;
                        opacity: 0.9;
                    }
                    
                    .copy-button {
                        padding: 0.25rem 0.75rem;
                        background: rgba(255, 255, 255, 0.9);
                        color: #667eea;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 0.85rem;
                        transition: all 0.2s;
                    }
                    
                    .copy-button:hover {
                        background: white;
                        transform: scale(1.05);
                    }
                    
                    .copy-button.copied {
                        background: #4ade80;
                        color: white;
                    }
                    
                    .instructions-note {
                        margin-top: 1rem;
                        padding: 0.5rem;
                        background: rgba(255, 255, 255, 0.15);
                        border-radius: 4px;
                    }
                    
                    .instructions-note code {
                        background: rgba(255, 255, 255, 0.2);
                        padding: 0.25rem 0.5rem;
                        border-radius: 3px;
                    }
                    
                    body.has-file-protocol-warning {
                        padding-top: 120px;
                    }
                `;
                document.head.appendChild(styles);
            }

            // Insert banner at the beginning of body
            document.body.insertBefore(banner, document.body.firstChild);
            document.body.classList.add('has-file-protocol-warning');

            // Populate server commands
            const commandsList = document.getElementById('server-commands-list');
            this.getServerCommands().forEach(cmd => {
                const commandDiv = document.createElement('div');
                commandDiv.className = 'server-command';
                commandDiv.innerHTML = `
                    <div class="command-info">
                        <div class="command-name">${cmd.name}</div>
                        <code>${cmd.command}</code>
                        <div class="command-desc">${cmd.description}</div>
                    </div>
                    <button class="copy-button" data-command="${cmd.command}">
                        Copy
                    </button>
                `;
                commandsList.appendChild(commandDiv);
            });

            // Add event listeners
            document.getElementById('show-server-instructions').addEventListener('click', () => {
                const instructions = document.getElementById('server-instructions');
                instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
            });

            document.getElementById('dismiss-warning').addEventListener('click', () => {
                banner.style.display = 'none';
                document.body.classList.remove('has-file-protocol-warning');
            });

            // Copy buttons
            document.querySelectorAll('.copy-button').forEach(button => {
                button.addEventListener('click', () => {
                    const command = button.getAttribute('data-command');
                    this.copyToClipboard(command).then(success => {
                        if (success) {
                            const originalText = button.textContent;
                            button.textContent = 'Copied!';
                            button.classList.add('copied');
                            setTimeout(() => {
                                button.textContent = originalText;
                                button.classList.remove('copied');
                            }, 2000);
                        }
                    });
                });
            });
        },

        /**
         * Check if the browser is Chrome
         */
        isChrome() {
            return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        },

        /**
         * Get browser-specific file protocol message
         */
        getBrowserSpecificMessage() {
            if (this.isChrome()) {
                return 'Chrome has strict CORS policies for file:// URLs. Consider using Firefox for local file access or set up a local server.';
            }
            return 'Your browser may restrict file:// protocol access. Consider setting up a local server for the best experience.';
        },

        /**
         * Initialize the file protocol helper
         */
        init() {
            if (this.isFileProtocol()) {
                // Show warning banner after DOM is ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.showWarningBanner());
                } else {
                    this.showWarningBanner();
                }

                // Log helpful information
                console.log('📁 File Protocol Detected');
                console.log('Embedded data available:', this.hasEmbeddedData());
                console.log(this.getBrowserSpecificMessage());
                console.log('To set up a local server, run one of these commands:');
                this.getServerCommands().forEach(cmd => {
                    console.log(`  ${cmd.name}: ${cmd.command}`);
                });
            }
        }
    };

    // Export to global namespace
    window.FileProtocolHelper = FileProtocolHelper;

    // Auto-initialize
    FileProtocolHelper.init();

})(window);