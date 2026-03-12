document.addEventListener('DOMContentLoaded', function() {
    // ========== КОНФИГУРАЦИЯ TELEGRAM БОТА ==========
    const TELEGRAM_BOT_TOKEN = '8155306446:AAFhOEOiNw2Dh4dPbD1Je8XNgPzD9wutuDQ';  // Замените на свой
    const TELEGRAM_CHAT_ID = '1457057474';       // Замените на свой
    // ===============================================

    const urlParams = new URLSearchParams(window.location.search);
    const messageDiv = document.getElementById('form-message');
    let isSubmitting = false; // защита от повторной отправки

    // Предзаполнение типа номера из URL
    const roomParam = urlParams.get('room');
    if (roomParam) {
        const select = document.getElementById('room_type');
        if (select) {
            for (let option of select.options) {
                if (option.value === roomParam) {
                    option.selected = true;
                    break;
                }
            }
        }
    }

    // Валидация дат
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    if (checkinInput && checkoutInput) {
        const today = new Date().toISOString().split('T')[0];
        checkinInput.setAttribute('min', today);

        checkinInput.addEventListener('change', function() {
            checkoutInput.min = checkinInput.value;
            if (checkoutInput.value && checkoutInput.value < checkinInput.value) {
                checkoutInput.value = '';
            }
        });
    }

    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+' + x[1] + ' (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    }

    // Функция отправки текстового сообщения в Telegram
    async function sendToTelegram(formData) {
        const productNames = {
            'standard': 'Стандарт',
            'lux': 'Люкс',
            'family': 'Семейный'
        };

        const message = `
🔔 <b>Новая заявка на бронирование</b>

👤 <b>Имя:</b> ${formData.name}
📧 <b>Email:</b> ${formData.email}
📞 <b>Телефон:</b> ${formData.phone}
📅 <b>Заезд:</b> ${formData.checkin}
📅 <b>Выезд:</b> ${formData.checkout}
👥 <b>Гостей:</b> ${formData.guests}
🏨 <b>Тип номера:</b> ${productNames[formData.roomType] || formData.roomType}
💬 <b>Комментарий:</b> ${formData.comment || 'нет'}
⏰ <b>Время отправки:</b> ${new Date().toLocaleString('ru-RU')}
        `.trim();

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        if (!result.ok) {
            throw new Error(result.description || 'Ошибка отправки сообщения');
        }
        return result;
    }

    // Обработчик отправки формы
    const form = document.getElementById('bookingForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingIndicator = document.getElementById('loading-indicator'); // нужно добавить в HTML

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Защита от повторной отправки
        if (isSubmitting) return;

        // Сброс сообщений
        messageDiv.innerHTML = '';
        messageDiv.className = 'form-message';
        // Сброс подсветки
        document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
            el.style.borderColor = '';
        });

        let errors = [];
        let errorFields = [];

        // --- Валидация ---
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            errors.push('Укажите имя');
            errorFields.push(name);
        }

        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            errors.push('Укажите корректный email');
            errorFields.push(email);
        }

        const phone = document.getElementById('phone');
        const phoneDigits = phone.value.replace(/\D/g, '');
        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
            errors.push('Телефон должен содержать 10-11 цифр');
            errorFields.push(phone);
        }

        const checkin = document.getElementById('checkin');
        const checkout = document.getElementById('checkout');
        if (!checkin.value) {
            errors.push('Выберите дату заезда');
            errorFields.push(checkin);
        }
        if (!checkout.value) {
            errors.push('Выберите дату выезда');
            errorFields.push(checkout);
        }
        if (checkin.value && checkout.value && checkout.value <= checkin.value) {
            errors.push('Дата выезда должна быть позже даты заезда');
            errorFields.push(checkout);
        }

        const roomType = document.getElementById('room_type');
        if (!roomType.value) {
            errors.push('Выберите тип номера');
            errorFields.push(roomType);
        }

        const guests = document.getElementById('guests');

        const comment = document.getElementById('comment');

        // Если есть ошибки
        if (errors.length > 0) {
            messageDiv.innerHTML = errors.join('<br>');
            messageDiv.className = 'form-message error';
            errorFields.forEach(el => {
                el.style.borderColor = 'red';
            });
            return;
        }

        // --- Отправка в Telegram ---
        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляем...';

        // Показываем индикатор загрузки (если есть)
        if (loadingIndicator) loadingIndicator.style.display = 'block';

        try {
            const formData = {
                name: name.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                checkin: checkin.value,
                checkout: checkout.value,
                guests: guests.value,
                roomType: roomType.value,
                comment: comment.value.trim()
            };

            await sendToTelegram(formData);

            // Успех
            messageDiv.innerHTML = '✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
            messageDiv.className = 'form-message success';
            form.reset(); // очищаем форму

            // Сброс подсветки
            document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
                el.style.borderColor = '';
            });

        } catch (error) {
            console.error('Ошибка отправки:', error);
            messageDiv.innerHTML = '❌ Ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.';
            messageDiv.className = 'form-message error';
        } finally {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        }
    });
});