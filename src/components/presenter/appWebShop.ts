import { IOrder, IOrderResult, IProduct } from '../../types';
import { Api, ApiListResponse } from './api';

export interface IProductAPI {
	getProductList: () => Promise<IProduct[]>;
	orderProduct: (value: IOrder) => Promise<IOrderResult>;
}

export class AppWebShop extends Api implements IProductAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProduct(order: IOrder): Promise<IOrderResult> {
		return this.post(`/order`, order).then((data: IOrderResult) => data);
	}
}

