THREE.AnimLoader = function ( manager, inputSkeleton) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
	this.skeleton = inputSkeleton;
	this.name = null;
	this.animation = null;
};

var debugSkin;

THREE.AnimLoader.prototype = {

	constructor: THREE.AnimLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;
		var skeleton = null;
		this.name = url;
		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {
			console.log("preparing to parse Animation File : " + url)
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
		
		var lines = text.split('\n');
		this.animation = new Animation(this.name, this.skeleton);
		var skeletonRoot = null;
		var currentJoint = null;
		var currentChannel = null;
		var state = null;
		var channelIndex = 0;
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
				case 'animation':
					console.log("Creating a new animation");
					break;
				case 'range':
					this.animation.setTimeRange(words);
					break;
				case 'numchannels':
					this.animation.setNumChannels(words);
					break;
				case 'channel':
					console.log("making a new channel");
					currentChannel = new Channel(this.skeleton, channelIndex);
					channelIndex++;
					this.animation.addChannel(currentChannel);
					break;
				case 'extrapolate':
					currentChannel.setExtrapolationType(words);
					break;
				case 'keys':
					state = 'keys';
					currentChannel.setNumKeys(words);
					break;
				case '}': //finished a section of text
					switch(state)
					{
						case 'keys':
							state = 'normal';
							break;
						case 'normal':
							break;
						default:
							console.log("no valid state"); break;
					}
					
					break;
				default:
					if(state == 'keys')
					{
						currentChannel.setKey(words);
					}
					else
					{
						console.log("dis file sucks yo, i tried to parse: " + words[0]);
					}
					break;
			}

			

			
			
		}
	}

};
