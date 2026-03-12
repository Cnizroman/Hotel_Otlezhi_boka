document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт отеля "Отлежи Бока" загружен');

    // ===== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ =====
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });

    // ===== ГАМБУРГЕР МЕНЮ =====
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        // Закрыть меню при клике на ссылку
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });

        // Закрыть при клике вне меню (опционально)
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    }

    // ===== ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА (i18n) =====
    const translations = {
        ru: {
            'logo_alt': 'Отлежи Бока',
            'nav_home': 'Главная',
            'nav_rooms': 'Номера',
            'nav_booking': 'Бронирование',
            'nav_contacts': 'Контакты',
            'footer_copyright': '© 2026 Отель «Отлежи Бока». Все права защищены.',
            'footer_support': 'создано при поддержке <a href="https://cnizroman.github.io/otkusi.babla/" target="_blank">Откуси Бабла</a> | При оплате картой банка — скидка 30%',
            'footer_small': 'Сайт для настоящего отдыха',
            'hero_title': 'Отель «Отлежи Бока»',
            'hero_subtitle': '«Не беспокойтесь, вы точно не уйдёте без желания вернуться»',
            'hero_btn': 'Забронировать сейчас',
            'features_title': 'Почему выбирают именно нас',
            'feature_1_title': '✨ Мгновенное заселение',
            'feature_1_text': 'Быстрее, чем вы скажете «Отлежи бока». Даже если вы приехали в 3 ночи после бурной вечеринки — мы уже на месте и с улыбкой.',
            'feature_2_title': '🎓 Для студентов и молодежи',
            'feature_2_text': 'Специальные цены, чтобы хватило на такси обратно. Никаких справок о доходах, только паспорт и хорошее настроение.',
            'feature_3_title': '🔒 Полная безопасность',
            'feature_3_text': 'Круглосуточная охрана и видеонаблюдение. Мы не кусаемся (в отличие от соседской собаки).',
            'feature_4_title': '☕ Поддержка 24/7',
            'feature_4_text': 'Разбудите нас хоть ночью — решим любой вопрос. Даже если вы просто хотите поговорить.',
            'stat_1_label': 'Гостей возвращаются',
            'stat_2_label': 'минут до центра',
            'stat_3_label': 'уютных номеров',
            'stat_4_label': 'часа работаем для вас',
            'app_title': 'Попробуйте наше новое приложение!',
            'app_text': 'Скачайте и бронируйте номера со скидкой до 20% — мы не кусаемся, а даём выгоду.',
            'app_btn': 'Скачать приложение',
            'rooms_header_title': 'Наши номера',
            'rooms_header_sub': 'Выберите идеальное место для своего отдыха',
            'room_standard_title': 'Стандарт',
            'room_standard_desc': '🛏️ Уютный номер для одного или двоих. Всё необходимое для комфортного отдыха. Wi-Fi, кондиционер, душ.',
            'room_standard_price': 'от 3 000 ₽/сутки',
            'room_lux_title': 'Люкс',
            'room_lux_desc': '🏛️ Просторный номер с гостиной зоной и панорамным видом на город. Джакузи, мини-бар, халат и тапочки.',
            'room_lux_price': 'от 5 500 ₽/сутки',
            'room_family_title': 'Семейный',
            'room_family_desc': '👨‍👩‍👧 Две смежные комнаты для отдыха с детьми. Есть детская кроватка, игрушки и безопасные розетки.',
            'room_family_price': 'от 4 800 ₽/сутки',
            'room_btn': 'Забронировать',
            'amenities_title': 'Всё для вашего комфорта',
            'amenity_1_title': 'Удобные душевые',
            'amenity_1_text': 'Просторные кабины, круглосуточная горячая вода, премиальная косметика и мягкие полотенца.',
            'amenity_2_title': 'Ванны премиум-класса',
            'amenity_2_text': 'В некоторых номерах — отдельные ванны, чтобы расслабиться после долгого дня.',
            'amenity_3_title': 'Просторный холл с кафетерием',
            'amenity_3_text': 'Уютное пространство, где можно выпить ароматный кофе, поработать или встретиться с друзьями.',
            'amenity_4_title': 'Конференц-зал',
            'amenity_4_text': 'Оборудованный зал для деловых встреч, переговоров и мероприятий. Всё необходимое включено.',
            'amenity_5_title': 'Мелочи для приятного отдыха',
            'amenity_5_text': 'Халаты, тапочки, зубные наборы, чай/кофе в номере — мы позаботились о деталях.',
            'booking_header_title': 'Забронировать номер',
            'booking_header_sub': 'Заполните форму — мы свяжемся с вами в ближайшее время',
            'form_name_label': 'Ваше ФИО *',
            'form_name_placeholder': 'ФИО',
            'form_email_label': 'Email *',
            'form_email_placeholder': 'ivan@example.com',
            'form_phone_label': 'Телефон *',
            'form_phone_placeholder': '+7 (999) 123-45-67',
            'form_guests_label': 'Гостей',
            'form_checkin_label': 'Заезд *',
            'form_checkout_label': 'Выезд *',
            'form_room_label': 'Тип номера *',
            'form_room_option_default': 'Выберите номер',
            'form_room_option_standard': 'Стандарт',
            'form_room_option_lux': 'Люкс',
            'form_room_option_family': 'Семейный',
            'form_comment_label': 'Комментарий',
            'form_comment_placeholder': 'Хочу номер с видом на закат и бутылку шампанского...',
            'submit_btn': 'Отправить заявку',
            'loading_text': 'Отправка заявки...',
            'contacts_header_title': 'Контакты',
            'contacts_header_sub': 'Всегда рады видеть вас!',
            'contacts_address_label': '📍 Адрес:',
            'contacts_address': 'г. Красноярск, ул. Сергея Лазо, д. 21',
            'contacts_phone_label': '📞 Телефон:',
            'contacts_phone': '+7 (995) 074-32-24',
            'contacts_email_label': '✉️ Email:',
            'contacts_email': 'info@otlezhiboka.ru',
            'contacts_hours_label': '⏰ Часы работы:',
            'contacts_hours': 'Заезд — когда хотите, выезд — когда проснётесь.',
            'contacts_btn': '🚗 Проложить маршрут',
            'error_name_required': 'Укажите имя',
            'error_email_invalid': 'Укажите корректный email',
            'error_phone_length': 'Телефон должен содержать 10-11 цифр',
            'error_checkin_required': 'Выберите дату заезда',
            'error_checkout_required': 'Выберите дату выезда',
            'error_dates_order': 'Дата выезда должна быть позже даты заезда',
            'error_room_required': 'Выберите тип номера',
            'success_message': '✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
            'error_send': '❌ Ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.',
            'submitting': 'Отправляем...',
        },
        en: {
            'logo_alt': 'Otlezhi Boka',
            'nav_home': 'Home',
            'nav_rooms': 'Rooms',
            'nav_booking': 'Booking',
            'nav_contacts': 'Contacts',
            'footer_copyright': '© 2026 Hotel "Otlezhi Boka". All rights reserved.',
            'footer_support': 'created with support of <a href="https://cnizroman.github.io/otkusi.babla/" target="_blank">Otkusi Babla</a> | 30% discount when paying with bank card',
            'footer_small': 'Website for a real rest',
            'hero_title': 'Hotel "Otzhegi Boka"',
            'hero_subtitle': '"Don\'t worry, you definitely won\'t leave without wanting to come back"',
            'hero_btn': 'Book now',
            'features_title': 'Why choose us',
            'feature_1_title': '✨ Instant check-in',
            'feature_1_text': 'Faster than you can say "Otlezhi boka". Even if you arrive at 3 am after a wild party — we are already there with a smile.',
            'feature_2_title': '🎓 For students and youth',
            'feature_2_text': 'Special prices so you have enough for a taxi back. No income statements, just passport and good mood.',
            'feature_3_title': '🔒 Full security',
            'feature_3_text': '24/7 security and video surveillance. We don\'t bite (unlike the neighbor\'s dog).',
            'feature_4_title': '☕ 24/7 support',
            'feature_4_text': 'Wake us up even at night — we\'ll solve any issue. Even if you just want to talk.',
            'stat_1_label': 'Guests return',
            'stat_2_label': 'minutes to center',
            'stat_3_label': 'cozy rooms',
            'stat_4_label': 'hours we work for you',
            'app_title': 'Try our new app!',
            'app_text': 'Download and book rooms with up to 20% discount — we don\'t bite, we give benefits.',
            'app_btn': 'Download app',
            'rooms_header_title': 'Our Rooms',
            'rooms_header_sub': 'Choose the perfect place for your stay',
            'room_standard_title': 'Standard',
            'room_standard_desc': '🛏️ Cozy room for one or two. Everything you need for a comfortable stay. Wi-Fi, air conditioning, shower.',
            'room_standard_price': 'from 3,000 RUB/night',
            'room_lux_title': 'Luxury',
            'room_lux_desc': '🏛️ Spacious room with living area and panoramic city view. Jacuzzi, mini-bar, bathrobe and slippers.',
            'room_lux_price': 'from 5,500 RUB/night',
            'room_family_title': 'Family',
            'room_family_desc': '👨‍👩‍👧 Two adjoining rooms for a family with children. Baby cot, toys and safe sockets.',
            'room_family_price': 'from 4,800 RUB/night',
            'room_btn': 'Book',
            'amenities_title': 'Everything for your comfort',
            'amenity_1_title': 'Comfortable showers',
            'amenity_1_text': 'Spacious cabins, 24/7 hot water, premium cosmetics and soft towels.',
            'amenity_2_title': 'Premium bathtubs',
            'amenity_2_text': 'Some rooms have private bathtubs to relax after a long day.',
            'amenity_3_title': 'Spacious hall with cafeteria',
            'amenity_3_text': 'Cozy space where you can have aromatic coffee, work or meet friends.',
            'amenity_4_title': 'Conference hall',
            'amenity_4_text': 'Equipped hall for business meetings, negotiations and events. Everything included.',
            'amenity_5_title': 'Little things for a pleasant stay',
            'amenity_5_text': 'Bathrobes, slippers, toothbrushes, tea/coffee in the room — we take care of details.',
            'booking_header_title': 'Book a room',
            'booking_header_sub': 'Fill out the form — we will contact you shortly',
            'form_name_label': 'Full name *',
            'form_name_placeholder': 'Full name',
            'form_email_label': 'Email *',
            'form_email_placeholder': 'ivan@example.com',
            'form_phone_label': 'Phone *',
            'form_phone_placeholder': '+7 (999) 123-45-67',
            'form_guests_label': 'Guests',
            'form_checkin_label': 'Check-in *',
            'form_checkout_label': 'Check-out *',
            'form_room_label': 'Room type *',
            'form_room_option_default': 'Choose room',
            'form_room_option_standard': 'Standard',
            'form_room_option_lux': 'Luxury',
            'form_room_option_family': 'Family',
            'form_comment_label': 'Comment',
            'form_comment_placeholder': 'I want a room with a sunset view and a bottle of champagne...',
            'submit_btn': 'Submit request',
            'loading_text': 'Sending request...',
            'contacts_header_title': 'Contacts',
            'contacts_header_sub': 'Always glad to see you!',
            'contacts_address_label': '📍 Address:',
            'contacts_address': 'Krasnoyarsk, Sergey Lazo str., 21',
            'contacts_phone_label': '📞 Phone:',
            'contacts_phone': '+7 (995) 074-32-24',
            'contacts_email_label': '✉️ Email:',
            'contacts_email': 'info@otlezhiboka.ru',
            'contacts_hours_label': '⏰ Opening hours:',
            'contacts_hours': 'Check-in — whenever you want, check-out — when you wake up.',
            'contacts_btn': '🚗 Get directions',
            'error_name_required': 'Name is required',
            'error_email_invalid': 'Enter a valid email',
            'error_phone_length': 'Phone must contain 10-11 digits',
            'error_checkin_required': 'Select check-in date',
            'error_checkout_required': 'Select check-out date',
            'error_dates_order': 'Check-out date must be after check-in date',
            'error_room_required': 'Select room type',
            'success_message': '✅ Request sent successfully! We will contact you soon.',
            'error_send': '❌ Error sending. Please try again later or contact us by phone.',
            'submitting': 'Sending...',
        }
    };

    let currentLang = localStorage.getItem('lang') || 'ru';

    window.t = function(key) {
        return translations[currentLang][key] || translations['ru'][key] || key;
    };

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        document.getElementById('lang-ru').classList.toggle('active', lang === 'ru');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.innerText = t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = t(key);
        });

        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
            const key = el.getAttribute('data-i18n-alt');
            el.alt = t(key);
        });

        document.querySelectorAll('[data-i18n-value]').forEach(el => {
            const key = el.getAttribute('data-i18n-value');
            el.value = t(key);
        });

        document.querySelectorAll('option[data-i18n]').forEach(opt => {
            const key = opt.getAttribute('data-i18n');
            opt.textContent = t(key);
        });

        const footerCopyright = document.querySelector('footer p:first-child');
        if (footerCopyright && footerCopyright.hasAttribute('data-i18n-html')) {
            footerCopyright.innerHTML = t(footerCopyright.getAttribute('data-i18n-html'));
        }
        const supportPara = document.querySelector('.support');
        if (supportPara && supportPara.hasAttribute('data-i18n-html')) {
            supportPara.innerHTML = t(supportPara.getAttribute('data-i18n-html'));
        }

        const msgDiv = document.getElementById('form-message');
        if (msgDiv && msgDiv.innerText) {
            msgDiv.innerHTML = '';
            msgDiv.className = 'form-message';
        }

        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn && !submitBtn.disabled) {
            submitBtn.textContent = t('submit_btn');
        }

        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            const p = loadingIndicator.querySelector('p');
            if (p) p.textContent = t('loading_text');
        }
    }

    document.getElementById('lang-ru').addEventListener('click', () => applyLanguage('ru'));
    document.getElementById('lang-en').addEventListener('click', () => applyLanguage('en'));

    applyLanguage(currentLang);

    // ===== ЛАЙТБОКС =====
    if (!document.getElementById('lightbox-modal')) {
        const modalHTML = `
            <div id="lightbox-modal" class="lightbox-modal">
                <span class="lightbox-close">&times;</span>
                <img id="lightbox-image" src="" alt="">
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.lightbox-close');

    function openLightbox(src) {
        modal.classList.add('show');
        modalImg.src = src;
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });

    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.addEventListener('click', function() {
            openLightbox(this.src);
        });
    }

    document.querySelectorAll('.lightbox-trigger').forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src);
        });
    });

    // ===== АНИМАЦИЯ СТАТИСТИКИ =====
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        let animated = false;
        let animationTimer = null;

        function animateStats() {
            let allFinished = true;

            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (isNaN(target)) return;

                let current = parseInt(stat.innerText) || 0;

                if (current < target) {
                    allFinished = false;
                    let increment = Math.ceil((target - current) / 100);
                    if (increment < 1) increment = 1;

                    let newVal = current + increment;
                    if (newVal > target) newVal = target;
                    stat.innerText = newVal;
                } else {
                    stat.innerText = target;
                }
            });

            if (!allFinished) {
                animationTimer = setTimeout(animateStats, 200);
            } else {
                if (animationTimer) {
                    clearTimeout(animationTimer);
                    animationTimer = null;
                }
            }
        }

        function checkVisibility() {
            if (animated) return;

            const statsSection = document.querySelector('.stats');
            if (!statsSection) return;

            const rect = statsSection.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            if (rect.top <= windowHeight - 100) {
                animated = true;
                animateStats();
            }
        }

        window.addEventListener('scroll', checkVisibility);
        checkVisibility();
    }
});

