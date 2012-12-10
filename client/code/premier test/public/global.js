/*initialisation* du moteur*/
var canvas = [];
var context = [];

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var tileWidth = 122;
var tileHeight = 86;

var lineSize = Math.round(canvasHeight / tileHeight + 1);
var colSize = Math.round(canvasWidth / tileWidth + 1);

//liste des emetteurs de particules
var particleEmitters;

//gestion du chargement
var initialDataLoaded = false;//initialise la connexion avec le serveur et telecharge les donnees initiales
var totalLoadingCount = 1;//1 car je compte la connexion au réseau
var currentLoadingCount = 0;
var loadingComplete = false;

//Moteur réseau
var networkEngine;