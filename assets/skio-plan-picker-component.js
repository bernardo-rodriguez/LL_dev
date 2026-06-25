/*
Usage Notes: 

The following web component can be dropped into any standard Shopify theme (i.e. non-headless), using Liquid to pass product data:

  {% assign skioSellingPlanGroups = product.selling_plan_groups | where: 'app_id', 'SKIO' %}
  {% if skioSellingPlanGroups.size > 0 %}
    <skio-plan-picker 
      product='{{ product | json | escape }}'
      selectedVariant='{{ product.selected_or_first_available_variant | json | escape }}'
      formId='{{ product_form_id }}'
      currency='{{ cart.currency.iso_code }}'
      >
    </skio-plan-picker>
    <input type="hidden" aria-hidden="true" name="selling_plan" value="">
    <script src="{{ 'skio-plan-picker-component.js' | asset_url }}" type="module"></script>
  {% endif %}

  Note: formId not required if element is inside of a form already

  Example variantChanged event dispatch:
  document.dispatchEvent( new CustomEvent("variantChanged", { detail: { variantId: variant.id } }) );
*/

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { unsafeHTML } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

/** Refill subscription disclaimer: days derived from Skio selling plan name (e.g. "2 months" → 60). */
function getRefillSubscriptionShipFooter(planName) {
  const n = (planName || '').toLowerCase();
  // "Delivery every month", "monthly", etc. (no digit — treat as 1 month / 30 days)
  if (
    /\bmonthly\b/.test(n) ||
    /\b(every|each|per)\s+month\b/.test(n) ||
    /\bone\s+month\b/.test(n) ||
    /\ba\s+month\b/.test(n)
  ) {
    return 'MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY 30 DAYS';
  }
  const monthsMatch = n.match(/(\d+)\s*months?/);
  if (monthsMatch) {
    const months = parseInt(monthsMatch[1], 10);
    if (!Number.isNaN(months) && months > 0) {
      const days = months * 30;
      return `MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY ${days} DAYS`;
    }
  }
  if (n.includes('quarter') || /\b90\b/.test(n)) {
    return 'MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY 90 DAYS';
  }
  if (n.includes('biannual') || n.includes('semi-annual') || n.includes('6 month')) {
    return 'MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY 180 DAYS';
  }
  if (n.includes('week')) {
    const w = n.match(/(\d+)\s*weeks?/);
    if (w) {
      const weeks = parseInt(w[1], 10);
      if (!Number.isNaN(weeks) && weeks > 0) {
        return `MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY ${weeks * 7} DAYS`;
      }
    }
  }
  return 'MODIFY OR CANCEL ANYTIME. YOUR SUBSCRIPTION SHIPS EVERY 60 DAYS';
}

function formatRefillMoney(val) {
  const s = String(val == null ? '' : val).trim();
  if (!s) return '';
  return s.startsWith('$') ? s : '$' + s.replace(/^\$/, '');
}

/** Refill sub tab + subscription includes strike — always standalone refill retail ($30), never kit previous_price ($65). */
function getRefillSubscriptionStrike(component) {
  if (typeof refill_subscription_compare_price !== 'undefined') {
    if (refill_subscription_compare_price === '' || refill_subscription_compare_price === null) return '';
    const t = String(refill_subscription_compare_price).trim();
    if (t !== '') return formatRefillMoney(refill_subscription_compare_price);
  }
  const stand = typeof refill_one_time_display_price !== 'undefined' && refill_one_time_display_price !== ''
    ? String(refill_one_time_display_price).replace(/^\$/, '')
    : '30';
  return formatRefillMoney(stand);
}

/** Refill one-time includes line strike; '' = hide (no hardcoded $65). */
function getRefillOneTimeStrike() {
  if (typeof refill_one_time_compare_price !== 'undefined') {
    if (refill_one_time_compare_price === '' || refill_one_time_compare_price === null) return '';
    const t = String(refill_one_time_compare_price).trim();
    if (t !== '') return formatRefillMoney(refill_one_time_compare_price);
  }
  return '';
}

const skioStyles = css`
  /*
    Typography values below use --ds-* custom properties defined in base.css :root.
    CSS custom properties inherit into shadow DOM, keeping this component
    in sync with the global design system. Do not hardcode font-family,
    line-height, or letter-spacing — use the tokens instead.
  */
  :host {
    display: block;
    width: 100%;
    min-width: 0;
  }
  fieldset.skio-plan-picker {
    margin: 0;
    padding: 0;
    border: 0;
  }
  .skio-plan-picker {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
    border: 0;
    margin: 0;
    width: 100%;
    min-width: 0;
  }
  .skio-plan-picker__purchase-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 0;
  }
  .skio-subscription-first {
    order: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-width: 0;
  }
  .skio-onetime-second {
    order: 2;
  }
  
  .skio-group-container {
    display: none;
  }
  .skio-group-container--available {
    display: block;
    position: relative;
    min-width: 0;
    overflow: visible;
    border-radius: 0;
    border: 1px solid #000;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    background: #e5e5e5;
    -webkit-tap-highlight-color: transparent;
  }
  .skio-group-container--selected {
    border-color: #000;
    background: #fff !important;
  }
  .skio-plan-picker__purchase-row .skio-group-container--selected {
    border-bottom: none;
    align-self: stretch;
  }
  /* Divider via box-shadow to avoid jog where unselected option ends */
  .skio-plan-picker__purchase-row .skio-subscription-first .skio-group-container--selected {
    border-right: none;
    box-shadow: inset -1px 0 0 #000;
  }
  .skio-plan-picker__purchase-row .skio-onetime-second.skio-group-container--selected {
    border-left: none;
    box-shadow: inset 1px 0 0 #000;
  }
  .skio-plan-picker__purchase-row .skio-group-container--available:not(.skio-group-container--selected) {
    border: none;
    border-bottom: 1px solid #000;
  }
  .skio-plan-picker__purchase-row .skio-group-container--available:not(.skio-group-container--selected) .skio-group-label {
    padding: 10px 16px;
  }
  .skio-plan-picker__purchase-row .skio-onetime-second.skio-group-container--available:not(.skio-group-container--selected) {
    align-self: end;
  }
  
  .skio-group-input {
    position: absolute;
    width: 0px;
    height: 0px;
    opacity: 0;
  }
  .skio-group-input:focus-visible ~ .skio-group-label {
    outline: 2px #ccc solid;
    outline-offset: 4px;
    border-radius: 0;
  }
  
  .skio-group-label {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    padding: 16px;
    overflow: hidden;
    border-radius: 0;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Aligns to: .sh3 (16px desktop / 14px mobile) */
  .skio-group-topline {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: 16px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 500;
    gap: 12px;
  }

  .skio-plan-picker__purchase-row .skio-group-topline {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .skio-plan-picker__purchase-row .skio-center-wrapper {
    flex-direction: column !important;
    align-items: flex-start;
    width: 100%;
    gap: 4px;
    justify-content: flex-start !important;
  }

  /* Align purchase card text with kit card image start (padding 16px = where image starts) */
  .skio-plan-picker__purchase-row .skio-group-label {
    padding-left: 16px;
  }

  .skio-purchase-option-price {
    flex-shrink: 0;
    min-width: 85px;
    text-align: right;
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-weight: 600;
  }

  .skio-plan-picker__purchase-row .skio-purchase-option-price {
    min-width: 0;
    text-align: left;
  }

  /* Aligns to: .body-sm (14px) */
  .skio-purchase-option-price .price--strike {
    text-decoration: line-through;
    color: #999;
    font-weight: 500;
    font-size: 14px;
    line-height: var(--ds-line-height, 1.3);
    margin-right: 2px;
  }

  .skio-plan-picker__purchase-row .skio-purchase-option-price .price--strike {
    font-size: 14px;
    margin-right: 2px;
  }

  /* Aligns to: p/.p (16px) */
  .skio-plan-picker__purchase-row .skio-purchase-option-price span:not(.price--strike) {
    font-size: 16px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 700;
  }

  .skio-center-wrapper {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-weight: 600;
  }
  
  .skio-radio__container {
    display: flex;
    margin-right: auto;
    margin-left: 5px;
  }
  
  .skio-radio {
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1);
    transform-origin: center;
    transform: scale(0);
    opacity: 0;
    color: var(--blue)!important;
  }
  .skio-group-label:hover .skio-radio {
    transform: scale(1);
    opacity: 0.75;
  }
  .skio-group-container--selected .skio-group-label .skio-radio {
    transform: scale(1);
    opacity: 1;
  }
  
  .skio-group-content {
    width: auto;
    margin: 0 5px;
    transition: max-height 0.25s cubic-bezier(0.4,0,0.2,1),
                opacity 0.25s cubic-bezier(0.4,0,0.2,1);
    max-height: 100px;
    opacity: 1;
  }
  
  /* Hide frequency if not selected 
  .skio-group-container:not(.skio-group-container--selected) .skio-group-content {
    max-height: 0;
    opacity: 0;
    pointer-events: none;
  }
  */


  .skio-group-content-2 {
    width: auto;
    margin: 0 5px;
    transition: max-height 0.25s cubic-bezier(0.4,0,0.2,1),
                opacity 0.25s cubic-bezier(0.4,0,0.2,1);
    opacity: 1;
    padding-top: 10px;
  }
  
  
  .skio-group-container:not(.skio-group-container--selected) .skio-group-content-2 {
    max-height: 0;
    opacity: 0;
    // pointer-events: none;
    padding-top: 0;
  }
 

  .hide-skio-select {
    max-height: 0;
    opacity: 0;
    pointer-events: none;
  }
  
  /* Aligns to: .sh2 (18px desktop / 16px mobile) */
  .skio-group-title {
    min-width: max-content;
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-weight: 700;
    font-size: 18px;
    line-height: var(--ds-line-height, 1.3);
    text-transform: uppercase;
  }
  @media (max-width: 768px) {
    .skio-group-title {
      font-size: 16px;
    }
  }
  
  .skio-save-ribbon {
    position: absolute;
    top: 0;
    left: -1px;
    transform: translateY(-50%);
    background: #000;
    color: #fff;
    /* Aligns to: .label-sm (12px) but smaller at 10px for ribbon */
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: 10px;
    font-weight: 700;
    padding: 4px 10px;
    text-transform: uppercase;
    letter-spacing: var(--ds-label-letter-spacing, 0.04em);
    border-radius: 0;
    text-align: center;
    display: inline-block;
    box-sizing: border-box;
  }
  
  .skio-save {
    color: #0fa573;
    border: 1px #0fa573 solid; 
    padding: 0px 8px;
    border-radius: 20px;
  }
  
  .skio-first-order-includes {
    margin-top: -12px;
    border: 1px solid #000;
    border-top: none;
    border-radius: 0;
    padding: 12px;
    background: #fff;
  }
  /* Aligns to: .skio-first-order-item__bullets (12px, weight 500) - no custom letter-spacing */
  .skio-first-order-includes__title {
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: var(--ds-body-sm-size, 12px);
    line-height: var(--ds-line-height, 1.3);
    font-weight: var(--ds-body-sm-weight, 500);
    text-transform: uppercase;
    margin-bottom: 8px;
    color: #000;
  }
  .skio-first-order-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 6px 0;
  }
  .skio-first-order-item--shipping {
    padding: 6px 0;
    align-items: flex-start;
  }
  .skio-first-order-item--shipping .skio-first-order-item__image {
    background: transparent;
    height: 0;
    min-height: 0;
    border: none;
  }
  .skio-first-order-item--shipping .skio-first-order-item__title {
    font-size: 14px;
    margin-bottom: 2px;
  }
  .skio-first-order-item__image {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    border-radius: 12px;
    overflow: hidden;
    background: #f5f5f5;
    border: 1px solid #000;
    box-sizing: border-box;
  }
  .skio-first-order-includes--refill .skio-first-order-item__image {
    border-radius: 0;
  }
  .skio-first-order-item__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .skio-first-order-item__content {
    flex: 1;
    min-width: 0;
  }
  /* Aligns to: .label (14px, uppercase) */
  .skio-first-order-item__title {
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: 14px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0;
    color: #000;
    margin-bottom: 2px;
  }
  /* Aligns to: .pdp-body-text / .body-xs (12px) */
  .skio-first-order-item__bullets {
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: var(--ds-body-sm-size, 12px);
    line-height: 1.4;
    font-weight: var(--ds-body-sm-weight, 500);
    color: #333;
    margin: 0;
    padding-left: 8px;
    padding-right: 8px;
  }
  /* Aligns to: .body-sm (14px) */
  .skio-first-order-item__price {
    text-align: right;
    flex-shrink: 0;
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: 14px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 500;
    min-width: 90px;
  }
  .skio-first-order-item__price .price--strike {
    text-decoration: line-through;
    color: #666;
    margin-right: 4px;
  }
  .skio-first-order-item__price .price--current {
    font-weight: 700;
    color: #000;
  }
  .skio-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    margin-top: 10px;
    border-top: 1px solid #000;
  }
  .skio-total-row__price {
    min-width: 90px;
    text-align: right;
  }
  /* Aligns to: .sh2 (18px) */
  .skio-total-row__label {
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: 18px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 600;
    color: #000;
  }
  .skio-total-row__price .price--strike {
    text-decoration: line-through;
    color: #666;
    margin-right: 8px;
  }
  /* Aligns to: .sh2 (18px) */
  .skio-total-row__price .price--current {
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: 18px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 600;
    color: #000;
  }
  /* Aligns to: .body-xs (12px) */
  .skio-subscription-footer {
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: 12px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 500;
    color: #000;
    text-align: center;
    margin-top: 12px;
  }
  /* Aligns to: .sh2 (18px mobile, 20px desktop, uppercase button) */
  .skio-includes-cta {
    margin-top: 16px;
    padding: 15px 24px;
    width: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background-color: #C4E9FF !important;
    color: #000 !important;
    border: 1px solid #000 !important;
    font-family: var(--ds-font-family, manrope, sans-serif) !important;
    font-size: 18px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 700 !important;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    border-radius: 0 !important;
  }
  .skio-includes-cta:hover {
    background-color: #b0dff8 !important;
  }
  @media (min-width: 769px) {
    .skio-includes-cta {
      font-size: 20px;
      padding: 17px 32px;
    }
  }
  /* Aligns to: .label-sm (10px mobile, 12px desktop) */
  .skio-modify-disclaimer {
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: 12px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 500;
    color: #000;
    text-align: center;
    margin-top: 12px;
    margin-bottom: 0;
    letter-spacing: 0;
  }
  /* Aligns to: .body-xs (12px) */
  .skio-onetime-subscribe-disclaimer {
    padding: 10px 12px;
    background-color: #fff9e6;
    border: 1px solid #000;
    border-radius: 0;
    margin: 8px 0 12px 0;
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: 12px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 500;
  }
  .skio-first-order-includes--refill .skio-onetime-subscribe-disclaimer {
    background-color: #f0f0f0;
  }
  .skio-onetime-subscribe-disclaimer a {
    color: #000;
    text-decoration: underline;
    font-weight: 700;
    cursor: pointer;
  }
  .skio-onetime-subscribe-disclaimer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .skio-modify-disclaimer {
      font-size: 10px;
    }
    .skio-first-order-includes {
      padding: 10px 12px;
      border-left: none;
      border-right: none;
      border-bottom: none;
    }
    .skio-first-order-includes__title {
      margin-bottom: 8px;
    }
    .skio-first-order-item {
      gap: 8px;
      padding: 6px 0;
    }
    .skio-first-order-item__image {
      width: 40px;
      height: 40px;
    }
    .skio-first-order-item__price {
      min-width: 60px;
    }
    .skio-first-order-item--shipping {
      padding: 6px 0;
    }
    .skio-total-row__price {
      min-width: 60px;
    }
    /* Remove side borders when full-bleed */
    .skio-plan-picker__purchase-row .skio-subscription-first .skio-group-container {
      border-left: none;
    }
    .skio-plan-picker__purchase-row .skio-onetime-second .skio-group-container {
      border-right: none;
    }
  }

  .skio-container {
    display: flex;
    justify-content: space-between;
  }

  .skio-custom-content {
    border-radius: 0;
  }

  .skio-refill-frequency-wrap {
    margin-bottom: 12px;
  }
  .skio-refill-frequency-wrap--after-total {
    margin-top: 12px;
    margin-bottom: 0;
  }
  .skio-refill-frequency-wrap .skio-custom-content-refill {
    margin-top: 0;
  }
  .skio-refill-frequency-label {
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-size: 12px;
    font-weight: 600;
    line-height: var(--ds-line-height, 1.3);
    color: #000;
    align-self: center;
    padding-right: 12px;
  }
  .skio-refill-frequency-row {
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .skio-custom-content-refill {
    border-radius: 0;
    padding: 12px;
    margin-top: 6px;
    border: 1px solid #000;
    background: #f5f5f5;
  }

  .skio-custom-content-background-color {
      background-color: #f0f0f0 !important;
  }
  
  /* Neutral, square — used if frequency UI is shown again */
  .skio-frequency {
    border: 1px solid #000 !important;
    background: #fff !important;
    color: #000 !important;
    font-family: var(--ds-font-family, manrope, sans-serif) !important;
    font-size: 12px !important;
    line-height: var(--ds-line-height, 1.3) !important;
    border-radius: 0 !important;
    padding: 8px 28px 8px 10px !important;
    -webkit-appearance: none !important;
    appearance: none !important;
    position: relative !important;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E") !important;
    background-position: right 8px top 50% !important;
    background-size: 14px !important;
    background-repeat: no-repeat !important;
  }
  // .skio-frequency.skio-frequency--one {
  //   background-image: none;
  //   pointer-events: none;
  // }
  
  .skio-frequency span {
    text-transform: lowercase;
  }

  .skio-price {
    margin-left: 4px;
  }

  .skio-subscribe-price {
    font-weight: 600;
  }

  /* Aligns to: .body-xs (12px) */
  .skio-price-shipping {
    font-family: var(--ds-font-family, manrope, sans-serif);
    font-weight: 500;
    font-size: 12px;
    line-height: var(--ds-line-height, 1.3);
    color: #323232;
  }

  /* Aligns to: p/.p (16px, uppercase button) - excludes .skio-includes-cta which has its own styling */
  button.add-to-cart:not(.skio-includes-cta) {
    justify-content: center;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--ds-label-letter-spacing, 0.04em);
    font-style: normal;
    font-size: 16px;
    line-height: var(--ds-line-height, 1.3);
    text-decoration: none;
    box-shadow: 0 0 #0000004d inset;
    width: 100%;
    color: #fff;
    background-color: #000;
    border-radius: 5px;
    transition-duration: .3s;
    padding: 10px 32px;
    cursor: pointer;
    font-family: var(--ds-font-family, manrope, sans-serif);
    transition: border-color 0.25s ease, background-color 0.25s ease, color 0.25s ease;

    border: solid 2px rgba(0,0,0,0);
  }
  button.add-to-cart:not(.skio-includes-cta):hover {
    background-color: rgba(0,0,0,0);
    color: #000;
    border-color: #000;
  }

  /* skio-details - "How do subscriptions work?" - commented out for potential future use
  .skio-details {
    --text-color: #333;
    --text-color-secondary: #888; 
    
    user-select: none;
    -webkit-user-select: none;
    margin-bottom: 20px;
    order: 3;
  }

  .skio-details summary::-webkit-details-marker,
  .skio-details summary::marker,
  .skio-details slot {
    color: rgba(0,0,0,0) !important;
  }

  .skio-details summary {
    margin-top: 15px;
  }

  .skio-details summary span {
    font-size: 0.9em;
    display: flex;
    padding: .5em 0;
    cursor: pointer;
    align-items: center;
    gap: 10px;
    text-decoration: underline;

    margin-top: -40px;
    color: #000;
  }

  @keyframes fadeInDown {
    0% {
      opacity: 0;
      transform: translateY(-15px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
  .skio-details[open] > .skio-details--content {
    animation-name: fadeInDown;
    animation-duration: 0.3s;
  }

  .skio-details--content {
    position: absolute;
    z-index: 1020;
    padding: 1em;
    width: fit-content;
    border-radius: 5px;
    background: white;
    box-shadow: 0 0 5px rgb(23 24 24 / 5%), 0 1px 2px rgb(0 0 0 / 7%);
  }

  .skio-details ul {
    margin: 0;
    padding: 0;
  }

  .skio-details ul li {
    display: flex;
    align-items: flex-start;
    gap: .75em;

    margin-bottom: 1em;
  }

  .skio-details .skio-content {
    display: flex;
    flex-direction: column;
  }

  .skio-details .skio-content p {
    font-size: 0.9em;

    margin-top: 0;
    margin-bottom: 0;

    letter-spacing: 0;
    line-height: 1.5;

    color: var(--text-color);
  }

  .skio-details ul li small {
    font-size: 0.7em;
    color: var(--text-color-secondary);
  }

  .skio-details .skio-icon {
    display: flex;

    width: 2.25em;
    height: 2.25em;

    color: var(--text-color);
    background: #f8f8f8;
    border-radius: 100%;

    flex-shrink: 0;
    align-items: center;
    justify-content: center;
  }

  .skio-details .skio-icon svg {
    width: 1.25em;
    height: 1.25em;

    color: inherit;
  }

  .skio-details--footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9em;
  }

  .skio-details--footer a {
    color: var(--text-color);
  }

  .skio-manage-link {
    text-decoration: underline;
  }

  .powered-by-skio {
    font-size: 0.8em;

    display: flex;
    text-decoration: none;
    
    align-items: center;
    gap: 3px;
  }
  */

  @media (max-width: 420px) {
    .skio-group-label {
      font-size: 14px;
      line-height: var(--ds-line-height, 1.3);
    }
    /* CSS that should be displayed if width is equal to or less than 800px goes here */
  }


  /* THIS IS NEWLY INSERTED FOR THE BUNDLE ONE TIME FUNCTIONALITY */

  .bundle-container {
      // max-width: 600px;
      width: 100%;
      margin: 0px auto;
  }

  .bundle-option {
      /* border: 2px solid #e5e7eb; */
      border: 1px solid black;
      border-radius: 8px;
      padding: 15px 25px;
      margin-bottom: 16px;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
  }

  // .bundle-option:hover {
  //     border-color: #93c5fd;
  // }

  .bundle-option.selected {
      /* border-color: #3b82f6; */
      background-color: var(--blue-tint-20) !important;
      // background-color: #eff6ff;
  }

  .bundle-content {
      display: flex;
      gap: 16px;
  }

  .bundle-content input {
      position: fixed;
      opacity: 0;
      pointer-events: none;
  }

  .bundle-details {
      flex-grow: 1;
      font-family: var(--ds-font-family, manrope, sans-serif);
      font-weight: 500;
  }

  .bundle-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  /* Aligns to: .sh3 (16px) */
  .bundle_offer_title {
      font-family: var(--ds-font-family, manrope, sans-serif);
      font-size: 16px;
      line-height: var(--ds-line-height, 1.3);
      font-weight: 600;
      margin: 0;
  }

  /* Aligns to: .body-sm (14px) */
  .bundle-description {
      color: #6b7280;
      font-family: var(--ds-font-family, manrope, sans-serif);
      font-size: 14px;
      line-height: var(--ds-line-height, 1.3);
      font-weight: 500;
      margin-top: 4px;
  }

  .bundle-pricing {
      text-align: center;
      font-family: var(--ds-font-family, manrope, sans-serif);
  }

  /* Aligns to: .sh2 (18px) */
  .bundle_current_price {
      font-size: 18px;
      line-height: var(--ds-line-height, 1.3);
      font-weight: 600;
  }

  /* Aligns to: p/.p (16px) */
  .bundle_previous_price {
    font-size: 16px;
    line-height: var(--ds-line-height, 1.3);
    font-weight: 500;
    padding-right: 5px;
    text-decoration: line-through;
    color: #666666;
  }

  .bundle_percent_off {

  }

  /* Aligns to: .body-sm (14px) */
  .bundle_price_per_treatment {
      color: #22c55e;
      font-size: 14px;
      line-height: var(--ds-line-height, 1.3);
      font-weight: 600;
      padding-top: 5px;
  }

  .shipping {
      color: #6b7280;
      font-size: 14px;
      margin-top: 8px;
  }

  .badge {
      position: absolute;
      top: -2px;
      left: -2px;
      padding: 4px 12px;
      color: white;
      font-size: 14px;
      // border-radius: 9999px;
  }

  .popular-badge {
      background-color: #ef4444;
      font-weight: 700;
  }

  .best-deal-badge {
      background-color: #22c55e;
      font-weight: 700;
  }

  .add-to-cart:not(.skio-includes-cta) {
      width: 100%;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 24px;
      transition: background-color 0.2s ease;
  }

  .add-to-cart:not(.skio-includes-cta):hover {
      background-color: #2563eb;
  }

  .savings-button {
    background-color: #69BBEB;
    width: 100%;
    max-width: 85px;
    border-radius: 20px;
    text-align: center;
    font-size: 14px;
    padding: 5px;
    font-weight: 700;
    display: inline-block
  }

  .subscription_selling_plan_details {
    font-weight: 500;
    padding: 10px 15px;
  }

  @media (max-width: 440px) {
    .bundle-option {
      padding: 15px 15px;
    }
    .bundle_offer_title {
      font-size: 14px;
    }
    .subscription_selling_plan_details {
      font-size: 14px;
    }
  }
`;

export class SkioPlanPickerComponent extends LitElement {
  static properties = {
    product: { type: Object },            //required
    productHandle: { type: String },      //optional (unless product isn't passed, then required)
    key: { type: String },                //optional, defaults to product.id; identifier for this instance of the Skio plan picker

    offer: { type: String },

    affiliate_referrer: {type: String},

    one_time_enabled: {type: Boolean},
    subscription_enabled: {type: Boolean},
    bundle_enabled: {type: Boolean},

    one_time_pricing: {type: String},
    subscription_pricing: {type: String},
    subscription_discount: {type: String},
    
    formId: { type: String },             //optional; if passed, used to connect input fields to form
    needsFormId: { type: Boolean },       //optional, defaults to false; if true, element needs to be passed a formId, else it searches for a form

    subscriptionFirst: { type: Boolean }, //optional, defaults to false; if true, shows subscription option above onetime
    startSubscription: { type: Boolean }, //optional, defaults to false; if true, auto-selects subscription on page load
    discountFormat: { type: String },     //optional, defaults to percent; can also pass "fixed"
    
    currency: { type: String },           //optional, defaults to 'USD', but can pass any 3 char identifier
    language: { type: String },           //optional, defaults to 'en-US', but can pass any similarly formatted language identifier
    moneyFormatter: {},                   //placeholder for object

    externalPriceSelector: { type: String },      //optional, used to update the external price

    externalPriceSelectorWithCurrency: { type: String },      //optional, used to update the external price
  
    selectedVariant: { type: Object },    //placeholder for data
    skioSellingPlanGroups: {},            //placeholder for data
    availableSellingPlanGroups: {},       //placeholder for data
    selectedSellingPlanGroup: {},         //placeholder for data
    selectedSellingPlan: {},              //placeholder for data

    defaultFrequency: {},                 //placeholder for data

    showAddToCartButton: { type: Boolean },

    meta: {},

    useVariantInputClickEvents: {type: Boolean}, // optional, allows use of variant input click events to update skio's selectedVariant
    variantInputSelector: {},

    treatmentQuantity: { type: String }, // Add this new property
    selectedBundle: { type: String },
    prevSelectedBundle: { type: String },
  };

  static styles = skioStyles;

  constructor() {
    super();
    this.product = null;
    this.selectedVariant = null;

    this.offer = this.getCookie('offer')

    this.affiliate_referrer = getCookie('affiliate_referrer')

    this.one_time_enabled = (affiliate_config[this.affiliate_referrer] ?? {}).pricing?.one_time_enabled ?? true;
    this.subscription_enabled = (affiliate_config[this.affiliate_referrer] ?? {}).pricing?.subscription_enabled ?? true;
    this.bundle_enabled = (affiliate_config[this.affiliate_referrer] ?? {}).pricing?.bundle_enabled ?? true;

    this.one_time_pricing = (affiliate_config[this.affiliate_referrer] ?? {}).pricing?.onetime ?? '';
    this.subscription_pricing = (affiliate_config[this.affiliate_referrer] ?? {}).pricing?.subscription ?? '';
    this.subscription_discount = (affiliate_config[this.affiliate_referrer] ?? {}).pricing?.subscription_discount ?? '0';

    this.product_page_copy = (affiliate_config[this.affiliate_referrer] ?? {}).product_page_copy ?? affiliate_config['default'].product_page_copy;

    this.productHandle = null;

    this.purchaseOption = 'onetime';

    this.key = null;
    this.formId = null;
    this.needsFormId = false;

    this.skioSellingPlanGroups = [];
    this.availableSellingPlanGroups = [];

    this.selectedSellingPlanGroup = null;
    this.selectedSellingPlan = null;

    this.startSubscription = false;
    this.subscriptionFirst = false;

    this.skioMainProduct = true;

    this.discountFormat = 'percent';

    this.externalPriceSelector = '[skio-external-price]';

    this.externalPriceSelectorWithCurrency = '[skio-external-price-with-currency]';

    this.currency = Shopify.currency.active;
    this.language = 'en-US';
    this.moneyFormatter = new Intl.NumberFormat(this.language, {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    this.defaultFrequency = '2 months';

    this.showAddToCartButton = false;

    this.meta = '';

    this.lastSellingPlanName = '';

    this.showDetailsHover = false;
    
    this.oneTimePricingConfig = affiliate_one_time_price_copy[this.affiliate_referrer] ?? affiliate_one_time_price_copy['default']
    this.subscriptionPricingConfig = affiliate_subscription_price_copy[this.affiliate_referrer] ?? affiliate_subscription_price_copy['default']

    this.treatmentQuantity = '6'; // Default value

    this.firstOrderIncludesConfig = affiliate_first_order_includes[this.affiliate_referrer] ?? affiliate_first_order_includes['default']
    this.selectedBundle = 'sub'; // Default to first bundle
    this.prevSelectedBundle = '1'; // Default to first bundle
  }

  getCookie(cname) {
    // const value = `; ${document.cookie}`;
    // const parts = value.split(`; ${name}=`);
    // if (parts.length === 2) return parts.pop().split(';').shift();
    
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.startSubscription == true) {
      this.purchaseOption = 'subscription';
    }

    if(!this.product && this.productHandle) {
      console.log('connected callback')
      this.fetchProduct(this.productHandle);
    }

    if (this.needsFormId && this.formId == null) {
      let forms = document.querySelectorAll('form[action="/cart/add"]');
      if (forms.length > 0) {
        let form;
        forms.forEach((el) => {
          if (el.hasAttribute('skio-key')) {
            if (el.getAttribute('skio-key') == this.key) form = el;
          }
        });
        if (!form) form = forms[0];
        this.formId = form.id;
        this.requestUpdate();
      }
    }
    let skio = this;
    document.addEventListener("variantChanged", function(e) {
      //update variant id
      let variantId = e.detail.variantId;
      let variant = skio.product.variants.find(x => x.id == variantId);
      if (variant) skio.selectedVariant = variant;
      else skio.log("Unable to find variant with id: ", variantId);
      skio.requestUpdate();
    });

    this.moneyFormatter = new Intl.NumberFormat(this.language, {
      style: 'currency',
      currency: skio.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (this.meta !== '') this.meta = JSON.parse(this.meta);

    if (this.useVariantInputClickEvents) {
      document.addEventListener('load', skio.addVariantClickEventListeners)
    }

    // Add treatment quantity change listener
    document.addEventListener('change', (e) => {
      if (e.target.name === 'treatment-quantity') {
        this.treatmentQuantity = e.target.value;
        this.updatePricingConfigForTreatmentQuantity();
        this.requestUpdate(); // Trigger re-render for real-time updates
      }
    });

    // Set initial treatment quantity and update config
    // Always read from DOM to respect browser form restoration
    this.treatmentQuantity = document.querySelector('input[name="treatment-quantity"]:checked')?.value || '6';
    this.updatePricingConfigForTreatmentQuantity();
    this.requestUpdate(); // Trigger re-render to update bundle titles and pricing
    
    // Retry update after a delay to handle browser form restoration timing
    setTimeout(() => {
      const checkedRadio = document.querySelector('input[name="treatment-quantity"]:checked');
      if (checkedRadio?.value !== this.treatmentQuantity) {
        this.treatmentQuantity = checkedRadio?.value || '6';
        this.updatePricingConfigForTreatmentQuantity();
        this.requestUpdate();
      }
    }, 200);
  }

  updatePricingConfigForTreatmentQuantity() {
    // Check if the pricing config variables are available
    if (typeof affiliate_one_time_price_copy === 'undefined') {
      return;
    }
    
    const baseConfig = affiliate_one_time_price_copy[this.affiliate_referrer] ?? affiliate_one_time_price_copy['default'];
    const upsellConfig = affiliate_upsell_one_time_price_copy[this.affiliate_referrer] ?? affiliate_upsell_one_time_price_copy['default'];

    const subscriptionConfig = affiliate_subscription_price_copy[this.affiliate_referrer] ?? affiliate_subscription_price_copy['default'];
    const upsellSubscriptionConfig = affiliate_upsell_subscription_price_copy[this.affiliate_referrer] ?? affiliate_upsell_subscription_price_copy['default'];

    let sellingPlan = this.selectedSellingPlan;

    if (this.treatmentQuantity === '12') { 
      // Update config for 12 treatments
      this.oneTimePricingConfig = upsellConfig
      this.subscriptionPricingConfig = upsellSubscriptionConfig;

      // Only update selling plan if availableSellingPlanGroups is set
      if (this.availableSellingPlanGroups && this.availableSellingPlanGroups.length > 0) {
        sellingPlan = this.availableSellingPlanGroups[0].selling_plans.find(plan => plan.name.includes('3 month')) || this.selectedSellingPlan;
      }
    } else { 
      // Use default config for 6 treatments
      this.oneTimePricingConfig = baseConfig;
      this.subscriptionPricingConfig = subscriptionConfig;

      // Only update selling plan if availableSellingPlanGroups is set
      if (this.availableSellingPlanGroups && this.availableSellingPlanGroups.length > 0) {
        sellingPlan = this.availableSellingPlanGroups[0].selling_plans.find(plan => plan.name.includes('2 month')) || this.selectedSellingPlan;
      }
    }

    // if selected selling plan is null, then onetime is selected and we don't need to update the selling plan
    if (this.selectedSellingPlan) {
      this.selectedSellingPlan = sellingPlan;
    }

    // update the last selling plan name. When one time is selected, selectedSellingPlan is null, so we need to keep track of the last selling plan name
    if (sellingPlan && sellingPlan.name) {
      this.lastSellingPlanName = sellingPlan.name;
    }

  }

  render() {
    if(!this.product || !this.selectedVariant || this.skioSellingPlanGroups.length == 0 || !this.product?.available) return;
    
    const hasIncludesCta = this.product.id == window.ProductConfig?.KIT_DOUBLE_LIGHTNING?.product_id
      || this.product.id == window.ProductConfig?.KIT_EMPTY_SPACE?.product_id
      || this.product.id == window.ProductConfig?.KIT_DEFAULT?.product_id
      || this.product.id == window.ProductConfig?.REFILL_DEFAULT?.product_id;
    if (hasIncludesCta) this.setAttribute('data-has-includes-cta', 'true');
    else this.removeAttribute('data-has-includes-cta');
    
    return html`
      <fieldset style = ${ this.offer == 'everyday' ? 'display : none;' : '' } class="skio-plan-picker" skio-plan-picker="${ this.key }">
        <input ${ this.formId !== null ? html`form="${ this.formId }"` : '' } name="selling_plan" type="hidden" value="${ this.subscription_enabled && this.selectedSellingPlan !== null ? this.selectedSellingPlan?.id : ''}" />
        <input ${ this.formId !== null ? html`form="${ this.formId }"` : '' } name="properties[Discount]" type="hidden" value="${ this.subscription_enabled && this.selectedSellingPlan !== null ? this.discount(this.selectedSellingPlan).percent : '' }" 
          ?disabled="${ !this.subscription_enabled || this.selectedSellingPlan == null ? true : false }" />
        
        <div class="skio-plan-picker__purchase-row" style="${ !this.subscription_enabled || !this.one_time_enabled ? 'display: none' : '' }">
         ${ this.one_time_enabled ? 
          html`
            <div class="skio-group-container skio-onetime-second
              ${ this.product.requires_selling_plan == false ? 'skio-group-container--available' : '' } 
              ${ (this.one_time_enabled && !this.subscription_enabled) || this.selectedSellingPlanGroup == null ? 'skio-group-container--selected' : '' }" skio-group-container 
              @click=${() => this.selectSellingPlanGroup(null) } 
              style = ${ this.subscription_enabled ? '' : 'border: none; box-shadow: none' }
              >
            
              <input id="skio-one-time-${ this.key }" class="skio-group-input" name="skio-group-${ this.key }" type="radio" value="" 
                skio-one-time ?checked=${ 
                (this.one_time_enabled && !this.subscription_enabled) || 
                (this.startSubscription == false && this.product.requires_selling_plan) == false ? true : false }>

              <label skio-label-onetime class="skio-group-label" for="skio-one-time-${ this.key }" style = ${ this.subscription_enabled ? '' : 'padding: 0' }>
                <div class="skio-group-topline" style = ${ this.subscription_enabled ? '' : 'display: none' }>
                  <div class="skio-radio__container" style="display: none;">
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1"></circle>
                      <circle class="skio-radio" cx="12" cy="12" r="11" fill="currentColor"></circle>
                    </svg>
                  </div>
                  <div class="skio-center-wrapper" style="justify-content: space-between; width: 100%;">
                    <div class="skio-group-title">
                      ONE-TIME
                    </div>
                    <div class="skio-purchase-option-price skio-price">
                      ${ this.bundle_enabled 
                       && (this.product.id == window.ProductConfig.KIT_DOUBLE_LIGHTNING.product_id 
                        || this.product.id == window.ProductConfig.KIT_EMPTY_SPACE.product_id 
                        || this.product.id == window.ProductConfig.KIT_DEFAULT.product_id)? html`
                        <span id = 'skio-onetime-price-set' skio-onetime-price>
                          ${this.selectedBundle === '1' || (this.prevSelectedBundle === '1' && this.selectedBundle == 'sub') ? 
                            this.oneTimePricingConfig['first']['bundle_current_price'] : 
                            this.oneTimePricingConfig['second']['bundle_current_price']
                          }
                        </span>
                        ` :  html`
                        <span id = 'skio-onetime-price-set' skio-onetime-price>$${ this.product.id == window.ProductConfig.REFILL_DEFAULT.product_id
                          ? (typeof refill_one_time_display_price !== 'undefined' && refill_one_time_display_price !== ''
                            ? String(refill_one_time_display_price).replace(/^\$/, '')
                            : '30')
                          : (this.selectedVariant.price / 100).toFixed(0) }</span>
                        ` }
                    </div>
                  </div>
                </div>
                
                ${ /* RE-ENABLE ONE-TIME QUANTITY PICKER: Remove style="display: none" from the div below to show Buy 1 vs Buy 2 options. Underlying selectBundle(), selectedBundle, oneTimePricingConfig remain intact. */
                  this.bundle_enabled 
                  && (this.product.id == window.ProductConfig.KIT_DOUBLE_LIGHTNING.product_id 
                 || this.product.id == window.ProductConfig.KIT_EMPTY_SPACE.product_id 
                 || this.product.id == window.ProductConfig.KIT_DEFAULT.product_id) ? html`
                <div class="skio-group-content-2" style="display: none; ${ this.subscription_enabled ? '' : 'margin: 0' }">
                  <div class="skio-custom-content" style = 'padding-right: 0; padding-left: 0'>
                    <div class="skio-container">
                      <div class="bundle-container">
                        <div class="bundle-option ${this.selectedBundle === '1' ? 'selected' : ''}" 
                             data-bundle="1" 
                             @click=${() => this.selectBundle('1')}>
                          <div class="bundle-content">
                            <input type="radio" name="onetime_bundle" value="1" 
                                   data-custom-price="${this.oneTimePricingConfig['first']['bundle_current_price']}" 
                                   ?checked=${this.selectedBundle === '1'}>
                            <div class="bundle-details">
                              <div class="bundle-header">
                                <div>
                                  <h3 class="bundle_offer_title">${unsafeHTML(this.oneTimePricingConfig['first']['bundle_offer_title'])}</h3>
                                  <div class="bundle_price_per_treatment">${ unsafeHTML(this.oneTimePricingConfig['first']['bundle_price_per_treatment']) }</div>
                                </div>
                                <div class="bundle-pricing">
                                  <div>
                                    <span class = 'bundle_previous_price'>${ unsafeHTML(this.oneTimePricingConfig['first']['bundle_previous_price']) }</span>
                                    <span class = 'bundle_current_price'>${ unsafeHTML(this.oneTimePricingConfig['first']['bundle_current_price']) }</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="bundle-option ${this.selectedBundle === '2' ? 'selected' : ''}" 
                             data-bundle="2" 
                             @click=${() => this.selectBundle('2')}>
                          <div class="bundle-content">
                            <input type="radio" name="onetime_bundle" value="2" 
                                   data-custom-price="${this.oneTimePricingConfig['second']['bundle_current_price']}" 
                                   ?checked=${this.selectedBundle === '2' }>
                            <div class="bundle-details">
                              <div class="bundle-header">
                                <div>
                                  <h3 class="bundle_offer_title">${unsafeHTML(this.oneTimePricingConfig['second']['bundle_offer_title'])}</h3>
                                  <div class="bundle_price_per_treatment">${ unsafeHTML(this.oneTimePricingConfig['second']['bundle_price_per_treatment']) }</div>
                                </div>
                                <div class="bundle-pricing">
                                  <div>
                                    <span class = 'bundle_previous_price'>${ unsafeHTML(this.oneTimePricingConfig['second']['bundle_previous_price']) }</span>
                                    <span class = 'bundle_current_price'>${ unsafeHTML(this.oneTimePricingConfig['second']['bundle_current_price']) }</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!--
                        <div class="bundle-option" data-bundle="3" style = 'margin-bottom: 0;'>
                          <div class="bundle-content">
                            <input type="radio" name="onetime_bundle" value="3" data-custom-price="${ this.oneTimePricingConfig['third']['bundle_current_price'] }" >
                            <div class="bundle-details">
                              <div class="bundle-header">
                                <div>
                                  <h3 class="bundle_offer_title">${unsafeHTML(this.oneTimePricingConfig['third']['bundle_offer_title'])}</h3>
                                  <div class="bundle_price_per_treatment">${ unsafeHTML(this.oneTimePricingConfig['third']['bundle_price_per_treatment']) }</div>
                                </div>
                                <div class="bundle-pricing">
                                  <div>
                                    <span class = 'bundle_previous_price'>${ unsafeHTML(this.oneTimePricingConfig['third']['bundle_previous_price']) }</span>
                                    <span class = 'bundle_current_price'>${ unsafeHTML(this.oneTimePricingConfig['third']['bundle_current_price']) }</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        -->

                      </div>
                    </div>
                    
                  </div>
                </div>` :  html`` }
              </label>
            </div>`
        : ''}

         ${ this.subscription_enabled ? 
              html`<div class="skio-subscription-first">
              ${ this.availableSellingPlanGroups ? this.availableSellingPlanGroups.map((group, index) => 
                html`
                  <div class="skio-group-container skio-group-container--available ${ this.subscription_enabled && this.selectedSellingPlanGroup == group ? 'skio-group-container--selected' : '' }" skio-group-container
                    @click=${() => this.selectSellingPlanGroup(group) }>
                    ${ this.discount(group.selected_selling_plan).percent !== '0%' ?
                      html`<span class="skio-save-ribbon">SAVE ${ this.discount(group.selected_selling_plan).percent }</span>` : '' }
                    <input id="skio-selling-plan-group-${ index }-${ this.key }" class="skio-group-input" name="skio-group-${ this.key }"
                      type="radio" value="${ group.id }" skio-selling-plan-group="${ group.id }" ?checked=${ 
                      this.subscription_enabled && this.selectedSellingPlanGroup == group ? true : false } >
                    <label skio-label-subscription class="skio-group-label" for="skio-selling-plan-group-${ index }-${ this.key }">
                      <div class="skio-group-topline">
                        <div class="skio-radio__container" style="display: none;">
                          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1"></circle>
                            <circle class="skio-radio" cx="12" cy="12" r="11" fill="currentColor"></circle>
                          </svg>
                        </div>
                        <div class="skio-center-wrapper" style="justify-content: space-between; width: 100%;">
                          <div class="skio-group-title" id = 'skio-group-title-sub'>
                            SUBSCRIBE & SAVE
                          </div>
                          <div class="skio-purchase-option-price skio-price">
                            ${ (() => {
                              if (this.product.id == window.ProductConfig.REFILL_DEFAULT.product_id) {
                                const strike = getRefillSubscriptionStrike(this);
                                return strike ? html`<span class="price--strike">${ strike }</span>` : '';
                              }
                              return this.subscriptionPricingConfig['previous_price']
                                ? html`<span class="price--strike">${ this.subscriptionPricingConfig['previous_price'] }</span>`
                                : '';
                            })() }
                            <span skio-subscription-price> 
                            ${
                              (() => {
                                const price = (this.price(group.selected_selling_plan, false) / 100) - parseInt(this.subscription_discount || 0) + parseFloat(this.subscriptionPricingConfig['next_price'] || 0);
                                return '$' + (price % 1 === 0 ? price.toFixed(0) : price.toFixed(2));
                              })()
                            }
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="skio-center-wrapper" style="${ (this.product.id == window.ProductConfig.KIT_DOUBLE_LIGHTNING.product_id || this.product.id == window.ProductConfig.KIT_EMPTY_SPACE.product_id || this.product.id == window.ProductConfig.KIT_DEFAULT.product_id || this.product.id == window.ProductConfig.REFILL_DEFAULT.product_id) ? 'display: none;' : '' }">
                      <span class = 'skio-price-shipping'> ${ '' }</span>
                      </div>

                      ${ this.product.id != window.ProductConfig.KIT_DOUBLE_LIGHTNING.product_id 
                      && this.product.id != window.ProductConfig.KIT_EMPTY_SPACE.product_id 
                      && this.product.id != window.ProductConfig.KIT_DEFAULT.product_id ?

                        (this.product.id == window.ProductConfig.REFILL_DEFAULT.product_id) ?
                        html`<div class="skio-group-content skio-group-content--refill-tab-placeholder" style="margin-top:0;padding:0;border:none;background:transparent;min-height:0;"></div>`
                        :
                        html`
                        <div class="skio-group-content ${this.selectedBundle === 'sub' ? 'skio-custom-content-background-color' : ''}" style= "border-radius: 8px; margin-top: 10px;">
                              <div class="bundle-option" style = "margin-bottom: 0">
                                <div class="bundle-content">
                                  <input type="radio" name="onetime_bundle" value = "sub" ?checked=${this.selectedBundle === 'sub'}>
                                  <div class="bundle-details">
                                    <div class="bundle-header">
                                      <div>
                                        <h3 class="bundle_offer_title">${ this.subscriptionPricingConfig['subscription_product_title'] }</h3>
                                        <div class="bundle_price_per_treatment">${ this.subscriptionPricingConfig['price_per_treatment'] }</div>
                                      </div>
                                      <div class="bundle-pricing">
                                        <div>
                                          <span class = 'bundle_previous_price'>${ this.subscriptionPricingConfig['previous_price'] }</span>
                                          <span class = 'bundle_current_price'>$${
                                              (() => {
                                                const price = (this.price(group.selected_selling_plan, false) / 100) - parseInt(this.subscription_discount) + parseFloat(this.subscriptionPricingConfig['next_price']);
                                                return price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
                                              })()
                                            }
                                         </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                        </div>
                        <div class = "subscription_selling_plan_details">
                          <div>
                            <svg
                              class="icon icon-checkmark"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path d="M23.4177 0C23.4177 0 15.2061 5.15966 8.38295 17.8572V17.8608L7.7412 17.0315C5.74251 14.5312 0.757158 10.528 0.757158 10.528L0 11.4775C0 11.4775 6.13246 17.4134 8.52809 24C8.52809 24 14.0852 8.68725 24 0.85228L23.4177 0V0Z" fill="#46BDF0"/>
                            </svg>
                            Delivery ${ this.lastSellingPlanName.toLowerCase() }
                          </div>
                          <div>
                            <svg
                              class="icon icon-checkmark"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path d="M23.4177 0C23.4177 0 15.2061 5.15966 8.38295 17.8572V17.8608L7.7412 17.0315C5.74251 14.5312 0.757158 10.528 0.757158 10.528L0 11.4775C0 11.4775 6.13246 17.4134 8.52809 24C8.52809 24 14.0852 8.68725 24 0.85228L23.4177 0V0Z" fill="#46BDF0"/>
                            </svg>
                            Pause or Cancel anytime
                          </div>
                          
                        </div>
                        `
                        :
                        html`` } 
                    </label>
                  </div>
                `
              ): ''}
              </div>`
        : ''}
        </div>

        ${ (() => {
          const isKitProduct = this.product.id == window.ProductConfig.KIT_DOUBLE_LIGHTNING.product_id
            || this.product.id == window.ProductConfig.KIT_EMPTY_SPACE.product_id
            || this.product.id == window.ProductConfig.KIT_DEFAULT.product_id;
          const isRefillProduct = this.product.id == window.ProductConfig.REFILL_DEFAULT.product_id;
          if (!isKitProduct && !isRefillProduct) return '';

          const purchaseKey = this.selectedSellingPlanGroup != null ? 'subscription' : 'one_time';
          let foConfig = {};
          if (isRefillProduct) {
            foConfig = (typeof refill_first_order_includes !== 'undefined' && refill_first_order_includes[purchaseKey]) || {};
          } else {
            const kitKey = this.treatmentQuantity == '12' ? 'deluxe' : 'starter';
            foConfig = this.firstOrderIncludesConfig?.[kitKey]?.[purchaseKey] || {};
          }
          const sectionTitle = foConfig.section_title || 'FIRST ORDER INCLUDES';
          const items = foConfig.items || [];
          const footerText = foConfig.footer_text || '';
          const planForFooter = isRefillProduct && this.selectedSellingPlanGroup != null
            ? (this.selectedSellingPlanGroup.selected_selling_plan || this.selectedSellingPlan)
            : null;
          const refillSubscriptionFooter = isRefillProduct && this.selectedSellingPlanGroup != null
            ? getRefillSubscriptionShipFooter(planForFooter?.name || this.lastSellingPlanName)
            : '';
          const includesFooterText = isRefillProduct && this.selectedSellingPlanGroup != null
            ? refillSubscriptionFooter
            : footerText;
          const showTotal = foConfig.show_total !== false;
          const hasOptionPicker = this.subscription_enabled && this.one_time_enabled;

          const renderDynamicPrice = () => {
            const isSubscription = this.selectedSellingPlanGroup != null;
            if (isRefillProduct) {
              if (isSubscription) {
                const strikePrice = getRefillSubscriptionStrike(this);
                const currentPrice = html`$${ (() => {
                  const group = this.availableSellingPlanGroups?.[0];
                  if (group) {
                    const price = (this.price(group.selected_selling_plan, false) / 100) - parseInt(this.subscription_discount || 0) + parseFloat(this.subscriptionPricingConfig['next_price'] || 0);
                    return price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
                  }
                  return '25';
                })() }`;
                return { strikePrice, currentPrice };
              }
              const display = (typeof refill_one_time_display_price !== 'undefined' && refill_one_time_display_price !== '')
                ? String(refill_one_time_display_price).replace(/^\$/, '')
                : '30';
              const currentPrice = '$' + display;
              const strikePrice = getRefillOneTimeStrike();
              return { strikePrice, currentPrice };
            }
            const strikePrice = isSubscription
              ? (this.subscriptionPricingConfig['previous_price'] || '$65')
              : (this.oneTimePricingConfig['first']['bundle_previous_price'] || '$84');
            const currentPrice = isSubscription
              ? html`$${ (() => {
                  const group = this.availableSellingPlanGroups?.[0];
                  if (group) {
                    const price = (this.price(group.selected_selling_plan, false) / 100) - parseInt(this.subscription_discount || 0) + parseFloat(this.subscriptionPricingConfig['next_price'] || 0);
                    return price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
                  }
                  return '39';
                })() }`
              : this.oneTimePricingConfig['first']['bundle_current_price'];
            return { strikePrice, currentPrice };
          };

          const computeTotalStrike = () => {
            let total = 0;
            for (const item of items) {
              if (item.type !== 'item') continue;
              if (item.dynamic_price) {
                const isSubscription = this.selectedSellingPlanGroup != null;
                let prev = '';
                if (isRefillProduct) {
                  prev = isSubscription ? getRefillSubscriptionStrike(this) : getRefillOneTimeStrike();
                } else {
                  prev = isSubscription
                    ? (this.subscriptionPricingConfig['previous_price'] || '$65')
                    : (this.oneTimePricingConfig['first']['bundle_previous_price'] || '$84');
                }
                total += parseInt((prev || '').replace(/[^0-9]/g, '')) || 0;
              } else if (item.previous_price) {
                total += parseInt(item.previous_price.replace(/[^0-9]/g, '')) || 0;
              }
            }
            return '$' + total;
          };

          const refillGroup = isRefillProduct && this.selectedSellingPlanGroup != null
            ? this.selectedSellingPlanGroup
            : null;

          return html`
        <div class="skio-first-order-includes${ isRefillProduct ? ' skio-first-order-includes--refill' : '' }" style="${ !hasOptionPicker ? 'margin-top: 0; border-top: 1px solid #000;' : '' }">
          <div class="skio-first-order-includes__title">${ sectionTitle }</div>
          ${ items.map(item => {
            if (item.type === 'disclaimer') {
              return this.availableSellingPlanGroups?.length > 0 ? html`
              <div class="skio-onetime-subscribe-disclaimer">
                ${ unsafeHTML(item.text) }<br>
                <a href="#" @click=${(e) => { e.preventDefault(); this.selectSellingPlanGroup(this.availableSellingPlanGroups[0]); }}>${ unsafeHTML(item.link_text) }</a>
              </div>` : '';
            }
            if (item.is_shipping) {
              return html`
              <div class="skio-first-order-item skio-first-order-item--shipping">
                <div class="skio-first-order-item__image"></div>
                <div class="skio-first-order-item__content">
                  <div class="skio-first-order-item__title">${ item.title }</div>
                </div>
                <div class="skio-first-order-item__price">
                  <span class="price--strike">${ item.previous_price }</span>
                  <span class="price--current">${ item.current_price }</span>
                </div>
              </div>`;
            }
            const prices = item.dynamic_price ? renderDynamicPrice() : { strikePrice: item.previous_price, currentPrice: item.current_price };
            return html`
            <div class="skio-first-order-item">
              ${ item.image ? html`
              <div class="skio-first-order-item__image">
                <img src="${ item.image }" alt="" width="50" height="50" />
              </div>` : '' }
              <div class="skio-first-order-item__content">
                <div class="skio-first-order-item__title">${ item.title }</div>
                ${ item.bullets?.length ? html`<p class="skio-first-order-item__bullets">${ unsafeHTML(item.bullets.map(b => '• ' + b).join('<br>')) }</p>` : '' }
              </div>
              <div class="skio-first-order-item__price">
                ${ prices.strikePrice ? html`<span class="price--strike">${ prices.strikePrice }</span>` : '' }
                ${ prices.currentPrice ? html`<span class="price--current">${ prices.currentPrice }</span>` : '' }
              </div>
            </div>`;
          }) }
          ${ showTotal ? html`
          <div class="skio-total-row">
            <span class="skio-total-row__label">TOTAL</span>
            <div class="skio-total-row__price">
              <span class="price--strike">${ computeTotalStrike() }</span>
              <span class="price--current">${ renderDynamicPrice().currentPrice }</span>
            </div>
          </div>
          ` : '' }
          ${ isRefillProduct && refillGroup ? html`
          <div class="skio-refill-frequency-wrap skio-refill-frequency-wrap--after-total">
            <div class="skio-custom-content-refill skio-custom-content-background-color">
              <div class="skio-container skio-refill-frequency-row">
                <div class="skio-refill-frequency-label">Delivery frequency</div>
                <select skio-selling-plans="${ refillGroup.id }" class="skio-frequency${ refillGroup.selling_plans.length == 1 ? ' skio-frequency--one' : '' }"
                  @change=${ (e) => this.selectSellingPlan(e.target, refillGroup) }>
                  ${ refillGroup.selling_plans.map((selling_plan) =>
                    html`
                  <option value="${ selling_plan.id }" ?selected=${ refillGroup.selected_selling_plan == selling_plan }>
                    ${ refillGroup.name == 'Subscription' ? `Delivery ${ selling_plan.name.toLowerCase() }` : `${ selling_plan.name }` }
                  </option>
                  `
                  )}
                </select>
              </div>
            </div>
          </div>
          ` : '' }
          <button type="button" class="add-to-cart skio-includes-cta" @click=${() => document.getElementById('main-clickable-button')?.click()}>BUY NOW</button>
          ${ includesFooterText ? html`<p class="skio-modify-disclaimer">${ includesFooterText }</p>` : '' }
        </div>
        `;
        })() }

            <!-- skio-details "How do subscriptions work?" - hidden via style for potential future use -->
            <details class="skio-details" @mouseover=${ (e) => this.detailsMouseover() } @mouseleave=${ (e) => this.detailsMouseleave() } style="display: none">
              <summary>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai ai-ArrowRepeat"><path d="M18 2l3 3-3 3"/><path d="M6 22l-3-3 3-3"/><path d="M21 5H10a7 7 0 0 0-7 7"/><path d="M3 19h11a7 7 0 0 0 7-7"/></svg>
                
                  How do subscriptions work?
                </span>
              </summary>
              <div class="skio-details--content">
                <ul>
                  <li>
                    <div class="skio-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div class="skio-content">
                      <p>Get exclusive deals</p>
                      <small>Subscribe for unique discounts</small>
                    </div>
                  </li>
                  <li>
                    <div class="skio-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <div class="skio-content">
                      <p>Edit your subscription anytime</p>
                      <small>Edit products, delivery schedule and more</small>
                    </div>
                  </li>
                  <li>
                    <div class="skio-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    
                    <div class="skio-content">
                      <p>No commitment</p>
                      <small>Easy to cancel if it's not for you</small>
                    </div>
                  </li>
                </ul>
                <div class="skio-details--footer">
                  <a class="skio-manage-link" href="/account/login?return_url=/a/account/shopify-login">Manage subscriptions</a> 
                  
                  <a style="letter-spacing: 0" class="powered-by-skio" href="https://skio.com/?utm_source=eonsincshop.myshopify.com&utm_medium=details_popover" target="_blank" rel="noopener">
                    Powered by
                    <svg width="24" height="11" viewBox="0 0 24 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.28399 5.78801C4.12399 5.63601 3.93599 5.50801 3.71999 5.40401C3.50399 5.30001 3.27599 5.24801 3.03599 5.24801C2.85199 5.24801 2.67999 5.28401 2.51999 5.35601C2.36799 5.42801 2.29199 5.55201 2.29199 5.72801C2.29199 5.89601 2.37599 6.01601 2.54399 6.08801C2.71999 6.16001 2.99999 6.24001 3.38399 6.32801C3.60799 6.37601 3.83199 6.44401 4.05599 6.53201C4.28799 6.62001 4.49599 6.73601 4.67999 6.88001C4.86399 7.02401 5.01199 7.20001 5.12399 7.40801C5.23599 7.61601 5.29199 7.86401 5.29199 8.15201C5.29199 8.52801 5.21599 8.84801 5.06399 9.11201C4.91199 9.36801 4.71199 9.57601 4.46399 9.73601C4.22399 9.89601 3.95199 10.012 3.64799 10.084C3.34399 10.156 3.03999 10.192 2.73599 10.192C2.24799 10.192 1.76799 10.116 1.29599 9.96401C0.831989 9.80401 0.443989 9.57201 0.131989 9.26801L1.23599 8.10401C1.41199 8.29601 1.62799 8.45601 1.88399 8.58401C2.13999 8.71201 2.41199 8.77601 2.69999 8.77601C2.85999 8.77601 3.01599 8.74001 3.16799 8.66801C3.32799 8.58801 3.40799 8.45201 3.40799 8.26001C3.40799 8.07601 3.31199 7.94001 3.11999 7.85201C2.92799 7.76401 2.62799 7.67201 2.21999 7.57601C2.01199 7.52801 1.80399 7.46401 1.59599 7.38401C1.38799 7.30401 1.19999 7.19601 1.03199 7.06001C0.871989 6.92401 0.739989 6.75601 0.635989 6.55601C0.531989 6.35601 0.479989 6.11601 0.479989 5.83601C0.479989 5.47601 0.555989 5.17201 0.707989 4.92401C0.859989 4.66801 1.05599 4.46001 1.29599 4.30001C1.53599 4.14001 1.79999 4.02401 2.08799 3.95201C2.38399 3.87201 2.67599 3.83201 2.96399 3.83201C3.41199 3.83201 3.84799 3.90401 4.27199 4.04801C4.70399 4.18401 5.06799 4.39201 5.36399 4.67201L4.28399 5.78801Z" fill="black"/>
                      <path d="M12.8481 10H10.4121L8.45615 7.13201H8.42015V10H6.44015V0.928009H8.42015V6.44801H8.45615L10.3641 4.02401H12.7521L10.4481 6.72401L12.8481 10Z" fill="black"/>
                      <path d="M15.7009 2.11601C15.7009 2.26801 15.6689 2.41201 15.6049 2.54801C15.5489 2.67601 15.4689 2.78801 15.3649 2.88401C15.2689 2.98001 15.1489 3.05601 15.0049 3.11201C14.8689 3.16801 14.7249 3.19601 14.5729 3.19601C14.2529 3.19601 13.9849 3.09201 13.7689 2.88401C13.5529 2.66801 13.4449 2.41201 13.4449 2.11601C13.4449 1.97201 13.4729 1.83601 13.5289 1.70801C13.5849 1.57201 13.6649 1.45601 13.7689 1.36001C13.8729 1.26401 13.9929 1.18801 14.1289 1.13201C14.2649 1.06801 14.4129 1.03601 14.5729 1.03601C14.7249 1.03601 14.8689 1.06401 15.0049 1.12001C15.1489 1.17601 15.2689 1.25201 15.3649 1.34801C15.4689 1.44401 15.5489 1.56001 15.6049 1.69601C15.6689 1.82401 15.7009 1.96401 15.7009 2.11601ZM13.5889 10V4.02401H15.5569V10H13.5889Z" fill="black"/>
                      <path d="M23.4516 6.98801C23.4516 7.47601 23.3636 7.92001 23.1876 8.32001C23.0116 8.71201 22.7716 9.04801 22.4676 9.32801C22.1636 9.60001 21.8116 9.81201 21.4116 9.96401C21.0116 10.116 20.5836 10.192 20.1276 10.192C19.6796 10.192 19.2516 10.116 18.8436 9.96401C18.4436 9.81201 18.0916 9.60001 17.7876 9.32801C17.4916 9.04801 17.2556 8.71201 17.0796 8.32001C16.9036 7.92001 16.8156 7.47601 16.8156 6.98801C16.8156 6.50001 16.9036 6.06001 17.0796 5.66801C17.2556 5.27601 17.4916 4.94401 17.7876 4.67201C18.0916 4.40001 18.4436 4.19201 18.8436 4.04801C19.2516 3.90401 19.6796 3.83201 20.1276 3.83201C20.5836 3.83201 21.0116 3.90401 21.4116 4.04801C21.8116 4.19201 22.1636 4.40001 22.4676 4.67201C22.7716 4.94401 23.0116 5.27601 23.1876 5.66801C23.3636 6.06001 23.4516 6.50001 23.4516 6.98801ZM21.5556 6.98801C21.5556 6.79601 21.5236 6.60801 21.4596 6.42401C21.3956 6.24001 21.3036 6.08001 21.1836 5.94401C21.0636 5.80001 20.9156 5.68401 20.7396 5.59601C20.5636 5.50801 20.3596 5.46401 20.1276 5.46401C19.8956 5.46401 19.6916 5.50801 19.5156 5.59601C19.3396 5.68401 19.1916 5.80001 19.0716 5.94401C18.9596 6.08001 18.8716 6.24001 18.8076 6.42401C18.7516 6.60801 18.7236 6.79601 18.7236 6.98801C18.7236 7.18001 18.7516 7.36801 18.8076 7.55201C18.8716 7.73601 18.9636 7.90401 19.0836 8.05601C19.2036 8.20001 19.3516 8.31601 19.5276 8.40401C19.7036 8.49201 19.9076 8.53601 20.1396 8.53601C20.3716 8.53601 20.5756 8.49201 20.7516 8.40401C20.9276 8.31601 21.0756 8.20001 21.1956 8.05601C21.3156 7.90401 21.4036 7.73601 21.4596 7.55201C21.5236 7.36801 21.5556 7.18001 21.5556 6.98801Z" fill="black"/>
                    </svg>
                  </a>
                  
                </div>
              </div>
            </details>

      </fieldset>`
  }

  updated = (changed) => {
    if(changed.has('product') && this.product) {
      // RAN ONLY ON FIRST LOAD
      window.ProductConfig.REFILL_DEFAULT.product_id
      if (this.product.id == window.ProductConfig.REFILL_DEFAULT.product_id 
      || this.product.id == window.ProductConfig.KIT_DOUBLE_LIGHTNING.product_id
      || this.product.id == 8954966147297 
      || this.product.id == 8943418736865 
      || this.product.id == window.ProductConfig.KIT_EMPTY_SPACE.product_id ) {
        console.log('has multiple selling plans')
        this.useVariantInputClickEvents = true
        this.variantInputSelector = 'input[name="refill-strength"]'
        this.addVariantClickEventListeners()
      } else {
        console.log('no need to worry about selling plan changes')
      }

      //update key
      this.key = this.key ? this.key : this.product.id;

      //update skioSellingPlanGroups
      this.skioSellingPlanGroups = this.product.selling_plan_groups.filter(
        selling_plan_group => selling_plan_group.app_id === 'SKIO'
      )

      this.skioSellingPlanGroups.forEach((group) => {
        group.selling_plans.sort(function(a,b){
          if (parseInt(a.name.replace(/\D/g, "")) < parseInt(b.name.replace(/\D/g, ""))) return -1;
          if (parseInt(a.name.replace(/\D/g, "")) > parseInt(b.name.replace(/\D/g, ""))) return 1;
          if (parseInt(a.name.replace(/\D/g, "")) == parseInt(b.name.replace(/\D/g, ""))) return 0;
        })
      });

    }

    if(changed.has('selectedVariant') && this.selectedVariant) {
      //update availableSellingPlanGroups based on skioSellingPlanGroups and selectedVariant.id
      let skioSellingPlanGroups = JSON.parse(JSON.stringify(this.skioSellingPlanGroups));
      this.availableSellingPlanGroups = skioSellingPlanGroups.filter(selling_plan_group =>
        selling_plan_group.selling_plans.some(selling_plan =>
          this.selectedVariant.selling_plan_allocations.some(
            selling_plan_allocation => selling_plan_allocation.selling_plan_id === selling_plan.id
          )
        )
      )

      //update selectedSellingPlan value
      if (this.availableSellingPlanGroups?.length > 0) {
        //update each group with a default selected_selling_plan

        this.availableSellingPlanGroups.forEach((group) => {
          group.selling_plans = group.selling_plans.filter(x => this.selectedVariant.selling_plan_allocations.find(y => y.selling_plan_id == x.id) );
        })

        this.availableSellingPlanGroups.forEach((group => {
          if (this.defaultFrequency) {
            let selling_plan = group.selling_plans.find(x => x.name.toLowerCase().includes(this.defaultFrequency.toLowerCase()));
            if (selling_plan) group.selected_selling_plan = selling_plan;
            else group.selected_selling_plan = group.selling_plans[0];
          } else {
            group.selected_selling_plan = group.selling_plans[0];
          }
       }));

        if (this.startSubscription == true || this.product.requires_selling_plan == true || this.purchaseOption == 'subscription') {
          //find a matching selling plan, or choose first available

          if (this.selectedSellingPlan == null || this.selectedSellingPlan == undefined) {
            this.selectSellingPlanGroup(this.availableSellingPlanGroups[0]);
          }

          let sellingPlanName = this.selectedSellingPlan?.name;

          let sellingPlanGroup = this.availableSellingPlanGroups.find(x => x.selling_plans.find(y => y.name == sellingPlanName));
          let sellingPlan = sellingPlanGroup?.selling_plans.find(y => y.name == sellingPlanName);
          if (sellingPlanName == sellingPlan.name) {
            this.selectedSellingPlanGroup = sellingPlanGroup;
            this.selectedSellingPlan = sellingPlan;
          } else {
          this.selectedSellingPlanGroup = this.availableSellingPlanGroups[0];
          this.selectedSellingPlan = this.availableSellingPlanGroups[0].selling_plans[0];
          }

        } else {
          this.selectedSellingPlan, this.selectedSellingPlanGroup = null
        }
      } else {
        this.selectedSellingPlan, this.selectedSellingPlanGroup = null
      }

      //update the form that was passed, if any
      this.updateForm();
      
      // Update pricing config for treatment quantity now that selling plan groups are available
      this.updatePricingConfigForTreatmentQuantity();
    }

    if(changed.has('selectedSellingPlan')) {
      // if (window.location.href.includes('at-home-whitening-kit-affiliate-ft')) {
      //   try {
      //     let dpk_choice = document.querySelector('input[name="dpk_chooser"]:checked')?.value || null;
      //     dpk_chosen(dpk_choice)
      //   } catch(e) {
          
      //   }
      // }
      //update price of price elements if applicable
      document.querySelectorAll(`[skio-price][skio-key="${ this.key }"]`).forEach((el) => {
        el.innerHTML = this.price(this.selectedSellingPlan);
      });

      //update display of external content elements
      document.querySelectorAll(`[skio-onetime-content][skio-key="${ this.key }"]`).forEach((el) => {
        this.selectedSellingPlan !== null ? el.style.display = "none" : el.style.removeProperty('display');
      });

      document.querySelectorAll(`[skio-subscription-content][skio-key="${ this.key }"]`).forEach((el) => {
        this.selectedSellingPlan == null ? el.style.display = "none" : el.style.removeProperty('display');
      });

      //dispatch CustomEvent to tell that this specific plan picker was updated, and pass the selectedSellingPlan
      const event = new CustomEvent(`skio::update-selling-plan`, {
        bubbles: true, 
        composed: true, 
        detail: {
          sellingPlan: this.selectedSellingPlan,
          key: this.key
        }
      });

      this.dispatchEvent(event);

      //update the form that was passed, if any
      this.updateForm();
      this.updateExternalPrice();

      //update external selling_plan input value
      let sellingPlanInput = document.querySelector('input[name="selling_plan"]')
      this.selectedSellingPlan != null ? sellingPlanInput.value = this.selectedSellingPlan.id : sellingPlanInput.value = ''

    }

    if(changed.has('formId')) {
      //update the form that was passed, if any
      this.updateForm();
    }

    if(changed.has('treatmentQuantity')) {
      this.updatePricingConfigForTreatmentQuantity();
    }

  }

  log = (...args) => {
    args.unshift('%c[skio]', 'color: #8770f2;');
    console.log.apply(console, args);
  }

  error = (...args) =>  {
    args.unshift('%c [skio]', 'color: #ff0000');
    console.error.apply(console, args);
  }

  detailsMouseover() {
    let details = this.renderRoot.querySelector('.skio-details');
    let summary = details?.querySelector('summary');
    if (details && summary && !details.hasAttribute('open') && this.showDetailsHover == false) {
      summary.click();
      this.showDetailsHover = true;
    }
  }

  detailsMouseleave() {
    let details = this.renderRoot.querySelector('.skio-details');
    let summary = details?.querySelector('summary');
    if (details && summary && details.hasAttribute('open') && this.showDetailsHover == true) {
      summary.click();
      this.showDetailsHover = false;
    }
  }

  updatePriceElement() {
    let priceEl = document.querySelector(`[data-skio-price="${ this.product.id }"]`);
    if (priceEl) {
      //add formatted price here
      let high = 0;
      this.product.variants.forEach((variant) => {
        if (variant.price > high) high = variant.price;
      });
      let content = '';
      if (!this.selectedSellingPlan) {
        content = this.moneyFormatter.format(this.selectedVariant.price / 100).replaceAll('A', '');
      } else {
        content = `<del>${this.moneyFormatter.format(high / 100).replaceAll('A', '')}</del>${this.price(this.selectedSellingPlan).replaceAll('A', '')}`;
      }
      priceEl.innerHTML = content;
    }
  }

  getMetadata(field) {
    let meta = this.meta;
    if (meta !== {}){
      let fieldData = meta[field];
      if (fieldData) return fieldData;
      else return '';
    }
  }

  getVariantMetadata(variantId, field) {
    let meta = this.meta;
    if (meta !== {}){
      let variantData = meta[variantId];
      if (variantData) {
        let fieldData = variantData[field];
        if (fieldData) return fieldData;
        else return '';
      }
    }
  }

  updateExternalPrice() {
    document.querySelectorAll(this.externalPriceSelector).forEach((el) => {
      this.selectedSellingPlan ? el.innerHTML = this.price(this.selectedSellingPlan) : el.innerHTML = this.money( this.selectedVariant.price);
    })
    document.querySelectorAll(this.externalPriceSelectorWithCurrency).forEach((el) => {
      this.selectedSellingPlan ? el.innerHTML = this.price(this.selectedSellingPlan) + ' ' + this.currency : el.innerHTML = this.money( this.selectedVariant.price) + ' ' + this.currency;
    })
  }
  
  // Update selected selling plan group; called on click of skio-group-container element
  selectSellingPlanGroup(group) {
    this.selectedSellingPlanGroup = group;
    this.selectedSellingPlan = group?.selected_selling_plan;
    if (this.selectedSellingPlan) this.lastSellingPlanName = this.selectedSellingPlan.name;
    if (group) {
      this.purchaseOption = 'subscription';
      // update the selected bundle to subscription. This ensure only one box is checked at any time
      if (this.selectedBundle != 'sub') {
        this.prevSelectedBundle = this.selectedBundle;
      }
      this.selectedBundle = 'sub';
    } else {
      this.purchaseOption = 'onetime';
      // Set default bundle when switching to one-time mode
      if (this.selectedBundle === 'sub') {
        this.selectedBundle = this.prevSelectedBundle || '1'; // Use previous bundle or default to '1'
      }
    }
    console.log('prevSelectedBundle', this.prevSelectedBundle)
    console.log('selectedBundle', this.selectedBundle)
    //update the form that was passed, if any
    this.updateForm();
    this.requestUpdate();
  }

  // Update selected selling plan; called on change of skio-frequency select element
  selectSellingPlan(element, group) {
    let selling_plan = group.selling_plans.find(x => x.id == element.value);
    if (selling_plan) {
      group.selected_selling_plan = selling_plan;
      this.selectedSellingPlanGroup = group;
      this.selectedSellingPlan = selling_plan;
      this.lastSellingPlanName = this.selectedSellingPlan.name;
      this.updateForm();
      this.requestUpdate();
    } else {  
      this.log("Error: couldn't find selling plan with id " + element.value + " for variant " + this.selectedVariant.id + " from product " + this.product.id + " : " + this.product.handle);
    }
  }

  // Update selected selling plan; called on change of skio-frequency select element
  selectSellingPlanButton(plan, group) {
    let selling_plan = group.selling_plans.find(x => x.id == plan.id);
    if (selling_plan) {
      group.selected_selling_plan = selling_plan;
      this.selectedSellingPlanGroup = group;
      this.selectedSellingPlan = selling_plan;
      this.lastSellingPlanName = this.selectedSellingPlan.name;
      this.updateForm();
      this.requestUpdate();
    }
    else this.log("Error: couldn't find selling plan with id " + element.value + " for variant " + this.selectedVariant.id + " from product " + this.product.id + " : " + this.product.handle);
  }

  // Formats integer value into money value
  money(price) {
    return this.moneyFormatter.format(price / 100.0)
  }

  // Calculates discount based on selling_plan.price_adjustments, returns { percent, amount } of selling plan discount
  discount(selling_plan) {

    if (!selling_plan)
      return { percent: '0%', amount: 0 }

    if (selling_plan.name.includes('prepaid')) {

      let option = selling_plan.options[0]['value'];

      var numberPattern = /\d+/g;
      let result = parseInt(option.match( numberPattern ).join(''));

      const price_adjustment = selling_plan.price_adjustments[0]
      const discount = { percent: '0%', amount: 0 }
      const price = this.selectedVariant.price * result;
      
      switch (price_adjustment.value_type) {
        case 'percentage':
          discount.percent = `${price_adjustment.value}%`
          discount.amount = Math.round(
            (price * price_adjustment.value) / 100.0
          )
          break
        case 'fixed_amount':
          discount.percent = `${Math.round(
            ((price_adjustment.value * 1.0) / price) * 100.0
          )}%`
          discount.amount = price - price_adjustment.value
          break
        case 'price':
          discount.percent = `${Math.round(
            (((price - price_adjustment.value) * 1.0) /
              price) *
              100.0
          )}%`
          discount.amount = price - price_adjustment.value
          break
      }
      
      return discount

    } else {

      const price_adjustment = selling_plan.price_adjustments[0]
      const discount = { percent: '0%', amount: 0 }
      const price = this.selectedVariant.price;
      
      switch (price_adjustment.value_type) {
        case 'percentage':
          discount.percent = `${price_adjustment.value}%`
          discount.amount = Math.round(
            (price * price_adjustment.value) / 100.0
          )
          break
        case 'fixed_amount':
          discount.percent = `${Math.round(
            ((price_adjustment.value * 1.0) / price) * 100.0
          )}%`
          discount.amount = price_adjustment.value
          break
        case 'price':
          discount.percent = `${Math.round(
            (((price - price_adjustment.value) * 1.0) /
              price) *
              100.0
          )}%`
          discount.amount = price - price_adjustment.value
          break
      }
      
      return discount

    }
    
  }

  // Calculates the variant's price for the given selling plan, returns a formatted money value (if desired)
  price(selling_plan, formatted = true) {

    if (selling_plan.name.includes('prepaid')) {

      let option = selling_plan.options[0]['value'];
      var numberPattern = /\d+/g;
      let result = parseInt(option.match( numberPattern ).join(''));

      return formatted
        ? this.money( (this.selectedVariant.price * result) - this.discount(selling_plan).amount)
        :  (this.selectedVariant.price * result) - this.discount(selling_plan).amount

    } else {

      return formatted
        ? this.money( this.selectedVariant.price - this.discount(selling_plan).amount)
        :  this.selectedVariant.price - this.discount(selling_plan).amount

    }

    
  }

  // If a formId was passed, appends the necessary <input> elements to the form
  updateForm() {
    if (this.formId) {
      let form = document.querySelector(`#${this.formId}`);

      if (form) {
        let selling_plan_input = form.querySelector('[name="selling_plan"]');
        if (selling_plan_input) {
          selling_plan_input.value = (this.subscription_enabled && this.selectedSellingPlan?.id !== undefined) ? this.selectedSellingPlan?.id : null;
          selling_plan_input.disabled = (this.subscription_enabled && this.selectedSellingPlan?.id !== undefined) ? false : true;
        } else {
          selling_plan_input = document.createElement('input');
          selling_plan_input.type = "hidden";
          selling_plan_input.name = "selling_plan";
          selling_plan_input.value = (this.subscription_enabled && this.selectedSellingPlan?.id !== undefined) ? this.selectedSellingPlan?.id : null;
          selling_plan_input.disabled = (this.subscription_enabled && this.selectedSellingPlan?.id !== undefined) ? false : true;
          form.append(selling_plan_input);
        }

        let discountValue = (this.subscription_enabled && this.selectedSellingPlan?.id !== undefined) ? this.discount(this.selectedSellingPlan).percent : null;
        if (discountValue == '0%') discountValue = null;

        let discount_input = form.querySelector('[name="properties[Discount]"]');
        if (discount_input) {
          discount_input.value = (this.subscription_enabled && this.selectedSellingPlan?.id !== undefined) ? this.discount(this.selectedSellingPlan).percent : null;
          discount_input.disabled = (this.subscription_enabled && this.selectedSellingPlan?.id !== undefined) ? false : true;
          if (discountValue == null) discount_input.disabled = true;
        } else {
          discount_input = document.createElement('input');
          discount_input.type = "hidden";
          discount_input.name = "properties[Discount]";
          discount_input.value = (this.subscription_enabled && this.selectedSellingPlan?.id !== undefined) ? this.discount(this.selectedSellingPlan).percent : null;
          discount_input.disabled = (this.subscription_enabled && this.selectedSellingPlan?.id !== undefined) ? false : true;
          if (discountValue == null) discount_input.disabled = true;
          form.append(discount_input);
        }

      } else {
        console.log(`Skio error: form ID is ${ this.formId }, but no form with that ID was found.`);
      }
    }
  }

  addVariantClickEventListeners() {
    let initial_setting_dict = {
          "sensitive": '🍃 Gentle (ID: 19-2)',
          "medium": '✨ Everyday (ID: 8-16)',
          "strong": '🔥 Super Strength (ID: 8-17)'
    }
    

    let variantInputs = document.querySelectorAll(this.variantInputSelector)
    let skio = this

    let inital_strength = this.getCookie('strength')
    if (inital_strength) {
      skio.selectedVariant = skio.product.variants.find(variant => variant.title == initial_setting_dict[inital_strength])
    }
        
    console.log('add variant click listeners')
    for (let el of variantInputs) {
      el.addEventListener('click', function(e) {
        // may need to replace with ID / e.target depending on client setup
        // may need to use different attribute depending on ^^
        let variantTitle = e.currentTarget.value
        console.log('variant event listener')
        console.log(variantTitle)
        skio.selectedVariant = skio.product.variants.find(variant => variant.title == variantTitle)
      })
    }
  }

  // Optional functions keep if necessary 

  /**
   *   
   * 
   */
  
  // Runs a fetch request to add the selectedVariant to the cart with the passed quantity and selectedSellingPlan
  addToCart(quantity = 1) {
    const items = [
      {
        id: this.selectedVariant.id,
        quantity: quantity,
        ...(this.selectedSellingPlan && { selling_plan: this.selectedSellingPlan?.id })
      }
    ];

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    })
    .then((response) => response.json())
    .then((response) => {
      this.log("SKIO added item to cart: ", response);
      //dispatch CustomEvent to tell document that an item was added to cart
      const event = new CustomEvent(`skio::added-to-cart`, {
        bubbles: true, 
        composed: true, 
        detail: {
          response,
          key: this.key
        }
      });

      this.dispatchEvent(event);
    })
    .catch((error) => {
      this.error(`SKIO ${ this.key } error adding item to cart: `, error);
    });
  } 

  fetchProduct = (handle) => {
    return fetch(`/products/${ handle }.js`)
    .then((response) => response.json())
    .then((product) => {
      this.product = product;
      this.selectedVariant = product.variants[0];

      return product;
    });
  }

  selectBundle(bundleValue) {
    if (this.selectedBundle != 'sub') {
      this.prevSelectedBundle = this.selectedBundle;
    }
    this.selectedBundle = bundleValue;
    this.requestUpdate(); // Trigger re-render
  }
}

customElements.define('skio-plan-picker', SkioPlanPickerComponent);

  function waitForElmShadowRoot(selector) {

    return new Promise(resolve => {
        if (document.querySelector('skio-plan-picker').shadowRoot.querySelector(selector)) {
            return resolve(document.querySelector('skio-plan-picker').shadowRoot.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector('skio-plan-picker').shadowRoot.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector('skio-plan-picker').shadowRoot.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}