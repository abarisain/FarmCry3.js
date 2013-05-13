Options = {};

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var tileWidth = 267;
var tileHeight = 189;

var lineSize = 16;
var colSize = 16;

var scaleFactor = 1;

//liste des emetteurs de particules
var particleEmitters;

var animationDuration = 60;

//gestion du chargement
var initialDataLoaded = false;//initialise la connexion avec le serveur et telecharge les donnees initiales
var totalLoadingCount = 1;//1 car je compte la connexion au réseau
var currentLoadingCount = 0;
var loadingComplete = false;
var initialData;

//Moteur réseau
var networkEngine;

Options.Graphic = {
	particles: true,
	clouds: true,
	advancedEffects: true
};

Options.Sound = {
	music: false
};

Options.Gameplay = {
	mapSpeed: 5
};

//graphic debug
Options.Debug = {};
Options.Debug.Graphic = {
	enabled: false,//affiche le debug basique
	map: false,//affiche les noms des tiles, ça arrache un peu les yeux
	item: true,//affiche les noms des tilesItems
	advanced: false,//switch la transparence des éléments
	globalAlpha: 1,//affiche tous les elements en transparence
	dotSize: 20//la taille des formes geometriques de debug à afficher
};

//Login
var loginRememberCheckbox;
var loginEmailField;
var loginPasswordField;
var loginPanel;
var loadingPanel;
var loadingProgressSpan;

// Patch JS
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};
Array.prototype.removeItem = function (element) {
	this.splice(this.indexOf(element), 1);
};
Array.prototype.removeItemAtIndex = function (index) {
	this.splice(index, 1);
};
String.prototype.beginsWith = function (string) {
	return(this.indexOf(string) === 0);
};