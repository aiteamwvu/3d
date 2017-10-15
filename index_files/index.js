 $(document).ready(function() {
	 
    var mainUrl = window.location.href + "#";
    
    function getFileName(choice) {
      var result = "";
      switch (choice) {
        case "machine learning":
          result = "machine_learning.json";
          break;
        case "neural networks":
          result = "neural_networks.json";
          break;
        case "semantic web":
          result = "semantic_web.json";
          break;
        case "machine vision":
          result = "machine_vision.json";
          break;
        case "artificial intelligence":
          result = "ai.json";
          break;
        case "data mining":
          result = "data_mining.json";
          break;
        case "natural language processing":
          result = "natural_language_processing.json";
          break;
        case "robotics":
          result = "robotics.json";
          break;
        case "deep learning":
          result = "deep_learning.json";
          break;
        default:
      }
      return "data/" + result;
    }

    function walk(obj) {
      $("#tempId").remove();
      $("#listId").append("<span id=\"tempId\"></span>");
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var val = obj[key];
          $("#tempId").append(
            "<p>" + key +
            "<a href=\"" + val.link + "\">" +
            val.title +
            "</a>" + val.date + "</p>");
        }
      }
    }

    $("#btSelectId").click(function() {
      $("#taListId").val($('#topicSelectId option:selected').val());
      var fn = getFileName($('#topicSelectId option:selected').val());
      console.log('filename ' + fn);
      $.getJSON( fn, function( data ) {
        walk(data);
      });
    });

    $("#btTypeId").click(function() {
      
      window.location.href = mainUrl;
      window.location.href += input;
      $("#container").empty();
      search(window.location.hash?window.location.hash.replace("#",""):"");

      // alert("type " + $("#topicTypeId").val());
      $("#taListId").val($("#topicTypeId").val());
      var fn = getFileName($("#topicTypeId").val());
      console.log('filename ' + fn);
      $.getJSON( fn, function( data ) {
        walk(data);
      });
    });

    var availableTags = [
      "machine learning",
      "neural networks",
      "semantic web",
      "machine vision",
      "artificial intelligence",
      "data mining",
      "natural language processing",
      "robotics",
      "deep learning"
    ];

    $("#topicTypeId").autocomplete({
      source: availableTags
    });
  });

 $('#graphButton').click(function(e){    
    $('#articleView, #graphButton').fadeOut('fast', function(){
	$('#graphView').css("visibility", "visible");
        $('#graphView, #articleButton').fadeIn('fast');
    });
});

$('#articleButton').click(function(e){    
    $('#graphView, #articleButton').fadeOut('fast', function(){
	$('#graphView').css("visibility", "hidden");
        $('#articleView, #graphButton').fadeIn('fast');
    });
});

 //*****************************GOOGLE SIGN IN***********************************************************

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    
    $('#signIn').css("visibility", "hidden");
    $('#signOut').css("visibility", "visible");
    $('#name').text("Signed in: " + profile.getName());
    $('#name').css("visibility", "visible");
    
  }
    
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
	 
    $('#signIn').css("visibility", "visible");
    $('#signOut').css("visibility", "hidden");
    $('#name').text("");
    $('#name').css("visibility", "hidden");
  }

//***************************************************GRAPH VIEW CODE********************************************

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

var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

function run() {
	init();
	animate();
}

function init() {
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 3000;
	scene = new THREE.Scene();
	// table
	for ( var i = 0; i < table.length; i += 6 ) {
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
		object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
		object.position.y = - ( table[ i + 4 ] * 180 ) + 990;
		targets.table.push( object );
	}

	// sphere

	var vector = new THREE.Vector3();
	var spherical = new THREE.Spherical();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {
		var phi = Math.acos( -1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;
		var object = new THREE.Object3D();
		spherical.set( 800, phi, theta );
		object.position.setFromSpherical( spherical );
		vector.copy( object.position ).multiplyScalar( 2 );
		object.lookAt( vector );
		targets.sphere.push( object );
	}

	// helix

	var vector = new THREE.Vector3();
	var cylindrical = new THREE.Cylindrical();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {
		var theta = i * 0.175 + Math.PI;
		var y = - ( i * 8 ) + 450;
		var object = new THREE.Object3D();
		cylindrical.set( 900, theta, y );
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
		object.position.x = ( ( i % 5 ) * 400 ) - 800;
		object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
		object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;
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
