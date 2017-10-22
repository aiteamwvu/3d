 $(document).ready(function() {
	 
    var mainUrl = 'http://aiwvu.ml/3d/' + '#';
    var searchKey;
   
    $("#btnSelectId").click(function() {
      
      searchKey = $('#topicSelectId option:selected').val();
      console.log('selected ' + searchKey);

      window.location.href = mainUrl;
      window.location.href += searchKey;

      $("#container").empty();
      $("#listArticles").empty();

      search(window.location.hash?window.location.hash.replace("#",""):"");
    });

    $("#btnTypeId").click(function() {
      
      var input = $("#topicTypeId").val();

      window.location.href = mainUrl;
      window.location.href += input;

      $("#container").empty();
      $("#listArticles").empty();
	    
      search(window.location.hash?window.location.hash.replace("#",""):"");
    });
	 
    $("#saveContextButton").click(function() {
      var  choice = $('input[name="contextRadio"]:checked').val();
		//alert(choice);
    });	
 });

var profile;

function getTopicsMenu() {

	$('#userSetUpId').css("display", "none");
	$('#userView').css("display", "inline");

	keys = $('#newKeywordsId').val().split(',');
		setUser(profile.getEmail(), keys, function(userObject) {
		console.log("set keywords " + userObject.keywords);
	});

	getUser(profile.getEmail(), function(userObject) {
		var userKeys = cleanString(userObject.keywords);
			$("#topicTypeId").autocomplete({
				source: userKeys
			});

		$("#topicSelectId").empty();

		for (var k in userKeys) {
			$("#topicSelectId").append('<option value=' + userKeys[k] + '>' + userKeys[k] + '</option>');
		}
	});
    }

 function goToGraphView(){    
	$('#articleView, #graphButton').fadeOut('fast', function(){
		$('#graphView').css("visibility", "visible");
		$('#graphView, #articleButton').fadeIn('fast');
    	});
     }
	 
    function goToArticleView(){
	$('#graphView, #articleButton').fadeOut('fast', function(){
		$('#graphView').css("visibility", "hidden");
		$('#articleView, #graphButton').fadeIn('fast');
	});
     }

 //*****************************GOOGLE SIGN IN + GET USER FROM DB**********************************************

function getKeywords(email, callback) {
	$.getJSON('http://aiwvu.ml:5000/get_keywords?email=' + email + '&t=' + (new Date()).getTime(), function(data) {
	    callback(data);
	});
}

function getUser(email, callback) {
    $.getJSON('http://aiwvu.ml:5000/get_user?email=' + email + '&t=' + (new Date()).getTime(), function(data) {
        callback(data);
    });
  }
  
 function setUser(email, keywords, callback) {
    $.getJSON('http://aiwvu.ml:5000/set_user?email=' + email + '&keywords=' + keywords + '&t=' + (new Date()).getTime(), function(data) {
        callback(data);
    });
  }

function cleanString(ks) {
    var ta = ks.toString().split(',');
    var at = [];
    for (var t in ta){
      if (ta[t].length > 0) {
        at.push(ta[t]);
      }
    }
    return at;
}

function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    
    $('#signIn').css("display", "none");
    $('#signOut').css("visibility", "visible");
    $('#name').text("Signed in: " + profile.getName());
    $('#name').css("visibility", "visible");
	
    $('#loginPromptId').css("display", "none");

    getUser(profile.getEmail(),  function(userObject) {
      console.log("get keywords " + userObject.keywords);
      var keys = cleanString(userObject.keywords);
      
      $("#listKeywords").empty();
      $("#listKeywords2").empty();

      for(var i =0; i <= keys.length/2; i++){
      	var list = document.createElement('li');
		list.className = 'list';
		list.innerHTML = keys[i];
		document.getElementById('listKeywords').appendChild(list);
      }

      for(var i =Math.round(keys.length/2)+1; i < keys.length; i++){
      	var list = document.createElement('li');
		list.className = 'list';
		list.innerHTML = keys[i];
		document.getElementById('listKeywords2').appendChild(list);
      }
    });

    $('.needLogIn').css("visibility", "visible");
    $('#userView').css("display", "none");
  }
    
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
	 
    $('#signIn').css("display", "inline");
    $('#signOut').css("visibility", "hidden");
    $('#name').text("");
    $('#name').css("visibility", "hidden");
	  
    $('#loginPromptId').css("display", "inline");
    $('.needLogIn').css("visibility", "hidden");
    goToArticleView();
  }
//*************************************************** SEARCH FUNCTION ********************************************

var table = [];

function search(query) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', 'http://aiwvu.ml:5000/?q=' + query + '&t=' + (new Date()).getTime(), true);
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4) {
	        if(xmlhttp.status == 200) {
	            table = JSON.parse(xmlhttp.responseText);
	            run();
	         }
	    }
	};
	xmlhttp.send(null);
}

//***************************************************LIST ARTICLES********************************************
//var listed = [];

function listing(){

	var numArticlesToList = 5;
	var j = 0;

	for( var i= 0; i < 7*numArticlesToList; i+=7){

		var list = document.createElement('li');
		list.className = 'list-group-item d-flex justify-content-between align-items-center';
		var title = table[i+6];
		var url = table[ i ].split('|')[0];
		var src = table[i].split('|')[1];

		//listed.push(url);

		//replace single quote by $ to avoid link bug
		title1 = title.replace(/'/g, "$");

		list.innerHTML = "<div class='media'><img class='mr-2 thumbimg' src='"+src+"' ><div class='media-body'><a href='#'' onclick=\"openArticleInView('"+title1+"')\">"+title+"</a><span class='badge badge-pill badge-info'>"+table[i+2]+"</span></div></div>";
		document.getElementById('listArticles').appendChild(list);

		j++;
	}
}

function openArticleInView(url){

	goToArticleView();

	//url = listed[index];

	//replace $ by single quote
	title1 = url.replace(/\$/g, "'");

	//url = "https://www.digitaltrends.com/web/how-to-uninstall-chrome-extensions/";

	/*getContent(url, function(articleObject){
		console.log("article content " + articleObject.title);
		var title = articleObject.title;
		var author = articleObject.author;
		var content = articleObject.content;
		var source = articleObject.source;
	});*/

	$('#articleTitle').text(title1);
	$('#articleContent').text(content);
}

//***************************************************GRAPH VIEW CODE********************************************


var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

function run() {
	init();
	animate();
	listing();
}

function init() {
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 3000;
	scene = new THREE.Scene();
	// table
	for ( var i = 0; i < table.length-(7*75); i += 7 ) {
		var element = document.createElement( 'div' );
		element.className = 'element';
		element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
		if( table[ i + 5 ] == "Book" )
			element.className += " circle";
		else if( table[ i + 5 ] == "Blog" )
			element.className += " square";
		var number = document.createElement( 'div' );
		number.className = 'number';
		number.textContent = table[ i + 2 ];
		element.appendChild( number );
		var symbol = document.createElement( 'div' );
		symbol.className = 'symbol';
		symbol.innerHTML = '<a href="' + table[ i ].split('|')[0] + '" target="_blank"><img src="' + table[ i ].split('|')[1] + '"></a>';
		element.appendChild( symbol );
		var details = document.createElement( 'div' );
		details.className = 'details';
		details.innerHTML = table[ i + 1 ];
		element.appendChild( details );
		var object = new THREE.CSS3DObject( element );
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;
		scene.add( object );
		objects.push( object );
		//
		var object = new THREE.Object3D();
		object.position.x = ( table[ i + 4 ] * 310 ) - 2230;
		object.position.y = - ( table[ i + 3 ] * 360 ) + 1990;
		targets.table.push( object );
	}

	// sphere

	var vector = new THREE.Vector3();
	var spherical = new THREE.Spherical();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {
		var phi = Math.acos( -1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;
		var object = new THREE.Object3D();
		spherical.set( 1200, phi, theta );
		object.position.setFromSpherical( spherical );
		vector.copy( object.position ).multiplyScalar( 2 );
		object.lookAt( vector );
		targets.sphere.push( object );
	}

	// helix

	var vector = new THREE.Vector3();
	var cylindrical = new THREE.Cylindrical();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {
		var theta = i * 100.175 + Math.PI;
		var y = - ( i * 40 ) + 750;
		var object = new THREE.Object3D();
		cylindrical.set( 1100, theta, y );
		object.position.setFromCylindrical( cylindrical );
		vector.x = object.position.x * 2;
		vector.y = object.position.y;
		vector.z = object.position.z * 2;
		object.lookAt( vector );
		targets.helix.push( object );
	}

	// grid

	for ( var i = 0; i < objects.length; i ++ ) {
		var object = new THREE.Object3D();
		object.position.x = ( ( i % 5 ) * 600 ) - 2500;
		object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 600 ) + 1000;
		object.position.z = ( Math.floor( i / 25 ) ) * 800 - 2000;
		targets.grid.push( object );
	}
	//
	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute';
	document.getElementById( 'container' ).appendChild( renderer.domElement );
	//
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;
	controls.minDistance = 500;
	controls.maxDistance = 6000;
	controls.addEventListener( 'change', render );
	var button = document.getElementById( 'table' );
	button.addEventListener( 'click', function ( event ) {
		transform( targets.table, 2000 );
	}, false );
	var button = document.getElementById( 'sphere' );
	button.addEventListener( 'click', function ( event ) {
		transform( targets.sphere, 2000 );
	}, false );
	var button = document.getElementById( 'helix' );
	button.addEventListener( 'click', function ( event ) {
		transform( targets.helix, 2000 );
	}, false );
	var button = document.getElementById( 'grid' );
	button.addEventListener( 'click', function ( event ) {
		transform( targets.grid, 2000 );
	}, false );
	transform( targets.table, 2000 );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function transform( targets, duration ) {
	TWEEN.removeAll();
	for ( var i = 0; i < objects.length; i ++ ) {
		var object = objects[ i ];
		var target = targets[ i ];
		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();
		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();
	}
	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
		.onUpdate( render )
		.start();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();
}

function animate() {
	requestAnimationFrame( animate );
	TWEEN.update();
	controls.update();
}

function render() {
	renderer.render( scene, camera );
}
