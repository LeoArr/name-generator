


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

function getType(type) {
	if (type == "female" || type == "male") return type;
	return (Math.random() >= 0.5) ? "female" : "male";
}

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
    const _type = getType(options.type);
	var name = getNameFromList(_type);
	if (options.compound == true) {
		name += "-" + getNameFromList(_type);
	}
	if (options.lastn == true) {
		name += " " + getLastName(_type);
	}
    $('#name').text(name)
}

function getNameFromList(type) {
    return names[type][Math.floor(Math.random() * names[type].length)];
}

const consonants = "bcdfghjklmnpqrstvzx";

function getLastName(type) {
	var parent = getNameFromList(getType("x"));
	if (type == "female") {
		const suffix = (Math.random() >= 0.5) ? "dotter" : "dottir";
		if (consonants.includes(parent.substr(parent.length-1, parent.length))) {
			return parent + "s" + suffix;
		}
		return parent + suffix;
	} else {
		const suffix = "son";
		if (parent.substr(parent.length-1, parent.length) == "s") {
			return parent + suffix;
		}
		return parent + "s" + suffix;
	}
}

function myOnLoad() {
    updateSavedNames();
}
