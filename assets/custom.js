/* Scroll javascript start */

document.addEventListener('DOMContentLoaded', function () {
  
    document.querySelector(window).scroll(function(){
      var sticky = document.querySelector('body:not(.template-index) .outer-header-wrapper'),
      scroll = document.querySelector(window).scrollTop;  
      if (scroll >= 50){
        sticky.classList.add('scrolled');
      }
      else {
        sticky.classList.remove('scrolled');
      }
    });
  
}, false);

/* Scroll javascript end */

/* animation policies javascript start */

var stringToRepeat = document.querySelector(".shopify-policy__container .shopify-policy__title").innerHTML.trim();
var TempVar = "";
for(let i=0;i<=100;i++){
    TempVar = TempVar + "" + stringToRepeat;   
}

document.querySelector(".shopify-policy__container .shopify-policy__title").innerHTML = TempVar;

var stringToRepeat = document.querySelector(".shopify-policy__container .shopify-policy__title h1").innerHTML.trim();
var TempVar = "";
var TempStr = "";

stringToRepeat = stringToRepeat.split(" ");
stringToRepeat[stringToRepeat.length - 1]


  for(i=0;i<stringToRepeat.length;i++){


    if(TempStr == ""){
       TempStr = stringToRepeat[i]
    }
    else{
      if((stringToRepeat.length - 1) == i){
        TempStr = TempStr + " <span class='stylized'>" + stringToRepeat[i] + "</span> ";
      }
      else{
        TempStr = TempStr + " " + stringToRepeat[i];
      }
    }
   
  }

TempStr = "<h1>" + TempStr + "</h1>";

for(let i=0;i<=100;i++){
    TempVar = TempVar + "" + TempStr;   
}

document.querySelector(".shopify-policy__container .shopify-policy__title").innerHTML = TempVar;

/* animation policies javascript end */