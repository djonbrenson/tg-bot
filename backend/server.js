// server.js

// Подключаем нужные модули
import express from 'express'; // Каркас для создания сервера
import cors from 'cors'; // Позволяет фронтенду общаться с бэкендом
import bodyParser from 'body-parser'; // Для чтения данных от фронтенда
import fetch from 'node-fetch'; // Для отправки запросов в Telegram API

// --- НАСТРОЙКИ: Эти два значения нужно будет добавить в переменные окружения ---
const BOT_TOKEN = process.env.BOT_TOKEN; // Токен твоего бота
const CHAT_ID = process.env.CHAT_ID;     // Твой личный ID в Telegram
// ---

const app = express();
const port = 5001; // Порт, на котором будет работать наш бэкенд

// Разрешаем нашему фронтенду (который будет на другом порту) общаться с бэкендом
app.use(cors());
// Используем bodyParser для парсинга JSON-данных из тела запроса
app.use(bodyParser.json());

// Это главная и единственная "ручка" (endpoint) нашего API
// Фронтенд будет отправлять сюда POST-запрос с данными о заказе
app.post('/shop/v1/orders/add', (req, res) => {
    console.log('Получен новый заказ:', req.body);

    const orderData = req.body;

    // --- Формируем красивое сообщение для Telegram ---
    let message = `🔔 *Новый заказ!*\n\n`;
    message += `*Клиент:*\n`;
    message += `Имя: ${orderData.customer?.first_name || 'Не указано'}\n`;
    message += `Фамилия: ${orderData.customer?.last_name || 'Не указано'}\n`;
    message += `Телефон: \`${orderData.customer?.phone_number || 'Не указан'}\`\n\n`;
    message += `*Состав заказа:*\n`;

    orderData.products.forEach(item => {
        message += `  - ${item.product.name} (${item.quantity} шт.)\n`;
    });

    message += `\n*Адрес доставки:*\n`;
    message += `${orderData.address?.address || 'Не указан'}\n\n`;
    message += `*Комментарий к заказу:*\n`;
    message += `${orderData.description || 'Нет комментария'}`;
    // ---

    // URL для отправки сообщения через Telegram Bot API
    const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    // Отправляем сформированное сообщение тебе в личку
    fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown' // Используем Markdown для красивого форматирования
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Ответ от Telegram API:', data);
        // Отправляем фронтенду ответ, что всё прошло успешно
        res.status(200).json({ success: true, message: "Заказ успешно создан и отправлен." });
    })
    .catch(error => {
        console.error('Ошибка при отправке в Telegram:', error);
        res.status(500).json({ success: false, message: "Ошибка на сервере." });
    });
});

// Запускаем наш сервер
app.listen(port, () => {
    console.log(`Бэкенд-сервер запущен и слушает порт ${port}`);
});