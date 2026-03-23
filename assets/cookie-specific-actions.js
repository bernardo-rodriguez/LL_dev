function getCookie(cname) {
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

function setCookie(key, value) {
  var date = new Date();
  date.setTime(date.getTime() + 2 * 3600 * 1000);
  var expires = date.toUTCString();
  console.log(expires)
  document.cookie = `${key}=${value}; expires=${expires}; path=/`;
}

function showAnnouncementBar(bar_text) {
    $('#announcement-bar').css('display', 'block')
    $(".outer-header-wrapper").css('top', '24px')
    $(".announcement-bar p").html(bar_text)
    $(window).scroll(function(){
      height = $(window).scrollTop()
      if (height > 24) {
        $(".outer-header-wrapper").css('top', '0')
      } else {
        diff = 24 - height
        $(".outer-header-wrapper").css('top', diff + 'px')
      }
    });
}

var PRODUCT_BANNER_PLACEHOLDER = '{{bold}}'

function showProductBanner(bar_value) {
  var el = document.getElementById('product-offer-banner')
  if (!el) return
  var text = ''
  var boldPart = ''
  if (typeof bar_value === 'object' && bar_value !== null && bar_value.text != null) {
    text = (bar_value.text || '').trim()
    boldPart = (bar_value.bold || '').trim()
    var idx = text.indexOf(PRODUCT_BANNER_PLACEHOLDER)
    if (idx !== -1 && boldPart) {
      var before = text.slice(0, idx)
      var after = text.slice(idx + PRODUCT_BANNER_PLACEHOLDER.length)
      el.innerHTML = escapeHtml(before) + '<strong>' + escapeHtml(boldPart) + '</strong>' + escapeHtml(after)
    } else {
      el.textContent = text
    }
  } else if (typeof bar_value === 'string' && bar_value !== '') {
    var parts = bar_value.split(':')
    if (parts.length > 1) {
      el.innerHTML = '<strong>' + escapeHtml(parts[0].trim()) + '</strong> ' + escapeHtml(parts.slice(1).join(':').trim())
    } else {
      el.textContent = bar_value
    }
  } else {
    el.textContent = ''
  }
  el.style.display = ''
}

function escapeHtml(s) {
  var div = document.createElement('div')
  div.textContent = s
  return div.innerHTML
}

function hideProductBanner() {
  var el = document.getElementById('product-offer-banner')
  if (el) el.style.display = 'none'
}

function getProductBannerText() {
  var a_referrer = getCookie('affiliate_referrer')
  var general = (affiliate_config[a_referrer] || {}).general
  if (a_referrer in affiliate_config && general && 'product_banner' in general) {
    return general.product_banner
  }
  var defaultGeneral = affiliate_config['default'] && affiliate_config['default']['general']
  if (defaultGeneral && defaultGeneral.product_banner) {
    return defaultGeneral.product_banner
  }
  return null
}

function cookie_actions() {
    let a_referrer = getCookie('affiliate_referrer')
    if (a_referrer in affiliate_config && 'general' in affiliate_config[a_referrer]) {
      let general_actions = affiliate_config[a_referrer]['general']
      if ('announcement_bar' in general_actions && general_actions['announcement_bar']) {
        showAnnouncementBar(general_actions['announcement_bar'])
      }
    } else if (affiliate_config['default']['general'] && 'announcement_bar' in affiliate_config['default']['general']) {
      showAnnouncementBar(affiliate_config['default']['general']['announcement_bar'])
    }

    var productOfferBannerEl = document.getElementById('product-offer-banner')
    if (productOfferBannerEl) {
      var refillProductId = window.ProductConfig && window.ProductConfig.REFILL_DEFAULT && window.ProductConfig.REFILL_DEFAULT.product_id
      var pageProductIdInput = document.querySelector('input[name="product_id"]')
      var pageProductId = pageProductIdInput && pageProductIdInput.value
      var isRefillPdp = refillProductId != null && String(pageProductId) === String(refillProductId)
      if (isRefillPdp) {
        hideProductBanner()
      } else {
        var product_banner_value = getProductBannerText()
        var hasBanner = product_banner_value != null && (
          (typeof product_banner_value === 'string' && product_banner_value !== '') ||
          (typeof product_banner_value === 'object' && product_banner_value !== null && product_banner_value.text)
        )
        if (hasBanner) {
          showProductBanner(product_banner_value)
        } else {
          hideProductBanner()
        }
      }
    }

    if (a_referrer in affiliate_config && 'flow' in affiliate_config[a_referrer]) {
      let redirect_flow = affiliate_config[a_referrer]['flow']

      if ('product_page' in redirect_flow && redirect_flow['product_page']) {
        path = window.location.pathname
        if (path == '/products/at-home-whitening-kit') {
          window.location = redirect_flow['product_page']
        }
      }
    }
}

 // Make cookie-actions globally available for the tracking script
 window.cookie_actions = cookie_actions;

 cookie_actions()

