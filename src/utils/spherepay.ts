export interface SphereCreateWallet {
  ok: boolean;
  object: string;
  statusCode: number;
  error?: Error;
  message: string;
  data: {
    wallet: {
      id: string;
      address: string;
      isConnectedWallet: boolean;
      primary: boolean;
      nickname?: "";
      network: string;
      created: string;
      updated: string;
    };
  };
  ts: string;
  request: string;
}

export interface SphereCreateProduct {
  ok: boolean;
  object: string;
  statusCode: number;
  error?: Error;
  message: string;
  data: {
    product: {
      id: string;
      name: string;
      description: string;
      images: string[];
      tags: string[];
      prices: string[];
      updated: string;
      created: string;
    };
  };
  ts: string;
  request: string;
}

export type SphereCreatePrice = {
  ok: boolean;
  object: string;
  statusCode: number;
  error?: Error;
  message: string;
  data: {
    price: {
      id: string;
      active: boolean;
      name: string;
      description: string;
      network: string;
      billingScheme: string;
      customUnitAmount: number;
      taxBehavior: string;
      type: string;
      tierType: string;
      tiers: string[];
      currencyOptions: string;
      currency: string;
      unitAmount: string;
      unitAmountDecimal: number;
      recurring: {
        type: string;
        usageAggregation: string;
        interval: number;
        intervalCount: number;
        usageType: string;
        defaultLength: number;
        expectedUsagePerInterval: number;
      };
      product: {
        id: string;
        name: string;
        description: string;
        images: string[];
        tags: string[];
        updated: string;
        created: string;
      };
      updated: string;
      created: string;
    };
  };
  ts: string;
  request: string;
};

export type SphereCreatePaymentLink = {
  ok: boolean;
  object: string;
  statusCode: number;
  error: Error;
  message: string;
  data: {
    paymentLink: {
      id: string;
      name: string;
      description: string;
      meta: {
        product_id: number;
        product_sphere_id: string;
      };
      url: string;
      successUrl: string;
      failUrl: string;
      taxRate: number;
      shippingRate: number;
      lineItems: Array<{
        id: string;
        name: string;
        description: string;
        quantity: number;
        quantityMutable: boolean;
        price: {
          id: string;
          active: boolean;
          name: string;
          description: string;
          network: string;
          billingScheme: string;
          taxBehavior: string;
          type: string;
          currency: string;
          unitAmount: string;
          unitAmountDecimal: number;
          recurring: {
            type: string;
            expectedUsagePerInterval: number;
          };
          product: {
            id: string;
            name: string;
            description: string;
            images: string[];
            tags: string[];
            updated: string;
            created: string;
          };
          updated: string;
          created: string;
        };
        amountTotal: number;
        paymentCurrency: string;
        updated: string;
        created: string;
      }>;
      features: {
        requiresEmail: boolean;
        requiresName: boolean;
        requiresShippingDetails: boolean;
      };
      application: {
        id: string;
        name: string;
        nickname: string;
        image: string;
        initialized: boolean;
        apiVersion: string;
        access: {
          early: boolean;
          payout: boolean;
          creditCard: boolean;
        };
        wallets: string[];
        members: Array<{
          id: string;
          role: string;
        }>;
        emailNotifications: boolean;
        notificationsEmail: string;
        updated: string;
        created: string;
      };
      wallets: string;
      updated: string;
      created: string;
    };
  };
  ts: string;
  request: string;
};
