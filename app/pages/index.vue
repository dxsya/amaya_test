<script setup lang="ts">
import { FetchError } from 'ofetch'
import type { Offer, PurchaseResult } from '~/types/offer'

const { data: offers, pending, error: offersError } = await useFetch<Offer[]>('/api/offers')
const selectedOfferId = ref('yearly')
const purchasePending = ref(false)
const purchaseError = ref('')
const purchaseResult = ref<PurchaseResult | null>(null)
const restoreMessage = ref('')

const selectedOffer = computed(() =>
  offers.value?.find(offer => offer.id === selectedOfferId.value),
)

const formattedPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU').format(price)

async function purchase() {
  if (!selectedOffer.value || purchasePending.value) return

  purchasePending.value = true
  purchaseError.value = ''

  try {
    purchaseResult.value = await $fetch<PurchaseResult>('/api/purchase', {
      method: 'POST',
      body: { offerId: selectedOffer.value.id },
    })
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      const message = error.data?.message
      purchaseError.value = typeof message === 'string'
        ? message
        : 'Не удалось оформить подписку. Проверьте соединение и попробуйте ещё раз.'
    } else if (error instanceof TypeError) {
      purchaseError.value = 'Не удалось подключиться к сервису. Проверьте соединение и попробуйте ещё раз.'
    } else {
      throw error
    }
  } finally {
    purchasePending.value = false
  }
}
</script>

<template>
  <main class="paywall">
    <section class="paywall-card" aria-label="Премиум-доступ Клуба героев">
      <header class="hero">
        <div class="hero-orbit hero-orbit--left" />
        <div class="hero-orbit hero-orbit--right" />
        <div class="hero-stars" aria-hidden="true">
          <span class="star star--one">✦</span>
          <span class="star star--two">·</span>
          <span class="star star--three">✦</span>
          <span class="star star--four">·</span>
        </div>

        <button class="close-button" type="button" aria-label="Закрыть">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <div class="club-label">
          <span class="club-dot" />
          Клуб героев
        </div>

        <div class="hero-copy">
          <p class="eyebrow"><span aria-hidden="true">✦</span> ПРЕМИУМ-ДОСТУП</p>
          <h1>Целая<br>вселенная<br>игр</h1>
          <p class="hero-subtitle">Все приключения, награды и новые миры — без ограничений</p>
        </div>

        <div class="rocket-art" aria-hidden="true">
          <span class="rocket-trail rocket-trail--one" />
          <span class="rocket-trail rocket-trail--two" />
          <svg class="rocket" viewBox="0 0 180 210" fill="none">
            <path d="M50 126c-15 6-25 20-28 42 15-4 28-14 36-29" fill="#ffb436" />
            <path d="M77 145c-3 20 5 34 21 45 5-17 3-31-7-45" fill="#ff8d38" />
            <path d="M49 117C57 73 91 27 145 8c14 48 1 101-33 134-21 21-47 32-72 34 0-24 3-43 9-59Z" fill="#fff" />
            <path d="M123 17c9-4 16-7 22-9 2 7 3 15 4 23l-26-14Z" fill="#f76568" />
            <path d="M48 117 25 135c-5 4-7 10-6 17l2 14 29-29" fill="#6fb6fa" />
            <path d="m111 143 2 29c0 6 4 11 9 14l12 7 5-39" fill="#6fb6fa" />
            <circle cx="94" cy="89" r="25" fill="#d9efff" />
            <circle cx="94" cy="89" r="17" fill="#79baff" />
            <circle cx="94" cy="89" r="11" fill="#397fe9" />
            <circle cx="60" cy="139" r="6" fill="#ffcb48" />
            <path d="M68 53c7-9 15-17 25-24" stroke="#fff" stroke-linecap="round" stroke-width="5" opacity=".8" />
          </svg>
          <span class="planet planet--ring" />
          <span class="planet planet--small" />
        </div>
      </header>

      <div class="offer-content">
        <p class="benefits" aria-label="Преимущества подписки">
          <span>40+ игр</span><i>·</i><span>Без рекламы</span><i>·</i><span>Новинки каждый месяц</span>
        </p>

        <div v-if="offersError" class="notice notice--error" role="alert">
          Не удалось загрузить тарифы. Обновите страницу и попробуйте снова.
        </div>
        <div v-else-if="pending" class="offer-skeleton" role="status" aria-label="Загружаем тарифы">
          <span /><span />
        </div>
        <div v-else-if="offers?.length" class="offer-list" role="group" aria-label="Выберите тариф">
          <button
            v-for="offer in offers"
            :key="offer.id"
            class="offer-option"
            :class="{ 'offer-option--selected': selectedOfferId === offer.id }"
            type="button"
            :aria-pressed="selectedOfferId === offer.id"
            @click="selectedOfferId = offer.id; purchaseResult = null; purchaseError = ''; restoreMessage = ''"
          >
            <span v-if="offer.badge" class="offer-badge">{{ offer.badge }}</span>
            <span class="offer-radio" aria-hidden="true">
              <span v-if="selectedOfferId === offer.id" />
            </span>
            <span class="offer-kicker">{{ offer.name }}</span>
            <span class="offer-period">{{ offer.period }}</span>
            <span class="offer-description">{{ offer.description }}</span>
            <span class="offer-price">
              <strong>{{ formattedPrice(offer.price) }} ₽</strong>
              <small>{{ offer.priceSuffix }}</small>
            </span>
            <span v-if="offer.savings" class="savings">{{ offer.savings }}</span>
          </button>
        </div>

        <button
          v-if="!pending && !offersError"
          class="purchase-button"
          :class="{ 'purchase-button--success': purchaseResult }"
          type="button"
          :disabled="purchasePending || !selectedOffer || Boolean(purchaseResult)"
          @click="purchase"
        >
          <span v-if="purchasePending" class="spinner" aria-hidden="true" />
          <template v-else-if="purchaseResult">Подписка оформлена!</template>
          <template v-else-if="selectedOffer">Открыть за {{ formattedPrice(selectedOffer.price) }} ₽</template>
          <template v-else>Выберите тариф</template>
        </button>

        <p v-if="purchaseResult" class="purchase-success" role="status">
          Готово! Премиум-доступ активирован. Приятной игры!
        </p>
        <p v-if="purchaseError" class="purchase-error" role="alert">{{ purchaseError }}</p>

        <p class="payment-note">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="3.5" y="7" width="9" height="7" rx="2" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
          </svg>
          Безопасная оплата · Отмена в любой момент
        </p>
        <button
          class="restore-button"
          type="button"
          @click="restoreMessage = purchaseResult ? 'Премиум-доступ уже активирован.' : 'Покупок пока нет — выберите тариф, чтобы открыть доступ.'"
        >
          Восстановить покупки
        </button>
        <p v-if="restoreMessage" class="restore-message" role="status">{{ restoreMessage }}</p>
        <p class="terms">Нажимая кнопку, вы соглашаетесь с условиями подписки</p>
      </div>
    </section>
  </main>
</template>
