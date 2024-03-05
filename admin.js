$(".regis ").on('click',function(){
    var form = $(".register");
    form.css("display", "flex")
    $(".darkBg").css("display", "block")
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    form.css("left","83.4%")
    // form.classList.add('slideInFromRight');
})