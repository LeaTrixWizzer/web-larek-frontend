import { IOrderAddress, IOrderContact } from '../../types';
import { ensureAllElements } from '../../utils/utils';
import { IEvents } from '../presenter/events';
import { Form } from './form';

export class OrderAddress extends Form<IOrderAddress> {
	protected _buttonAll: HTMLButtonElement[];

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._buttonAll = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this._buttonAll.forEach((item) => {
			item.addEventListener('click', () => {
				this.payment = item.name;
				events.emit('payment:change', item);
			});
		});
	}

	set payment(paymentMethod: string) {
		this._buttonAll.forEach((button) => {
			this.toggleClass(
				button,
				'button_alt-active',
				button.name === paymentMethod
			);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

export class OrderContacts extends Form<IOrderContact> {
	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
