var images = [];
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

//-- usage --//
function preLoadStuff() {
    console.log('hello')
    preload(
        "https://www.mylaughland.com/cdn/shop/t/128/assets/blue-pen-big.png?v=75789883786534928331687761031",
        "https://www.mylaughland.com/cdn/shop/t/128/assets/blue-pen-small.png?v=10233571042852380481688254825",
        "https://www.mylaughland.com/cdn/shop/files/Laughland-drip-big.png?v=1686797546",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/before-after-smaller.png?v=1688076991&width=2048",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/before-after-smaller.png?v=1688076991&width=1800", 
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/before-after-smaller.png?v=1688076991&width=820",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Laughland_79400_1.jpg?v=1674083131&width=2048",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Laughland_79400_1.jpg?v=1674083131&width=1800",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/Laughland_79400_1.jpg?v=1674083131&width=820",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-1.png?v=1688078584&width=2048",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-2.png?v=1688078601&width=2048",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-3.png?v=1688078620&width=2048",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-4.png?v=1688078635&width=2048",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-1.png?v=1688078584&width=1800",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-2.png?v=1688078601&width=1800",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-3.png?v=1688078620&width=1800",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-4.png?v=1688078635&width=1800",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-1.png?v=1688078584&width=820",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-2.png?v=1688078601&width=820",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-3.png?v=1688078620&width=820",
        "https://cdn.shopify.com/s/files/1/0066/4728/3782/files/how-to-use-4.png?v=1688078635&width=820",
    )
}

document.addEventListener("DOMContentLoaded", preLoadStuff);
// $(window).load(preLoadStuff);