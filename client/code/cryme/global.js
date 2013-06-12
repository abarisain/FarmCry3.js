Options = {};

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var tileWidth = 267;
var tileHeight = 189;

var lineSize = 16;
var colSize = 16;

var scaleFactor = 1;

var borderSize = 0;//taille des bordures dans la vue d'informations pour les tiles

var isAudioUnlocked = false;
var isIOS = false;

//liste des emetteurs de particules
var particleEmitters;

//var animationDuration = 800;

//gestion du chargement
var initialDataLoaded = false;//initialise la connexion avec le serveur et telecharge les donnees initiales
var totalLoadingCount = 1;//1 car je compte la connexion au réseau
var currentLoadingCount = 0;
var loadingComplete = false;
var initialData = null;

//Moteur réseau
var networkEngine;

Options.Graphic = {
	particles: true,
	clouds: true,
	advancedEffects: true,
	refreshRate: 60,
	refreshRateReference: 60,//default,
	timeSpeed: 2//for battle only
};

Options.Sound = {
	music: false
};

Options.Gameplay = {
	mapSpeed: 5,
	fightRoundCount: 3
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
	var index = this.indexOf(element);
	if (index != -1)
		this.splice(index, 1);
};
Array.prototype.removeItemAtIndex = function (index) {
	this.splice(index, 1);
};
String.prototype.beginsWith = function (string) {
	return(this.indexOf(string) === 0);
};