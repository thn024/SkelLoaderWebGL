THREE.SkinLoader = function ( manager, inputSkeleton) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
	this.skeleton = inputSkeleton;
	this.name = null;
};

var debugSkin;

THREE.SkinLoader.prototype = {

	constructor: THREE.SkinLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;
		var skeleton = null;
		this.name = url;
		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {
			console.log("preparing to parse skin : " + url)
			scope.parse( text );
		} );
	},

	parse: function ( text ) {

		function vector( x, y, z ) {

			return new THREE.Vector3( x, y, z );

		}

		function uv( u, v ) {

			return new THREE.Vector2( u, v );

		}

		function face3( a, b, c, normals ) {

			return new THREE.Face3( a, b, c, normals );

		}
		
		var object = new THREE.Object3D();
		var geometry, material, mesh;
		var face_offset = 0;
		var lines = text.split('\n');
		var skin = new Skin(this.name, this.skeleton);
		var skeletonRoot = null;
		var currentJoint = null;
		var tempJoint = null;
		var state = null;
		var index = 0;
		var matrixIndex = 0;
		debugSkin = skin;
		//for every line, we want to parse skele data
		for(var i =0; i < lines.length; ++i)
		{
			//split up the file into lines
			line = lines[i];
			//get rid of whitespaces at the ends of the line, and get rid of multiple whitespaces in between
			line = line.trim().replace(/\s+/g, ' ');
			//split up the line into single words, store into a word array
			words = line.split(' ');
			
			switch(words[0])
			{
				case 'positions':
					state = 'positions';
					break;
				case 'normals':
					state = 'normals';
					break;
				case 'skinweights':
					state = 'skinweights';
					break;
				case 'triangles':
					state = 'triangles';
					break;
				case 'bindings':
					state = 'bindings';
					break;
				case 'matrix':
					state = 'matrix';
					break;
				case '}': //finished a section of text
					switch(state)
					{
						case 'positions':
						case 'normals':
						case 'skinweights':
						case 'triangles':
						case 'bindings':
							state = null; index = 0;
							console.log('should be finished reading skin file');
							break;
						case 'matrix':
							state = 'bindings'; matrixIndex = 0; index++; break;
						default:
							console.log("no valid state"); break;
					}
					
					break;
				default: 
					//console.log('i hit the default');
					//check if we parsed a float value in a line correctly
					if(  !isNaN( parseFloat(words[0]) ) ) 
					{
					    //console.log("my value is: " + parseFloat(words[0]));
					    if(state == 'matrix')
					    {
					    	skin.handleInput(state, words, index, matrixIndex);
					    	matrixIndex++;
					    }
					    else
					    {
					    	skin.handleInput(state, words, index, null);
					    	index++;
						}
					    
					}
					//console.log("dis file sucks yo, i tried to parse: " + words[0]);
					break;
			}

			

			
			
		}
		//after you are done parsing, draw the scene
		skin.Draw();

	}

};
