# Homework 65 | Розширення функціональності сервера Express з MongoDB Atlas
Цей проект є освітнім RESTful API сервером, побудованим на Node.js та Express.js, який взаємодіє з базою даних MongoDB Atlas. Сервер надає повний набір CRUD (Create, Read, Update, Delete) операцій для керування колекцією товарів.

## Встановлення та запуск

1.  **Клонуйте репозиторій:**
    ```bash
    git clone [https://github.com/allyavorsky/homework-65.git](https://github.com/allyavorsky/homework-65.git)
    cd homework-65
    ```

2.  **Встановіть залежності:**
    ```bash
    npm install
    ```

3.  **Налаштуйте змінні середовища:**
    Створіть файл `.env` у корені проекту, скопіювавши зміст з `.env.example`, та додайте свій рядок підключення до MongoDB Atlas.
    ```
    MONGO_URI="mongodb+srv://..."
    ```

4.  **Запустіть сервер:**
    Для розробки з автоматичним перезапуском:
    ```bash
    npm run dev
    ```
    Або для звичайного запуску:
    ```bash
    npm start
    ```
    Сервер буде доступний за адресою `http://localhost:3000`.