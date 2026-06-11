*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* в•ђв•ђв•ђ THEMES в•ђв•ђв•ђ */
:root, [data-theme="dark"] {
  --bg:        #0d0f14;
  --surface:   #161b24;
  --surface2:  #1e2535;
  --border:    #252d3d;
  --accent:    #f5a623;
  --danger:    #e8392a;
  --success:   #27ae60;
  --text:      #e4e8f0;
  --muted:     #7a8499;
  --shadow:    rgba(0,0,0,0.5);
  --popup-bg:  #1a2030;
  --popup-text:#e4e8f0;
}

[data-theme="light"] {
  --bg:        #f0f2f5;
  --surface:   #ffffff;
  --surface2:  #f7f8fa;
  --border:    #dde1ea;
  --accent:    #e08c00;
  --danger:    #e8392a;
  --success:   #1e8c4a;
  --text:      #1a1f2e;
  --muted:     #6b7280;
  --shadow:    rgba(0,0,0,0.15);
  --popup-bg:  #ffffff;
  --popup-text:#1a1f2e;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  height: 100dvh;
  overflow: hidden;
  transition: background 0.3s, color 0.3s;
}

/* в•ђв•ђв•ђ SPLASH в•ђв•ђв•ђ */
#splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(160deg, #0a0c12 0%, #111827 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.splash-inner {
  text-align: center;
  animation: splashIn 0.6s cubic-bezier(0.22,1,0.36,1);
}

@keyframes splashIn {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.splash-icon {
  font-size: 4rem;
  margin-bottom: 10px;
  animation: splashPulse 1.5s ease-in-out infinite;
}

@keyframes splashPulse {
  0%,100% { transform: scale(1); }
  50%      { transform: scale(1.1); }
}

.splash-title {
  font-family: 'Oswald', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #f5a623;
  letter-spacing: 3px;
}

.splash-sub {
  color: #7a8499;
  font-size: 0.9rem;
  margin-top: 4px;
  letter-spacing: 1px;
}

.splash-animals {
  font-size: 1.8rem;
  margin: 20px 0;
  letter-spacing: 6px;
  opacity: 0.8;
}

.splash-loader {
  width: 200px;
  height: 3px;
  background: #1e2535;
  border-radius: 3px;
  margin: 20px auto 12px;
  overflow: hidden;
}

.splash-bar {
  height: 100%;
  background: #f5a623;
  border-radius: 3px;
  animation: load 2s ease-in-out forwards;
}

@keyframes load {
  from { width: 0; }
  to   { width: 100%; }
}

.splash-hint {
  color: #4a5568;
  font-size: 0.78rem;
  letter-spacing: 0.5px;
}

/* в•ђв•ђв•ђ TOPBAR в•ђв•ђв•ђ */
.topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: 52px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 2px 8px var(--shadow);
}

.topbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 1px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.topbar-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--success);
  font-weight: 500;
}

.dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:0.4; transform:scale(0.7); }
}

.theme-btn {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 5px 9px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.theme-btn:hover { background: var(--border); }

/* в•ђв•ђв•ђ MAP в•ђв•ђв•ђ */
#map {
  position: fixed;
  top: 52px; left: 0; right: 0; bottom: 0;
}

/* в•ђв•ђв•ђ MAPBOX POPUP CUSTOM в•ђв•ђв•ђ */
.mapboxgl-popup-content {
  background: var(--popup-bg) !important;
  color: var(--popup-text) !important;
  border-radius: 12px !important;
  padding: 0 !important;
  box-shadow: 0 4px 20px var(--shadow) !important;
  border: 1px solid var(--border);
}

.mapboxgl-popup-tip { display: none !important; }
.mapboxgl-popup-close-button {
  color: var(--muted) !important;
  font-size: 1.1rem !important;
  padding: 6px 10px !important;
  background: none !important;
}

.mpopup { padding: 14px; min-width: 200px; }

.mpopup-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.mpopup-emoji { font-size: 2rem; line-height: 1; }
.mpopup-title { font-weight: 700; font-size: 1rem; display: block; }
.mpopup-time  { font-size: 0.72rem; color: var(--muted); }

.mpopup-danger {
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.mpopup-coords {
  font-size: 0.68rem;
  color: var(--muted);
  margin-bottom: 10px;
}

.mpopup-votes {
  border-top: 1px solid var(--border);
  padding-top: 10px;
  margin-bottom: 8px;
}

.mpopup-votes > span {
  font-size: 0.75rem;
  color: var(--muted);
  display: block;
  margin-bottom: 6px;
}

.vote-btns { display: flex; gap: 6px; }

.vote-yes, .vote-no {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 6px 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: opacity 0.15s;
}

.vote-yes { background: rgba(39,174,96,0.15); color: #27ae60; border: 1px solid #27ae60; }
.vote-no  { background: rgba(232,57,42,0.15); color: #e8392a; border: 1px solid #e8392a; }
.vote-yes:hover, .vote-no:hover { opacity: 0.75; }

.mpopup-delete {
  width: 100%;
  background: rgba(232,57,42,0.1);
  border: 1px solid rgba(232,57,42,0.3);
  color: #e8392a;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  font-size: 0.78rem;
  transition: background 0.15s;
}

.mpopup-delete:hover { background: rgba(232,57,42,0.25); }

/* в•ђв•ђв•ђ MARKER в•ђв•ђв•ђ */
.animal-marker {
  cursor: pointer;
  user-select: none;
  /* Р¤РРљРЎРР РћР’РђРќРќР«Р™ вЂ” РЅРµ РґРІРёРіР°РµС‚СЃСЏ РїСЂРё РїР°РЅРѕСЂР°РјРёСЂРѕРІР°РЅРёРё */
  will-change: transform;
  pointer-events: auto;
}

.marker-emoji {
  font-size: 2rem;
  display: block;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.8));
  transition: transform 0.15s;
  line-height: 1;
}

.animal-marker:hover .marker-emoji { transform: scale(1.3); }

/* в•ђв•ђв•ђ SPEED WARNING в•ђв•ђв•ђ */
.speed-warning {
  position: fixed;
  top: 64px; left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  background: var(--danger);
  color: #fff;
  border-radius: 14px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 30px rgba(232,57,42,0.55);
  min-width: 300px;
  max-width: 90vw;
  animation: slideIn 0.4s cubic-bezier(0.22,1,0.36,1);
}

.speed-warning.hidden { display: none; }

@keyframes slideIn {
  from { opacity:0; transform:translateX(-50%) translateY(-20px); }
  to   { opacity:1; transform:translateX(-50%) translateY(0); }
}

.sw-icon { font-size: 2rem; }
.sw-text { flex: 1; }
.sw-text strong { font-family: 'Oswald', sans-serif; font-size: 1rem; display: block; }
.sw-text span   { font-size: 0.78rem; opacity: 0.9; }
.sw-close {
  background: rgba(255,255,255,0.2);
  border: none; color: #fff;
  width: 26px; height: 26px;
  border-radius: 50%; cursor: pointer; font-size: 0.75rem;
}

/* в•ђв•ђв•ђ FAB (floating button for mobile) в•ђв•ђв•ђ */
.fab {
  position: fixed;
  bottom: 24px;
  right: 16px;
  z-index: 90;
  background: var(--accent);
  color: #000;
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(245,166,35,0.4);
  display: none; /* РїРѕРєР°Р·С‹РІР°РµС‚СЃСЏ С‚РѕР»СЊРєРѕ РЅР° РјРѕР±РёР»СЊРЅРѕРј */
}

/* в•ђв•ђв•ђ PANEL OVERLAY в•ђв•ђв•ђ */
.panel-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 149;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
}

/* в•ђв•ђв•ђ PANEL в•ђв•ђв•ђ */
.panel {
  position: fixed;
  z-index: 150;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
}

/* Desktop: Р±РѕРєРѕРІР°СЏ РїР°РЅРµР»СЊ СЃР»РµРІР° */
@media (min-width: 641px) {
  .panel {
    top: 52px; left: 0; bottom: 0;
    width: 300px;
    border-top: none;
    border-left: none;
    border-bottom: none;
    transform: none !important;
    overflow-y: auto;
  }

  .panel-handle, .panel-close, .fab, .panel-overlay { display: none !important; }

  #map { left: 300px; }
}

/* Mobile: РІС‹РµР·Р¶Р°СЋС‰Р°СЏ СЃРЅРёР·Сѓ РїР°РЅРµР»СЊ */
@media (max-width: 640px) {
  .fab { display: flex; align-items: center; gap: 6px; }

  .panel {
    left: 0; right: 0; bottom: 0;
    border-radius: 20px 20px 0 0;
    border-left: none; border-right: none; border-bottom: none;
    max-height: 80dvh;
    transform: translateY(100%);
    overflow-y: auto;
  }

  .panel.open {
    transform: translateY(0);
  }

  .panel.open ~ .panel-overlay,
  .panel-overlay.visible { display: block; }

  /* РєРѕРіРґР° РїР°РЅРµР»СЊ РѕС‚РєСЂС‹С‚Р° вЂ” РїРѕРєР°Р·С‹РІР°РµРј overlay */
  .panel.open + .panel-overlay { display: block; }
}

/* js СѓРїСЂР°РІР»СЏРµС‚ С‡РµСЂРµР· classList.add('open') */
@media (max-width: 640px) {
  #panel.open ~ #panelOverlay { display: block; }
}

.panel-handle {
  padding: 10px 0 6px;
  text-align: center;
  cursor: pointer;
}

.handle-bar {
  width: 40px; height: 4px;
  background: var(--border);
  border-radius: 4px;
  margin: 0 auto;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 8px;
  border-bottom: 1px solid var(--border);
}

.panel-header h2 {
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent);
}

.panel-close {
  background: none; border: none;
  color: var(--muted); cursor: pointer;
  font-size: 1rem; padding: 4px 8px;
}

.panel-body {
  padding: 12px 16px 24px;
}

.hint {
  font-size: 0.78rem;
  color: var(--muted);
  margin-bottom: 10px;
}

/* в•ђв•ђв•ђ ANIMAL GRID в•ђв•ђв•ђ */
.animal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  margin-bottom: 10px;
}

.animal-btn {
  background: var(--surface2);
  border: 2px solid var(--border);
  border-radius: 10px;
  padding: 8px 4px;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
  color: var(--text);
}

.animal-btn:hover  { border-color: var(--accent); }
.animal-btn.active { border-color: var(--accent); background: rgba(245,166,35,0.12); }
.animal-btn .emoji { font-size: 1.6rem; display: block; }
.animal-btn .label { font-size: 0.66rem; color: var(--muted); margin-top: 2px; }

.selected-animal {
  text-align: center;
  font-size: 0.82rem;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 10px;
}

/* в•ђв•ђв•ђ BUTTONS в•ђв•ђв•ђ */
.btn-report {
  width: 100%;
  background: var(--accent);
  color: #000;
  border: none;
  border-radius: 10px;
  padding: 11px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 8px;
  transition: opacity 0.15s;
}

.btn-report:hover { opacity: 0.85; }

.btn-myloc {
  background: var(--surface2);
  color: var(--text);
  border: 1px solid var(--border);
}

hr { border: none; border-top: 1px solid var(--border); margin: 12px 0; }

h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 8px;
}

/* в•ђв•ђв•ђ FEED в•ђв•ђв•ђ */
.feed { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.feed-empty { font-size: 0.78rem; color: var(--muted); text-align: center; padding: 10px 0; }

.feed-item {
  background: var(--surface2);
  border-radius: 8px;
  padding: 8px 10px;
  border-left: 3px solid var(--accent);
  font-size: 0.78rem;
  cursor: pointer;
  transition: opacity 0.15s;
}

.feed-item:hover { opacity: 0.8; }
.fi-top { display: flex; justify-content: space-between; margin-bottom: 2px; }
.fi-animal { font-weight: 600; }
.fi-time   { color: var(--muted); }
.fi-coords { color: var(--muted); font-size: 0.7rem; }

/* в•ђв•ђв•ђ PIN HINT в•ђв•ђв•ђ */
.pin-hint {
  position: fixed;
  bottom: 80px; left: 50%;
  transform: translateX(-50%);
  z-index: 160;
  background: var(--surface);
  border: 1px solid var(--accent);
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 0.82rem;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 2px 12px var(--shadow);
  white-space: nowrap;
}

.pin-hint button {
  background: var(--danger);
  border: none; color: #fff;
  border-radius: 20px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 0.75rem;
}

.pin-hint.hidden { display: none; }

/* в•ђв•ђв•ђ SCROLLBAR в•ђв•ђв•ђ */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

/* в•ђв•ђв•ђ PANEL OVERLAY toggle via JS в•ђв•ђв•ђ */
#panelOverlay { display: none; }

/* в•ђв•ђв•ђ CAMERA FAB в•ђв•ђв•ђ */
.cam-fab {
  position: fixed;
  bottom: 90px;
  right: 16px;
  z-index: 90;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--surface);
  border: 2px solid var(--accent);
  font-size: 1.4rem;
  cursor: pointer;
  box-shadow: 0 4px 14px var(--shadow);
  transition: transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cam-fab:hover { transform: scale(1.1); }

@media (min-width: 641px) {
  .cam-fab { bottom: 24px; right: 70px; }
}

/* в•ђв•ђв•ђ CAMERA BUTTON IN PANEL в•ђв•ђв•ђ */
.btn-camera {
  width: 100%;
  background: linear-gradient(135deg, #1a2535, #1e2d45);
  color: var(--text);
  border: 2px solid var(--accent);
  border-radius: 10px;
  padding: 11px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.15s;
  letter-spacing: 0.3px;
}

.btn-camera:hover { background: rgba(245,166,35,0.12); }

.divider-text {
  text-align: center;
  font-size: 0.72rem;
  color: var(--muted);
  margin: 6px 0 10px;
}

/* в•ђв•ђв•ђ CAMERA MODAL в•ђв•ђв•ђ */
.camera-modal {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.camera-modal.hidden { display: none; }

.cam-inner {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6);
}

.cam-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.cam-title {
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--accent);
}

.cam-close {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--muted);
  width: 30px; height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.85rem;
}

.cam-status {
  padding: 8px 16px;
  font-size: 0.8rem;
  color: var(--muted);
  text-align: center;
  border-bottom: 1px solid var(--border);
  background: var(--surface2);
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Р’РёРґРµРѕ РѕР±С‘СЂС‚РєР° */
.cam-video-wrap {
  position: relative;
  width: 100%;
  background: #000;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.cam-video-wrap video,
.cam-video-wrap canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}

.cam-video-wrap canvas {
  pointer-events: none;
}

/* Р РµР·СѓР»СЊС‚Р°С‚ РґРµС‚РµРєС†РёРё */
.cam-detected {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(245,166,35,0.1);
  border-top: 2px solid var(--accent);
  animation: detectedPop 0.3s cubic-bezier(0.22,1,0.36,1);
}

.cam-detected.hidden { display: none; }

@keyframes detectedPop {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cam-det-emoji { font-size: 2.2rem; }

.cam-det-info strong { display: block; font-size: 1rem; color: var(--text); }
.cam-det-info span   { font-size: 0.75rem; color: var(--accent); }

.cam-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
}

.cam-confirm {
  flex: 2;
  background: var(--accent);
  color: #000;
  border: none;
  border-radius: 10px;
  padding: 11px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}

.cam-confirm:disabled { opacity: 0.35; cursor: default; }
.cam-confirm:not(:disabled):hover { opacity: 0.85; }

.cam-cancel {
  flex: 1;
  background: var(--surface2);
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 11px;
  cursor: pointer;
  font-size: 0.85rem;
}

.cam-hint {
  text-align: center;
  font-size: 0.72rem;
  color: var(--muted);
  padding: 0 16px 14px;
}

/* в•ђв•ђв•ђ TOAST в•ђв•ђв•ђ */
.cam-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 600;
  background: var(--success);
  color: #fff;
  padding: 10px 22px;
  border-radius: 50px;
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(39,174,96,0.4);
  animation: toastIn 0.3s cubic-bezier(0.22,1,0.36,1);
  white-space: nowrap;
}

.cam-toast.hidden { display: none; }

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
