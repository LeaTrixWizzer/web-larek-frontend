import { AppData } from './components/model/appData';
import { AppWebShop } from './components/presenter/appWebShop';
import { EventEmitter } from './components/presenter/events';
import { Basket } from './components/view/basket';
import { Modal } from './components/view/modal';
import { OrderAddress, OrderContacts } from './components/view/order';
import { Page } from './components/view/page';
import { Product, ProductPreview } from './components/view/product';
import { Success } from './components/view/success';
import './scss/styles.scss';
import { IOrderContact, IProduct, OrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const app = new EventEmitter();
const apiProduct = new AppWebShop(CDN_URL, API_URL);

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const appData = new AppData({}, app);

const page = new Page(document.body, app);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), app);

const basket = new Basket(
	cloneTemplate<HTMLTemplateElement>(basketTemplate),
	app
);
const order = new OrderAddress(
	cloneTemplate<HTMLFormElement>(orderTemplate),
	app
);
const contacts = new OrderContacts(cloneTemplate(contactsTemplate), app);

function changedItems() {
	page.catalog = appData.catalog.map((item) => {
		const card = new Product(cloneTemplate(cardCatalogTemplate), {
			onClick: () => app.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
}

function selectCard(item: IProduct) {
		const card = new ProductPreview(cloneTemplate(cardPreviewTemplate), {
			onClick: () => app.emit('card:add', item),
		});
		modal.render({
			content: card.render({
				id: item.id,
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category,
				description: item.description,
			}),
		});

		if (item.price === null) {
			card.setDisabled(card.button, true);
		} else if (appData.selectedProduct(item)) {
			card.setDisabled(card.button, true);
		}
}

function addCard(item: IProduct) {
	appData.addProduct(item);
	appData.addToBasket(item);
	page.counter = appData.basket.length;
	modal.close();
}

function openBasket() {
	basket.total = appData.getTotalAmount();
	basket.setDisabled(basket._button, appData.isEmpty);
	basket.items = appData.basket.map((item, index) => {
		const card = new Product(cloneTemplate(cardBasketTemplate), {
			onClick: () => app.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render(),
	});
}

function removeCard(item: IProduct) {
	appData.deleteFromBasket(item);
	appData.removeProduct(item);
	page.counter = appData.basket.length;
	basket.setDisabled(basket._button, appData.isEmpty);
	basket.total = appData.getTotalAmount();
	basket.items = appData.basket.map((item, index) => {
		const card = new ProductPreview(cloneTemplate(cardBasketTemplate), {
			onClick: () => app.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render(),
	});
}

function openOrder() {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
}

function submitOrder() {
	appData.order.total = appData.getTotalAmount();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
}

function changePayment(item: HTMLButtonElement) {
	appData.order.payment = item.name;
	appData.validateAddress();
}

function changeFormErrors(errors: Partial<OrderForm>) {
	const { address, payment, email, phone } = errors;
	order.valid = !address && !payment;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');

	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
}

function trackingChanged(data: { field: keyof IOrderContact; value: string }) {
	appData.setOrderData(data.field, data.value);
}

function submitContacts() {
	apiProduct
		.orderProduct(appData.order)
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: res.total,
				}),
			});

			appData.clearBasket();
			page.counter = 0;
		})
		.catch((err) => {
			console.error(err);
		});
}

function openModal() {
	page.locked = true;
}

function closeModal() {
	page.locked = false;
}

app.on('items:changed', changedItems); // Изменилить элементы каталога
app.on('card:select', selectCard); // Выбрать превью карточки
app.on('card:add', addCard); // Добавление карточки товара в корзину
app.on('basket:open', openBasket); // Открытие модального окна корзины
app.on('card:remove', removeCard); // Удаление карточки товара из корзины
app.on('order:open', openOrder); // Открытие модального окна формы заказа
app.on('order:submit', submitOrder); // Открытие модального окна контактов
app.on('payment:change', changePayment); // Реакция на изменении способа оплаты в форме заказа.
app.on('formErrors:change', changeFormErrors); // Валидация данных строки
app.on(/^(order(\.payment)?|contacts)\.(.*):change/, trackingChanged); // Отслеживаем изменение одного из полей
app.on('contacts:submit', submitContacts); // Открытие модального окна об успешном оформления заказа
app.on('modal:open', openModal); // Блокировка прокрутки при открытии модального окна
app.on('modal:close', closeModal); // Снятие блокировки прокрутки при открытии модального окна

//Получаем данные с сервера

apiProduct
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
