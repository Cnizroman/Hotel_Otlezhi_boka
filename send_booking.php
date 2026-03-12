<?php
// Telegram Bot credentials - ЗАМЕНИТЕ НА СВОИ!
$botToken = '8155306446:AAFhOEOiNw2Dh4dPbD1Je8XNgPzD9wutuDQ';          // Получить у @BotFather
$chatId = '1457057474';                // Узнать у @userinfobot

// Функция отправки сообщения в Telegram
function sendTelegramMessage($botToken, $chatId, $message) {
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];

    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode == 200) {
            return true;
        }
        return false;
    } else {
        $options = [
            'http' => [
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($data),
                'timeout' => 10
            ]
        ];
        $context = stream_context_create($options);
        $result = @file_get_contents($url, false, $context);
        return ($result !== false);
    }
}

// Проверка honeypot (если заполнено — это спам)
if (!empty($_POST['honeypot'])) {
    // Тихо выходим, имитируя успех, чтобы бот думал, что всё ок
    header('Location: booking.html?status=success');
    exit;
}

// Получаем и очищаем данные из формы
$name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars(trim($_POST['email'] ?? ''), ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars(trim($_POST['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$checkin = htmlspecialchars(trim($_POST['checkin'] ?? ''), ENT_QUOTES, 'UTF-8');
$checkout = htmlspecialchars(trim($_POST['checkout'] ?? ''), ENT_QUOTES, 'UTF-8');
$guests = (int)($_POST['guests'] ?? 2);
$roomType = htmlspecialchars(trim($_POST['room_type'] ?? ''), ENT_QUOTES, 'UTF-8');
$comment = htmlspecialchars(trim($_POST['comment'] ?? ''), ENT_QUOTES, 'UTF-8');

// Проверка обязательных полей
if (!$name || !$email || !$phone || !$checkin || !$checkout || !$roomType) {
    header('Location: booking.html?status=error&reason=required');
    exit;
}

// Проверка email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: booking.html?status=error&reason=email');
    exit;
}

// Дополнительная проверка телефона (минимальное кол-во цифр)
$phoneDigits = preg_replace('/\D/', '', $phone);
if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 11) {
    header('Location: booking.html?status=error&reason=phone');
    exit;
}

// Проверка дат: выезд не раньше заезда
if ($checkout <= $checkin) {
    header('Location: booking.html?status=error&reason=dates');
    exit;
}

// Маппинг типа номера
$roomTypeText = match($roomType) {
    'standard' => 'Стандарт',
    'lux'      => 'Люкс',
    'family'   => 'Семейный',
    default    => $roomType
};

// Формируем сообщение
$message = "🔔 <b>Новая заявка на бронирование</b>\n\n";
$message .= "<b>Имя:</b> $name\n";
$message .= "<b>Email:</b> $email\n";
$message .= "<b>Телефон:</b> $phone\n";
$message .= "<b>Заезд:</b> $checkin\n";
$message .= "<b>Выезд:</b> $checkout\n";
$message .= "<b>Гостей:</b> $guests\n";
$message .= "<b>Тип номера:</b> $roomTypeText\n";
if ($comment) {
    $message .= "<b>Комментарий:</b> $comment\n";
}

// Отправка
$sent = sendTelegramMessage($botToken, $chatId, $message);

if ($sent) {
    header('Location: booking.html?status=success');
} else {
    header('Location: booking.html?status=error');
}
exit;
?>