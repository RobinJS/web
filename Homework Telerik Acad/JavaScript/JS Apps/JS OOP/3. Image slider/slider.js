if (!Object.create) {
    Object.create = function (obj) {
        function theClass() { };
        theClass.prototype = obj;
        return new theClass();
    }
}

if (!Object.prototype.extend) {
    Object.prototype.extend = function (properties) {
        function f() { };
        f.prototype = Object.create(this);
        for (var prop in properties) {
            f.prototype[prop] = properties[prop];
        }
        f.prototype._super = this;
        return new f();
    }
}

var sliderHead = document.getElementById('sliderHead');
var heading = document.getElementById('heading');
var thumbnailContainer = document.getElementById('sliderThumbnails');
var currentImage;

var Slider = {
    init: function (images) {
        this.images = [];
    },
    displayThumbs: function () {
        for (var i = 0; i < images.length; i++) {
            var img = document.createElement("img");
            img.setAttribute("src", images[i].thumbnail);
            var largeImagePath = images[i].large;
            var imageTitle = images[i].title;
            img.setAttribute("onclick", "enlargeImage('" + imageTitle + "', '" + largeImagePath + "', '" + i + "')");
            thumbnailContainer.appendChild(img);
        }
    },
    crateSliderHeader: function myfunction() {
        sliderHead.style.backgroundImage = "url('" + images[0].large + "')";
        heading.innerHTML = images[0].title;
        currentImage = 0;
        var nextButton = document.getElementById('next');
        nextButton.setAttribute("onclick", "showNextImage()");
        var previousButton = document.getElementById('previous');
        previousButton.setAttribute("onclick", "showPrevioustImage()");
    }
};

var Image = {
    init: function (title, thumbnail, large) {
        this.title = title;
        this.thumbnail = thumbnail;
        this.large = large;
    }
};

function enlargeImage(imageTitle, largeImagePath, index) {

    sliderHead.style.backgroundImage = "url('" + largeImagePath + "')";
    heading.innerHTML = imageTitle;
    currentImage = index;
    console.log(currentImage);
}

function showNextImage() {
    if (currentImage < images.length - 1) {
        currentImage++;
        enlargeImage(images[currentImage].title, images[currentImage].large, currentImage);
    }
}

function showPrevioustImage() {
    if (currentImage > 0) {
        currentImage--;
        enlargeImage(images[currentImage].title, images[currentImage].large, currentImage);
    }
}

var bridgesImg = Object.create(Image);
bridgesImg.init("Bridges", "images/bridges-thumb.jpg", "images/bridges.jpg");
var forestImg = Object.create(Image);
forestImg.init("Forest cliff", "images/forest-cliff-thumb.jpg", "images/forest-cliff.jpg");
var geysersImg = Object.create(Image);
geysersImg.init("Geysers", "images/geysers-thumb.jpg", "images/geysers.jpg");
var hutImg = Object.create(Image);
hutImg.init("Hut", "images/hut-thumb.jpg", "images/hut.jpg");
var oceanImg = Object.create(Image);
oceanImg.init("Ice ocean", "images/ice-ocean-thumb.jpg", "images/ice-ocean.jpg");
var mountainImg = Object.create(Image);
mountainImg.init("Mountain", "images/mountain-thumb.jpg", "images/mountain.jpg");

var images = [bridgesImg, forestImg, geysersImg, hutImg, oceanImg, mountainImg];
var slider = Object.create(Slider);
slider.init(images);
slider.displayThumbs();
slider.crateSliderHeader();