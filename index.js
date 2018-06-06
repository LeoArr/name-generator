const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const names = require("./names");
const mysql = require('mysql');
const fPath = "./counter.txt";

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));

// logging body parser (middleware) Handles bad JSON
app.use(bodyParser.json({verify: function(req, res, buf, enconding) {
	try {
		JSON.parse(buf);
	} catch (e) {
		res.status(500);
		var output = "";
		try {
			output = decodeURIComponent(escape(buf));
		} catch (e) {
			res.status(500);
			res.send({success: false, message: "Invalid JSON", data: buf});
			throw "Utf-8 Error"
		}
		res.send({success: false, message: "Invalid JSON", data: output});
		throw "invalid JSON";
	}
}}));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

//Fetching name
function getType(type) {
	if (type == "female" || type == "male") return type;
	return (Math.random() >= 0.5) ? "female" : "male";
}

function getName(type) {
	return names[type][Math.floor(Math.random() * names[type].length)];
}

var consonants = "bcdfghjklmnpqrstvzx";

function getLastName(type) {
	var parent = getName(getType("x"));
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

//DB
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'namegendatabase'
  });
  
connection.connect()

//route
app.get('/get-name', (req, res) => {
	const type = getType(req.query.type);
	var name = getName(type);
	if (req.query.compound == "true") {
		name += "-" + getName(type);
	}
	if (req.query.lastn == "true") {
		name += " " + getLastName(type);
	}
	res.send(name);
	updateCounter();
});

//counter stuff
async function updateCounter() {
	connection.query("update counter set nr=nr+1;", [], (err, rows, fi) => { });
}

async function getCounter(res=null) {
	connection.query("select nr from counter;", [], (err, row, fi) => {
		if (err) {
			if (res)
				res.send(err);
		} else {
			if (res) {
				res.send(row[0]);
			}
		}
	});
}


//HANDLING THE COUNTER
app.get('/nr-of-gens', (req, res) => {
	getCounter(res);
});

const port = 5050;

app.listen(port, () => console.log("Listedning on port " + port));