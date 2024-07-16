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
    } 
  }

  createSubscriptionWidget() {
    this.waitForSkio('skio-plan-picker').then(() => {
      console.log('skio ready')
      
      //remove loading circle when ready
      this.container.querySelector(".loading-overlay__spinner").classList.add("hidden")
      this.container.querySelector("product-form.visually-hidden").classList.remove("visually-hidden")
      this.stickyBar.querySelector("[data-sticky-atc]").removeAttribute('disabled')

      let selling_plan_input = document.querySelector('input[name="selling_plan"]')
      this.observeForm(selling_plan_input)

      // this.setToOneMonth()
    })
  }

  updateStickyBar(event) {
    let subscriptionSelected = !!event.detail.sellingPlan
    console.log(subscriptionSelected)
    let price
    let skio = document.querySelector('skio-plan-picker').shadowRoot

    console.log(event)

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
  
  updateStickySellingPlans(e) {
    const controller = this.stickyBar.querySelector(`select#${e.target.id}_sticky `)
    controller.value = e.target.value
  }

  observeForm(selling_plan_input) {

    console.log(selling_plan_input)

    let skio = document.querySelector('skio-plan-picker')

    skio.addEventListener('skio::update-selling-plan', (e) => {
      this.updateStickyBar(e)
      this.mostRecentSellingPlan = e.detail.sellingPlan ? e.detail.sellingPlan.id : this.mostRecentSellingPlan
      console.log(this.mostRecentSellingPlan)
    })
  }

  waitForSkio(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
          this.getSubPrice()
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

  modifySubscriptionWidget(widgetSelector){
    const widget = document.querySelector(widgetSelector)
    // const subOffer = this.getSubPrice()
    var subOfferPrice = subOffer[0] 
    const subOfferText = subOffer[1]
    const kitOfferText = subOffer[2]
    const kitOfferPrice = subOffer[3]
    //HOTFIX
    setTimeout(function () {

      if (window.location.href.includes('whitening-kit-affiliate-ft')) {
        console.log('here')
        // subOfferPrice = '$0'
      }
      
      const widgetOptions = widget.querySelectorAll(".rc_widget__option");
      console.log(widgetOptions)

      widgetOptions.forEach((option) => {

        // Global widget changes
        const customEl = document.createElement("div")
        customEl.setAttribute('class', 'rc-custom-radio-button')
        option.querySelector(".rc_widget__option__selector label").appendChild(customEl)

        const textEl = document.createElement("span")
        textEl.innerHTML = "&#8212;"
        option.querySelector(".rc_widget__option__selector label").insertBefore(textEl, option.querySelector(".rc_widget__option__selector label > span:nth-of-type(2)"))

        // Subscription option only changes
        // Exit if this is the One Time option
        if (option.getAttribute("data-option-onetime") != null) {
          return
        }

        option.querySelector(".rc-selling-plans__label")?.classList.remove("visually-hidden");

        console.log('selling plans')
        console.log(option.querySelector(".rc-selling-plans"))
        if( option.querySelector(".rc-selling-plans") ) {
          // grab from page then inject subscription details
          // HOTFIX!!!
          // const cloneSubDetails = this.container.querySelector(".subscription-details").cloneNode(true)
          const cloneSubDetails = document.querySelector(".subscription-details").cloneNode(true)
          const firstEl = cloneSubDetails.querySelectorAll("dl")[0]
          const secondEl = cloneSubDetails.querySelectorAll("dl")[1]

          option.insertBefore(firstEl, option.querySelector(".rc-selling-plans"))
          option.appendChild(secondEl)

          const newSubPrice = document.createElement("span")
          newSubPrice.setAttribute('class', 'updated-price')
          newSubPrice.innerHTML = subOfferPrice
    
          option.querySelector("[data-price-subsave]").classList.add('visually-hidden')
          option.querySelector(".rc_widget__option__selector label").appendChild(newSubPrice)
        }
      })
      const sub_and_save_text = $(".rc-option__subsave .rc_widget__option__selector label .rc-option__text")
      if (sub_and_save_text.length == 1) {
        sub_and_save_text.html(subOfferText)
      }

      const one_time_text = $(".rc-option__onetime .rc_widget__option__selector label .rc-option__text")
      if (one_time_text.length == 1) {
        if (kitOfferText.length > 1) {
          one_time_text.html(kitOfferText)
        }
        if (kitOfferPrice.length > 1) {
          const newSubPrice = document.createElement("span")
          newSubPrice.setAttribute('class', 'updated-price')
          newSubPrice.innerHTML = kitOfferPrice

          var one_time_label = document.querySelector("[data-selector-onetime]")
          one_time_label.querySelector("[data-price-onetime]").classList.add('visually-hidden')
          one_time_label.querySelector(".rc_widget__option__selector label").appendChild(newSubPrice)
        }
      }
      
      try {
        const stickyBar = document.querySelector(`sticky-product-bar[data-id="${ this.productId }"]`)
        stickyBar.querySelector(".sticky__price").innerHTML = subOfferPrice
      } catch (error) {
        console.log('sticky bar update error')
      }

      var selector = document.querySelector("select[name='selling_plan']")
      console.log(selector)

      if(document.querySelector("select[name='selling_plan']")){
        let value = Array.from(document.querySelector("select[name='selling_plan']").options).filter(option =>{
          return (option.dataset.planOption == "Every 1 Month")
        })[0].value;
        if(value) document.querySelector("select[name='selling_plan']").value = value;
        const dropdownCopy = document.querySelector("select[name='selling_plan']").cloneNode(true);
        if(value) dropdownCopy.value = value;
        dropdownCopy.setAttribute("data-control-id", dropdownCopy.id)
        dropdownCopy.id = dropdownCopy.id + "_sticky"
        dropdownCopy.setAttribute('name', dropdownCopy.getAttribute("name") + "_sticky")
        // HOTFIX
        // stickyBar.querySelector("[data-sticky-subsave").appendChild(dropdownCopy)

        // document.querySelector("select[name='selling_plan']").addEventListener("change", function(e){
        //   this.updateStickySellingPlans(e)
        // }.bind(this))
      }
  
    }, 200);
    // END HOTFIX

  }

  setToOneMonth() {
    try {
      const cookies = ['redirect_inspire', 'redirect_ut', 'redirect_ut_direct', 'shareasaleShopifySSCID', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans']
      let subscriptionCookie = cookies.filter( cookieName => this.getCookie(cookieName) != null )
      if (["redirect_ut"].includes(subscriptionCookie[0])) {
        const elements = document.querySelectorAll('.rc-selling-plans__dropdown');
        Array.from(elements).forEach((element, index) => {
          element.value = 3450700001
          // element.setAttribute("disabled", "disabled");
        }); 
      }
      if (["redirect_sweatcoin"].includes(subscriptionCookie[0])) {
        const elements = document.querySelectorAll('.rc-selling-plans__dropdown');
        Array.from(elements).forEach((element, index) => {
          element.value = 3449880801
          // element.setAttribute("disabled", "disabled");
        });
        // $('.rc-option__subsave').first().find( "dd").first().html('1 Months Supply')
      }
    } catch (error) {
      console.error(error);
      // Expected output: ReferenceError: nonExistentFunction is not defined
      // (Note: the exact output may be browser-dependent)
    }
  }


  add_pen() {
      console.log('adding pen')
      const strength_cookie = getCookie('strength')
      let kit_formula_dict = {
        'medium': 42250643833057,
        'strong': 42250643865825,
        'weak': 42250643898593
      }
      
      let pen_formula_dict = {
        'medium': 42210600812769,
        'strong': 42210600845537,
        'weak': 42210600878305
      }

      let pen_selling_plan_dict = {
        3449880801: 3450175713,
        3449913569: 3450208481,
        3449946337: 3450241249
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
        console.log('pen')

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
  }
    
  getSubPrice() {
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
        // this.setToOneMonth()
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
        // this.setToOneMonth()
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

  // addPenSometimes() {
  //   const sweatcoin_automatic = getCookie('redirect_sweatcoin');

  //   if (sweatcoin_automatic == 'true') {
  //     if (true) {
  //       add_pen()
  //     }
      
  //   }
  // }

  onSubmitHandler(evt) {
    evt.preventDefault();
    
    document.cookie = "directcheckout=true;path=/";

    if(window.localStorage.getItem('landing_page_product_discount')){
      document.cookie = `landing_page_product_discount=${window.localStorage.getItem('landing_page_product_discount')};path=/`
      window.localStorage.removeItem('landing_page_product_discount');
    }

    const submitButton = this.querySelector('[type="submit"]');

    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');

    let body =  JSON.stringify({
      ...JSON.parse(serializeForm(this.form)),
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    if(submitButton.dataset.dsicountCode){
      console.log(submitButton.dataset.dsicountCode)
      var date = new Date();
      date.setTime(date.getTime()+(3600*24*1000));
      var expires = "; expires="+date.toUTCString();
      if(submitButton.dataset.dsicountCode != "") document.cookie = `productDiscountCode=${submitButton.dataset.dsicountCode} ${expires};path=/; `;
    }

    if (window.location.href.includes('at-home-whitening-kit')) { 
      if (window.location.href.includes('at-home-whitening-kit-affiliate-ft') || window.location.href.includes('at-home-whitening-kit-affiliate-ut')) {
        // console.log(body)
        // if (parseInt(body['quantity']) > 2) {
        //   throw new Error('Cannot purchase more than 2 products with this promotion');
        // }
        body = JSON.parse(body)
        body['quantity'] = '1'
        body = JSON.stringify(body)
        // commented to remove addition of pen
        // let strength = getCookie('strength')
        // let pen_id_dict = {
        //   "sensitive": 42210600878305,
        //   "medium": 42210600812769,
        //   "strong": 42210600845537
        // }
        // let json_body = JSON.parse(body)
        // let addedPenBody = {
        //   'items': [
        //     json_body,
        //     {
        //       'id': pen_id_dict[strength],
        //       'quantity': 1
        //     }
        //   ]
        // }
        // body = JSON.stringify(addedPenBody)
        // console.log(body)
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
      console.log(supply_type)
      console.log(strength)
      json_body['id'] = id_dict[supply_type][strength]
      json_body['product-id'] = product_dict[supply_type]
      body = JSON.stringify(json_body)
      console.log(body)
    }

    
    fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
      .then((response) => response.json())
      // .then((parsedState) => {

      //   this.getSectionsToRender().forEach((section => {
      //     const elementToReplace =
      //       document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

      //     elementToReplace.innerHTML =
      //       this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);

      //   }));
      // })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('disabled');
        // this.cartDrawer.open();
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
