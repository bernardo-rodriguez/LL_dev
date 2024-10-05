affiliate_cookie_options = ['redirect_inspire', 'redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans', 'redirect_skimm', 'redirect_pinterest']
affiliate_cookie_options_2 = ['redirect__inspire', 'redirect__ut', 'redirect__ut__direct', 'redirect__paceline', 'redirect__sweatcoin', 'redirect__miles', 'redirect__studentbeans', 'redirect__skimm', 'redirect__pinterest', 'shareasaleShopifySSCID']

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

A_B_testing_campaigns = {
  active: {
    google_tag: "SC_09_24_UPSELL_STATUS",
    active_name: 'active',
    inactive_name: 'inactive',
    affiliate_tested: supported_affiliates['sweatcoin'],
    active_split: '100',
    page_and_functions: [
      {
        page: 'at-home-whitening-kit-affiliate-ft',
        function: 'sweatcoin_09_24_upselling_test'
      }
    ]
  },
  cactus_media_2024_08: {

  }
}

function gtagLoaded(gtag_payload) {
  gtag('set', 'user_properties', gtag_payload);
}

function send_gtag_properties(gtag_payload) {
  console.log('setting gtag properties ' + JSON.stringify(gtag_payload))
  if (typeof gtag === 'function') {
    gtagLoaded(gtag_payload); // gtag is already loaded
  } else {
    window.addEventListener('load', function() {
      if (typeof gtag === 'function') {
        gtagLoaded(gtag_payload); // gtag loaded after the page finished loading
      } else {
        console.log("gtag.js failed to load");
      }
    });
  }
}

function sweatcoin_09_24_upselling_test() {
  console.log('running sweatcoin_09_24_upselling_test')
  setCookie('show_upsell', 'false')
  $('.dpk_body').hide()
}

function run_active_campaign() {
  // run function if we are on their executable page from page_and_functions in active campaigns dict
  try {
    let campaign_functions = A_B_testing_campaigns['active']['page_and_functions']

    console.log(campaign_functions)

    campaign_functions.forEach((campaign_func) => {
      console.log(campaign_func)
      console.log(window.location.href)
      if (window.location.href.indexOf(campaign_func['page']) > -1) {
        console.log(campaign_func['function'])
        window[campaign_func['function']](); 
      }
    });
  } catch (e) {
    console.log('error caught')
    console.log(e)
  }
}

function should_run_active_campaign() {
  // if cookie that is the google tag name is currently set, that means we should run the active campaign
  let campaign_google_tag = A_B_testing_campaigns['active']['google_tag']
  if (getCookie(campaign_google_tag) == 'true') {
    return true
  }
  return false
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
  removeCookie('cookie_hasnt_been_set')
}

function setTestOrders(d) {
  tracking_1 = parseInt(document.getElementById('tracking_v1').innerHTML) / 100
  tracking_2 = parseInt(document.getElementById('tracking_v2').innerHTML) / 100
  tracking_3 = parseInt(document.getElementById('tracking_v3').innerHTML) / 100
  
  var mc = getCookie('redirect_ut')
  var mm = getCookie('redirect_skimm')
  var ss = getCookie('redirect_sweatcoin')

  if (mc == 'true') {
    if (d > tracking_1) {
      setCookie('test_order', 'true')
    }
  } else if (mm == 'true') {
    if (d > tracking_2) {
      setCookie('test_order', 'true')
    }
  } else if (ss == 'true') {
    if (d > tracking_3) {
      setCookie('test_order', 'true')
    }
  } 
}

function ifTestApplies() {
  let active_test = A_B_testing_campaigns['active']
  let affiliate_tested = active_test['affiliate_tested']
  const affiliates_tested_list = affiliate_tested.split(","); // Split by comma

  console.log(affiliates_tested_list)

  let isCookieSet = affiliates_tested_list.some( cookieName => getCookie(cookieName) != null ) // are any of them set?

  console.log(isCookieSet)
  if (affiliate_tested == 'all' || isCookieSet) { // TODO: verify isCookieSet set is working
    return true
  } 
  return false
}

function setABCookies(d) {
  // ran on page visit if it hasnt been ran before
  let active_test = A_B_testing_campaigns['active']
  let test_split = parseInt(active_test['active_split']) / 100
  console.log("experiment should be aplied to " + test_split + " of users")
  console.log("rand produced is " + d)
  let google_tag = active_test['google_tag']
  let gtag_payload = {}

  gtag_payload['SET_ONETIME_TRACKED'] = 'user_properties_tracked' // cookie and gtag initial setter ran

  if (ifTestApplies()) {
    console.log('test applies')
    gtag['AB_TEST_APPLIES'] = 'user_properties_tracked' // if affiliate to which ab test applies is currently active
    if (test_split >= d) {
      console.log("apply test")
      setCookie(google_tag, 'true')
      gtag_payload[google_tag] = active_test['active_name']
      run_active_campaign()
    } else {
      console.log("dont apply test")
      setCookie(google_tag, 'false')
      gtag_payload[google_tag] = active_test['inactive_name']
    }
  } else {
    console.log("excluded from active test")
  }

  send_gtag_properties(gtag_payload)
}

function setCookieIfFirstTime() {
  // ran on every page visited
  if (getCookie("cookie_hasnt_been_set") != 'true') {
      // set test order and ab cookies if this hasnt ran before
    var d = Math.random();

    setTestOrders(d)
    setABCookies(d)
    setCookie('cookie_hasnt_been_set', 'true')
  }

  // send gtag properties every time
  let active_test = A_B_testing_campaigns['active']
  send_gtag_properties({CUSTOM_DIMENSION_TRACKED: "user_properties_tracked"})
}


function setCookieAffiliate(cookie) {
  setCookie(cookie, 'true')

  // remove all other affiliate cookies except for the one I'm setting
  for (let i = 0; i < affiliate_cookie_options.length; i++) {
    cookie_option = affiliate_cookie_options[i]
    if (cookie_option != cookie) {
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
  let utm_affiliate = query_params.utm_affiliate_specific
  if (current_page == '/') {
    // If i'm at site roots url, set affiliate cookies based on affiliate query params and redirect to landing page coookies
    // https://stackoverflow.com/questions/8100515/how-to-check-if-the-user-is-visiting-the-sites-root-url
    if (utm_affiliate in supported_affiliates) {
        setCookieAffiliate(supported_affiliates[utm_affiliate])
    }
  } else if (current_page == '/pages/landing-page' || current_page == '/pages/landing-page/' || current_page.includes('landing-page')) {
      if (utm_affiliate in supported_affiliates) {
          setCookieAffiliate(supported_affiliates[utm_affiliate])
      }
      if (utm_affiliate == 'sweatcoin') {
        LandingPopulateSweatcoin()
      } else if (utm_affiliate == 'cactus_media') {
        LandingPopulateCactus()
      }
  } else if (current_page == '/pages/clear-affiliate-cookies' || current_page == '/pages/clear-affiliate-cookies/' || current_page.includes('clear-affiliate-cookies')) {
    clearAllAffiliateCookies()
  } else {
    if (utm_affiliate in supported_affiliates) {
      setCookieAffiliate(supported_affiliates[utm_affiliate])
    }
  }
  setDefaultStrength(query_params)
  setCookieIfFirstTime()

  if (should_run_active_campaign()) {
    console.log('campaign should run')
    run_active_campaign()
  }
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
