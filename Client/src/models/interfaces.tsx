export interface session {
  id : string;
  username: string;
  email: string;
  phone: string;
  createAt: string;
  totalPurchases: number;
}

export interface product {
  accuracy: number;
  createdAt: string;
  description: string;
  forecastImageUrl: string;
  matchDate: string;
  price: number;
  title: string;
  _id: string;
  }

    export interface purchase {
    id: string;
    orderId: string;
    productId: product;
    purchaseDate: string;
    status: string;
    userId: string;
  }

