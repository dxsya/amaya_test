import type { Offer } from '../../app/types/offer'

export const offers: Offer[] = [
  {
    id: 'monthly',
    name: 'Гибкий старт',
    period: 'На 1 месяц',
    description: 'Попробуйте все игры и приключения',
    price: 349,
    priceSuffix: '/ в месяц',
  },
  {
    id: 'yearly',
    name: 'Выгодно',
    period: 'На целый год',
    description: 'Экономия 2 590 ₽ за год',
    price: 1599,
    priceSuffix: '/ в год',
    savings: '−62%',
  },
]
