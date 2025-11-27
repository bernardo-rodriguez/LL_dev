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


function cookie_actions() {
    let a_referrer = getCookie('affiliate_referrer')
    if (a_referrer in affiliate_config && 'general' in affiliate_config[a_referrer]) {
      let general_actions = affiliate_config[a_referrer]['general']
      if ('announcement_bar' in general_actions && general_actions['announcement_bar']) {
        showAnnouncementBar(general_actions['announcement_bar'])
      }
    } else if ('announcement_bar' in affiliate_config['default']['general']) {
      showAnnouncementBar(affiliate_config['default']['general']['announcement_bar'])
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

