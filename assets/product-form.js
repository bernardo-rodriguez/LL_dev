customElements.define('product-form', class ProductForm extends HTMLElement {
  constructor() {
    super();   

    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartDrawer = document.querySelector('cart-drawer');
    this.container = this.closest(".product__info-wrapper")
    this.productId = this.dataset.productId

    this.mostRecentSellingPlan = ''

    this.stickyBar = document.querySelector(`sticky-product-bar[data-id="${ this.productId }"]`)

    this.setName();
    this.setVariant();

    this.createSubscriptionWidget();

    this.getSubPrice()
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

    const name = `${first_name}${ last_name != "" ? ' ' + last_name : ''}`

    if (window.location.href.includes('at-home-whitening-kit')) { 
      if ( name != "" && !storedProductName?.toLowerCase().includes("to go pen") && window.location.pathname != '/pages/landing-page') {
        this.container.querySelector('#product__title_id').innerHTML = `<span class="stylized">${name}'s</span><br> ${storedProductName.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')}`
      }
    } else if (window.location.href.includes('landing-page-product-main')) {
      $('#perfect-match-text').html(`${name}'s Perfect Match`)
    }
  }

  setVariant() {
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

    if (window.location.href.includes('at-home-whitening-kit')) {
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
    } 
  }

  getSubPrice() {
    // Return subscription price and text based on redirection cookie
    const cookies = ['redirect_inspire', 'redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans', 'redirect_skimm']

    let subscriptionCookie = cookies.filter( cookieName => this.getCookie(cookieName) != null )
    let subPrice = ''
    let subText = ''
    let oneTimeText = ''
    let oneTimePrice = ''

    switch(subscriptionCookie[0]) {
       // case 'redirect_skimm':
       //  subPrice = '$19'
       //  subText = 'Subscribe & Save'
       //  oneTimeText = 'Skimm One-Time'
       //  oneTimePrice = '$57'
       //  break
       case 'redirect_sweatcoin':
        subPrice = '$0'
        subText = 'SWEATCOIN SPECIAL'
        // this.add_pen()
        break
      case 'redirect_ut':
        this.add_pen()
        subPrice = '$9'
        subText = 'STARTER SPECIAL'
        // subPrice = '$0'
        // subText = 'FREE TRIAL SPECIAL'
        // subPrice = '$19'
        // subText = 'STARTER SPECIAL'
        break;
      case 'redirect_ut_direct':
        subPrice = '$9'
        subText = 'Starter Special'
        // subPrice = '$0'
        // subText = 'FREE TRIAL SPECIAL'
        break
      case 'redirect_paceline':
        subPrice = '$29'
        subText = 'Subscribe & Save'
        break
      case 'redirect_miles':
        subPrice = '$9'
        subText = 'Subscribe & Save'
        break
      case 'redirect_studentbeans':
        subPrice = '$9'
        subText = 'Subscribe & Save'
        break
      case 'redirect_inspire':
        subPrice = '$13.5'
        subText = 'Subscribe & Save'
        break
      default:
        subPrice = '$19'
        subText = 'Subscribe & Save'
        break
    }

    return [subPrice, subText, oneTimeText, oneTimePrice]
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
        //remove loading circle when ready
        this.container.querySelector(".loading-overlay__spinner").classList.add("hidden")
        this.container.querySelector("product-form.visually-hidden").classList.remove("visually-hidden")
        this.stickyBar.querySelector("[data-sticky-atc]").removeAttribute('disabled')

        let selling_plan_input = document.querySelector('input[name="selling_plan"]')
        this.observeForm(selling_plan_input)

      })
    } catch (e) {
        console.log("Error: failure in createSubcriptionWidget() for product-form.js")
        console.log(e)
    }
  }

  updateStickyBar(event) {
    // Update selection option for selling plan in sticky checkout
    let subscriptionSelected = !!event.detail.sellingPlan
    console.log(subscriptionSelected)
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

  observeForm(selling_plan_input) {
    // Watch selling_plan changes and make updates to sticky bar in case of any changes.
    try {
        console.log(selling_plan_input)
        let skio = document.querySelector('skio-plan-picker')

        skio.addEventListener('skio::update-selling-plan', (e) => {
          this.updateStickyBar(e)
          this.mostRecentSellingPlan = e.detail.sellingPlan ? e.detail.sellingPlan.id : this.mostRecentSellingPlan
          console.log(this.mostRecentSellingPlan)
        })
    } catch (e) {
        console.log("Error: failure in observeForm() for product-form.js")
        console.log(e)
    }
  }

  add_pen() {
    try {
        console.log('adding pen')
        const strength_cookie = getCookie('strength')
        
        let pen_formula_dict = {
          'medium': 42210600812769,
          'strong': 42210600845537,
          'weak': 42210600878305
        }

        let formula_id;
        if (strength_cookie in pen_formula_dict) {
          formula_id = pen_formula_dict[strength_cookie]
        } else {
          formula_id = pen_formula_dict['medium']
        }

        var pen = 
          {
          "id": formula_id,
          "quantity":  1
          }

        jQuery.ajax({
          type: 'POST',
          url: '/cart/add.js',
          data: pen,
          dataType: 'json',
          success: function() {
            console.log('pen added') 
          },
          error: function (exception) {
            console.log(exception)
          }
        });
    } catch (e) {
        console.log("Error: failure in add_pen() for product-form.js")
        console.log(e)
    }
  }


  onSubmitHandler(evt) {
    evt.preventDefault();
    
    console.log("still handled by me?")

    document.cookie = "directcheckout=true;path=/";

    const submitButton = this.querySelector('[type="submit"]');

    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');

    let skio = document.querySelector('skio-plan-picker')
    let product_form = JSON.parse(serializeForm(this.form))

    console.log(product_form)

    let dpk_choice = document.querySelector('input[name="dpk_chooser"]:checked').value;

    console.log(dpk_choice)
    let quantity_setter = (dpk_choice == two_kits) ? 2: 1

    let formData = {
      'items': [{
        id: product_form.id, // this is variant id
        quantity: quantity_setter,
        selling_plan: product_form.selling_plan // or can also do product_form.selling_plan? skio.selectedSellingPlan.id
      }]
    }

    let body = JSON.stringify(formData)

    // let body =  JSON.stringify({
    //   ...JSON.parse(serializeForm(this.form)),
    //   sections: this.getSectionsToRender().map((section) => section.section),
    //   sections_url: window.location.pathname
    // });
    

    if (window.location.href.includes('at-home-whitening-kit')) { 
      if (window.location.href.includes('at-home-whitening-kit-affiliate-ft') || window.location.href.includes('at-home-whitening-kit-affiliate-ut')) {
        body = JSON.parse(body)
        body['quantity'] = '1'
        body = JSON.stringify(body)
      }

    } else if (window.location.href.includes('landing-page-product-main')) {
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
      .then(data => {
          if ($('#package_protection').prop('checked')) {
            let formData = {
              'items': [{
                id: 39775917605037,
                quantity: 1
              }]
            };
            return fetch(window.Shopify.routes.root + 'cart/add.js', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            })
          } else {
            console.log('continue')
          }
      })
      .then(data => {
        let cactus = this.getCookie('redirect_ut')

        if (cactus == true) {
          console.log('cactus')
          // const strength_cookie = getCookie('strength')
        
          // let pen_formula_dict = {
          //   'medium': 42210600812769,
          //   'strong': 42210600845537,
          //   'weak': 42210600878305
          // }

          // let formula_id;
          // if (strength_cookie in pen_formula_dict) {
          //   formula_id = pen_formula_dict[strength_cookie]
          // } else {
          //   formula_id = pen_formula_dict['medium']
          // }

          // let formData = {
          //   'items': [{
          //     id: formula_id,
          //     quantity: 1
          //   }]
          // };

          // return fetch(window.Shopify.routes.root + 'cart/add.js', {
          //   method: 'POST',
          //   headers: {
          //   'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify(formData)
          // })
        }
        
      })
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
    return [
      {
        id: 'cart-drawer__content',
        section: document.getElementById('cart-drawer__content').dataset.id,
        selector: '.cart-drawer__content',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      }
    ];
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

    this.waitForEl("sticky-product-bar [data-plans-dropdown").then(() => {
      this.sellingPlans = this.querySelector("input[name='selling_plan']]")
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
