export interface session {
  id : string;
  username: string;
  email: string;
  phone: string;
  createAt: string;
  totalPurchases: number;
}

export interface product {
  accuracy?: number;
  createdAt: string;
  forecastImageUrl: string;
  matchDate?: string;
  giftCardCode?: string;
  description: string;
  price: number;
  title: string;
  _id: string;
  isGiftCard: boolean;

  }

    export interface purchase {
    id: string;
    orderId: string;
    productId: product;
    purchaseDate: string;
    status: string;
    userId: string;
  }

