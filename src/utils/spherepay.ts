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
        buyer: string;
        creator: string;
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

export type SpherePaymentWebhookResponse = {
  hmacTimestamp: string;
  id: string;
  name: string;
  data: {
    payment: {
      [x: string]: unknown;
      id: string;
      type: string;
      status: string;
      meta: {
        buyer: string;
        product: number;
      };
      transactions: Array<{
        id: string;
        type: string;
        rails: string;
        network: string;
        flow: string;
        amount: string;
        amountUSD: number;
        currency: string;
        description: string;
        available: string;
        updated: string;
        created: string;
      }>;
      transport: {
        solana: {
          id: string;
          hash: string;
          solanaEvent: {
            id: string;
            name: string;
            txSig: string;
            slot: number;
            errored: boolean;
            updated: string;
            created: string;
          };
          updated: string;
          created: string;
        };
      };
      updated: string;
      created: string;
    };
  };
  mock: boolean;
  payment: {
    id: string;
    type: string;
    status: string;
    paymentReference: string;
    transactions: Array<{
      id: string;
      type: string;
      rails: string;
      network: string;
      flow: string;
      amount: string;
      amountUSD: number;
      currency: string;
      description: string;
      available: string;
      updated: string;
      created: string;
    }>;
    solanaTransport: {
      id: string;
      tx: {
        message: {
          header: {
            numRequiredSignatures: number;
            numReadonlySignedAccounts: number;
            numReadonlyUnsignedAccounts: number;
          };
          recentBlockhash: string;
          staticAccountKeys: Array<string>;
          addressTableLookups: Array<{
            accountKey: string;
            readonlyIndexes: Array<number>;
          }>;
          compiledInstructions: Array<{
            data: {
              data: Array<number>;
              type: string;
            };
            programIdIndex: number;
            accountKeyIndexes: Array<number>;
          }>;
        };
      };
      hash: string;
      solanaEvent: {
        id: string;
        name: string;
        txSig: string;
        pEvent: {
          transfer: {
            "0": {
              v1: {
                "0": {
                  config: string;
                  currency: string;
                  customer: string;
                  feeAmount: string;
                  configAuthority: string;
                  totalPaymentAmount: string;
                  solanaTransportHash: string;
                };
              };
            };
          };
        };
        slot: number;
        errored: boolean;
        updated: string;
        created: string;
      };
      updated: string;
      created: string;
    };
    updated: string;
    created: string;
  };
  updated: string;
  created: string;
};
