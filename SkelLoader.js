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
		//for every line, we want to parse skele data
		for(var i =0; i < lines.length; ++i)
		{
			//split up the file into lines
			line = lines[i];
			line = line.trim();
			//split up the line into single words, store into a word array
			words = line.split(' ');
			
			switch(words[0])
			{
				case 'offset':
					//console.log("offset yo");
				currentJoint.AddDOF(new DOF(words));
					break;
				case 'boxmin':

					break;
				case 'boxmax':
					break;
				case 'rotxlimit':
					break;
				case 'rotylimit':
					break;
				case 'rotzlimit':
				currentJoint.AddDOF(new DOF(words));
					break;
				case 'pose':
					break;
				case 'balljoint': //i should make some sort of joint data structure here
					if(skeletonRoot == null)
					{
						console.log('Creating a new Skeleton Root Node');
						skeletonRoot = new Joint();
						skeleton.SetRoot(skeletonRoot);
					}
					console.log("making a new joint: " + words[1]);
					var testJoint = new Joint(words[1]);
					currentJoint = testJoint;
					break;
				case '}': //end of joint data
					console.log("finished with joint: " + currentJoint.name)
					break
				default: console.log("dis file sucks yo, i tried to parse: " + words[0]);
					break
			}
		}

		/*
		function add_face( a, b, c, normals_inds ) {

			if ( normals_inds === undefined ) {

				geometry.faces.push( face3(
					parseInt( a ) - (face_offset + 1),
					parseInt( b ) - (face_offset + 1),
					parseInt( c ) - (face_offset + 1)
				) );

			} else {

				geometry.faces.push( face3(
					parseInt( a ) - (face_offset + 1),
					parseInt( b ) - (face_offset + 1),
					parseInt( c ) - (face_offset + 1),
					[
						normals[ parseInt( normals_inds[ 0 ] ) - 1 ].clone(),
						normals[ parseInt( normals_inds[ 1 ] ) - 1 ].clone(),
						normals[ parseInt( normals_inds[ 2 ] ) - 1 ].clone()
					]
				) );

			}

		}
		
		function add_uvs( a, b, c ) {
      
			geometry.faceVertexUvs[ 0 ].push( [
				uvs[ parseInt( a ) - 1 ].clone(),
				uvs[ parseInt( b ) - 1 ].clone(),
				uvs[ parseInt( c ) - 1 ].clone()
			] );

		}
		
		function handle_face_line(faces, uvs, normals_inds) {

			if ( faces[ 3 ] === undefined ) {
				
				add_face( faces[ 0 ], faces[ 1 ], faces[ 2 ], normals_inds );
				
				if (!(uvs === undefined) && uvs.length > 0) {

					add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 2 ] );

				}

			} else {
				
				if (!(normals_inds === undefined) && normals_inds.length > 0) {

					add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ], [ normals_inds[ 0 ], normals_inds[ 1 ], normals_inds[ 3 ] ]);
					add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ], [ normals_inds[ 1 ], normals_inds[ 2 ], normals_inds[ 3 ] ]);

				} else {

					add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ]);
					add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ]);

				}
				
				if (!(uvs === undefined) && uvs.length > 0) {

					add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 3 ] );
					add_uvs( uvs[ 1 ], uvs[ 2 ], uvs[ 3 ] );

				}

			}
			
		}

		// create mesh if no objects in text

		if ( /^o /gm.test( text ) === false ) {

			geometry = new THREE.Geometry();
			material = new THREE.MeshLambertMaterial();
			mesh = new THREE.Mesh( geometry, material );
			object.add( mesh );
		}

		var vertices = [];
		var verticesCount = 0;
		var normals = [];
		var uvs = [];

		// v float float float

		var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// vn float float float

		var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// vt float float

		var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// f vertex vertex vertex ...

		var face_pattern1 = /f( +\d+)( +\d+)( +\d+)( +\d+)?/;

		// f vertex/uv vertex/uv vertex/uv ...

		var face_pattern2 = /f( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))?/;

		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

		var face_pattern3 = /f( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))?/;

		// f vertex//normal vertex//normal vertex//normal ... 

		var face_pattern4 = /f( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))?/

		//

		var lines = text.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			var line = lines[ i ];
			line = line.trim();

			var result;

			if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

				continue;

			} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				geometry.vertices.push( vector(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				) );

			} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				normals.push( vector(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				) );

			} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

				// ["vt 0.1 0.2", "0.1", "0.2"]

				uvs.push( uv(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] )
				) );

			} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

				// ["f 1 2 3", "1", "2", "3", undefined]

				handle_face_line([ result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ] ]);

			} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

				// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]
				
				handle_face_line(
					[ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
					[ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //uv
				);

			} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

				handle_face_line(
					[ result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ] ], //faces
					[ result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ] ], //uv
					[ result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ] ] //normal
				);

			} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

				// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

				handle_face_line(
					[ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
					[ ], //uv
					[ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //normal
				);

			} else if ( /^o /.test( line ) ) {

				// object

				if (!(geometry === undefined)) {

					face_offset = face_offset + geometry.vertices.length;

				}
				
				geometry = new THREE.Geometry();
				material = new THREE.MeshLambertMaterial();

				mesh = new THREE.Mesh( geometry, material );
				mesh.name = line.substring( 2 ).trim();
				object.add( mesh );

				verticesCount = 0;

			} else if ( /^g /.test( line ) ) {

				// group

			} else if ( /^usemtl /.test( line ) ) {

				// material

				material.name = line.substring( 7 ).trim();

			} else if ( /^mtllib /.test( line ) ) {

				// mtl file

			} else if ( /^s /.test( line ) ) {

				// smooth shading

			} else {

				// console.log( "THREE.SkelLoader: Unhandled line " + line );

			}

		}

		*/
		
		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			var geometry = object.children[ i ].geometry;

			geometry.computeCentroids();
			geometry.computeFaceNormals();
			geometry.computeBoundingSphere();

		}
		
		return object;

	}

};