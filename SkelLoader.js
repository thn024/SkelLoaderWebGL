/**
 * @author Thinh Nguyen / http://ThinhN.com/
 */

THREE.SkelLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

var debugging;
var debugSkeleton;

THREE.SkelLoader.prototype = {

	constructor: THREE.SkelLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {
			debugging = text;
			console.log("preparing to parse : " + url)
			console.log(text);
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
		var skeleton = new Skeleton();
		debugSkeleton = skeleton;
		var skeletonRoot = null;
		var currentJoint = null;
		var tempJoint = null;
		var jointStack = [];

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
				case 'offset':
				case 'boxmin':
				case 'boxmax':
				case 'rotxlimit':
				case 'rotylimit':
				case 'rotzlimit':
				case 'pose':
				currentJoint.AddDOF(new DOF(words));
					break;
				case 'balljoint': //i should make some sort of joint data structure here
					if(skeletonRoot == null)
					{
						console.log('Creating a new Skeleton Root Node');
						currentJoint = new Joint(words[1]);
						skeletonRoot = currentJoint;
						skeleton.SetRoot(currentJoint);
					}
					else
					{
						console.log("making a new joint: " + words[1]);
						tempJoint = new Joint(words[1]);
						currentJoint.AddChild(tempJoint);
						currentJoint = tempJoint;
					}
					jointStack.push(currentJoint);

					break;
				case '}': //end of joint data
					currentJoint.Load();
					console.log("finished with joint: " + jointStack.pop().name);
					if(jointStack.length > 0)
					{
						currentJoint = jointStack[jointStack.length-1];
						console.log("current joint is now : " + currentJoint.name);
					}
					break
				default: console.log("dis file sucks yo, i tried to parse: " + words[0]);
					break
			}

			//after you are done parsing, draw the scene

			skeleton.Draw();
		}
	}

};
