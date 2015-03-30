function createRequest() {
    try {
        request = new XMLHttpRequest();
    } catch (tryMS) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (otherMS) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (failed) {
                request = null;
            }
        }
    }

    return request;
}

function getContent(fileName) {
    var request = createRequest();
    if (request == null) {
        alert("Unable to create request");
        return;
    }

    request.onreadystatechange = placeContent;
    request.open("GET", fileName + ".html", true);
    request.send(null);
}

var text = '';

function placeContent() {
    if (request.readyState == 4) {
        if (request.status == 200) {
            
            if ( text == request.responseText ) {
                text = '';
                return;
            }

            text = request.responseText

            var contentDiv = $("#content");
            contentDiv.hide(300);
            contentDiv.html(request.responseText);
            contentDiv.fadeIn(300);
        }
    }
}
