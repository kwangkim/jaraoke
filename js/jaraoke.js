var Jaraoke = Class.create({
	initialize: function() {
		this.apW = $('apW');
		this.apW.volume = 0; // With vocal's volume off initially
		this.apW.play(); this.apW.pause(); // Force buffering on load - without this time alignment between the two tracks isn't spot on...even with autobuffer="true"
		this.apN = $('apN');
		this.apN.volume = 1; // No vocal's volume full initially
		this.apN.play(); this.apN.pause(); // Force buffering on load
		this.apN.addEventListener("timeupdate", timeUpdate, true);
		this.bVocal = false;
		this.bPlaying = false;
		$('bob').update('Ready to RAWK!');
	}
	
});

// Crude as hell...plan to use XML for lyrics data in the future...
var currCue = 0;
var cues = [ 9.0, 13.5, 17.5, 22.2, 26.6, 30.7, 34.9, 39.8, 44.3, 48.5, 52.7, 57.4, 70.6, 75.0, 78.9, 83.9, 87.7, 92.7, 96.7, 101.5, 106.0, 110.2, 114.4, 119.0, 123.2, 127.9, 132.0, 136.7, 175.8, 180.6, 184.8, 189.5, 193.6, 198.2, 202.5, 207.1 ];
var lyrics = [	"I pushed a button and elected him to office and a",
				"He pushed a button and it dropped a bomb",
				"You pushed a button and could watch it on the television",
				"Those motherfuckers didn't last too long ha ha",
				"I'm sick of hearing 'bout the haves and the have nots",
				"Have some personal accountability",
				"The biggest problem with the way that we've been doing things is",
				"The more we let you have the less that I'll be keeping for me",

				"Well I used to stand for something",
				"Now I'm on my hands and knees",
				"Traded in my God for this one",
				"He signs his name with a Capital G",

				"Don't give a shit about the temperature in Guatemala",
				"Don't really see what all the fuss is about",
				"Ain't gonna worry bout no future generations and a",
				"I'm sure somebody's gonna figure it out",
				"Don't try to tell how some power can corrupt a person",
				"You haven't had enough to know what it's like",
				"You're only angry 'cause you wish you were in my position",
				"Now nod your head because you know that I'm right&mdash;all right!",

				"Well I used to stand for something",
				"But forgot what that could be",
				"There's a lot of me inside you",
				"Maybe you're afraid to see",
				"Well I used to stand for something",
				"Now I'm on my hands and knees",
				"Traded in my God for this one",
				"He signs his name with a Capital G",

				"Well I used to stand for something",
				"But forgot what that could be",
				"There's a lot of me inside you",
				"Maybe you're afraid to see",
				"Well I used to stand for something",
				"Now I'm on my hands and knees",
				"Traded in my God for this one",
				"He signs his name with a Capital G" ];

var cues = [ 24.78, 26.81, 29.69, 34.88, 37.57, 42.57, 45.42, 50.37, 53.25, 58.23, 62.17, 66.18, 70.07, 75.25, 81.82, 84.72, 89.03, 92.64, 97.59, 100.55, 105.46, 108.91, 113.33, 117.24, 121.17, 125.07, 130.8 ];
var lyrics = [	"Am I...",
			  	"Am I still tough enough?",
				"Feels like I'm wearing down, down, down, down, down...",
				"Is my viciousness",
				"Lo&mdash;...Losing ground, ground, ground, ground, ground?",
				"Am I taking too much",
				"Did I cross a line, line, line",
				"I need my role in this",
				"Very clearly defined",
				"I need your discipline",
				"I need your help",
				"I need your discipline",
				"You know once I start I cannot help myself",
				"",
				"And now it's starting up",
				"Feels like I'm losing touch",
				"Oooh nothing matters to me",
				"Nothing matters as much",
				"I see you left a mark",
				"Up and down my skin, skin, skin",
				"I don't know where I end",
				"And where you begin",
				"I need your discipline",
				"I need your help",
				"I need your discipline",
				"You know once I start I cannot help myself",
				"" ];

var CUEOFFSET = 1.0 + 3.9; // Display lyric CUEOFFSET seconds before lyric in the track starts...this should be configurable by the user... The 3.9 is because I'm a dumbass and snagged all the cue times from the raw vocal file...which still had 3.9 seconds of silence on the front, whereas the tracks I use in the app dont...

function timeUpdate() {
	if(jaraoke.apN.currentTime > (cues[currCue] - CUEOFFSET)) {
		var el = $(document.createElement('li'));
		el.update(lyrics[currCue++]);
		//el.hide();
		$('lyricsList').insertBefore(el, $('lyricsList').firstChild);
		//new Effect.SlideDown(el, {duration:0.5, transition:Effect.Transitions.Bounce});
	}
}

function handleToggle(e, g) {
	e.stop();
	if(g.bVocal) { 	// If bVocal is true, switch to playing track without vocals
		g.apN.volume = 1;
		g.apW.volume = 0;
		$('bob').update('Switching vocals off!');
	}
	else {			// Else switch to track with vocals
		g.apN.volume = 0;
		g.apW.volume = 1;
		$('bob').update('Switching vocals on!');
	}
	g.bVocal = !g.bVocal;

}

var FADETIME = 25; // milliseconds
var FADEINTERVAL = 0.05; // Total time = (1/FADEINTERVAL) * FADETIME

function fadeDown() {
	$$('audio').each(function (a) { 
		if(a.volume > 0.1) {
			a.volume -= FADEINTERVAL;
			$('bob').update(a.volume);
			setTimeout("fadeDown()", FADETIME);
		}
		else {
			$('bob').update('Paused');
			a.volume = 0; // Deal with oddball floating point errors...find better solution.
			a.pause();
		}
	});
}

function fadeUp() {
	$$('audio').each(function (a) { 
		if(a.volume < 1) {
			a.volume += FADEINTERVAL;
			$('bob').update(a.volume);
			setTimeout("fadeUp()", FADETIME);
		}
	});
}

document.observe('dom:loaded', function() {

	jaraoke = new Jaraoke();
	
	$('togglePlay').observe('click', function () {
		if(jaraoke.bVocal) { 	// If bVocal is true, play it!
			jaraoke.apW.volume = 1;
			$('bob').update('Playing vocal track');
		}
		else {
			jaraoke.apN.volume = 1;
			$('bob').update('Playing non-vocal track');
		}
			
		$$('audio').each(function (a) {
			if(a.paused) {
				//jaraoke.apN.currentTime = jaraoke.apW.currentTime; // Quick and dirty hack to get the times to align...doesn't work...
				a.play();
				//fadeUp(); So sad...sexy little feature, but it throws the synchronization between tracks all outta wack until I can debug why...
			}
			else {
				a.pause();
				//fadeDown();
				$('bob').update('Paused');
			}
		});
	});

	$('toggleVocal').observe('click', handleToggle.bindAsEventListener(this, jaraoke));


});