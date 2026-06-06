// =============================================
//  app.js — РодАлерт Core Logic
//  Mapbox GL + Firebase Firestore realtime
// =============================================

'use strict';

// ---------- ANIMAL DEFINITIONS ----------
const ANIMALS = [
  { id: 'cow',      emoji: '🐄', label: 'Корова',   danger: 'high' },
  { id: 'horse',    emoji: '🐎', label: 'Лошадь',   danger: 'high' },
  { id: 'camel',    emoji: '🐪', label: 'Верблюд',  danger: 'high' },
  { id: 'sheep',    emoji: '🐑', label: 'Овца',     danger: 'medium' },
  { id: 'goat',     emoji: '🐐', label: 'Коза',     danger: 'medium' },
  { id: 'dog',      emoji: '🐕', label: 'Собака',   danger: 'medium' },
  { id: 'deer',     emoji: '🦌', label: 'Олень',    danger: 'high' },
  { id: 'boar',     emoji: '🐗', label: 'Кабан',    danger: 'high' },
  { id: 'other',    emoji: '🐾', label: 'Другое',   danger: 'medium' },
];

// ---------- STATE ----------
let map, db;
let selectedAnimal = null;
let pinMode = false;
let userLocation = null;
let markers = {}; // docId → mapbox Marker
let warningTimer = null;

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  initAnimalGrid();
  initFirebase();
  initMap();
});

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

// ---------- FIREBASE ----------
function initFirebase() {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    listenToReports();
  } catch (e) {
    console.error('Firebase init error:', e);
    showStatus('Ошибка Firebase', false);
  }
}

function listenToReports() {
  const cutoff = new Date(Date.now() - MARKER_EXPIRE_MIN * 60 * 1000);

  db.collection('reports')
    .where('timestamp', '>', cutoff)
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        const data = doc.data();

        if (change.type === 'added' || change.type === 'modified') {
          addOrUpdateMarker(doc.id, data);
          updateFeed(doc.id, data, change.type === 'added');
          if (change.type === 'added') checkProximityWarning(data);
        }

        if (change.type === 'removed') {
          removeMarker(doc.id);
        }
      });
    }, err => {
      console.error('Firestore listen error:', err);
    });
}

// ---------- MAP ----------
function initMap() {
  mapboxgl.accessToken = MAPBOX_TOKEN;

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [71.4, 51.2], // Kazakhstan центр по умолчанию
    zoom: 10,
    attributionControl: false,
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true,
  }), 'top-right');

  // Track user location for proximity warnings
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(pos => {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    }, null, { enableHighAccuracy: true });
  }

  // Click on map to place report
  map.on('click', (e) => {
    if (!pinMode) return;
    placeReport(e.lngLat.lat, e.lngLat.lng);
    cancelPinMode();
  });

  map.on('load', () => {
    map.getCanvas().style.cursor = '';
  });
}

// ---------- PIN MODE ----------
function startPinMode() {
  if (!selectedAnimal) {
    alert('Сначала выберите животное!');
    return;
  }
  pinMode = true;
  document.getElementById('pinHint').classList.remove('hidden');
  map.getCanvas().style.cursor = 'crosshair';
}

function cancelPinMode() {
  pinMode = false;
  document.getElementById('pinHint').classList.add('hidden');
  map.getCanvas().style.cursor = '';
}

function reportAtMyLocation() {
  if (!selectedAnimal) { alert('Сначала выберите животное!'); return; }
  if (!navigator.geolocation) { alert('Геолокация не поддерживается'); return; }

  navigator.geolocation.getCurrentPosition(pos => {
    placeReport(pos.coords.latitude, pos.coords.longitude);
  }, () => {
    alert('Не удалось получить местоположение. Разрешите доступ к геолокации.');
  }, { enableHighAccuracy: true });
}

// ---------- FIRESTORE WRITE ----------
async function placeReport(lat, lng) {
  if (!db) { alert('Firebase не подключён'); return; }

  const report = {
    animal:    selectedAnimal.id,
    emoji:     selectedAnimal.emoji,
    label:     selectedAnimal.label,
    danger:    selectedAnimal.danger,
    lat,
    lng,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    confirmed: 0,
  };

  try {
    await db.collection('reports').add(report);
    map.flyTo({ center: [lng, lat], zoom: 14, speed: 1.2 });
  } catch (e) {
    alert('Ошибка при сохранении: ' + e.message);
  }
}

// ---------- MARKERS ----------
function addOrUpdateMarker(docId, data) {
  if (markers[docId]) {
    markers[docId].remove();
  }

  const el = document.createElement('div');
  el.className = 'animal-marker';
  el.textContent = data.emoji || '🐾';
  el.title = data.label;

  const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
    .setHTML(`
      <div style="font-family:'Inter',sans-serif;font-size:13px;line-height:1.5">
        <b>${data.emoji} ${data.label}</b><br>
        <span style="color:#888;font-size:11px">${formatTime(data.timestamp?.toDate?.())}</span><br>
        <span style="color:${data.danger==='high'?'#e8392a':'#f5a623'}">
          ${data.danger === 'high' ? '🔴 Высокая опасность' : '🟡 Средняя опасность'}
        </span>
      </div>
    `);

  const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
    .setLngLat([data.lng, data.lat])
    .setPopup(popup)
    .addTo(map);

  markers[docId] = marker;
}

function removeMarker(docId) {
  if (markers[docId]) {
    markers[docId].remove();
    delete markers[docId];
  }
}

// ---------- FEED ----------
const feedItems = [];

function updateFeed(docId, data, isNew) {
  if (!isNew) return;

  feedItems.unshift({ docId, data });
  if (feedItems.length > 20) feedItems.pop();

  const list = document.getElementById('feedList');
  list.innerHTML = '';

  feedItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'feed-item';
    li.innerHTML = `
      <div class="fi-top">
        <span class="fi-animal">${item.data.emoji} ${item.data.label}</span>
        <span class="fi-time">${formatTime(item.data.timestamp?.toDate?.())}</span>
      </div>
      <div class="fi-coords">${item.data.lat.toFixed(4)}, ${item.data.lng.toFixed(4)}</div>
    `;
    li.onclick = () => map.flyTo({ center: [item.data.lng, item.data.lat], zoom: 15 });
    list.appendChild(li);
  });
}

// ---------- PROXIMITY WARNING ----------
function checkProximityWarning(data) {
  if (!userLocation) return;

  const dist = haversineM(
    userLocation.lat, userLocation.lng,
    data.lat, data.lng
  );

  if (dist <= WARN_RADIUS_M) {
    showWarning(data, dist);
  }
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

// ---------- PANEL TOGGLE ----------
function togglePanel() {
  document.getElementById('panel').classList.toggle('collapsed');
}

// ---------- HELPERS ----------
function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function formatTime(date) {
  if (!date) return 'только что';
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)   return `${diff}с назад`;
  if (diff < 3600) return `${Math.floor(diff/60)}мин назад`;
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function showStatus(msg, ok) {
  const badge = document.getElementById('statusBadge');
  badge.textContent = msg;
  badge.style.color = ok ? 'var(--success)' : 'var(--danger)';
}
