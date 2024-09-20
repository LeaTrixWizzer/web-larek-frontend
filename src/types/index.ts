export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: string;
}

export type TPayment = 'online' | 'offline';

export interface OrderAddress {
	payment: TPayment;
	address: string;
}

export interface OrderContact {
	email: string;
	phone: string;
}

export interface OrderForm extends OrderAddress, OrderContact {}

export interface Order extends OrderForm {
	products: IProduct[];
	total: string;
}

export interface OrderResult {
	id: string;
	total: string;
}

export interface IProductAPI {
	getProductList: () => Promise<IProduct[]>;
	getProductById: (id: string) => Promise<IProduct>;
	orderProduct: (order: Order) => Promise<OrderResult[]>;
}
