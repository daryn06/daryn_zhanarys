'use strict';

const ANIMALS = [
  { id: 'cow',   emoji: '🐄', label: 'Корова',  danger: 'high',   desc: 'Крупный рогатый скот' },
  { id: 'horse', emoji: '🐎', label: 'Лошадь',  danger: 'high',   desc: 'Лошадь на дороге' },
  { id: 'camel', emoji: '🐪', label: 'Верблюд', danger: 'high',   desc: 'Верблюд на дороге' },
  { id: 'sheep', emoji: '🐑', label: 'Овца',    danger: 'medium', desc: 'Мелкий скот' },
  { id: 'goat',  emoji: '🐐', label: 'Коза',    danger: 'medium', desc: 'Мелкий скот' },
  { id: 'dog',   emoji: '🐕', label: 'Собака',  danger: 'medium', desc: 'Собака на дороге' },
  { id: 'deer',  emoji: '🦌', label: 'Олень',   danger: 'high',   desc: 'Дикое животное' },
  { id: 'boar',  emoji: '🐗', label: 'Кабан',   danger: 'high',   desc: 'Дикий кабан' },
  { id: 'other', emoji: '🐾', label: 'Другое',  danger: 'medium', desc: 'Неизвестное животное' },
];

let map, db;
let mapReady = false;
let selectedAnimal = null;
let pinMode = false;
let userLocation = null;
let markers = {};
let warningTimer = null;
let localIdCounter = 0;
let pendingMarkers = [];
let currentTheme = localStorage.getItem('theme') || 'dark';

// ── SPLASH SCREEN ──────────────────────────────────────────
function hideSplash() {
  const splash = document.getElementById('splash');
  splash.style.opacity = '0';
  splash.style.transform = 'scale(1.05)';
  setTimeout(() => { splash.style.display = 'none'; }, 600);
}

// ── THEME ──────────────────────────────────────────────────
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (map) {
    map.setStyle(theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/streets-v12');
    map.once('style.load', () => {
      mapReady = true;
      Object.keys(markers).forEach(id => {
        const m = markers[id];
        m._mapboxMarker && m._mapboxMarker.addTo(map);
      });
    });
  }
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  initAnimalGrid();
  initFirebase();
  initMap();
  setTimeout(hideSplash, 2200);
});

// ── ANIMAL GRID ────────────────────────────────────────────
function initAnimalGrid() {
  const grid = document.getElementById('animalGrid');
  ANIMALS.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'animal-btn';
    btn.dataset.id = a.id;
    btn.innerHTML = `<span class="emoji">${a.emoji}</span><span class="label">${a.label}</span>`;
    btn.onclick = () => selectAnimal(a);
    grid.appendChild(btn);
  });
}

function selectAnimal(a) {
  selectedAnimal = a;
  document.querySelectorAll('.animal-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-id="${a.id}"]`).classList.add('active');
  document.getElementById('selectedAnimalLabel').textContent = `${a.emoji} ${a.label} выбран`;
}

// ── FIREBASE ───────────────────────────────────────────────
function initFirebase() {
  try {
    if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'YOUR_FIREBASE_API_KEY') {
      showStatus('Локальный режим', true);
      return;
    }
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    showStatus('Онлайн', true);
    listenToReports();
  } catch (e) {
    console.error('Firebase error:', e);
    showStatus('Локальный режим', true);
  }
}

function listenToReports() {
  if (!db) return;
  const cutoff = new Date(Date.now() - MARKER_EXPIRE_MIN * 60 * 1000);
  db.collection('reports')
    .where('timestamp', '>', cutoff)
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        const id = change.doc.id;
        if (change.type === 'added' || change.type === 'modified') {
          addOrUpdateMarker(id, { ...data, _fromFirebase: true });
          updateFeed(id, data, change.type === 'added');
          if (change.type === 'added') checkProximityWarning(data);
        }
        if (change.type === 'removed') removeMarker(id);
      });
    }, err => console.error('Firestore:', err));
}

// ── MAP ────────────────────────────────────────────────────
function initMap() {
  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN_HERE') {
    document.getElementById('map').innerHTML =
      '<div style="padding:40px;text-align:center">⚠️ Вставьте Mapbox токен в src/config.js</div>';
    return;
  }

  mapboxgl.accessToken = MAPBOX_TOKEN;
  map = new mapboxgl.Map({
    container: 'map',
    style: currentTheme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/streets-v12',
    zoom: 13,
    attributionControl: false,
  });

  map.on('load', () => {
    mapReady = true;
    pendingMarkers.forEach(({ id, data }) => _addMarkerNow(id, data));
    pendingMarkers = [];

    // Автоопределение местоположения при загрузке
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        userLocation = { lat, lng };
        map.flyTo({ center: [lng, lat], zoom: 14, speed: 1.2 });
      }, null, { enableHighAccuracy: true });
    }
  });

  // Следим за позицией постоянно
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(pos => {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    }, null, { enableHighAccuracy: true });
  }

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true,
  }), 'top-right');

  map.on('click', (e) => {
    if (!pinMode) return;
    cancelPinMode();
    placeReport(e.lngLat.lat, e.lngLat.lng);
  });
}

// ── PIN MODE ───────────────────────────────────────────────
function startPinMode() {
  if (!selectedAnimal) { alert('Сначала выберите животное!'); return; }
  pinMode = true;
  document.getElementById('pinHint').classList.remove('hidden');
  map.getCanvas().style.cursor = 'crosshair';
  // На мобильном закрываем панель чтобы видеть карту
  if (window.innerWidth < 640) closePanel();
}

function cancelPinMode() {
  pinMode = false;
  document.getElementById('pinHint').classList.add('hidden');
  if (map) map.getCanvas().style.cursor = '';
}

function reportAtMyLocation() {
  if (!selectedAnimal) { alert('Сначала выберите животное!'); return; }
  if (!navigator.geolocation) { alert('Геолокация не поддерживается'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    placeReport(pos.coords.latitude, pos.coords.longitude);
  }, () => alert('Разрешите доступ к геолокации'), { enableHighAccuracy: true });
}

// ── PLACE REPORT ───────────────────────────────────────────
function placeReport(lat, lng) {
  if (!selectedAnimal) { alert('Выберите животное!'); return; }

  const createdAt = new Date();
  const data = {
    animal:    selectedAnimal.id,
    emoji:     selectedAnimal.emoji,
    label:     selectedAnimal.label,
    danger:    selectedAnimal.danger,
    lat, lng,
    votes_yes: 0,
    votes_no:  0,
    createdAt,
    timestamp: { toDate: () => createdAt },
  };

  const id = 'local_' + (++localIdCounter);
  addOrUpdateMarker(id, data);
  updateFeed(id, data, true);
  checkProximityWarning(data);
  map.flyTo({ center: [lng, lat], zoom: 15, speed: 1.5 });
  if (window.innerWidth < 640) closePanel();

  if (db) {
    db.collection('reports').add({
      animal: data.animal, emoji: data.emoji, label: data.label,
      danger: data.danger, lat, lng,
      votes_yes: 0, votes_no: 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(ref => console.log('Firebase OK:', ref.id))
    .catch(e => console.warn('Firebase недоступен:', e.message));
  }
}

// ── MARKERS ────────────────────────────────────────────────
function addOrUpdateMarker(docId, data) {
  if (!mapReady) { pendingMarkers.push({ id: docId, data }); return; }
  _addMarkerNow(docId, data);
}

function _addMarkerNow(docId, data) {
  if (markers[docId]) markers[docId].remove();

  const createdAt = data.createdAt instanceof Date
    ? data.createdAt
    : (data.timestamp?.toDate?.() || new Date());

  const timeStr = formatTime(createdAt);
  const dangerLabel = data.danger === 'high'
    ? '🔴 Опасно — скорость снизить!'
    : '🟡 Умеренная опасность';
  const dangerColor = data.danger === 'high' ? '#e8392a' : '#f5a623';

  // Popup с голосованием
  const popupHTML = `
    <div class="mpopup" data-id="${docId}">
      <div class="mpopup-head">
        <span class="mpopup-emoji">${data.emoji}</span>
        <div>
          <b class="mpopup-title">${data.label}</b>
          <div class="mpopup-time">${timeStr}</div>
        </div>
      </div>
      <div class="mpopup-danger" style="color:${dangerColor}">${dangerLabel}</div>
      <div class="mpopup-coords">${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}</div>
      <div class="mpopup-votes">
        <span>Это верно?</span>
        <div class="vote-btns">
          <button class="vote-yes" onclick="vote('${docId}','yes')">✅ Да <span id="yes_${docId}">${data.votes_yes||0}</span></button>
          <button class="vote-no"  onclick="vote('${docId}','no')">❌ Нет <span id="no_${docId}">${data.votes_no||0}</span></button>
        </div>
      </div>
      <button class="mpopup-delete" onclick="deleteMarker('${docId}')">🗑️ Удалить метку</button>
    </div>
  `;

  const popup = new mapboxgl.Popup({
    offset: 30,
    closeButton: true,
    maxWidth: '240px',
  }).setHTML(popupHTML);

  // Фиксированный элемент маркера (не двигается!)
  const el = document.createElement('div');
  el.className = 'animal-marker';
  el.innerHTML = `<span class="marker-emoji">${data.emoji}</span>`;

  const mapboxMarker = new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
    // Отключаем трансформацию которая вызывает "желе"
    rotationAlignment: 'map',
    pitchAlignment: 'map',
  })
    .setLngLat([data.lng, data.lat])
    .setPopup(popup)
    .addTo(map);

  // Сохраняем и marker и его данные для удаления
  markers[docId] = mapboxMarker;
  markersData[docId] = data;
}

// Хранилище данных маркеров
const markersData = {};

function removeMarker(docId) {
  if (markers[docId]) { markers[docId].remove(); delete markers[docId]; }
  delete markersData[docId];
  removeFeedItem(docId);
}

// ── VOTE ───────────────────────────────────────────────────
function vote(docId, type) {
  const key = `voted_${docId}`;
  if (localStorage.getItem(key)) {
    alert('Вы уже голосовали за эту метку');
    return;
  }
  localStorage.setItem(key, type);

  const yesEl = document.getElementById(`yes_${docId}`);
  const noEl  = document.getElementById(`no_${docId}`);

  if (type === 'yes' && yesEl) yesEl.textContent = parseInt(yesEl.textContent||0) + 1;
  if (type === 'no'  && noEl)  noEl.textContent  = parseInt(noEl.textContent||0)  + 1;

  // Если 3+ голосов "нет" — удаляем метку
  const noCount = parseInt(noEl?.textContent || 0);
  if (noCount >= 3) {
    setTimeout(() => deleteMarker(docId), 500);
    return;
  }

  if (db && !docId.startsWith('local_')) {
    const field = type === 'yes' ? 'votes_yes' : 'votes_no';
    db.collection('reports').doc(docId)
      .update({ [field]: firebase.firestore.FieldValue.increment(1) })
      .catch(e => console.warn('Vote update failed:', e));
  }
}

// ── DELETE MARKER ──────────────────────────────────────────
function deleteMarker(docId) {
  if (!confirm('Удалить эту метку?')) return;
  removeMarker(docId);
  if (db && !docId.startsWith('local_')) {
    db.collection('reports').doc(docId).delete()
      .catch(e => console.warn('Delete failed:', e));
  }
}

// ── FEED ───────────────────────────────────────────────────
const feedItems = [];

function updateFeed(docId, data, isNew) {
  if (!isNew) return;
  const createdAt = data.createdAt instanceof Date ? data.createdAt : new Date();
  feedItems.unshift({ docId, data: { ...data, createdAt } });
  if (feedItems.length > 20) feedItems.pop();
  renderFeed();
}

function removeFeedItem(docId) {
  const idx = feedItems.findIndex(i => i.docId === docId);
  if (idx !== -1) { feedItems.splice(idx, 1); renderFeed(); }
}

function renderFeed() {
  const list = document.getElementById('feedList');
  list.innerHTML = '';
  if (feedItems.length === 0) {
    list.innerHTML = '<li class="feed-empty">Пока нет сигналов...</li>';
    return;
  }
  feedItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'feed-item';
    li.innerHTML = `
      <div class="fi-top">
        <span class="fi-animal">${item.data.emoji} ${item.data.label}</span>
        <span class="fi-time">${formatTime(item.data.createdAt)}</span>
      </div>
      <div class="fi-coords">${item.data.lat.toFixed(4)}, ${item.data.lng.toFixed(4)}</div>
    `;
    li.onclick = () => {
      map.flyTo({ center: [item.data.lng, item.data.lat], zoom: 15 });
      if (window.innerWidth < 640) closePanel();
    };
    list.appendChild(li);
  });
}

// ── WARNING ────────────────────────────────────────────────
function checkProximityWarning(data) {
  if (!userLocation) return;
  const dist = haversineM(userLocation.lat, userLocation.lng, data.lat, data.lng);
  if (dist <= WARN_RADIUS_M) showWarning(data, dist);
}

function showWarning(data, distM) {
  document.getElementById('warningIcon').textContent = data.emoji;
  document.getElementById('warningTitle').textContent = `${data.label} — ${Math.round(distM)}м от вас!`;
  document.getElementById('warningDesc').textContent = 'Снизьте скорость и будьте осторожны!';
  document.getElementById('speedWarning').classList.remove('hidden');
  clearTimeout(warningTimer);
  warningTimer = setTimeout(dismissWarning, WARN_DURATION_MS);
}

function dismissWarning() {
  document.getElementById('speedWarning').classList.add('hidden');
}

// ── PANEL (mobile) ─────────────────────────────────────────
function togglePanel() {
  const panel = document.getElementById('panel');
  panel.classList.toggle('open');
}

function closePanel() {
  document.getElementById('panel').classList.remove('open');
}

function openPanel() {
  document.getElementById('panel').classList.add('open');
}

// ── HELPERS ────────────────────────────────────────────────
function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function formatTime(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return 'только что';
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 10)   return 'только что';
  if (diff < 60)   return `${diff}с назад`;
  if (diff < 3600) return `${Math.floor(diff/60)}мин назад`;
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function showStatus(msg, ok) {
  const badge = document.getElementById('statusBadge');
  badge.innerHTML = `<span class="dot"></span> ${msg}`;
  badge.style.color = ok ? 'var(--success)' : 'var(--danger)';
}

// ── PANEL OVERLAY SYNC ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('panel');
  const overlay = document.getElementById('panelOverlay');
  if (!panel || !overlay) return;

  const obs = new MutationObserver(() => {
    overlay.style.display = panel.classList.contains('open') ? 'block' : 'none';
  });
  obs.observe(panel, { attributes: true, attributeFilter: ['class'] });
});
