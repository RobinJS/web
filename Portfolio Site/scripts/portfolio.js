//$('a').on('click', function (event) {
//    event.preventDefault();

//    var title = this.title;
//    $("#content").hide(300);
//    getContent(title);
//})

/* Image opacity on hover */
var portfolioLinks = $(".portfolioPage div a");

portfolioLinks.hover(function () {
    image = $(this).find("img");
    p = $(this).parent("div").find("p");

    $(this).stop().animate({
        marginLeft: "5px"
    }, 'fast');

    image.stop().animate({
        opacity: 1
    }, 'fast');

    /* Shosing the content related to the image */
    p.show();
    p.stop().animate({
        width: "300px"
    }, 'fast');

}, function () {
    $(this).stop().animate({
        marginLeft: 0
    }, 'fast');

    image.stop().animate({
        opacity: 0.65
    }, 'fast');

    /* Hiding the content related to the image */
    p.stop().animate({
        width: 0,
    }, 'fast').hide(20);
});