'use strict';

const COCO_TO_ANIMAL = {
  'cow':      { id: 'cow',   emoji: '🐄', label: 'Корова',  danger: 'high' },
  'horse':    { id: 'horse', emoji: '🐎', label: 'Лошадь',  danger: 'high' },
  'sheep':    { id: 'sheep', emoji: '🐑', label: 'Овца',    danger: 'medium' },
  'dog':      { id: 'dog',   emoji: '🐕', label: 'Собака',  danger: 'medium' },
  'cat':      { id: 'other', emoji: '🐈', label: 'Кошка',   danger: 'medium' },
  'bird':     { id: 'other', emoji: '🐦', label: 'Птица',   danger: 'medium' },
  'elephant': { id: 'other', emoji: '🐘', label: 'Слон',    danger: 'high' },
  'bear':     { id: 'other', emoji: '🐻', label: 'Медведь', danger: 'high' },
  'zebra':    { id: 'other', emoji: '🦓', label: 'Зебра',   danger: 'high' },
  'giraffe':  { id: 'other', emoji: '🦒', label: 'Жираф',   danger: 'high' },
};

let cocoModel = null;
let cameraStream = null;
let cameraActive = false;
let modelLoading = false;
let animFrameId = null;

// Авто-метка: кулдаун чтобы не спамить одно животное
let lastAutoPlace = {};   // { animalId: timestamp }
const AUTO_COOLDOWN_MS = 10000; // 10 секунд между метками одного вида

// Для плавного рисования — отдельный offscreen canvas для AI
let offCanvas = null;
let offCtx = null;
let lastPredictions = [];
let detectingNow = false;
const DETECT_EVERY_MS = 1200; // AI запускаем раз в 1.2 сек
let lastDetectTime = 0;

// ── OPEN ───────────────────────────────────────────────────
async function openCamera() {
  document.getElementById('cameraModal').classList.remove('hidden');
  setStatus('⏳ Загрузка AI модели...');

  await startStream();   // сначала камера — юзер видит картинку
  loadModel();           // модель грузим параллельно
}

// ── CLOSE ──────────────────────────────────────────────────
function closeCamera() {
  cameraActive = false;
  if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  const v = document.getElementById('camVideo');
  if (v) v.srcObject = null;
  document.getElementById('cameraModal').classList.add('hidden');
}

// ── LOAD MODEL ─────────────────────────────────────────────
async function loadModel() {
  if (cocoModel || modelLoading) return;
  modelLoading = true;
  try {
    cocoModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' }); // лёгкая версия!
    setStatus('✅ AI готов — наведите камеру на животное');
    console.log('COCO-SSD lite загружен');
  } catch (e) {
    setStatus('❌ Ошибка загрузки AI');
    console.error(e);
  }
  modelLoading = false;
}

// ── START STREAM ───────────────────────────────────────────
async function startStream() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width:  { ideal: 480 },   // меньше разрешение = меньше лагов
        height: { ideal: 360 },
        frameRate: { ideal: 25 },
      },
      audio: false,
    });

    const video = document.getElementById('camVideo');
    video.srcObject = cameraStream;
    await video.play();

    // Offscreen canvas для AI (маленький)
    offCanvas = document.createElement('canvas');
    offCanvas.width  = 320;
    offCanvas.height = 240;
    offCtx = offCanvas.getContext('2d');

    cameraActive = true;
    setStatus('📷 Камера готова — загружаю AI...');
    renderLoop();

  } catch (e) {
    setStatus('❌ Нет доступа к камере. Разрешите в браузере.');
    console.error(e);
  }
}

// ── RENDER LOOP (requestAnimationFrame — плавно!) ──────────
function renderLoop() {
  if (!cameraActive) return;

  const video  = document.getElementById('camVideo');
  const canvas = document.getElementById('camCanvas');
  if (!video || !canvas || video.readyState < 2) {
    animFrameId = requestAnimationFrame(renderLoop);
    return;
  }

  const ctx = canvas.getContext('2d');
  canvas.width  = video.videoWidth  || 480;
  canvas.height = video.videoHeight || 360;

  // 1. Рисуем видео
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 2. Рисуем последние рамки (из предыдущей детекции)
  drawBoxes(ctx, lastPredictions, canvas.width, canvas.height);

  // 3. Запускаем AI не каждый кадр, а раз в DETECT_EVERY_MS
  const now = performance.now();
  if (cocoModel && !detectingNow && (now - lastDetectTime) > DETECT_EVERY_MS) {
    lastDetectTime = now;
    runDetection(video);
  }

  animFrameId = requestAnimationFrame(renderLoop);
}

// ── RUN AI DETECTION (асинхронно, не блокирует рендер) ─────
async function runDetection(video) {
  if (!cocoModel || detectingNow) return;
  detectingNow = true;

  try {
    // Рисуем уменьшенный кадр в offscreen canvas
    offCtx.drawImage(video, 0, 0, offCanvas.width, offCanvas.height);
    const predictions = await cocoModel.detect(offCanvas);
    lastPredictions = predictions;
    processAutoPlace(predictions);
  } catch (e) {
    // тихо игнорируем ошибки детекции
  }

  detectingNow = false;
}

// ── DRAW BOXES ─────────────────────────────────────────────
function drawBoxes(ctx, predictions, W, H) {
  if (!predictions.length) return;

  // Масштаб от offscreen (320x240) к реальному canvas
  const scaleX = W / 320;
  const scaleY = H / 240;

  predictions.forEach(pred => {
    const animal = COCO_TO_ANIMAL[pred.class];
    const score  = Math.round(pred.score * 100);
    if (score < 40) return;

    const [x, y, w, h] = pred.bbox;
    const rx = x * scaleX, ry = y * scaleY;
    const rw = w * scaleX, rh = h * scaleY;

    const isAnimal = !!animal;
    const color = isAnimal ? '#f5a623' : 'rgba(120,130,150,0.6)';

    // Рамка
    ctx.strokeStyle = color;
    ctx.lineWidth   = isAnimal ? 3 : 1;
    ctx.strokeRect(rx, ry, rw, rh);

    if (!isAnimal) return;

    // Бейдж
    const label = `${animal.emoji} ${animal.label} ${score}%`;
    ctx.font = 'bold 15px Inter, sans-serif';
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(245,166,35,0.88)';
    ctx.fillRect(rx, ry - 24, tw + 10, 24);
    ctx.fillStyle = '#000';
    ctx.fillText(label, rx + 5, ry - 6);

    // Угловые акценты
    const cs = 16;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    [[rx,ry],[rx+rw,ry],[rx,ry+rh],[rx+rw,ry+rh]].forEach(([cx,cy]) => {
      const dx = cx === rx ? 1 : -1;
      const dy = cy === ry ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(cx + dx*cs, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + dy*cs);
      ctx.stroke();
    });
  });
}

// ── AUTO PLACE (без подтверждения!) ───────────────────────
function processAutoPlace(predictions) {
  predictions.forEach(pred => {
    const animal = COCO_TO_ANIMAL[pred.class];
    if (!animal) return;
    const score = pred.score * 100;
    if (score < 40) return; // минимум 55% уверенности

    const now = Date.now();
    const last = lastAutoPlace[animal.id] || 0;
    if (now - last < AUTO_COOLDOWN_MS) return; // кулдаун

    // Ставим метку!
    lastAutoPlace[animal.id] = now;
    selectedAnimal = animal;

    if (userLocation) {
      placeReport(userLocation.lat, userLocation.lng);
      showAutoToast(animal, Math.round(score));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        placeReport(pos.coords.latitude, pos.coords.longitude);
        showAutoToast(animal, Math.round(score));
      }, null, { enableHighAccuracy: true, timeout: 5000 });
    }
  });
}

// ── TOAST ──────────────────────────────────────────────────
function showAutoToast(animal, score) {
  const toast = document.getElementById('camToast');
  document.getElementById('camToastText').textContent =
    `${animal.emoji} ${animal.label} (${score}%) — метка поставлена!`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
  console.log(`✅ Авто-метка: ${animal.emoji} ${animal.label} ${score}%`);
}

function setStatus(msg) {
  const el = document.getElementById('camStatus');
  if (el) el.textContent = msg;
}
