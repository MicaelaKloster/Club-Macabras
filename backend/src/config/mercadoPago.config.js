import { MercadoPagoConfig } from "mercadopago";

// Cliente Mercado Pago con Access Token
export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN, // Tu access token de test o producción
});