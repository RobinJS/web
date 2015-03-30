$(window).load(function () {
    /* Header border-bottom color changes on menu item mouseover */
    var allMenuLinks = $("nav ul li a");

    allMenuLinks.on("mouseover", function () {
        changeHeaderColor(this.title);
    });

    allMenuLinks.on("mouseout", function () {
        header.css("border-bottom-color", currentColor);
    });

    allMenuLinks.click(function () {
        var currentLinkTitle = this.title;
        changeAllColors(currentLinkTitle);
        getContent(currentLinkTitle);
    });

    setInterval(hashCheck, 200);
});

var currentColor = "#D81411";

/* Changing colors */
var header = $("body > header");

function changeHeaderColor(linkTitle) {
    var red = "#D81411";
    var green = "#1A8937";
    var blue = "#2171C6";
    var orange = "#DB6f11";
    var color;

    switch (linkTitle) {
        case "home-page": color = red; break;
        case "portfolio": color = blue; break;
        case "web-projects": color = blue; break;
        case "dot-net-projects": color = blue; break;
        case "about-me": color = orange; break;
        case "contact-me": color = green; break;
        default: "Menu item with this title does not exist!"
    }

    header.css("border-bottom-color", color);
    return color;
}

function setSelectedButtonColor(title) {
    $(".mainItem").css("background-color", "");
    if (title == "web-projects" || title == "dot-net-projects") {
        title = "portfolio";
    }

    $("nav ul li a[title=" + title + "]").css("background-color", currentColor);
}

function changeAllColors(title) {
    currentColor = changeHeaderColor(title);
    setSelectedButtonColor(title);
}

/* Hash changes check */
var currentHash;
function hashCheck() {
    var hash = window.location.hash;
    var isHomePageDisplayed = $("#content > div").hasClass('homePage')

    if (hash == "" && isHomePageDisplayed == false) {
        currentHash = hash;
        changeAllColors("home-page");
        getContent("home-page");
    } else if (hash != currentHash) {
        currentHash = hash;
        hash = hash.replace("#", "");
        changeAllColors(hash);
        getContent(hash);
    }
}