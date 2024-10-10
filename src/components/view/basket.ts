import { createElement, ensureElement, formatNumber } from '../../utils/utils';
import { EventEmitter } from '../presenter/events';
import { Component } from './component';

interface IBasketView {
	total: number;
	list: HTMLElement[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	_button: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(container: HTMLTemplateElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._button = this.container.querySelector('.basket__button');
		this._total = this.container.querySelector('.basket__price');

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(items: string[]) {
		this.setDisabled(this._button, items.length === 0);
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}
