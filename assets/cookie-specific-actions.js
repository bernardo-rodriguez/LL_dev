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
  date.setFullYear(date.getFullYear() + 1);
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
    const cookies = ['redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans']

    let subscriptionCookie = cookies.filter( cookieName => getCookie(cookieName) != null )

    switch(subscriptionCookie[0]) {
      case 'redirect_sweatcoin':
        showAnnouncementBar('👋 Sweatcoin Users! Discount auto applied at checkout')
        break
      case 'redirect_ut':
        showAnnouncementBar('Free Shipping + Discount auto applied at checkout')
        break
    }

    quiz_version = getCookie('quiz_version')
    
    if (quiz_version == null) {
      var d = Math.random();
      console.log(d)
      if (d <= .5) {
          setCookie('quiz_version', 'long')
          gtag('set', 'user_properties', {
            quiz_version: "long"
          });
      } else {
          setCookie('quiz_version', 'short')
          gtag('set', 'user_properties', {
            quiz_version: "short"
          });
      }
    } else {
      if (quiz_version == 'long') {
          gtag('set', 'user_properties', {
            quiz_version: "long"
          });
      } else if (quiz_version == 'short') {
          gtag('set', 'user_properties', {
            quiz_version: "short"
          });
      }
    }
}


cookie_actions()

