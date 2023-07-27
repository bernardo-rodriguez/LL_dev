var images = [];
function preload_at_home() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload_at_home.arguments[i];
    }
}

function preload_at_home_JS() {
    for (var i = 0; i < arguments.length; i++) {
        var preloadLink = document.createElement("link");
        preloadLink.href = preload_at_home_JS.arguments[i];
        preloadLink.rel = "preload";
        preloadLink.as = "script";
        document.head.appendChild(preloadLink);
    }
}

function preload_at_home_CSS() {
    for (var i = 0; i < arguments.length; i++) {
        var preloadLink = document.createElement("link");
        preloadLink.href = preload_at_home_CSS.arguments[i];
        preloadLink.rel = "preload";
        preloadLink.as = "style";
        document.head.appendChild(preloadLink);
    }
}

//-- usage --//
function preload_at_home_whitening_kit() {
    console.log('preloading')
    preload_at_home(
        "https://www.mylaughland.com/cdn/shop/products/1-1.25ProductPicture.jpg?v=1689977080",
        "https://www.mylaughland.com/cdn/shop/products/277853769_989453628631128_6103431719502674547_n_1.png?v=1649362122",
        "https://www.mylaughland.com/cdn/shop/files/4-min.jpg?v=1690430950",
        "https://www.mylaughland.com/cdn/shop/files/Laughland_79400_1.jpg?v=1674083131&width=832",
        "https://www.mylaughland.com/cdn/shop/files/MP4_dd1165d5-4283-4226-9e3b-f81ba196527b.png?v=1673037047&width=832",
        "https://www.mylaughland.com/cdn/shop/files/IMG_0705.jpg?v=1687280436&width=832", 
        "https://www.mylaughland.com/cdn/shop/files/LesleyAfter.jpg?v=1679423356&width=832", 
        "https://www.mylaughland.com/cdn/shop/files/Brisa5.jpg?v=1687280436&width=832",
        "https://www.mylaughland.com/cdn/shop/files/BrisaAfter.jpg?v=1679423225&width=832",
        "https://www.mylaughland.com/cdn/shop/files/IMG_0007.jpg?v=1687280533&width=832",
        "https://www.mylaughland.com/cdn/shop/files/NehaAfter.jpg?v=1679423399&width=832",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Laughland_PenProduct_72501_3.png?v=1683324105",
        "https://www.mylaughland.com/cdn/shop/products/12.jpg?v=1671102404",
        "https://www.mylaughland.com/cdn/shop/products/277853769_989453628631128_6103431719502674547_n_1.png?v=1649362122&width=200",
        "https://www.mylaughland.com/cdn/shop/products/1-1.25ProductPicture.jpg?v=1689977080&width=200",
        "https://www.mylaughland.com/cdn/shop/products/12.jpg?v=1671102404&width=200",
        "https://www.mylaughland.com/cdn/shop/files/4-min.jpg?v=1690430950&width=200",
        "https://www.mylaughland.com/cdn/shop/products/ScreenShot2021-12-22at12.35.45AM.png?v=1640147794&width=200",
        "https://www.mylaughland.com/cdn/shop/files/Byrdie_Logo-500x118.png?v=1677638689&width=300",
        "https://www.mylaughland.com/cdn/shop/files/instyle-logo_fd11ccc7-b9e1-4d8f-9f87-7438947a8269.png?v=1677637075&width=300"

    )

    preload_at_home_JS(
        "https://www.mylaughland.com/cdn/shop/t/128/assets/product-form.js?v=116414170861993488341688944264",
        "https://cdn.judge.me/widget/base.js",
        "https://cdn.judge.me/widget/common.js",
        "https://cdn.judge.me/widget/main.js",
        "https://cdn.judge.me/widget/media.js",
        "https://static.rechargecdn.com/assets/js/widget.min.js?shop=glowup-smile.myshopify.com"
        // "https://static.rechargecdn.com/assets/js/widget.min.js?shop=glowup-smile.myshopify.com"
    )

    preload_at_home_CSS(
        "https://www.mylaughland.com/cdn/shop/t/128/assets/section-main-product.css?v=77679036591768168711683496849",
        "https://www.mylaughland.com/cdn/shop/t/128/assets/component-price.css?v=152699361744074217061680288520",
        "https://www.mylaughland.com/cdn/shop/t/128/assets/component-rte.css?v=71669948001115577601680288520",
        "https://www.mylaughland.com/cdn/shop/t/128/assets/recharge-widget-styles.css?v=8787213908653306691687843892",
        "https://www.mylaughland.com/cdn/shop/t/128/assets/landing-options-styles.css?v=35443416108917538771688076554",
        "https://cdn.judge.me/widget/main.css"

    )
}

// window.onload = function() {
//     preLoadStuff()
// }
// document.addEventListener("DOMContentLoaded", preLoadStuff);
// $(window).load(preLoadStuff);