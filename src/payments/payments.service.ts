import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel',
    });

    return session;
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    // Testing
    // const endpointSecret =
    //   'whsec_10e9ba668f17d1218efdfb18e789cbd6350a399d7f1eaeb596a28dea70637f4c';

    const endpointSecret = 'whsec_39Vm7gC0Y9NtSeBZpifGq3ayDsZlENYo';

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    console.log(event);
    switch (event.type) {
      case 'charge.succeeded':
        const changeSucceeded = event.data.object;
        // TODO: llamar nuestro microservicio
        console.log({
          metadata: changeSucceeded.metadata,
          orderId: changeSucceeded.metadata.orderId,
        });
        break;

      default:
        console.log(`Evento ${event.type} not handled`);
    }

    return res.status(200).json({ sig });
  }
}
