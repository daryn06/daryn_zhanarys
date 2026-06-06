// =============================================
//  config.js — ЗАМЕНИТЕ КЛЮЧИ СВОИМИ!
//  НЕ КОММИТЬТЕ РЕАЛЬНЫЕ КЛЮЧИ В GITHUB!
// =============================================

const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN_HERE';

const FIREBASE_CONFIG = {
  apiKey:            "YOUR_FIREBASE_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// Расстояние (в метрах), при котором показывается предупреждение
const WARN_RADIUS_M = 500;

// Как долго показывать предупреждение (мс)
const WARN_DURATION_MS = 8000;

// Через сколько минут метка считается "устаревшей" и скрывается
const MARKER_EXPIRE_MIN = 60;
