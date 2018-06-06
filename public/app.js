
//helper function for html requests
function xmlHttpReq(method, url, options, callback) {
    url += "?type=" + options.type + "&compound=" + options.compound + "&lastn=" + options.lastn;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(xhttp.responseText);
        } else {
            callback(xhttp.responseText, err=this.status);
        }
    }
    xhttp.open(method, url, true);
    xhttp.send();
}

$(document).ready(function(){
    $('#btn-fem').click(function($event) {
        var options = {
            type: 'female',
            compound: $('#check-comp').prop('checked'),
            lastn: $('#check-lastn').prop('checked')
        }
        getName(options);
    });
    $('#btn-mal').click(function($event) {
        var options = {
            type: 'male',
            compound: $('#check-comp').prop('checked'),
            lastn: $('#check-lastn').prop('checked')
        }
        getName(options);
    });
    $('#btn-wil').click(function($event) {
        var options = {
            type: 'both',
            compound: $('#check-comp').prop('checked'),
            lastn: $('#check-lastn').prop('checked')
        }
        getName(options);
    });
    //on load
    var options = {
        type: 'both',
        compound: true,
        lastn: true
    }
    getName(options);
});

function getName(options) {
    xmlHttpReq('GET', '/get-name', options, function(resp, err=null) {
        $('#name').text(resp)
    });
    getCounter();
}

function getCounter() {
    xmlHttpReq('GET', '/nr-of-gens', '', function(resp, err=null) {
        $('#nrofgens').text(JSON.parse(resp).nr + " names generated");
    });
}
window.onload = getCounter();