import { FormErrors, IOrder, IOrderContact, IProduct } from '../../types';
import { Model } from './model';

export interface IAppData {
	catalog: IProduct[];
	basket: string[];
	order: IOrder;
}

export class AppData extends Model<IAppData> {
	basket: IProduct[] = [];
	catalog: IProduct[];
	order: IOrder = {
		total: 0,
		items: [],
		payment: '',
		address: '',
		email: '',
		phone: '',
	};
	formErrors: FormErrors = {};

	setCatalog(data: IProduct[]) {
		this.catalog = data;
		this.emitChanges('items:changed');
	}

	addProduct(item: IProduct) {
		this.order.items.push(item.id);
	}

	removeProduct(item: IProduct) {
		const index = this.order.items.indexOf(item.id);
		if (index >= 0) {
			this.order.items.splice(index, 1);
		}
	}

	addToBasket(data: IProduct) {
		this.basket.push(data);
	}

	deleteFromBasket(item: IProduct) {
		const index = this.basket.indexOf(item);
		if (index >= 0) {
			this.basket.splice(index, 1);
		}
	}

	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}

	get isEmpty(): boolean {
		return this.basket.length === 0;
	}

	validateAddress() {
		const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		} else if (!regexp.test(this.order.address)) {
			errors.address = 'Укажите настоящий адрес';
		} else if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		const regexpPhone = /^((8|\+7)[ \- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!regexpEmail.test(this.order.email)) {
			errors.email = 'Некорректный адрес электронной почты';
		}

		if (this.order.phone.startsWith('8')) {
			this.order.phone = '+7' + this.order.phone.slice(1);
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!regexpPhone.test(this.order.phone)) {
			errors.phone = 'Некорректный формат номера телефона';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderData(field: keyof IOrderContact, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
		if (this.validateAddress()) {
			this.events.emit('order:ready', this.order);
		}
	}

	selectedProduct(item: IProduct) {
		return this.basket.includes(item);
	}

	getTotalAmount() {
		return this.order.items.reduce(
			(firstItem, nextItem) =>
				firstItem +
				this.catalog.find((targetItem) => targetItem.id === nextItem).price,
			0
		);
	}
}
