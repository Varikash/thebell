import { Injectable } from '@angular/core';
import { Currency } from '../product-showcase/product.model';

export interface PaymentRequest {
  productId: string;
  planId: string;
  amount: number;
  currency: Currency;
  email: string;
  cardNumber: string;
}

export type PaymentResult = { ok: true } | { ok: false; message: string };

/**
 * Точка подключения оплаты. Модалка знает только этот интерфейс.
 * На проде вместо мока подставляется реализация с настоящим провайдером
 * или биллингом The Bell — в app.config.ts, одной строкой.
 */
export abstract class PaymentGateway {
  abstract charge(request: PaymentRequest): Promise<PaymentResult>;
}

/** Тестовая карта, которую банк «отклоняет». Любая другая проходит. */
export const DECLINED_TEST_CARD = '4000000000000002';

/** Мок для демо: через секунду отвечает успехом или отказом для тестовой карты. */
@Injectable()
export class MockPaymentGateway extends PaymentGateway {
  async charge(request: PaymentRequest): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    if (request.cardNumber === DECLINED_TEST_CARD) {
      return {
        ok: false,
        message: 'Банк отклонил платёж. Проверьте данные карты или попробуйте другую.',
      };
    }
    return { ok: true };
  }
}
