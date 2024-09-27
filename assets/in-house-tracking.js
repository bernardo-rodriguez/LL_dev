affiliate_cookie_options = ['redirect_inspire', 'redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans', 'redirect_skimm', 'redirect_pinterest']
affiliate_cookie_options_2 = ['redirect__inspire', 'redirect__ut', 'redirect__ut__direct', 'redirect__paceline', 'redirect__sweatcoin', 'redirect__miles', 'redirect__studentbeans', 'redirect__skimm', 'redirect__pinterest', 'shareasaleShopifySSCID']

function vwo_upsell_test() {
  setCookie('show_upsell', 'false')
  $('.dpk_body').hide()
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
  }
}


function redirectToLandingIfFirstTime2(cookie, p) {
  var d = Math.random();

  console.log('rand' + d)
  console.log('set' + p)
  if (d <= p) {
    console.log('flow 1')
    setCookie('flow_ga_tracking_v1', 'true')
  } else {
    console.log('flow 2')
    setCookie('flow__ga_tracking_v2', 'true')
  }

  setCookie('cookie_tracked', 'true')
  if (getCookie("in_house_already_redirected") != 'true') {
    setCookie('in_house_already_redirected', 'true')
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

  setCookie('cookie_tracked', 'true')
  if (getCookie("in_house_already_redirected") != 'true' && from_landing != true) {
    setCookie('in_house_already_redirected', 'true')

  }
}


function setCookieAffiliate(cookie, affiliate) {
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


function landingPageAction(current_page, query_params) {
  // This gets callled on every page visited (script type defer)
  // curent_page: page without query parameters (',', 'pages/landing-page')
  // query_params: dictionary of all query parameters (null if not found)
  console.log("tracker:")
  console.log(current_page)
  if (current_page == '/') {
    switch(query_params.utm_affiliate_specific) {
      case 'sweatcoin':
        setCookieAffiliate('redirect_sweatcoin', 'Sweatcoin')
        redirectToLandingIfFirstTime('redirect_sweatcoin')
        break;
      case 'product-direct':
        setCookieAffiliate('redirect_ut_direct', 'Direct To Product (misc)')
        redirectToLandingIfFirstTime('redirect_ut_direct')
        break;
      case 'paceline':
        setCookieAffiliate('redirect_paceline', 'Paceline')
        redirectToLandingIfFirstTime('redirect_paceline')
        break;
      case 'miles':
        setCookieAffiliate('redirect_miles', 'Miles')
        redirectToLandingIfFirstTime('redirect_miles')
        break;
      case 'utm_partner':
        setCookieAffiliate('utm_partner', 'UTM Partner')
        redirectToLandingIfFirstTime('utm_partner')
        break;
      case 'utm_gen_direct':
        setCookieAffiliate('utm_gen_direct', 'UTM Gen Direct')
        redirectToLandingIfFirstTime('utm_gen_direct')
        break;
      case 'cactus_media':
        setCookieAffiliate('redirect_ut', 'Cactus Media')
        redirectToLandingIfFirstTime('redirect_ut')
        break;
      case 'redirect_inspire':
        setCookieAffiliate('redirect_inspire', 'Inspire More')
        redirectToLandingIfFirstTime('redirect_inspire')
        break;
      case 'redirect_pinterest':
        setCookieAffiliate('redirect_pinterest', 'Pinterest')
        redirectToLandingIfFirstTime2('redirect_pinterest', .5)
        break;
      case 'skimm':
        setCookieAffiliate('redirect_skimm', 'Skimm')
        redirectToLandingIfFirstTime2('redirect_skimm', .25)
        setDefaultStrength(query_params)
        break;
      default:
        setCookie('in_house_already_redirected', 'true')
        redirectToLandingIfFirstTime('none')
        break;
    } 
  } else if (current_page == '/pages/clear-affiliate-cookies') {
      clearAllAffiliateCookies()
  } else if (current_page == '/pages/landing-page' || current_page == '/pages/landing-page/' || current_page.includes('landing-page')) {
      console.log("tracker_landing_page")
      setCookie('in_house_already_redirected', 'true')
      if (query_params.utm_affiliate_specific == 'sweatcoin') {
        LandingPopulateSweatcoin()
        setCookieAffiliate('redirect_sweatcoin', 'Sweatcoin')
        setCookie('cookie_tracked', 'true')
      }
      else if (query_params.utm_affiliate_specific == 'skimm') {
        setCookieAffiliate('redirect_skimm', 'Skimm')
        setCookie('cookie_tracked', 'true')
        setDefaultStrength(query_params)
      } else if (query_params.utm_affiliate_specific == 'cactus_media') {
        LandingPopulateCactus()
        setCookieAffiliate('redirect_ut', 'Cactus Media')
        redirectToLandingIfFirstTime('redirect_ut', true)
      } else if (query_params.utm_affiliate_specific == 'redirect_pinterest') {
        setCookieAffiliate('redirect_pinterest', 'Pinterest')
        setCookie('cookie_tracked', 'true')
      }
  } else {
      setCookie('in_house_already_redirected', 'true')
      if (query_params.utm_affiliate_specific == 'sweatcoin') {
        setCookieAffiliate('redirect_sweatcoin', 'Sweatcoin')
        setCookie('cookie_tracked', 'true')
      } else if (query_params.utm_affiliate_specific == 'skimm') {
        setCookieAffiliate('redirect_skimm', 'Skimm')
        setCookie('cookie_tracked', 'true')
        setDefaultStrength(query_params)
      } else if (query_params.utm_affiliate_specific == 'redirect_pinterest') {
        setCookieAffiliate('redirect_pinterest', 'Pinterest')
        setCookie('cookie_tracked', 'true')
      } else if (query_params.utm_affiliate_specific == 'cactus_media') {
        setCookieAffiliate('redirect_ut', 'Cactus Media')
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
