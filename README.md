# 🐄 РодАлерт — Животные на дороге

> Веб-приложение для предупреждения водителей о животных на дороге в реальном времени.  
> Стек: **Mapbox GL JS** + **Firebase Firestore** + чистый HTML/CSS/JS

---

## 🚀 Быстрый старт

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/YOUR_USERNAME/road-animal-alert.git
cd road-animal-alert
```

---

### 2. Получите ключ Mapbox

1. Зарегистрируйтесь на [mapbox.com](https://www.mapbox.com)
2. Перейдите в **Account → Tokens**
3. Скопируйте **Default public token** (начинается с `pk.eyJ1...`)

---

### 3. Создайте Firebase проект

1. Откройте [console.firebase.google.com](https://console.firebase.google.com)
2. **Создать проект** → придумайте имя → Continue
3. В боковом меню: **Firestore Database** → **Создать базу данных** → режим **Test mode**
4. Перейдите в **Project Settings** (шестерёнка) → **Ваши приложения** → **</> Web**
5. Зарегистрируйте приложение, скопируйте конфиг (`firebaseConfig`)

---

### 4. Вставьте ключи в config.js

Откройте файл `src/config.js` и замените placeholder-значения:

```js
const MAPBOX_TOKEN = 'pk.eyJ1...ВАШ_ТОКЕН...';

const FIREBASE_CONFIG = {
  apiKey:            "AIza...",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123...:web:abc..."
};
```

> ⚠️ **Не коммитьте реальные ключи!** Добавьте `src/config.js` в `.gitignore` или используйте переменные окружения.

---

### 5. Настройте правила Firestore

В Firebase Console → **Firestore Database → Rules** вставьте содержимое файла `firestore.rules`.

---

### 6. Откройте в браузере

Просто откройте `index.html` в браузере, или используйте VS Code с расширением **Live Server**:

```
Правой кнопкой на index.html → "Open with Live Server"
```

---

## 📖 Как пользоваться

| Действие | Описание |
|----------|----------|
| Выбрать животное | Нажмите на нужный значок в левой панели |
| 📍 Отметить на карте | Нажмите кнопку, затем кликните по карте |
| 📡 Моё местоположение | Автоматически определит GPS и сохранит |
| Нажать на маркер | Показывает детали: вид, время, опасность |
| Красный баннер вверху | Предупреждение если животное <500м от вас |

---

## 🏗️ Структура проекта

```
road-animal-alert/
├── index.html          # Основная страница
├── src/
│   ├── config.js       # 🔑 Ключи Mapbox и Firebase
│   ├── app.js          # Вся логика приложения
│   └── style.css       # Стили
├── firestore.rules     # Правила безопасности Firestore
├── .gitignore
└── README.md
```

---

## 🔧 Настройки (src/config.js)

```js
const WARN_RADIUS_M    = 500;   // Радиус предупреждения в метрах
const WARN_DURATION_MS = 8000;  // Как долго показывать баннер (мс)
const MARKER_EXPIRE_MIN = 60;   // Через сколько минут метка устаревает
```

---

## 📤 Деплой на GitHub Pages

```bash
# 1. Инициализируйте git (если ещё не сделали)
git init
git add .
git commit -m "Initial commit"

# 2. Создайте репозиторий на github.com и подключите
git remote add origin https://github.com/YOUR_USERNAME/road-animal-alert.git
git branch -M main
git push -u origin main

# 3. В настройках репозитория: Settings → Pages → Source: main branch
```

Сайт будет доступен по адресу: `https://YOUR_USERNAME.github.io/road-animal-alert`

---

## 🛡️ Безопасность для продакшн

- [ ] Добавьте Firebase Authentication (анонимный вход или телефон)
- [ ] Ограничьте Mapbox токен по домену (mapbox.com → Tokens → Add restrictions)
- [ ] Настройте CORS и ограничения Firestore Rules
- [ ] Добавьте модерацию меток (кнопка "Неверно" у маркера)
- [ ] Настройте Cloud Function для автоудаления старых меток

---

## 📦 Используемые технологии

- [Mapbox GL JS v3](https://docs.mapbox.com/mapbox-gl-js/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- Google Fonts: Oswald + Inter

---

*Сделано с ❤️ для безопасности на дорогах*
