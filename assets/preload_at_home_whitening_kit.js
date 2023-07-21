var images = [];
function preload_at_home() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

function preload_at_home_JS() {
    for (var i = 0; i < arguments.length; i++) {
        var preloadLink = document.createElement("link");
        preloadLink.href = preloadJS.arguments[i];
        preloadLink.rel = "preload";
        preloadLink.as = "script";
        document.head.appendChild(preloadLink);
    }
}

function preload_at_home_CSS() {
    for (var i = 0; i < arguments.length; i++) {
        var preloadLink = document.createElement("link");
        preloadLink.href = preloadCSS.arguments[i];
        preloadLink.rel = "preload";
        preloadLink.as = "style";
        document.head.appendChild(preloadLink);
    }
}

//-- usage --//
function preload_at_home_whitening_kit() {
    preload_at_home(
        "https://www.mylaughland.com/cdn/shop/t/128/assets/blue-pen-big.png?v=75789883786534928331687761031",
        // "https://www.mylaughland.com/cdn/shop/t/128/assets/blue-pen-small.png?v=10233571042852380481688254825",
        // "https://www.mylaughland.com/cdn/shop/files/Laughland-drip-big.png?v=1686797546",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/before-after-smaller.png?v=1688076991&width=2048",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/before-after-smaller.png?v=1688076991&width=1800",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/before-after-smaller.png?v=1688076991&width=1024", 
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/before-after-smaller.png?v=1688076991&width=820",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Laughland_79400_1.jpg?v=1674083131&width=2048",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Laughland_79400_1.jpg?v=1674083131&width=1800",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Laughland_79400_1.jpg?v=1674083131&width=1024",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Laughland_79400_1.jpg?v=1674083131&width=820",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-1.png?v=1688078584&width=2048",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-2.png?v=1688078601&width=2048",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-3.png?v=1688078620&width=2048",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-4.png?v=1688078635&width=2048",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-1.png?v=1688078584&width=1800",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-2.png?v=1688078601&width=1800",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-3.png?v=1688078620&width=1800",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-4.png?v=1688078635&width=1800",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-1.png?v=1688078584&width=1024",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-2.png?v=1688078601&width=1024",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-3.png?v=1688078620&width=1024",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-4.png?v=1688078635&width=1024",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-1.png?v=1688078584&width=820",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-2.png?v=1688078601&width=820",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-3.png?v=1688078620&width=820",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-4.png?v=1688078635&width=820",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/right-arrow.png?v=1687558083&width=2048",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/right-arrow.png?v=1687558083&width=1800",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/right-arrow.png?v=1687558083&width=1024",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/right-arrow.png?v=1687558083&width=820",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Line_20.png?v=1688021392&width=1800",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/image_4.png?v=1647385882",
        // "https://www.mylaughland.com/cdn/shop/files/Laughland-drip-big.png?v=1686797546&width=200",
        // "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Group_297.png?v=1688102497&width=102",
        // "https://www.mylaughland.com/cdn/shop/t/128/assets/checkmarkblue.png?v=48407837164877214861686899368"
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