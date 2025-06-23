async function setCartAttributes(upsell) {
   let cart = await fetch('/cart/update.js', {
        method: "POST",
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json;'
        },
        body: JSON.stringify({
            'attributes': {
              'upsell_test': upsell
            }
        })
    }).then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    });
    return cart
  }

  async function setCartAttributesShareasale(affiliate, affiliate_id) {
    if (affiliate_id === undefined || affiliate_id === null) {
      affiliate_id = "none"
    }
   let cart = await fetch('/cart/update.js', {
        method: "POST",
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json;'
        },
        body: JSON.stringify({
            'attributes': {
              'shareasale_affiliate': affiliate,
              'shareasale_affiliate_id': affiliate_id
            }
        })
    }).then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    });
    return cart
  }
  
  async function setAttributes() {
      upsell_test = getCookie('upsell_test')
      let shareasale_cookie = getCookie('shareasaleShopifySSCID')
      let shareasale_cookie_clean = shareasale_cookie ?? "none";
      console.log('shareasale cookie is:')
      console.log(shareasale_cookie_clean)

      var shareasale_cookie_dict = {
        '11k9_lrh8b': 'Skimbit'
      }

      try {
        a_referrer = getCookie('affiliate_referrer')

        if (a_referrer in affiliate_config && 'flow' in affiliate_config[a_referrer] && 'cart_attribute' in affiliate_config[a_referrer]['flow']) {
          if (affiliate_config[a_referrer]['flow']['cart_attribute']) {
            await setCartAttributesShareasale(affiliate_config[a_referrer]['flow']['cart_attribute'], shareasale_cookie_clean);
          } 
        }  
        else {
          if (shareasale_cookie_clean in shareasale_cookie_dict) {
            await setCartAttributesShareasale(shareasale_cookie_dict['shareasale_cookie_clean'], shareasale_cookie_clean); 
          } else {
            await setCartAttributesShareasale("none", shareasale_cookie_clean); 
          }
        }
      } catch (error) {
        console.log(error)

        console.log('something went wrong when setting cart attributes');
      }
  }

  async function clear_cart() {
    await new Promise((resolve, reject) => {
      var xhttp = new XMLHttpRequest();

      xhttp.open("POST", "/cart/clear.js", true);

      xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
          // Check the HTTP status code
          if (xhttp.status === 200) {
            // Resolve the promise with the response text
            console.log('cart cleared')
            resolve(JSON.parse(xhttp.responseText));
          } else {
            // Reject the promise if there's an error
            console.log('error clearing cart')
            reject(new Error(`Request failed with status ${xhttp.status}`));
          }
        }
      };

      xhttp.send();
    });
  }

  async function cart_setup() {
    await clear_cart()
    await setAttributes()
  }

  cart_setup()

  document.getElementById('main-clickable-button').addEventListener("click", upsellLogic);

    function upsellLogic() {
        // here is upsell_logic upsell logic upsell-logic
        a_referrer = getCookie('affiliate_referrer')
        if (a_referrer in affiliate_config && 'flow' in affiliate_config[a_referrer] && 'show_upsell' in affiliate_config[a_referrer]['flow']) {
          if (affiliate_config[a_referrer]['flow']['show_upsell']) {
            openPopup()
          } else {
            $('#real-submit-button').click()
          }
        }

        // try {
        //     if ($('#main-product-handle-id').html() && ($('#main-product-handle-id').html().includes('at-home-whitening-kit-affiliate-ft') || $('#main-product-handle-id').html().includes('at-home-whitening-kit-affiliate-ut'))) {
        //         show_upsell = getCookie('show_upsell')
        //         if (show_upsell != 'false') {
        //         openPopup()
        //         } else {
        //         $('#real-submit-button').click()
        //         }
        //     } else {
        //     $('#real-submit-button').click()
        //     }
        // } catch (e) {
        //     console.log(e)
        //     $('#real-submit-button').click()
        // }
    }