affiliate_cookie_options = ['redirect_inspire', 'redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans', 'redirect_skimm', 'redirect_pinterest']
affiliate_cookie_options_2 = ['redirect__inspire', 'redirect__ut', 'redirect__ut__direct', 'redirect__paceline', 'redirect__sweatcoin', 'redirect__miles', 'redirect__studentbeans', 'redirect__skimm', 'redirect__pinterest', 'shareasaleShopifySSCID']

function vwo_upsell_test() {
  setCookie('show_upsell', 'false')
  $('.dpk_body').hide()

  gtag('set', 'user_properties', {
    SC_09_24_UPSELL_STATUS: "inactive"
  });
}

function vwo_upsell_test_control() {
  gtag('set', 'user_properties', {
    SC_09_24_UPSELL_STATUS: "active"
  });
}

function LandingPopulateCactus() {
  // Populate landing page text for cactus media
  $('#hero_subtitle_1').css('margin-bottom', '50px !important')
  // $('#hero_title').html('Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">For Free Today</span>') 
  $('#hero_title').html('Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit') 

  // document.getElementsByClassName('Hero_Subtitle')[0].querySelector('span').style.fontSize = '22px'

  // $('.Hero_Subtitle').first().find('.stylized').first().html("<sup>$</sup>0")
  $('.Hero_Subtitle').first().text("See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.")
}

function LandingPopulateSweatcoin() {
  // Populate landing page text for cactus media
  $('#hero_subtitle_1').css('margin-bottom', '50px !important')
  $('#hero_title').html('Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">For Free Today</span>') 
  // $('#hero_title').html('Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit') 

  
  // document.getElementsByClassName('Hero_Subtitle')[0].querySelector('span').style.fontSize = '22px'

  // $('.Hero_Subtitle').first().find('.stylized').first().html("<sup>$</sup>0")
  $('.Hero_Subtitle').first().text("See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.")
}

// if user arrives at mylaughland.com?utm_affiliatgit e_specific=cactus_media
// set cookie to cactus media, and google referral tag to cactus media
// if first time, set redirect to whatever it is.

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


function removeCookie(key) {
  document.cookie = `${key}=true;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`
}


function clearAllAffiliateCookies(){
  affiliate_cookie_options.forEach((affiliate, index) => removeCookie(affiliate));
  removeCookie('upsell_test')
}

function setCookieIfFirstTime() {
  if (getCookie("cookie_hasnt_been_set") != 'true') {
      tracking_1 = parseInt(document.getElementById('tracking_v1').innerHTML) / 100
      tracking_2 = parseInt(document.getElementById('tracking_v2').innerHTML) / 100
      tracking_3 = parseInt(document.getElementById('tracking_v3').innerHTML) / 100
      
      var d = Math.random();
      console.log(d)
      var mc = getCookie('redirect_ut')
      var mm = getCookie('redirect_skimm')
      var ss = getCookie('redirect_sweatcoin')
      console.log(mc)
      console.log(tracking_1)
      if (mc == 'true') {
        if (d > tracking_1) {
          setCookie('test_order', 'true')
        }
      } else if (ss == 'true') {
        if (d > tracking_3) {
          setCookie('test_order', 'true')
        }
      } 
      else if (mm == 'true') {
        if (d > tracking_2) {
          //setCookie('test_order', 'true')
        }
      }
      setCookie('cookie_hasnt_been_set', 'true')

      gtag('set', 'user_properties', {
        SC_09_24_UPSELL_STATUS: "user_properties_tracked"
      });

      gtag('set', 'user_properties', {
        CUSTOM_DIMENSION_TRACKED: "user_properties_tracked"
      });
  }
}


function redirectToLandingIfFirstTime(cookie, from_landing=false) {
  // If I haven't redirected, redirect to random page and set landing page cookie.
  // Mark redirect in cookies so we don't redirect again if a user somehow goes back with the same utm params.
  // if (getCookie("in_house_already_redirected") != 'true') {
  //   setCookie('in_house_already_redirected', 'true')
              
  var d = Math.random();
  tracking_1 = parseInt(document.getElementById('tracking_v1').innerHTML) / 100
  if (d <= tracking_1) {
    console.log('flow 1')
    setCookie('flow_ga_tracking_v1', 'true')
  } else {
    console.log('flow 2')
    setCookie('flow__ga_tracking_v2', 'true')
  }

  if (getCookie("in_house_already_redirected") != 'true' && from_landing != true) {
    setCookie('in_house_already_redirected', 'true')

  }
}


function setCookieAffiliate(cookie) {
  console.log("swetcookieaffiliate")
  setCookie(cookie, 'true')

  // remove all other affiliate cookies except for the one I'm setting
  console.log('removing old cookies')
  for (let i = 0; i < affiliate_cookie_options.length; i++) {
    cookie_option = affiliate_cookie_options[i]
    if (cookie_option != cookie) {
      console.log(cookie_option)
      removeCookie(cookie_option)
    }
  }
}


supported_affiliates = {
  'sweatcoin': 'redirect_sweatcoin',
  'product-direct': 'redirect_ut_direct',
  'paceline': 'redirect_paceline',
  'miles': 'redirect_miles',
  'utm_partner': 'utm_partner',
  'utm_gen_direct': 'utm_gen_direct',
  'cactus_media': 'redirect_ut',
  'redirect_inspire': 'redirect_inspire',
  'redirect_pinterest': 'redirect_pinterest',
  'skimm': 'redirect_skimm',
}


function landingPageAction(current_page, query_params) {
  // This gets callled on every page visited (script type defer)
  // curent_page: page without query parameters (',', 'pages/landing-page')
  // query_params: dictionary of all query parameters (null if not found)
  console.log("tracker:")
  console.log(current_page)
  let utm_affiliate = query_params.utm_affiliate_specific
  setDefaultStrength(query_params)
  if (current_page == '/') {
    // If i'm at site roots url, set affiliate cookies based on affiliate query params and redirect to landing page coookies
    // https://stackoverflow.com/questions/8100515/how-to-check-if-the-user-is-visiting-the-sites-root-url
    if (utm_affiliate in supported_affiliates) {
        setCookieAffiliate(supported_affiliates[utm_affiliate])
        redirectToLandingIfFirstTime(supported_affiliates[utm_affiliate])
    } else {
        setCookie('in_house_already_redirected', 'true')
        redirectToLandingIfFirstTime('none')
    }
  } else if (current_page == '/pages/landing-page' || current_page == '/pages/landing-page/' || current_page.includes('landing-page')) {
      console.log("tracker_landing_page")
      setCookie('in_house_already_redirected', 'true')
      if (query_params.utm_affiliate_specific == 'sweatcoin') {
        LandingPopulateSweatcoin()
        setCookieAffiliate(supported_affiliates[utm_affiliate])
      }
      else if (query_params.utm_affiliate_specific == 'skimm') {
        setCookieAffiliate(supported_affiliates[utm_affiliate])
        setDefaultStrength(query_params)
      } else if (query_params.utm_affiliate_specific == 'cactus_media') {
        LandingPopulateCactus()
        setCookieAffiliate(supported_affiliates[utm_affiliate])
        redirectToLandingIfFirstTime('redirect_ut', true)
      } else if (query_params.utm_affiliate_specific == 'redirect_pinterest') {
        setCookieAffiliate(supported_affiliates[utm_affiliate])
      }
  } else if (current_page == '/pages/clear-affiliate-cookies' || current_page == '/pages/clear-affiliate-cookies/' || current_page.includes('clear-affiliate-cookies')) {
    clearAllAffiliateCookies()
  } else {
      setCookie('in_house_already_redirected', 'true')
      if (query_params.utm_affiliate_specific == 'sweatcoin') {
        setCookieAffiliate(supported_affiliates[utm_affiliate])
      } else if (query_params.utm_affiliate_specific == 'skimm') {
        setCookieAffiliate(supported_affiliates[utm_affiliate])
        setDefaultStrength(query_params)
      } else if (query_params.utm_affiliate_specific == 'redirect_pinterest') {
        setCookieAffiliate(supported_affiliates[utm_affiliate])
      } else if (query_params.utm_affiliate_specific == 'cactus_media') {
        setCookieAffiliate(supported_affiliates[utm_affiliate])
      }
  }
  setCookieIfFirstTime()
}

function setDefaultStrength(query_params) {
  setTimeout(function() {

    switch(query_params.default_strength) {
      case 'sensitive':
        setCookie('strength', 'sensitive')
        location.reload();
        break;
      case 'strong':
        setCookie('strength', 'strong')
        location.reload();
        break;
    } 
}, 2000);

}

var current_page = window.location.pathname // last page in URL before query parameters

const query_params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

landingPageAction(current_page, query_params)
