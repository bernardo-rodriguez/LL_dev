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
    const cookies = ['jam_media', 'redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans', 'redirect_skimm', 'redirect_cpgap_gen', 'redirect_cpgap']

    let subscriptionCookie = cookies.filter( cookieName => getCookie(cookieName) != null )

    switch(subscriptionCookie[0]) {
      case 'redirect_sweatcoin': //sweatcoin annoucnement text 
        showAnnouncementBar('Sweatcoin discounts auto applied at checkout!')
        path = window.location.pathname
        if (path == '/products/at-home-whitening-kit') {
          window.location = '/products/at-home-whitening-kit-affiliate-ft'
        }
        break
      case 'redirect_ut': //cactus annoucnement text 
        showAnnouncementBar('Discount auto applied at checkout!')
        // showAnnouncementBar('Discount & Free Pen Automatically Applied')
        path = window.location.pathname
        if (path == '/products/at-home-whitening-kit') {
          window.location = '/products/at-home-whitening-kit-affiliate-ut'
        }
        break
      case 'redirect_cpgap_gen': //cpgap free trial annoucnement text 
        showAnnouncementBar('Discount auto applied at checkout!')
        // showAnnouncementBar('Discount & Free Pen Automatically Applied')
        path = window.location.pathname
        if (path == '/products/at-home-whitening-kit') {
          window.location = '/products/at-home-whitening-kit-affiliate-ft'
        }
        break
      case 'jam_media':
        showAnnouncementBar('Discount auto applied at checkout!!')
        break
      case 'redirect_cpgap': //cpgap annoucnement text 
        // showAnnouncementBar('Discount auto applied at checkout!')
        break
      case 'redirect_inspire': // redirect inspire annoucnement text 
        showAnnouncementBar('InspireMore readers, Discount is Automatically Applied at Checkout!')
        break
      case 'redirect_skimm':
        showAnnouncementBar('👋 Skimm reader, discount auto-applied at checkout!')
        break
      default:
        showAnnouncementBar('Start Whitening Today for just $29!')
        break;
    }
}


cookie_actions()

