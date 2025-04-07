export interface session {
  id : string;
  username: string;
  email: string;
  phone: string;
  createdAt: string;
  totalPurchases: number;
  isAdmin: boolean;
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
  isActive: boolean;
  }

    export interface purchase {
    id: string;
    orderId: string;
    productId: product;
    purchaseDate: string;
    status: string;
    userId: string;
    value: string;
    payerFullName: string;
  }

  export interface MessageType {
    text: string;
    type: string;
  }

