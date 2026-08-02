function add_pen_cookie() {
  const strength_cookie = getCookie('strength')
  kit_formula_dict = {
    'medium': 42250643833057,
    'strong': 42250643865825,
    'sensitive': 42250643898593
  }
  
  pen_formula_dict = {
    'medium': 42210600812769,
    'strong': 42210600845537,
    'sensitive': 42210600878305
  }

  pen_selling_plan_dict = {
    3449880801: 3450175713,
    3449913569: 3450208481,
    3449946337: 3450241249
  }

  if (strength_cookie in pen_formula_dict) {
    formula_id = pen_formula_dict[strength_cookie]
  } else {
    formula_id = pen_formula_dict['medium']
  }

  setCookie('add_pen', formula_id)
}

setCookie('add_pen', 'false')

customElements.define('product-form', class ProductForm extends HTMLElement {
  constructor() {
    super();   

    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartDrawer = document.querySelector('cart-drawer');
    this.container = this.closest(".product__info-wrapper")
    this.productId = this.dataset.productId

    this.mostRecentSellingPlan = ''
    this.sellingPlans = null; // Initialize selling plans attribute

    this.stickyBar = document.querySelector(`sticky-product-bar[data-id="${ this.productId }"]`)

    this.setName();

    this.createSubscriptionWidget();
    
    // Initialize selling plans
    this.initializeSellingPlans();

    document.addEventListener('DOMContentLoaded', () => {
      // 'this' here refers to the original outer context
      this.bundleStickyBar();
    });

  }

  async initializeSellingPlans() {
    try {
      if (this.productId) {
        this.sellingPlans = await fetchPlansByProductIds([this.productId, window.ProductConfig.REFILL_DEFAULT.product_id]);
        // this.sellingPlans = await fetchPlansByProductIds([window.ProductConfig.REFILL_DEFAULT.product_id]);

        console.log('Selling plans loaded:', this.sellingPlans);
        this.indexPlans(this.sellingPlans);
      }
    } catch (error) {
      console.error('Error fetching selling plans:', error);
      this.sellingPlans = null;
    }
  }

  indexPlans(sellingPlans) {
    this.sellingPlansByVariant = indexPlansByVariant(sellingPlans, this.productId);
    console.log('sellingPlansByVariant')
    console.log(this.sellingPlansByVariant)

    this.currentProductSellingPlan = indexPlansCurrentProduct(sellingPlans, this.productId);
    console.log('currentProductSellingPlan')
    console.log(this.currentProductSellingPlan)
  }

  getCookie(cname) {
    // Get cookie by cookie name
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

  setName() {
    // Set name of customer in product page header.
    // Retrieves first name from the quiz cookies.
    const first_name = getCookie('firstname') || ""
    const last_name = getCookie('lastname') || ""
    const storedProductName = this.container?.querySelector('#product__title_id')?.innerHTML

    let name = `${first_name}${ last_name != "" ? ' ' + last_name : ''}`

    if (first_name != '') {
      name = first_name
    }

    if (window.location.href.includes('at-home-whitening-kit')) { 
      if ( name != "" && !storedProductName?.toLowerCase().includes("to go pen") && window.location.pathname != '/pages/landing-page') {
        this.container.querySelector('#product__title_id').innerHTML = `<span class="stylized">${name}'s</span><br> ${storedProductName.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')}`
      }
    } else if (window.location.href.includes('landing-page-product-main')) {
      $('#perfect-match-text').html(`${name}'s Perfect Match`)
    }
  }

  // skio-plan-picker
  // input[name='id']
  setVariant(selection='✨ Everyday (ID: 8-16)', picked = false) {
    // Select the product variant chosen in the quiz in the product page selection
    // Set the product variant formula in the sticky checkout
    // Set the ingredients correpoding to the picked formula, in the product page
    let strength = getCookie('strength')
    let inputValue
    switch (strength){
      case 'sensitive':
        if (window.location.href.includes('at-home-whitening-kit-2')) {
          inputValue = 'Gentle'
        } else {
          inputValue = '🍃 Gentle (ID: 19-2)'
        }
        break;
      case 'medium':
        if (window.location.href.includes('at-home-whitening-kit-2')) {
          inputValue = 'Balance'
        } else {
          inputValue = '✨ Everyday (ID: 8-16)'
        }
        break;
      case 'strong':
        if (window.location.href.includes('at-home-whitening-kit-2')) {
          inputValue = 'Supermax'
        } else {
          inputValue = '🔥 Super Strength (ID: 8-17)'
        }
        break;
      default: 
        if (window.location.href.includes('at-home-whitening-kit-2')) {
          inputValue = 'Balance'
        } else {
          inputValue = '✨ Everyday (ID: 8-16)'
        }
        break;
    }

    if ((window.location.href.includes('at-home-whitening-kit') || window.location.href.includes('at-home-whitening-kit-ft')) && !picked) {
      // If product is kit, try to set the required formula strength
      try {
        this.querySelector(`input[value="${inputValue}"]`).click()

        if(document.querySelector(`[data-formula-type] [data-variant-title="${inputValue}"]`)){
          document.querySelector(`[data-formula-type] [data-variant-title="${inputValue}"]`).classList.remove("hidden")

          // Set sticky checkout formula
          if(document.querySelector(`[data-sticky-formula]`)) document.querySelector(`[data-sticky-formula]`).innerHTML = document.querySelector(`[data-formula-type] [data-variant-title="${inputValue}"]`).innerHTML.split(":")[0]
        }
    
        // Set ingredients based on metafields
        if(window.variantIngredients){
          let variantIngredientList = window.variantIngredients.find((v) => v.id == inputValue)
    
          let ingredientCards = document.querySelectorAll("[data-ingredient]")
          ingredientCards.forEach((ingredient, i) => {
            if( variantIngredientList.ingredients.includes(ingredient.dataset.ingredient)) {
              ingredient.classList.remove("hidden")
            } else {
              ingredient.classList.add("hidden")
            }
            if( i == ingredientCards.length - 1) {
              ingredient.closest('.swiper').classList.add('update')
            }
          })
        }
      } catch (e) {
        console.log("Error: failure in setVariant() for product-form.js")
        console.log(e)
      }
    } else {
      // try {
        let all_strengths = ['🍃 Gentle (ID: 19-2)', '✨ Everyday (ID: 8-16)', '🔥 Super Strength (ID: 8-17)']
        let selection_to_cookie = {
          '🍃 Gentle (ID: 19-2)': "sensitive",
          '✨ Everyday (ID: 8-16)': "medium",
          '🔥 Super Strength (ID: 8-17)': "strong"
        }
        setCookie('strength', selection_to_cookie[selection])
        if (typeof window.updateFormulaIngredientCopy === 'function') window.updateFormulaIngredientCopy()

        let refill_formula_selector = this.querySelector(`variant-radios input[value="${selection}"]`);
        let refill_formula_new_dawn = document.querySelector(`variant-selects input[type="radio"][value="${selection}"]`);

        if (refill_formula_selector) {
          refill_formula_selector.click();
        } else if (refill_formula_new_dawn) {
          refill_formula_new_dawn.click();
        } else {
          console.warn(`No radio input found for value: ${selection}`);
        }
        
        all_strengths.forEach(element => {
          if(document.querySelector(`[data-formula-type] [data-variant-title="${element}"]`)){
            document.querySelector(`[data-formula-type] [data-variant-title="${element}"]`).classList.add("hidden")  
          }
        });
        
        if(document.querySelector(`[data-formula-type] [data-variant-title="${selection}"]`)){
          document.querySelector(`[data-formula-type] [data-variant-title="${selection}"]`).classList.remove("hidden")

          // Set sticky checkout formula
          if(document.querySelector(`[data-sticky-formula]`)) document.querySelector(`[data-sticky-formula]`).innerHTML = selection
        }
    
        // Set ingredients based on metafields
        // if(window.variantIngredients){
        //   let variantIngredientList = window.variantIngredients.find((v) => v.id == inputValue)
    
        //   let ingredientCards = document.querySelectorAll("[data-ingredient]")
        //   ingredientCards.forEach((ingredient, i) => {
        //     if( variantIngredientList.ingredients.includes(ingredient.dataset.ingredient)) {
        //       ingredient.classList.remove("hidden")
        //     } else {
        //       ingredient.classList.add("hidden")
        //     }
        //     if( i == ingredientCards.length - 1) {
        //       ingredient.closest('.swiper').classList.add('update')
        //     }
        //   })
        // }
      // } 
      // catch (e) {
      //   console.log("Error: failure in setVariant() for product-form.js")
      //   console.log(e)
      // }
    }
  }

  waitForSkio(selector) {
    // Wait for skio-plan-picker to be available on the site
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        let timeout = setTimeout(() => {
          observer.disconnect();
          resolve('Nothing happened ?');
        }, 5 * 1000);
    });
  }

  createSubscriptionWidget() {
    // Remove loading bars and show Skio UI once its available
    // sticky checkout to observe any updates to selling plan and reflect accordingly
    try {
       this.waitForSkio('skio-plan-picker').then(() => {  
        try {
          this.container.querySelector(".loading-overlay__spinner").classList.add("hidden")
          this.container.querySelector("product-form.visually-hidden").classList.remove("visually-hidden")
          this.stickyBar.querySelector("[data-sticky-atc]").removeAttribute('disabled')
        } catch (e) {
          //fails on special product
        }
        
        let selling_plan_input = document.querySelector('input[name="selling_plan"]')
        this.observeForm(selling_plan_input)
        this.setVariant();
        this.observeFormulaPicker('input[name="refill-strength"]')
      })
    } catch (e) {
        console.log("Error: failure in createSubcriptionWidget() for product-form.js")
        console.log(e)
    }
  }

  updateStickyBar(event) {
    // Update selection option for selling plan in sticky checkout
    let subscriptionSelected = !!event.detail.sellingPlan
    let price
    let skio = document.querySelector('skio-plan-picker').shadowRoot

    if (subscriptionSelected) {
      this.stickyBar.querySelector('[data-sticky-subsave]').classList.add('selected')
      this.stickyBar.querySelector('[data-sticky-onetime]').classList.remove('selected')

      price = skio.querySelector(`[skio-subscription-price]`)?.innerText
    }
    else {
      this.stickyBar.querySelector('[data-sticky-onetime]').classList.add('selected')
      this.stickyBar.querySelector('[data-sticky-subsave]').classList.remove('selected')

      price = skio.querySelector(`[skio-onetime-price]`)?.innerText
    }

    this.stickyBar.querySelector(".sticky__price").innerHTML = price
  }

    bundleStickyBar() {
    if (!document.querySelector('.price-section')) {
      try {
        let skio_plan_picker = document.querySelector('skio-plan-picker')
        skio_plan_picker.addEventListener('click', (e) => {
          try {
            if (document.querySelector('[data-sticky-onetime]')) {
              let customPrice = document.querySelector('skio-plan-picker').shadowRoot.querySelector('input[name="onetime_bundle"]:checked').dataset.customPrice
              document.querySelector(".sticky__price").innerHTML = customPrice
            }
          } catch (e) {
            console.log(e)
          }
        });
      } catch (e) {
        console.log(e)
      }
      return 
    } else {
      return
    }
  }

  observeForm(selling_plan_input) {
      // Watch selling_plan changes and make updates to sticky bar in case of any changes.
      if (!document.querySelector('.price-section')) { // dont give the option for special ones
        try {
            let skio = document.querySelector('skio-plan-picker')

            skio.addEventListener('skio::update-selling-plan', (e) => {
            
            let sub_price = document.querySelector('skio-plan-picker').shadowRoot.querySelector(`[skio-subscription-price]`)?.innerText

            $('span.price-item.price-item--regular').html(sub_price + '.00 USD');

            if (this.stickyBar) {
              this.updateStickyBar(e)
            }
            
            this.mostRecentSellingPlan = e.detail.sellingPlan ? e.detail.sellingPlan.id : this.mostRecentSellingPlan
            console.log(this.mostRecentSellingPlan)
          })        
        } catch (e) {
            console.log("Error: failure in observeForm() for product-form.js")
            console.log(e)
        }
    }
  }

  observeFormulaPicker(refill_strength_input) {
    try {
        let refill_strength = document.querySelectorAll(refill_strength_input)
        let skio = document.querySelector('skio-plan-picker')

        // Add change event listener to each radio button
        refill_strength.forEach(radio => {
          radio.addEventListener('change', (e) => {
            // Example of triggering different actions based on selection
            console.log(e.target.value)
            this.setVariant(e.target.value, true)
            
            if (document.querySelector('.price-section')) {
              updatePrices(e.target.value === '🔥 Super Strength (ID: 8-17)');
            }
          });
        });

        // initial setting
        let strength = getCookie('strength')
        if (!strength) {
          strength = 'medium';
        }
        let id = '#' + strength
        $(id).prop('checked', true).trigger('change');

    } catch (e) {
        console.log("refill strength picker not found")
    }
  }

  onSubmitHandler(evt) {
    evt.preventDefault();    
    console.log('onSubmitHandler');
    document.cookie = "directcheckout=true;path=/";

    let p_referrer = getCookie('affiliate_referrer')

    const submitButton = this.querySelector('[type="submit"]');

    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');

    let skio = document.querySelector('skio-plan-picker')
    let product_form = JSON.parse(serializeForm(this.form))

    console.log(product_form)

    let quantity_setter = 1

    let itemsList;

    let bundle_value = null
    let bundle_quantities = {'1':1, '2':3, '3': 5}

    const treatmentQuantity = document.querySelector('input[name="treatment-quantity"]:checked')?.value;

    if (product_form.product_id == window.ProductConfig.KIT_DEFAULT.product_id
      && treatmentQuantity == '12'
      && 'selling_plan' in product_form
    ) {
      setCookie('manual_discount', 'SUB_12_TREATMENTS')
    } else {
      setCookie('manual_discount', '')
    }

    // not subscription and bundle is not explicitly disabled: use onetime bundle quantity and set bundle_discount
    if (!('selling_plan' in product_form) && 
    !(ConfigUtils.equals(affiliate_config, `${p_referrer}.flow.bundle_enabled`, false))
    && product_form.product_id == window.ProductConfig.KIT_DEFAULT.product_id) {
      bundle_value = document.querySelector('skio-plan-picker').shadowRoot.querySelector('input[name="onetime_bundle"]:checked').value

      if (ConfigUtils.exists(affiliate_config, `${p_referrer}.flow.bundle_discount.${bundle_value}`)) {
        setCookie('bundle_discount', ConfigUtils.getValue(affiliate_config, `${p_referrer}.flow.bundle_discount.${bundle_value}`))
      } else {
        setCookie('bundle_discount', '')
      }

      itemsList = [{
        id: product_form.id, // this is variant id
        quantity: bundle_quantities[bundle_value],
        selling_plan: product_form.selling_plan? skio.selectedSellingPlan.id: '' //product_form.selling_plan // or can also do 
      }]
    } 
    else {
      setCookie('bundle_discount', '')
      itemsList = [{
        id: product_form.id, // this is variant id
        quantity: quantity_setter,
        selling_plan: product_form.selling_plan? skio.selectedSellingPlan.id: '' // product_form.selling_plan // or can also do 
      }]
    }

    if (treatmentQuantity === '6') {
      console.log('6 treatments selected');
    } else if (treatmentQuantity === '12') {
      const strength_cookie = getCookie('strength') || 'medium'
      let translate = {
        'medium': 'everyday',
        'strong': 'super',
        'sensitive': 'gentle'
      }
      let addOnProductId = window.ProductConfig.REFILL_DEFAULT.product_id
      let addOnVariantId = window.ProductConfig.REFILL_DEFAULT.variants[translate[strength_cookie]]

      if (product_form.selling_plan) {
        let cadenceKey = this.currentProductSellingPlan[skio.selectedSellingPlan.id]
        let addOnSellingPlanId = this.sellingPlansByVariant[addOnProductId][addOnVariantId][cadenceKey]

        itemsList.push({
          id: addOnVariantId,
          quantity: 1,
          selling_plan: addOnSellingPlanId
        })
      } else {
        if (bundle_value) {
          quantity_setter = bundle_quantities[bundle_value]
        }

        itemsList.push({
          id: addOnVariantId,
          quantity: quantity_setter
        })
      }
    }

    // Add pen when main kit (current_products_ref.KIT_DEFAULT) and subscription checkout; or when user chose pen in upsell (add_pen cookie)
    var kitProductIdForPen = (typeof current_products_ref !== 'undefined' && current_products_ref.KIT_DEFAULT) ? current_products_ref.KIT_DEFAULT.product_id : (window.ProductConfig && window.ProductConfig.KIT_DEFAULT && window.ProductConfig.KIT_DEFAULT.product_id) || 7503162605793;
    var isSubscription = !!(product_form.selling_plan || (skio && skio.selectedSellingPlan && skio.selectedSellingPlan.id));
    var addPenForKitSubscription = (product_form.product_id == kitProductIdForPen && isSubscription);
    if (addPenForKitSubscription) {
      add_pen_cookie();
    }

    let pen = this.getCookie('add_pen');
    var shouldAddPen = (pen && pen != 'false') || addPenForKitSubscription;
    if (shouldAddPen) {
      var penVariantId = (pen && pen != 'false') ? pen : this.getCookie('add_pen');
      if (penVariantId && penVariantId != 'false') {
        itemsList.push({
          id: penVariantId,
          quantity: 1
        });
      }
    }

    if ($('#package_protection').prop('checked')) {
      itemsList.push({
          id: 39775917605037,
          quantity: 1
        })
      }

    let formData = {
      'items': itemsList
    }

    let body = JSON.stringify(formData)


    if (window.location.href.includes('landing-page-product-main')) {
      let json_body = JSON.parse(body)
      let id_dict = {
        "1_month": {
          "sensitive": 43934768070881,
          "medium": 43934768005345,
          "strong": 43934768038113
        },
        "2_month": {
          "sensitive": 43934775673057,
          "medium": 43934775607521,
          "strong": 43934775640289
        },
        "3_month": {
          "sensitive": 43934773838049,
          "medium": 43934773772513,
          "strong": 43934773805281
        }
      }

      let product_dict = {
        "1_month": 8042329407713,
        "2_month": 8043044372705,
        "3_month": 8043108139233
      }
      let supply_type = $('input[name="supply_type"]:checked').val()
      let strength = getCookie('strength')
      json_body['id'] = id_dict[supply_type][strength]
      json_body['product-id'] = product_dict[supply_type]
      body = JSON.stringify(json_body)
    }
    
    fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
      .then((response) => response.json())
      // .then(data => {
      //   let cactus = this.getCookie('redirect_ut')

      //   if (cactus == true) {
      //     console.log('cactus')
      //   }
      // })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('disabled');
        document.querySelector('.page-transition').classList.toggle('visible');
        window.location = '/cart'
      });
  }

  getSectionsToRender() {
    const cartDrawerEl = document.getElementById('cart-drawer__content');
    const sections = [];
    if (cartDrawerEl && cartDrawerEl.dataset && cartDrawerEl.dataset.id) {
      sections.push({
        id: 'cart-drawer__content',
        section: cartDrawerEl.dataset.id,
        selector: '.cart-drawer__content',
      });
    }
    sections.push({
      id: 'cart-icon-bubble',
      section: 'cart-icon-bubble',
      selector: '.shopify-section'
    });
    return sections;
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
    this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

    this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
});

customElements.define('sticky-product-bar', class StickyProductBar extends HTMLElement {
  constructor() {
    super()

    this.container = this.closest('.product-sticky-bar')
    this.productId = this.dataset.id
    this.onetime = this.querySelector("[data-sticky-onetime")
    this.subsave = this.querySelector("[data-sticky-subsave")
    this.mainForm = document.querySelector(`product-form[data-product-id="${ this.productId}"]`)
    this.atc = this.querySelector("[data-sticky-atc]")
    this.open = this.container.querySelector("[data-sticky-open]")
    this.close = this.container.querySelector("[data-sticky-close]")

    this.waitForEl("sticky-product-bar [data-plans-dropdown]").then(() => {
      this.sellingPlans = this.querySelector("input[name='selling_plan']")
      console.log(this.sellingPlans)
      this.sellingPlans.addEventListener("change", function(e){
        this.updateSellingPlans(e)
      }.bind(this))
    })

    this.bindEvents()
  }

  bindEvents() {

    let skio = document.querySelector('skio-plan-picker')

    this.open.addEventListener("click", this.openStickyBar.bind(this))
    this.close.addEventListener("click", this.closeStickyBar.bind(this))
    this.onetime.addEventListener('click', function(e){
      skio.selectedSellingPlanGroup = null
      skio.selectedSellingPlan = null
    }.bind(this))

    this.subsave.addEventListener('click', function(e){
      skio.selectedSellingPlanGroup = skio.availableSellingPlanGroups[0]
      skio.selectedSellingPlan = skio.availableSellingPlanGroups[0].selling_plans.find(plan => plan.id == this.mainForm.mostRecentSellingPlan)
    }.bind(this))

    this.atc.addEventListener('click', function(e){
      e.preventDefault();
      this.atc.setAttribute("disabled", "true")
      document.querySelector(`button[type="submit"]`).click()
    }.bind(this))


    let referrer = getCookie('affiliate_referrer')
    let one_time_pricing_e = (affiliate_config[referrer] ?? {}).pricing?.one_time_enabled ?? true;
    let sub_pricing_e = (affiliate_config[referrer] ?? {}).pricing?.subscription_enabled ?? true;
    if (!(one_time_pricing_e && sub_pricing_e)) {
      $('#shopify-section-sticky-product-bar').css('display', 'none')
    }
    $('#shopify-section-sticky-product-bar').css('display', 'none')
  }

  openStickyBar() {
      slideDown(this.parentElement)
      this.open.setAttribute("aria-hidden", "true")
  }

  closeStickyBar() {
    slideUp(this.parentElement)
    this.open.setAttribute("aria-hidden", "false")
  }

  updateSellingPlans(e) {
    const controller = document.querySelector(`select#${e.target.dataset.controlId} `)
    controller.value = e.target.value
  }

  waitForEl(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              resolve(document.querySelector(selector));
              observer.disconnect();
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
  }
})


// Commented out to fix treatment quantity radio button state restoration issue
// window.addEventListener('pageshow', function(event) {
//   if (event.persisted) {
//     console.log('loaded from cache')
//     // The page was loaded from bfcache (back-forward cache) or a similar mechanism.
//     // You can force a reload or reinitialize any state here.
//    window.location.reload();
//   }
// });