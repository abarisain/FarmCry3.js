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

//Moteur réseau
var networkEngine;

//Login
var loginRememberCheckbox;
var loginEmailField;
var loginPasswordField;
var loginPanel;
var loadingPanel;
var loadingProgressSpan;

// Patch JS
String.prototype.beginsWith = function (string) {
	return(this.indexOf(string) === 0);
};