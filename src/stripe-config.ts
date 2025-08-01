export interface Product {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    priceId: 'price_1QRZZqFdGKBVpgAdy4E9EsRv',
    name: 'Digital Twin and MetaHuman Creation Platform',
    description: 'Create hyper-realistic, customizable digital humans for immersive virtual experiences. Enhance user engagement, automate tasks, and scale your digital presence with seamless, interactive MetaHumans. Transform the future of interaction today.',
    mode: 'subscription'
  }
];