function navigateTo(section) {
    alert(`Navigating to: ${section}`);
    // Реальный функционал можно добавить, например, через:
    // window.location.href = `/${section}.html`;
}

// Получаем элементы для переключения форм
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Функция для отслеживания прокрутки и добавления класса для анимации
const fadeInElements = document.querySelectorAll('.fade-in');

// Добавим обработчик событий для прокрутки
window.addEventListener('scroll', checkVisibility);

// Запустим проверку сразу после загрузки страницы
document.addEventListener('DOMContentLoaded', checkVisibility);

// Получаем элементы для кнопок Facebook
const facebookLoginBtn = document.getElementById('facebook-login');
const facebookRegisterBtn = document.getElementById('facebook-register');

// Добавляем слушатели событий для кнопок
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Инициализация Facebook SDK
window.fbAsyncInit = function() {
    try {
        FB.init({
            appId      : '4742485145976984', // Замените на ваш реальный App ID Facebook
            cookie     : true,
            xfbml      : true,
            version    : 'v21.0'
        });

        // Логируем страницу
        FB.AppEvents.logPageView();

        // Добавляем возможность входа через Facebook
        facebookLoginBtn.addEventListener('click', function() {
            FB.login(function(response) {
                if (response.authResponse) {
                    console.log('Авторизация успешна');
                    // Получение данных пользователя
                    FB.api('/me', function(response) {
                        console.log('Добро пожаловать, ' + response.name);
                        // Здесь можно передать данные на сервер для входа или создания сессии.
                    });
                } else {
                    console.log('Пользователь отменил авторизацию');
                    alert('Не удалось авторизоваться через Facebook. Пожалуйста, попробуйте снова.');
                    window.location.href = '/';  // Перенаправляем на главную страницу
                }
            });
        });

        // Добавляем возможность регистрации через Facebook
        facebookRegisterBtn.addEventListener('click', function() {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    // Пользователь успешно зарегистрирован через Facebook
                    alert('Successfully registered with Facebook!');
                    // Здесь можно создать аккаунт на вашем сайте с использованием данных из Facebook
                    FB.api('/me?fields=id,name,email', function(userData) {
                        console.log('User data: ', userData);
                        // Вы можете использовать данные пользователя, например:
                        // Отправить запрос на сервер для создания аккаунта.
                    });
                } else {
                    // Пользователь отказался от регистрации
                    alert('Facebook registration failed or canceled.');
                    window.location.href = '/';  // Перенаправляем на главную страницу
                }
            }, {scope: 'public_profile,email'});
        });
    } catch (error) {
        console.error('Ошибка при инициализации Facebook SDK:', error);
        alert('Ошибка при подключении к Facebook. Пожалуйста, попробуйте позже.');
        window.location.href = '/';  // Перенаправляем на главную страницу
    }
};

// Загружаем SDK Facebook асинхронно
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');
