// =============================================
//  config.js — ЗАМЕНИТЕ КЛЮЧИ СВОИМИ!
//  НЕ КОММИТЬТЕ РЕАЛЬНЫЕ КЛЮЧИ В GITHUB!
// =============================================

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGFyeW4xIiwiYSI6ImNtcGR2ZzZ4ajBoYmUydHIyaG5pd2o4cTgifQ.mo3pO5tFlskUY9gUbAdlyw';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCbCbrteNzHxtkMrXtt9jWWYsaN7hP1JiU",
  authDomain: "gps-animals.firebaseapp.com",
  databaseURL: "https://gps-animals-default-rtdb.firebaseio.com",
  projectId: "gps-animals",
  storageBucket: "gps-animals.firebasestorage.app",
  messagingSenderId: "58735998155",
  appId: "1:58735998155:web:2b3a84dfcfd1e559dd574e",
  measurementId: "G-D17DTKXKZN"
};

// Расстояние (в метрах), при котором показывается предупреждение
const WARN_RADIUS_M = 500;

// Как долго показывать предупреждение (мс)
const WARN_DURATION_MS = 8000;

// Через сколько минут метка считается "устаревшей" и скрывается
const MARKER_EXPIRE_MIN = 60;
