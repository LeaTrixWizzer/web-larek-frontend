# Проектная работа "Веб-ларек"

## Оглавление

- [Описание проекта](#описание-проекта)
- [Установка и запуск](#установка-и-запуск)
- [Сборка](#сборка)
- [Архитектура проекта](#архитектура-проекта)
- [Слой Model](#слой-model)
- [Слой View](#слой-view)
- [Слой Presenter](#слой-presenter)
- [Ключевые типы данных](#ключевые-типы-данных)
- [Размещение в сети](#размещение-в-сети)

## Описание проекта

Проект "Веб-ларек" реализует пример интернет-магазина с товарами для веб-разработчиков. Пользователь может просматривать каталог товаров, выбирать и добавить товары в корзину, так же оформить заказ.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура проекта

В проекте применен принцип MVP (Model-View-Presenter), который обеспечивает четкое разделение ответственностей между классами Model и View каждый класс выполняет свою определенную роль:

- Model - работает с данными, проводит вычисления и руководит всеми бизнес-процессами. получение, обновление и удаление данных;
- View - показывает пользователю интерфейс и данные из модели. Отображение данных, обработка нажатий кнопок, заполнения/отправка форма, а также их валидация;
- Presenter - служит прослойкой между моделью и видом. Обработчик событий;

## Слой Model

### Класс Model

Абстрактный класс, который используется для создания объекта хранения данных.

Конструктор:

- `data: Partial<T>` - Копия свойств объекта с данными, переданного в конструктор;
- `protected events: IEvents` - Защищеный аргумент экземпляра класса EventEmitter;

Методы:

- `emitChanges(event: string, payload?: object) {}` - Уведомляет о изменении модели;

### Класс AppData

Класс отвечает за состояние данных приложения. Класс наследуется от абстрактного класса Model.

Свойства:

- `basket: IProduct[] = []` - Защищенный ккаталог с купленными товарами;
- `catalog: IProduct[]` - Защищенный массив каточек товара;
- `order: IOrder = {}` - Данные для отправки на сервер;
- `formErrors: IFormError = {}` - Защищенные данные ошибок заполнения форм;

Методы:

- `setCatalog(items: IProduct[]) {}` - Установить каталог с товарами;
- `addProduct(item: IProduct)` - Добавить id товара в заказ;
- `removeProduct(item: IProduct)` — Удалить id товара из заказа;
- `addToBasket(item: IProduct) {}` — Добавить данные продуктов в корзине;
- `deleteFromBasket(item: IProduct) {}` — Удалить данные продуктов в корзине;
- `clearBasket() {}` - Очистить корзину;
- `validateAddress() {}` - Проверить корректность заполнения формы заказа;
- `validateContacts() {}` - Проверить корректность заполнения формы контактов;
- `setOrderData(field: keyof OrderForm, value: string) {}` - Установить значений в объекте заказа и валидации введенных данных;
- `selectedProduct(item: IProduct) {}` -  Поверяет наличие переданного товара в корзине;
- `getTotalAmount() {}` — Получить общую сумму стоимость товаров в корзине;

## Слой View

### Класс Component

Абстрактный класс обеспечивает работу с DOM. Его функции - устанавливать данные в компонентах и отображать их.

Конструктор:

- `protected readonly container: HTMLElement` - Принимает корневой DOM-элемент, в котором будет размещен компонент;

Методы:

- `toggleClass(element: HTMLElement, className: string, force?: boolean) {}` - Переключить класс;
- `protected setText (element: HTMLElement, value: unknown) {}` - Установить текстовое содержимое;
- `setDisabled(element: HTMLElement, state: boolean) {}` - Сменить статус блокировки;
- `protected setHidden (element: HTMLElement) {}` - Скрыть компонент;
- `protected setVisible (element: HTMLElement) {}` - Показать компонент;
- `setImage (element: HTMLImageElement, src: string, alt?: string) {}` - Установить изображение;
- `render(data? : Partial <T>) : HTMLElement {}` - Метод рендеринга элемента;

### Класс Modal

Наследуется от абстрактного класса Component. Реализует модальное окно. Предоставляет методы для управления состоянием окна и генерации событий.

Свойства:

- `protected _closeButton: HTMLButtonElement` - Защищенная кнопка закрытия модального окна;
- `protected _content: HTMLElement` - Защищенный контент, выводящийся в модальном окне;

Конструктор:

- `container: HTMLElement` - Принимает в себя родительский контейнер;
- `protected events: IEvents` - Защищеный аргумент экземпляра класса EventEmitter;

Методы:

- `set content(value: HTMLElement) {}` — Установить контент внутри модального окна;
- `clickEscape = (evt: KeyboardEvent) => {}` — Закрыть модальное окно на клавишу ESCAPE;
- `open() {}` — Открыть модальное окно;
- `close() {}` — Закрыть модальное окно;
- `render(data: IModalData): HTMLElement {}` — Метод рендеринга элемента;

### Класс Form

Общий класс для работы с формами. Наследуется от класса Component. Отвечает за установку ошибок при заполнении формы, блокировку кнопки сабмита, если форма не валидна, и отрисовку самой формы.

Класс является дженериком и принимает в переменной T тип и состав данных, какие мы хотим получить на вход.

Свойства:

- `protected _submit: HTMLButtonElement` - Защищенная кнопка подтверждения формы;
- `protected _errors: HTMLElement` - Защищенный элемент для отображения ошибок формы;

Конструктор:

- `protected container: HTMLFormElement` - Принимает в себя родительский контейнер;
- `protected events: IEvents` - Защищеный аргумент экземпляра класса EventEmitter;

Методы:

- `protected onInputChange(field: keyof T, value: string) {}` - Обработать изменения ввода пользователем.
- `set errors(value: string) {}` — Установить ошибки при отсутствии заполненных полей;
- `set valid(value: boolean) {}` — Проверить корректность заполнения формы;
- `render(state: Partial<T> & IFormState) {}` — Метод рендеринга элемента;

### Класс Page

Компонент для отображения и изменения контента страницы.

Свойства:

- `protected _counter: HTMLElement` - Защищенная счетчик товаров в корзине;
- `protected _catalog: HTMLElement` - Защищенный каталог продуктов;
- `protected _wrapper: HTMLElement` - Защищенная контейнер-обертка страницы;
- `protected _basket: HTMLElement` - Защищенный кнопка перехода в корзину;

Конструктор:

- `container: HTMLElement` - Принимает в себя родительский контейнер;
- `protected events: IEvents` - Защищеный аргумент экземпляра класса EventEmitter;

Методы:

- `set counter(value: number) {}` - Установить значений счетчика продуктов в корзине;
- `set catalog(items: HTMLElement[]) {}` - Установить каталог продуктов;
- `set locked(value: boolean) {}` - Блокировка\разблокировка страницы;

### Класс Product

Реализует карточку товара (используется на главной, в модальном окне и в корзине).

Свойства:

- `protected _title: HTMLElement` - Защищенный заголовок товара;
- `protected _category: HTMLElement` - Защищенное описание категории;
- `protected _image: HTMLImageElement` - Защищенная иконка товара;
- `protected _price: HTMLElement` - Защищенная цена товара;

Конструктор:

- `container: HTMLTemplateElement` - Принимает в себя родительский контейнер;
- `actions?: IActions` - Принимает действия, связанные с продуктом;

Методы:

- `set id(value: string) {}` - Установить id карточки;
- `get id(): string {}` - Получить id карточки;
- `set title(value: string) {}` - Установить заголовок карточки;
- `set image(value: string) {}` - Установить изображение карточки;
- `set price(value: number) {}` - Установить цену товара;
- `set category(value: string) {}` - Установить категорию товара и добавляет соответствующий класс;

### Класс ProductPreview

Отвечает за отображение и взаимодействие с карточкой товара.

Свойства:

- `protected _index: HTMLElement` - Защищенная порядковй номер товара;
- `protected _description: HTMLElement` - Защищенная категория товара;
- `button: HTMLButtonElement` - Кнопка удаления товара из корзины;

Конструктор:

- `container: HTMLTemplateElement` - Принимает в себя родительский контейнер;
- `actions?: IActions` - Принимает действия, связанные с продуктом;

Методы:

- `set index(value: number) {}` - Установить номер товара в корзине;
- `set description(value: string) {}` - Установить текст карточки;

### Класс Basket

Отвечает за отображение товаров в корзине и общей суммы заказа. При клике на кнопку формируется соответствующее событие об открытии формы заказа.

Свойства:

- `protected _list: HTMLElement` - Защищенный элемент, отвещающий за вывод в корзину списка выбранных товаров;
- `protected _total: HTMLElement` - Защищенный элемент, отображающий общую стоимость выбранных товаров;
- `_button: HTMLButtonElement` - Кнопка оформления;

Конструктор:

- `container: HTMLElement` - Принимает в себя родительский контейнер;
- `event: EventEmitter` - Принимает события;

Методы:

- `set items(items: HTMLElement[]) {}` - Отобразить карточки товаров в корзине;
- `set selected(items: string[]) {}` - Активировать/деактивировать кнопку оформления заказа;
- `set total(total: number) {}` - Установить общую стоимость товаров;

### Класс OrderAddress

Наследуется от класса Form. Форма оплаты и доставки.

Свойства:

- `protected _buttonAll: HTMLButtonElement[]` - Защищенные кнопки выбора оплаты товара;

Конструктор:

- `container: HTMLElement` - Принимает в себя родительский контейнер;
- `events: IEvents` - Аргумент экземпляра класса EventEmitter;

Методы:

- `set payment(paymentMethod: string) {}` - Установить сособ оплаты;
- `set address(value: string) {}` - Установить значение поля адреса;

### Класс OrderContacts

Наследуется от класса Form. Форма контактной информации.

Конструктор:

- `container: HTMLElement` - Принимает в себя родительский контейнер;
- `events: IEvents` - Аргумент экземпляра класса EventEmitter;

Методы:

- `set phone(value: string) {}` - Установить значение поля телефона;
- `set email(value: string) {}` - Установить значение поля email;

### Класс Success

Реализует окно с подтверждением заказа. Отображает общую сумму заказа. При клике на кнопку закрывается модальное окно.

Свойства:

- `protected _close: HTMLButtonElement` - Защищенная кнопка закрытия модального окна;
- `protected _total: HTMLElement` - Защищенное сообщение о списании суммы;

Конструктор:

- `container: HTMLElement` - Принимает в себя родительский контейнер;
- `actions?: IActions` - Аргумент объекта с обработчиком клика кнопки закрытия окна подтверждения успешного заказа;

Методы:

- `set total (value: number) {}` - Установить значение общей суммы заказа;

## Слой Presenter

### Класс Api

Класс содержит логику отправки запросов.

Свойства класса:

- `readonly baseUrl: string` - Неизменяемое свойство, базового URL;
- `protected options: RequestInit` - Защищенное свойство, дополнительные параметры для HTTP-запросов;

Конструктор принимает следующие аргументы:

- `this.baseUrl = baseUrl` - Базовый URL
- `this.options = {}` - Дополнительные параметры для HTTP-запросов

Класс имеет такие методы:

- `protected async handleResponse(response: Response): Promise<object> {}` - Обработать полученный ответ от сервера. Если ответ положительный, он возвращает содержимое ответа в виде JSON. В противном случае, он формирует ошибку;
- `async get(uri: string) {}` - Получить данные с сервера;
- `async post(uri: string, data: object, method: ApiPostMethods = 'POST') {}` - Отправить данные на сервер

## Класс EventEmitter

Реализует паттерн "Наблюдатель" и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

Класс имеет методы:

- `on<T extends object>(eventName: EventName, callback: (event: T) => void) {}` - Установить обработчик на событие;
- `off(eventName: EventName, callback: Subscriber) {}` - Снять обработчик с события;
- `emit<T extends object>(eventName: string, data?: T) {}` - Инициировать событие с данными;
- `onAll(callback: (event: EmitterEvent) => void) {}` - Слушать все события;
- `offAll() {}` - Сбросить все обработчики;
- `trigger<T extends object>(eventName: string, context?: Partial<T>) {}` - Сделать коллбек триггер, генерирующий событие при вызове;

### Класс AppWebShop

Дополняет базовый класс API методами работы с конкретным сервером проекта.

Свойства:

- `readonly cdn: string` - Адрес для получения изображения товаров;

Конструктор:

- `cdn: string` - Принимает url адрес cdn;
- `baseUrl: string` - Базовый url магазина;
- `option?: RequestInit` - Опции запроса;

Методы:

- `getProductList(): Promise<IProduct[]> {}` - Получить массив продуктов с сервера;
- `orderProduct(order: IOrder): Promise<IOrderResult> {}` - Отправить переданный заказ на сервер и возвратить результат;

## Ключевые типы данных

```TypeScript
// интерфейс, описывающий карточку товара в магазине
interface IProduct {
	id: string; // уникальный ID
	title: string; // наименование товара
	description: string; // описание товара
	image: string; // ссылка на картинку товара
	category: string; // категория на товар
	price: number | null; // цена товара
}

// интерфейс, описывающий данные способа оплаты и адреса доставки
interface IOrderAddress {
	payment: string; // выбор метода оплаты товара
	address: string; // адрес доставки
}

// интерфейс, описывающий данные контактов
interface IOrderContact {
	email: string; // адрес электорнной почты
	phone: string; // номер телефона
}

// интерфейс, описывающий все поля заказа
interface OrderForm extends IOrderAddress, IOrderContact {}

// интерфейс для описания данных заказа
interface Order extends OrderForm {
	items: string[]; // массив ID купленных товаров
	total: number; // сумма заказа
}

// интерфейс, описывающий результат заказа
interface OrderResult {
	id: string;
	total: string;
}

// интерфейс для коллбэков
interface IActions {
	onClick: (event: MouseEvent) => void;
}

// описание данных карточки товара
interface IAppData {
	catalog: IProduct[];
	basket: string[];
	order: IOrder;
}

//интерфейс для реализации API клиента
interface IProductAPI {
	getProductList: () => Promise<IProduct[]>;
	orderProduct: (value: IOrder) => Promise<IOrderResult>;
}

//интерфейс описывающий возможные действия с карточкой
interface IBasketView {
	total: number;
	list: HTMLElement[];
}

//интерфейс описывающий возможные действия в случае удачной покупки
interface IModalData {
	content: HTMLElement;
}

//интерфейс описывающий методы работы с Api
interface IPage {
	counter: number;
	catalog: HTMLElement[];
}

//интерфейс описывающий форму заказа
interface IProductData {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
	index?: number;
}

//интерфейс типы состояния приложения
interface ISuccess {
	total: number;
}

// интерфейс для ошибок в форме
type FormErrors = Partial<Record<keyof IOrder, string>>;

```

## Размещение в сети

- Репозиторий проекта: https://github.com/LeaTrixWizzer/web-larek-frontend.git
