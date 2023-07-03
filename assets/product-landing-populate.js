function setVariant() {
    let strength = getCookie('strength')
    console.log(strength)
    let inputValue
    switch (strength){
    case 'sensitive':
        inputValue = '🍃 Gentle (ID: 19-2)'
        break;
    case 'medium':
        inputValue = '✨ Everyday (ID: 8-16)'
        break;
    case 'strong':
        inputValue = '🔥 Super Strength (ID: 8-17)'
        break;
    default: 
        inputValue = '✨ Everyday (ID: 8-16)'
        break;
    }

    let variantIngredientList = window.variantIngredients.find((v) => v.id == inputValue)
    console.log(variantIngredientList)

    let stylized_title = variantIngredientList.title.replace('{', "<span class='stylized canela'>").replace("}", "</span>")
    $('#product__title_id').html(stylized_title)
    $('#formula-header-text').html(variantIngredientList.formula_header_text)
    $('#selling_point_landing').html(variantIngredientList.selling_point_landing)
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

function setName() {
    const first_name = getCookie('firstname') || ""
    const last_name = getCookie('lastname') || ""
    const storedProductName = this.container?.querySelector('#product__title_id')?.innerHTML

    const name = `${first_name}${ last_name != "" ? ' ' + last_name : ''}`

    if (window.location.href.includes('at-home-whitening-kit')) { 
      if ( name != "" && !storedProductName?.toLowerCase().includes("to go pen") && window.location.pathname != '/pages/landing-page') {
        this.container.querySelector('#product__title_id').innerHTML = `<span class="stylized">${name}'s</span><br> ${storedProductName.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')}`
      }
    } else if (window.location.href.includes('landing-page-product-main')) {
      $('#perfect-match-text').html(`${name}'s Perfect Match`)
    }
  }