
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

function displaySnackbar(str) {
    var x = document.getElementById("snackbar");
    x.innerText = str;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
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

    $('#btn-sav').click(function() {
        if (typeof(Storage) !== "undefined") {
            var name = $('#name').text();
            var store = localStorage.getItem("savedNames");
            if (store) {
                store = JSON.parse(store);
                if (store.names.includes(name)) return;
                if (store.names.length > 16) {
                    displaySnackbar("Too many names saved already.");
                }
                store.names.push(name);
                localStorage.setItem("savedNames", JSON.stringify(store));
            } else {
                localStorage.setItem("savedNames", JSON.stringify({ names: [name] }));
            }
            updateSavedNames();
        } else {
            displaySnackbar("Sorry your browser does not support local storage.")
        }
    });

    //on load
    var options = {
        type: 'both',
        compound: true,
        lastn: true
    }
    getName(options);
    myOnLoad();
});

function removeName(index) {
    const json = localStorage.getItem("savedNames");
    if (!json) return;
    const names = JSON.parse(json).names;
    names.splice(index, 1);
    localStorage.setItem("savedNames", JSON.stringify({ names: names }));
    updateSavedNames();
}

function updateSavedNames() {
    const json = localStorage.getItem("savedNames");
    if (!json) return;
    const names = JSON.parse(json).names;
    document.getElementById("names-list").innerHTML = "";
    for (var i = 0; i < names.length; i++) {
        $("#names-list").append('<li><div class="name">' + names[i] + '</div><div onclick="removeName('+ i +')" class="remove-name"><i class="fas fa-trash-alt"></i></div></li>');
    }
}

function getName(options) {
    xmlHttpReq('GET', '/get-name', options, function(resp, err=null) {
        if (err) return;
        $('#name').text(resp)
        getCounter();
    });
}

function getCounter() {
    xmlHttpReq('GET', '/nr-of-gens', '', function(resp, err=null) {
        if (err) return;
        if (resp)
            $('#nrofgens').text(JSON.parse(resp).nr + " names generated");
    });
}

function myOnLoad() {
    getCounter()
    updateSavedNames();
}
