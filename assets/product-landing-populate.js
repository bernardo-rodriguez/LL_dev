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
    $('#ingredients-box-1-percent').html(variantIngredientList.ingredients_box_1_percent + '%')
    $('#ingredients-box-2-percent').html(variantIngredientList.ingredients_box_2_percent + '%')
    $('#ingredients-box-3-percent').html(variantIngredientList.ingredients_box_3_percent + '%')
    $('#ingredients-box-1-name').html(variantIngredientList.ingredients_box_1_name)
    $('#ingredients-box-2-name').html(variantIngredientList.ingredients_box_2_name)
    $('#ingredients-box-3-name').html(variantIngredientList.ingredients_box_3_name)
    $('#ingredients-box-1-purpose').html(variantIngredientList.ingredients_box_1_purpose)
    $('#ingredients-box-2-purpose').html(variantIngredientList.ingredients_box_2_purpose)
    $('#ingredients-box-3-purpose').html(variantIngredientList.ingredients_box_3_purpose)
    
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

function setNameAndVariant() {
    console.log('setname')
    const first_name = getCookie('firstname') || ""
    const last_name = getCookie('lastname') || ""
    const storedProductName = this.container?.querySelector('#product__title_id')?.innerHTML

    const name = `${first_name}${ last_name != "" ? ' ' + last_name : ''}`

    console.log(name)
    console.log($('#perfect-match-text'))
    waitForElm('#perfect-match-text').then((elm) => {
        console.log('Element is ready');
        elm.innerHTML = `${name}'s Perfect Match`
        setVariant()
    });
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

setNameAndVariant()
