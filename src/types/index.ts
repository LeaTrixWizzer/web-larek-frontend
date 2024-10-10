export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderAddress {
	payment: string;
	address: string;
}

export interface IOrderContact {
	email: string;
	phone: string;
}

export interface OrderForm extends IOrderAddress, IOrderContact {}

export interface IOrder extends OrderForm {
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}
