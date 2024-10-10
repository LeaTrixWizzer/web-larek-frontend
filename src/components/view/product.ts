import { IActions } from '../../types';
import { categories } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from './component';

export interface IProductData {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
	index?: number;
}

export class Product extends Component<IProductData> {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

	constructor(container: HTMLTemplateElement, actions?: IActions) {
		super(container);
		this._category = container.querySelector('.card__category');
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector(`.card__image`);
		this._price = ensureElement<HTMLImageElement>(`.card__price`, container);

		if (actions?.onClick) {
			container.addEventListener('mousedown', actions.onClick);
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}

	set price(value: number) {
		value === null
			? this.setText(this._price, 'Бесценно')
			: this.setText(this._price, `${value} синапсов`);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${categories[value]}`;
	}
}

export class ProductPreview extends Product {
	protected _index: HTMLElement;
	protected _description: HTMLElement;
	button: HTMLButtonElement;

	constructor(container: HTMLTemplateElement, actions?: IActions) {
		super(container);
		this.button = container.querySelector('.card__button');
		this._index = container.querySelector('.basket__item-index');
		this._description = container.querySelector('.card__text');
		if (actions?.onClick) {
			if (this.button) {
				this.button.addEventListener('mousedown', actions.onClick);
			}
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}
