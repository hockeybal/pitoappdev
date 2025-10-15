declare module '@mollie/api-client' {
  interface Amount {
    value: string;
    currency: string;
  }

  interface PaymentCreateParams {
    amount: Amount;
    description: string;
    redirectUrl?: string;
    webhookUrl?: string;
    customerId?: string;
    sequenceType?: 'oneoff' | 'first' | 'recurring';
    metadata?: Record<string, any>;
  }

  interface Payment {
    id: string;
    status: string;
    amount: Amount;
    description: string;
    redirectUrl?: string;
    webhookUrl?: string;
    customerId?: string;
    sequenceType?: string;
    metadata?: Record<string, any>;
    _links?: {
      checkout?: {
        href: string;
      };
    };
    getCheckoutUrl(): string;
  }

  interface Mandate {
    id: string;
    status: string;
    method: string;
    details?: any;
    mandateReference?: string;
    signatureDate?: string;
    createdAt: string;
  }

  interface Customer {
    id: string;
    name: string;
    email: string;
    locale?: string;
    metadata?: Record<string, any>;
    createdAt: string;
  }

  interface CustomerCreateParams {
    name: string;
    email: string;
    locale?: string;
    metadata?: Record<string, any>;
  }

  interface Method {
    id: string;
    description: string;
    minimumAmount?: Amount;
    maximumAmount?: Amount;
  }

  interface CustomersAPI {
    create(params: CustomerCreateParams): Promise<Customer>;
    get(id: string): Promise<Customer>;
    mandates: {
      list(customerId: string): Promise<Mandate[]>;
      revoke(customerId: string, mandateId: string): Promise<boolean>;
    };
  }

  interface MethodsAPI {
    list(): Promise<Method[]>;
    get(id: string): Promise<Method>;
  }

  interface PaymentsAPI {
    create(params: PaymentCreateParams): Promise<Payment>;
    get(id: string): Promise<Payment>;
  }

  interface MollieClient {
    customers: CustomersAPI;
    methods: MethodsAPI;
    payments: PaymentsAPI;
  }

  interface MollieOptions {
    apiKey: string;
  }

  function createMollieClient(options: MollieOptions): MollieClient;
  export { createMollieClient };
}