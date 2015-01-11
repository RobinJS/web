/* Image box-shadow efect on mouseover */
$("#content div div a > img").mouseover(function () {
    $(this).css('boxShadow', '0 0 6px 2px #2171C6');
}).mouseout(function () {
    $(this).css('boxShadow', 'none');
});