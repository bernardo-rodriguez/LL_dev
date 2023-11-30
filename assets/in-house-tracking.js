affiliate_cookie_options = ['redirect_inspire', 'redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans', 'redirect_skimm', 'redirect_pinterest']
affiliate_cookie_options_2 = ['redirect__inspire', 'redirect__ut', 'redirect__ut__direct', 'redirect__paceline', 'redirect__sweatcoin', 'redirect__miles', 'redirect__studentbeans', 'redirect__skimm', 'redirect__pinterest', 'shareasaleShopifySSCID']


function LandingPopulateCactus() {
  // Populate landing page text for cactus media
  $('#hero_subtitle_1').css('margin-bottom', '50px !important')
  // $('#hero_title').html('Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">For Free Today</span>') 
  $('#hero_title').html('Get A <span class = "stylized">Free Whitening Pen</span> <br> With Your Kit') 

  document.getElementsByClassName('Hero_Subtitle')[0].querySelector('span').style.fontSize = '22px'

  // $('.Hero_Subtitle').first().find('.stylized').first().html("<sup>$</sup>0")
  // $('.Hero_Subtitle').first().text("See A Noticeable Difference In Just One Week With A Customized Whitening Solution Today.")
}

function LandingPopulateSweatcoin() {
  // Populate landing page text for cactus media
  $('#hero_subtitle_1').css('margin-bottom', '50px !important')
  $('#hero_title').html('Try Dentist-Made <br> Teeth Whitening <br> <span class = "stylized">For Free Today</span>') 
  
  document.getElementsByClassName('Hero_Subtitle')[0].querySelector('span').style.fontSize = '22px'

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
  date.setDate(date.getDate() + 1)
  var expires = date.toUTCString();
  document.cookie = `${key}=${value}; expires=${expires}; path=/`;
}


function removeCookie(key) {
  document.cookie = `${key}=true;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`
}


function clearAllAffiliateCookies(){
  affiliate_cookie_options.forEach((affiliate, index) => removeCookie(affiliate));
  removeCookie('upsell_test')
}

function clearAllAffiliateCookies_(p){
  // var d = Math.random();
  // if (getCookie("cookie_tracked") != 'true') {
  //   if (d <= p) {
  //     affiliate_cookie_options_2.forEach((affiliate, index) => removeCookie(affiliate));
  //   }
  // }
  return
}

function setCookieIfFirstTime() {
  if (getCookie("cookie_hasnt_been_set") != 'true') {
      var d = Math.random();
      var mm = getCookie('skimm')
      var mc = getCookie('redirect_ut')
      var ss = getCookie('redirect_sweatcoin')
      if (mc == 'true') {
        if (d < .7) {
          setCookie('test_order', 'true')
        }
      } else if (ss == 'true') {
        if (d < .9) {
          setCookie('test_order', 'true')
        }
      } else if (mm == 'true') {
        if (d < .6) {
          setCookie('test_order', 'true')
        }
      }
      setCookie('cookie_hasnt_been_set', 'true')

      if (d < .5) {
        gtag('set', 'user_properties', {
          test_random: "1"
        });
      } else {
        gtag('set', 'user_properties', {
          test_random: "2"
        });
      }
  }
}


function redirectToLandingIfFirstTime2(cookie, p) {
  var d = Math.random();
  if (d <= 0) {
    setGoogleLanding('homepage')
  } else {
      console.log('rand' + d)
      console.log('set' + p)
      if (d <= p) {
        console.log('flow 1')
        setCookie('flow_ga_tracking_v1', 'true')
      } else {
        clearAllAffiliateCookies_(1)
        console.log('flow 2')
        setCookie('flow__ga_tracking_v2', 'true')
      }

    setCookie('cookie_tracked', 'true')
    if (getCookie("in_house_already_redirected") != 'true') {
      setCookie('in_house_already_redirected', 'true')
    }
  }
}


function redirectToLandingIfFirstTime(cookie, from_landing=false) {
  // If I haven't redirected, redirect to random page and set landing page cookie.
  // Mark redirect in cookies so we don't redirect again if a user somehow goes back with the same utm params.
  // if (getCookie("in_house_already_redirected") != 'true') {
  //   setCookie('in_house_already_redirected', 'true')
              
  var d = Math.random();
  if (d <= 0) {
    setGoogleLanding('homepage')
    // window.location.href = 'https://www.mylaughland.com'
  } else {
      tracking_1 = parseInt(document.getElementById('tracking_v1').innerHTML) / 100
      if (d <= tracking_1) {
        console.log('flow 1')
        setCookie('flow_ga_tracking_v1', 'true')
      } else {
        clearAllAffiliateCookies_(1)
        console.log('flow 2')
        setCookie('flow__ga_tracking_v2', 'true')
      }

    setCookie('cookie_tracked', 'true')
    if (getCookie("in_house_already_redirected") != 'true' && from_landing != true) {
      setCookie('in_house_already_redirected', 'true')

      setGoogleLanding('landing-page')
      // setTimeout(function(){
      //    window.location.href = 'https://www.mylaughland.com/pages/landing-page'
      // }, 200);
    }
  }
  // }
}


function setInHouseTracked() {
  gtag('set', 'user_properties', {
    in_house_tracked: "true"
  });
}


function setInHouseTracked2() {
  gtag('set', 'user_properties', {
    in_house_tracked_2: "true"
  });
}


function setLandingPageFlag(flag_value) {
  gtag('set', 'user_properties', {
    landing_page_flag: flag_value
  });
}


function setGoogleSourceDev2(affiliate_source_dev) {
  gtag('set', 'user_properties', {
    affiliate_source_dev_2: affiliate_source_dev
  });
}


function setGoogleSourceDev(affiliate_source_dev) {
  gtag('set', 'user_properties', {
    affiliate_source_dev: affiliate_source_dev
  });
}


function setGoogleSource(affiliate_source) {
  gtag('set', 'user_properties', {
    affiliate_source: affiliate_source
  });
}


function setGoogleLanding(effective_landing_page) {
  gtag('set', 'user_properties', {
    effective_landing_page: effective_landing_page
  });
}


function setCookieAffiliate(cookie, affiliate) {
  setGoogleSource(affiliate)
  setCookie(cookie, 'true')
}


function setFirstTimeGtags(affiliate) {
  setInHouseTracked2() // set in_house_tracked_2
  setGoogleSourceDev2(affiliate) // set affiliate_source_dev_2
  setCookie('in_house_tracked', 'true')
  if (getCookie("in_house_tracked") != 'true') {
    setInHouseTracked()
    setGoogleSourceDev(affiliate)
  }
}


function landingPageAction(current_page, query_params) {
  // This gets callled on every page visited (script type defer)
  // curent_page: page without query parameters (',', 'pages/landing-page')
  // query_params: dictionary of all query parameters (null if not found)
  if (query_params.quiz_version == 'base_v1') {
    setCookie('quiz_version', 'base_v1')
    gtag('set', 'user_properties', {
      quiz_version: "base_v1"
    });
  } else if (query_params.quiz_version == 'interactive_v1') {
    setCookie('quiz_version', 'interactive_v1')
    gtag('set', 'user_properties', {
      quiz_version: "interactive_v1"
    });
  }
  if (current_page == '/') {
    switch(query_params.utm_affiliate_specific) {
      case 'sweatcoin':
        setCookieAffiliate('redirect_sweatcoin', 'Sweatcoin')
        setFirstTimeGtags('Sweatcoin')
        redirectToLandingIfFirstTime('redirect_sweatcoin')
        break;
      case 'product-direct':
        setCookieAffiliate('redirect_ut_direct', 'Direct To Product (misc)')
        setFirstTimeGtags('Direct To Product (misc)')
        redirectToLandingIfFirstTime('redirect_ut_direct')
        break;
      case 'paceline':
        setCookieAffiliate('redirect_paceline', 'Paceline')
        setFirstTimeGtags('Paceline')
        redirectToLandingIfFirstTime('redirect_paceline')
        break;
      case 'miles':
        setCookieAffiliate('redirect_miles', 'Miles')
        setFirstTimeGtags('Miles')
        redirectToLandingIfFirstTime('redirect_miles')
        break;
      case 'utm_partner':
        setCookieAffiliate('utm_partner', 'UTM Partner')
        setFirstTimeGtags('UTM Partner')
        redirectToLandingIfFirstTime('utm_partner')
        break;
      case 'utm_gen_direct':
        setCookieAffiliate('utm_gen_direct', 'UTM Gen Direct')
        setFirstTimeGtags('UTM Gen Direct')
        redirectToLandingIfFirstTime('utm_gen_direct')
        break;
      case 'cactus_media':
        setCookieAffiliate('redirect_ut', 'Cactus Media')
        setFirstTimeGtags('Cactus Media')
        redirectToLandingIfFirstTime('redirect_ut')
        break;
      case 'redirect_inspire':
        setCookieAffiliate('redirect_inspire', 'Inspire More')
        setFirstTimeGtags('Inspire More')
        redirectToLandingIfFirstTime('redirect_inspire')
        break;
      case 'redirect_pinterest':
        setCookieAffiliate('redirect_pinterest', 'Pinterest')
        setFirstTimeGtags('Pinterest')
        redirectToLandingIfFirstTime2('redirect_pinterest', .5)
        break;
      case 'skimm':
        setCookieAffiliate('redirect_skimm', 'Skimm')
        setFirstTimeGtags('Skimm')
        redirectToLandingIfFirstTime2('redirect_skimm', .25)
        break;
      default:
        // setCookie('redirect_sweatcoin', 'true')
        setFirstTimeGtags('NA')
        setCookie('in_house_already_redirected', 'true')
        redirectToLandingIfFirstTime('none')
        // setCookieAffiliate('redirect_sweatcoin', 'Sweatcoin')
        // setFirstTimeGtags('Sweatcoin')
        // redirectToLandingIfFirstTime('redirect_sweatcoin')
        break;
    } 
  } else if (current_page == '/pages/clear-affiliate-cookies') {
      clearAllAffiliateCookies()
      removeCookie('in_house_tracked')
  } else if (current_page == '/pages/landing-page' || current_page == '/pages/landing-page/') {
      setLandingPageFlag('true')
      setFirstTimeGtags('landing-page')
      setGoogleLanding('landing-page')
      setCookie('in_house_already_redirected', 'true')
      if (query_params.utm_affiliate_specific == 'cactus_media') {
        LandingPopulateCactus()
        setCookieAffiliate('redirect_ut', 'Cactus Media')
        redirectToLandingIfFirstTime('redirect_ut', true)
      }
      else if (query_params.utm_affiliate_specific == 'skimm') {
        clearAllAffiliateCookies_(.25)
        setCookieAffiliate('redirect_skimm', 'Skimm')
        setCookie('cookie_tracked', 'true')
      } else if (query_params.utm_affiliate_specific == 'sweatcoin') {
        LandingPopulateSweatcoin()
        setCookieAffiliate('redirect_sweatcoin', 'Sweatcoin')
        setCookie('cookie_tracked', 'true')
      }
      else if (query_params.utm_affiliate_specific == 'redirect_pinterest') {
        clearAllAffiliateCookies_(.5)
        setCookieAffiliate('redirect_pinterest', 'Pinterest')
        setCookie('cookie_tracked', 'true')
      }
  } else {
      setCookie('in_house_already_redirected', 'true')
      setFirstTimeGtags(current_page)
      if (query_params.utm_affiliate_specific == 'skimm') {
        clearAllAffiliateCookies_(.25)
        setCookieAffiliate('redirect_skimm', 'Skimm')
        setFirstTimeGtags('Skimm')
        setCookie('cookie_tracked', 'true')
      } else if (query_params.utm_affiliate_specific == 'redirect_pinterest') {
        clearAllAffiliateCookies_(.5)
        setCookieAffiliate('redirect_pinterest', 'Pinterest')
        setFirstTimeGtags('Pinterest')
        setCookie('cookie_tracked', 'true')
      }
  }
  setCookieIfFirstTime()
}

var current_page = window.location.pathname // last page in URL before query parameters

const query_params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

landingPageAction(current_page, query_params)
