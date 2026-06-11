'use strict';

// Маппинг COCO классов на наших животных
const COCO_TO_ANIMAL = {
  'cow':   { id: 'cow',   emoji: '🐄', label: 'Корова',  danger: 'high' },
  'horse': { id: 'horse', emoji: '🐎', label: 'Лошадь',  danger: 'high' },
  'sheep': { id: 'sheep', emoji: '🐑', label: 'Овца',    danger: 'medium' },
  'dog':   { id: 'dog',   emoji: '🐕', label: 'Собака',  danger: 'medium' },
  'cat':   { id: 'dog',   emoji: '🐈', label: 'Кошка',   danger: 'medium' },
  'bird':  { id: 'other', emoji: '🐦', label: 'Птица',   danger: 'medium' },
  'elephant': { id: 'other', emoji: '🐘', label: 'Слон', danger: 'high' },
  'bear':  { id: 'other', emoji: '🐻', label: 'Медведь', danger: 'high' },
  'zebra': { id: 'other', emoji: '🦓', label: 'Зебра',   danger: 'high' },
  'giraffe': { id: 'other', emoji: '🦒', label: 'Жираф', danger: 'high' },
};

let cocoModel = null;
let cameraStream = null;
let detectionLoop = null;
let cameraActive = false;
let lastDetectedAnimal = null;
let detectionCooldown = false;
let modelLoading = false;

// ── OPEN CAMERA MODAL ──────────────────────────────────────
async function openCamera() {
  document.getElementById('cameraModal').classList.remove('hidden');
  document.getElementById('camStatus').textContent = 'Загрузка AI модели...';
  document.getElementById('camDetected').classList.add('hidden');
  document.getElementById('camConfirmBtn').disabled = true;

  await loadModel();
  await startStream();
}

// ── CLOSE CAMERA ───────────────────────────────────────────
function closeCamera() {
  stopStream();
  document.getElementById('cameraModal').classList.add('hidden');
  lastDetectedAnimal = null;
}

// ── LOAD TENSORFLOW MODEL ──────────────────────────────────
async function loadModel() {
  if (cocoModel) return;
  if (modelLoading) return;
  modelLoading = true;

  try {
    document.getElementById('camStatus').textContent = '⏳ Загрузка AI (первый раз ~10 сек)...';
    cocoModel = await cocoSsd.load();
    document.getElementById('camStatus').textContent = '✅ AI готов — наведите камеру на животное';
    console.log('COCO-SSD модель загружена');
  } catch (e) {
    console.error('Ошибка загрузки модели:', e);
    document.getElementById('camStatus').textContent = '❌ Ошибка загрузки AI модели';
  }
  modelLoading = false;
}

// ── START CAMERA STREAM ────────────────────────────────────
async function startStream() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // задняя камера на телефоне
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    });

    const video = document.getElementById('camVideo');
    video.srcObject = cameraStream;
    await video.play();

    cameraActive = true;

    if (cocoModel) {
      document.getElementById('camStatus').textContent = '✅ AI готов — наведите камеру на животное';
      startDetectionLoop();
    } else {
      // Ждём модель
      const waitModel = setInterval(() => {
        if (cocoModel) {
          clearInterval(waitModel);
          document.getElementById('camStatus').textContent = '✅ AI готов — наведите камеру на животное';
          startDetectionLoop();
        }
      }, 500);
    }

  } catch (e) {
    console.error('Камера недоступна:', e);
    document.getElementById('camStatus').textContent = '❌ Нет доступа к камере. Разрешите в браузере.';
  }
}

// ── STOP STREAM ────────────────────────────────────────────
function stopStream() {
  cameraActive = false;
  clearInterval(detectionLoop);
  detectionLoop = null;

  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
  }

  const video = document.getElementById('camVideo');
  if (video) video.srcObject = null;
}

// ── DETECTION LOOP ─────────────────────────────────────────
function startDetectionLoop() {
  if (detectionLoop) clearInterval(detectionLoop);

  detectionLoop = setInterval(async () => {
    if (!cameraActive || !cocoModel) return;

    const video = document.getElementById('camVideo');
    const canvas = document.getElementById('camCanvas');
    if (!video || video.readyState < 2) return;

    // Рисуем кадр на canvas
    const ctx = canvas.getContext('2d');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    try {
      const predictions = await cocoModel.detect(canvas);
      processPredictions(predictions, ctx, canvas);
    } catch (e) {
      console.warn('Ошибка детекции:', e);
    }
  }, 600); // каждые 600мс
}

// ── PROCESS PREDICTIONS ────────────────────────────────────
function processPredictions(predictions, ctx, canvas) {
  // Очищаем предыдущие рамки
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const video = document.getElementById('camVideo');
  ctx.drawImage(video, 0, 0);

  let foundAnimal = null;

  predictions.forEach(pred => {
    const animal = COCO_TO_ANIMAL[pred.class];
    const score = Math.round(pred.score * 100);

    // Рисуем рамку для всех объектов
    const [x, y, w, h] = pred.bbox;
    const isAnimal = !!animal;

    ctx.strokeStyle = isAnimal ? '#f5a623' : '#4a5568';
    ctx.lineWidth = isAnimal ? 3 : 1;
    ctx.strokeRect(x, y, w, h);

    // Подпись
    ctx.fillStyle = isAnimal ? '#f5a623' : '#718096';
    ctx.font = `${isAnimal ? 'bold ' : ''}${isAnimal ? 16 : 12}px Inter, sans-serif`;
    const label = animal ? `${animal.emoji} ${animal.label} ${score}%` : `${pred.class} ${score}%`;
    ctx.fillStyle = isAnimal ? 'rgba(245,166,35,0.85)' : 'rgba(74,85,104,0.7)';
    ctx.fillRect(x, y - (isAnimal ? 24 : 18), ctx.measureText(label).width + 8, isAnimal ? 24 : 18);
    ctx.fillStyle = '#fff';
    ctx.fillText(label, x + 4, y - 6);

    // Берём животное с наибольшей уверенностью
    if (isAnimal && score >= 45) {
      if (!foundAnimal || score > foundAnimal.score) {
        foundAnimal = { ...animal, score };
      }
    }
  });

  // Обновляем UI
  if (foundAnimal && !detectionCooldown) {
    lastDetectedAnimal = foundAnimal;
    showDetected(foundAnimal);
  } else if (!foundAnimal) {
    hideDetected();
    lastDetectedAnimal = null;
  }
}

// ── SHOW DETECTED ANIMAL ───────────────────────────────────
function showDetected(animal) {
  const box = document.getElementById('camDetected');
  box.classList.remove('hidden');
  document.getElementById('camDetectedEmoji').textContent = animal.emoji;
  document.getElementById('camDetectedLabel').textContent = animal.label;
  document.getElementById('camDetectedScore').textContent = `Уверенность: ${animal.score}%`;
  document.getElementById('camConfirmBtn').disabled = false;

  document.getElementById('camStatus').textContent = `🎯 Обнаружено: ${animal.emoji} ${animal.label}!`;
}

function hideDetected() {
  document.getElementById('camDetected').classList.add('hidden');
  document.getElementById('camConfirmBtn').disabled = true;
  document.getElementById('camStatus').textContent = '🔍 Ищу животных...';
}

// ── CONFIRM & PLACE MARKER ─────────────────────────────────
function confirmCameraDetection() {
  if (!lastDetectedAnimal) return;

  // Устанавливаем как выбранное животное
  selectedAnimal = lastDetectedAnimal;

  // Cooldown чтобы не ставить дважды
  detectionCooldown = true;
  setTimeout(() => { detectionCooldown = false; }, 5000);

  // Получаем местоположение и ставим метку
  if (navigator.geolocation) {
    document.getElementById('camStatus').textContent = '📡 Определяю местоположение...';
    navigator.geolocation.getCurrentPosition(pos => {
      placeReport(pos.coords.latitude, pos.coords.longitude);
      closeCamera();
      showCamSuccess(lastDetectedAnimal);
    }, () => {
      // Если нет GPS — используем последнее известное
      if (userLocation) {
        placeReport(userLocation.lat, userLocation.lng);
        closeCamera();
        showCamSuccess(lastDetectedAnimal);
      } else {
        alert('Не удалось определить местоположение. Разрешите геолокацию.');
      }
    }, { enableHighAccuracy: true, timeout: 8000 });
  } else {
    alert('Геолокация не поддерживается');
  }
}

// ── SUCCESS TOAST ──────────────────────────────────────────
function showCamSuccess(animal) {
  const toast = document.getElementById('camToast');
  document.getElementById('camToastText').textContent =
    `${animal.emoji} ${animal.label} отмечен на карте!`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}
