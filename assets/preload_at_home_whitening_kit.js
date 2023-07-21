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
        "https://www.mylaughland.com/cdn/shop/products/4.jpg?v=1671102404",
        "https://www.mylaughland.com/cdn/shop/files/Laughland_79400_1.jpg?v=1674083131&width=1340",
        "https://www.mylaughland.com/cdn/shop/files/MP4_dd1165d5-4283-4226-9e3b-f81ba196527b.png?v=1673037047&width=1320",
        "https://www.mylaughland.com/cdn/shop/files/IMG_0705.jpg?v=1687280436&width=2316", /* MAKE THIS MUCH SMALLER */
        "https://www.mylaughland.com/cdn/shop/files/LesleyAfter.jpg?v=1679423356&width=1080", /* MAKE THIS MUCH SMALLER */
    )

    preload_at_home_JS(
        // are these switching?
        // "https://replocdn.com/w/57e49375-3a33-42e8-88b7-484104081682/224b18f7-acde-4496-b12f-c701a3909a92.min.js?v=c63519e6-1707-11ee-a195-b21abdbd5202",
        // "https://replocdn.com/w/57e49375-3a33-42e8-88b7-484104081682/4dff59fc-1de9-43d7-a664-feec286888f0.min.js?v=d58a1b78-1a98-11ee-bb35-f69a0a326a7f",
        // "https://replocdn.com/w/57e49375-3a33-42e8-88b7-484104081682/82491444-6cf5-4a48-b28e-8eb46f84b4c1.min.js?v=d34c8f46-16c2-11ee-8154-7a4af79e392a",
        // "https://replocdn.com/w/57e49375-3a33-42e8-88b7-484104081682/e567da00-b5b8-4708-b012-dbe33f4e5b63.min.js?v=9537667e-1701-11ee-b6b2-b21abdbd5202"
    )

    preload_at_home_CSS(
        "https://www.mylaughland.com/cdn/shop/t/128/assets/section-main-product.css?v=77679036591768168711683496849",
        "https://www.mylaughland.com/cdn/shop/t/128/assets/component-price.css?v=152699361744074217061680288520",
        "https://www.mylaughland.com/cdn/shop/t/128/assets/component-rte.css?v=71669948001115577601680288520",
        "https://www.mylaughland.com/cdn/shop/t/128/assets/recharge-widget-styles.css?v=8787213908653306691687843892",
        "https://www.mylaughland.com/cdn/shop/t/128/assets/landing-options-styles.css?v=35443416108917538771688076554"
    )
}

// window.onload = function() {
//     preLoadStuff()
// }
// document.addEventListener("DOMContentLoaded", preLoadStuff);
// $(window).load(preLoadStuff);