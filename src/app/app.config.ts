import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MockPaymentGateway, PaymentGateway } from './features/subscription/payment-gateway';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    // Демо-оплата. На проде здесь подключается настоящий платёжный провайдер.
    { provide: PaymentGateway, useClass: MockPaymentGateway },
  ],
};
