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
    const cookies = ['redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans', 'redirect_skimm']

    let subscriptionCookie = cookies.filter( cookieName => getCookie(cookieName) != null )

    switch(subscriptionCookie[0]) {
      case 'redirect_sweatcoin': //sweatcoin annoucnement text 
        showAnnouncementBar('Sweatcoin discounts auto applied at checkout!')
        path = window.location.pathname
        if (path == '/products/at-home-whitening-kit') {
          window.location = '/products/at-home-whitening-kit-2'
        }
        break
      case 'redirect_ut': //cactus annoucnement text 
        showAnnouncementBar('Free Shipping & Discount auto applied at checkout!')
        // showAnnouncementBar('Discount & Free Pen Automatically Applied')
        path = window.location.pathname
        if (path == '/products/at-home-whitening-kit') {
          window.location = '/products/at-home-whitening-kit-2'
        }
        break
      case 'redirect_inspire': // redirect inspire annoucnement text 
        showAnnouncementBar('InspireMore readers, Discount is Automatically Applied at Checkout!')
        break
      case 'redirect_skimm':
        showAnnouncementBar('👋 Skimm reader, discount auto-applied at checkout!')
        break
      default:
        showAnnouncementBar('Start Whitening Today for just $19!')
        break;
    }


    upsell_test = getCookie('upsell_test')
    if (upsell_test == null) {
      var d = Math.random();
      console.log('upsell_test:')
      console.log(d)
      if (d <= .5) {
          setCookie('upsell_test', 'true')
          gtag('set', 'user_properties', {
            upsell_test: "true"
          });
      } else {
          setCookie('upsell_test', 'false')
          gtag('set', 'user_properties', {
            upsell_test: "false"
          });
      }
    } else {
      if (upsell_test == 'true') {
          gtag('set', 'user_properties', {
            upsell_test: "true"
          });
      } else if (upsell_test == 'false') {
          gtag('set', 'user_properties', {
            upsell_test: "false"
          });
      }
    }

    upsell_test_2 = getCookie('upsell_test_2')
    if (upsell_test_2 == null) {
      var d = Math.random();
      console.log('upsell_test_2:')
      console.log(d)
      if (d <= .5) {
          setCookie('upsell_test_2', 'true')
          gtag('set', 'user_properties', {
            upsell_test_2: "true"
          });
      } else {
          setCookie('upsell_test_2', 'false')
          gtag('set', 'user_properties', {
            upsell_test_2: "false"
          });
      }
    }


    // quiz_version = getCookie('quiz_version')
    // if (quiz_version == null) {
    //   var d = Math.random();
    //   console.log('quiz_version:')
    //   console.log(d)
    //   if (d <= 1) {
    //       setCookie('quiz_version', 'long')
    //       gtag('set', 'user_properties', {
    //         quiz_version: "long"
    //       });
    //   } else {
    //       setCookie('quiz_version', 'short')
    //       gtag('set', 'user_properties', {
    //         quiz_version: "short"
    //       });
    //   }
    // } else {
    //   if (quiz_version == 'long') {
    //       gtag('set', 'user_properties', {
    //         quiz_version: "long"
    //       });
    //   } else if (quiz_version == 'short') {
    //       gtag('set', 'user_properties', {
    //         quiz_version: "short"
    //       });
    //   }
    // }
}


cookie_actions()

