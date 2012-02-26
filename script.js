	var sp = getSpotifyApi(1);
	var models = sp.require('sp://import/scripts/api/models');
	var views = sp.require('sp://import/scripts/api/views');
	//var ui = sp.require('sp://import/scripts/api/ui');
	var player = models.player;
	var myAwesomePlaylist;
	var firstsong; 
	var firstset;
	var fakePlaylist = [];

	 var artist = [];
	 var artist_name = [];
	 var urls = [];
	 var costs = [];
	  
	 var results_string = "";
	 var share_string = "";
	 var venue = "";
	 var show_date = "";

	 var familiarity;
	 var hotness;

     var show_date1 = "";
	 var show_date2 = "";
	 
	 var BandsDB;
	 var checkDB = [];

	 
window.onbeforeunload = function(){
	player.playing = 0;	
}

window.onload = function(){

	//Loads the initial pull down menu to pick dates
	   
	        var req1 = new XMLHttpRequest();
	       req1.open("GET", "http://pinzler.kodingen.com/test/bnby/spot/getDates.php", true);
	       req1.onreadystatechange = function() {
	               //console.log(req1.status);

	               if (req1.readyState == 4) {
	                       if (req1.status == 200) {
				           var obj = JSON.parse(req1.responseText);
				var i=0;
				var sd = "";
				var listform="<form name='view'><div><h2>Start date:</h2><select id='venue_date'>";
				
				for (h=0; h<obj.arr.length; h++) {
					sd = obj.arr[h].show_date;
					listform = listform + "<option value='" + sd + "'>" + sd +"</option>";
					}
				listform = listform + "</select></div>"

				listform = listform + "<div><h2>End date:</h2><select id='venue_date2'>";
				for (h=0; h<obj.arr.length; h++) {
					sd = obj.arr[h].show_date;
					listform = listform + "<option value='" + sd + "'>" + sd +"</option>";
					}
				
				listform = listform + "</select></div> <button onClick='prepVenues()'>Submit</button></form>"

				document.getElementById("list_div0").innerHTML = listform; 
	                       
	               	}
	               }
	       };

	       req1.send();
	
}

function prepVenues() {
	var x=document.getElementById("venue_date").selectedIndex;
	var y=document.getElementById("venue_date").options;
	show_date1 = y[x].text;
	x=document.getElementById("venue_date2").selectedIndex;
	y=document.getElementById("venue_date2").options;
	show_date2 = y[x].text;
	//alert(show_date2);
	
	   var req4 = new XMLHttpRequest();
       req4.open("GET", "http://pinzler.kodingen.com/test/bnby/spot/getAll.php?show_date1=" + show_date1 + "&show_date2=" + show_date2, true);
       req4.onreadystatechange = function() {
               //console.log(req4.status);

               if (req4.readyState == 4) {
                       if (req4.status == 200) {
			            BandsDB = JSON.parse(req4.responseText);
						var bandstemp = [];
						var testBand = true;
						for (h=0; h < BandsDB.arr.length; h++) 
							checkDB.push(0);					
						for (h=0; h < BandsDB.arr.length; h++) {
							testBand = true;
							for (t=0; t < bandstemp.length; t++)
								if (bandstemp[t] == BandsDB.arr[h].venue)
									testBand=false;
							if (testBand)
								checkBand(BandsDB.arr[h].name);
							}
						
						var options='';
						bandstemp = [];
						testBand = true;
						for (h=0; h < BandsDB.arr.length; h++) {
							testBand = true;
							for (t=0; t < bandstemp.length; t++)
								if (bandstemp[t] == BandsDB.arr[h].venue)
									testBand=false;
							if (testBand)
								bandstemp.push(BandsDB.arr[h].venue);
							}
						for (h=0; h < bandstemp.length; h++) {
							ven = bandstemp[h];  
							options = options + '<option value="' + ven + '" onclick="prepBands()">' + ven + "</option>";
						}
						
						document.getElementById("multistore").innerHTML = options; 
                       
               	}
               }
       };

       req4.send();

}
       
 function selectAll() {
    // have we been passed an ID
        selectBox = document.getElementById('multistore2');
    
    // is the select box a multiple select box?
    
        for (var i = 0; i < selectBox.options.length; i++) 
            selectBox.options[i].selected = true;
    
}
       
        function getSelected(opt) {
            var selected = new Array();
            var index = 0;
            for (var intLoop = 0; intLoop < opt.length; intLoop++) {
               if ((opt[intLoop].selected) ||
                   (opt[intLoop].checked)) {
                  index = selected.length;
                  selected[index] = new Object;
                  selected[index].value = opt[intLoop].value;
                  selected[index].index = intLoop;
               }
            }
            return selected;
         }

         function outputSelected(opt) {
            var sel = getSelected(opt);
                   
    					//var listform="<form name='view3'><SELECT id='multistore2' SIZE=10 MULTIPLE>";
						var options = '';
            			var bandstemp = [];
						var testBand = true;
						for (var item in sel)
						{
						  for (h=0; h < BandsDB.arr.length; h++) {
						  	if (BandsDB.arr[h].venue == sel[item].value)
						  		{
								testBand = true;
								for (t=0; t < bandstemp.length; t++)
									if (bandstemp[t] == BandsDB.arr[h].name)
										testBand=false;
								if (testBand && checkDB[h] == 1)
									bandstemp.push(BandsDB.arr[h].name);
								}
							}
						}
						  for (h=0; h < bandstemp.length; h++) {
							ven = bandstemp[h];  
							options = options + '<option value="' + ven + '"> ' + ven + '</option>';
						}
			
			
			//var buttons = "";
			//document.getElementById("multistore2").innerHTML = ""; 
			document.getElementById("multistore2").innerHTML = options;
			$('#playlist_buttons').show();
         }
      
function prepBands() {

	outputSelected(document.getElementById("multistore").options);

}

function loadVenueInfo(venueName) {
	
	var VENUE_ID;
		
	var arr = new Array(14);
	for ( var i = 0; i < 14; i++ ) {
	    arr[i] = new Array(2);

	 }
	
	arr[0][0] = "Arlenes Grocery";
	arr[0][1] = "3fd66200f964a520dce31ee3";
	arr[1][0] = "Bitter End";
	arr[1][1] = "3fd66200f964a520d9ea1ee3";
	arr[2][0] = "Caffe Vivaldi";
	arr[2][1] = "43598100f964a520fa281fe3";
	arr[3][0] = "Cake Shop";
	arr[3][1] = "42853f80f964a52008231fe3";
	arr[4][0] = "Googies";
	arr[4][1] = "4abeda71f964a520499020e3";
	arr[5][0] = "Knitting Factory Brooklyn";
	arr[5][1] = "4aa6ccdaf964a520064b20e3";
	arr[6][0] = "Living Room";
	arr[6][1] = "3fd66200f964a5200deb1ee3";
	arr[7][0] = "Mercury Lounge";
	arr[7][1] = "3fd66200f964a520dde31ee3";
	arr[8][0] = "Music Hall of Williamsburg";
	arr[8][1] = "47048266f964a5204f4b1fe3";
	arr[9][0] = "Parkside Lounge";
	arr[9][1] = "3fd66200f964a52012e41ee3";
	arr[10][0] = "Pianos";
	arr[10][1] = "3fd66200f964a5200fe41ee3";
	arr[11][0] = "Rockwood Music Hall";
	arr[11][1] = "42b75880f964a52088251fe3";
	arr[12][0] = "Sidewalk Cafe";
	arr[12][1] = "3fd66200f964a5201fe51ee3";
	arr[13][0] = "Sullivan Hall";
	arr[13][1] = "49f9d486f964a520896d1fe3";
	
	for(var i=0; i<arr.length; i++) {
		
		if (arr[i][0] == venueName) {
		  
			VENUE_ID = arr[i][1];
	
		  }
	}
	
	var requestPhotos = new XMLHttpRequest();
       requestPhotos.open("GET", "https://api.foursquare.com/v2/venues/" + VENUE_ID + "/photos?group=venue&client_id=HZDN05HPJVNNHXJVK0YKTCQUMGQWHUMF3Z10M5JTKQMPYZGB&client_secret=ZU42PRVV5MUNWEK1NU3Y2JCQFYU0T20DKVF4AGFG3BEPZ1YY&v=20120225", true);
		
       requestPhotos.onreadystatechange = function() {
               //console.log(requestPhotos.status);
               if (requestPhotos.readyState == 4) {   
					if (requestPhotos.status == 200) {
							var url = '';
                       		var object = JSON.parse(requestPhotos.responseText);
							var ammPhotos;

							if (object.response.photos.items.length > 10) {
								
								ammPhotos = 10;

							} else {
								
								ammPhotos = object.response.photos.items.length;
								
							}
							for (var i=0; i< ammPhotos; i++) {

								url = url + "<li><img src=" + object.response.photos.items[i].url + "></li>";
								document.getElementById("venue_pics").innerHTML = url; 
							}

						}	
			}
		
		}
		
	requestPhotos.send();
	/*
	var requestTips = new XMLHttpRequest();
       requestTips.open("GET", "https://api.foursquare.com/v2/venues/" + VENUE_ID + "/tips?group=venue&client_id=HZDN05HPJVNNHXJVK0YKTCQUMGQWHUMF3Z10M5JTKQMPYZGB&client_secret=ZU42PRVV5MUNWEK1NU3Y2JCQFYU0T20DKVF4AGFG3BEPZ1YY&v=20120225", true);
		
       requestTips.onreadystatechange = function() {
               //console.log(requestTips.status);
               if (requestTips.readyState == 4) {   
					if (requestTips.status == 200) {
							
                       		var object = JSON.parse(requestTips.responseText);
							for (var i=0; i<object.response.tips.items.length; i++) {
								
								var text = text + "<p>" + object.response.tips.items[i].text + "</p>";
								document.getElementById("venue_tips").innerHTML = text; 
								
							}

						}	
			}
		
		}
		
	requestTips.send();	
*/
}

function loadBandInfo(bandName) {
	
	var bandId;
	
	var requestBand = new XMLHttpRequest();
		requestBand.open("GET", "http://developer.echonest.com/api/v4/artist/search?api_key=KPO6YTNCVKGHAPOUJ&format=json&name=" + bandName + "&results=1", true);

			requestBand.onreadystatechange = function() {
				console.log(requestBand.status); 
				if (requestBand.readyState == 4) {   
						if (requestBand.status == 200) {

				           		var object = JSON.parse(requestBand.responseText);
								for (var i=0; i<object.response.artists.length; i++) {

									bandId = object.response.artists[i].id;
									
									var requestFamiliarity = new XMLHttpRequest();
									requestFamiliarity.open("GET", "http://developer.echonest.com/api/v4/artist/familiarity?api_key=N6E4NIOVYMTHNDM8J&id=" + bandId + "&format=json", true);

									   requestFamiliarity.onreadystatechange = function() {
									           console.log(requestFamiliarity.status);
									           if (requestFamiliarity.readyState == 4) {   
													if (requestFamiliarity.status == 200) {

									                   		var object = JSON.parse(requestFamiliarity.responseText);
															familiarity = object.response.artist.familiarity;

														}	
											}

										}

									requestFamiliarity.send();

									/*
									var requestBandImages = new XMLHttpRequest();
									requestBandImages.open("GET", "http://developer.echonest.com/api/v4/artist/images?api_key=N6E4NIOVYMTHNDM8J&id=" + bandId + "&format=json&results=1&start=0&license=unknown", true);

									   requestBandImages.onreadystatechange = function() {
									           
									           if (requestBandImages.readyState == 4) {   
													if (requestBandImages.status == 200) {
															var url = '';
									                   		var object = JSON.parse(requestBandImages.responseText);
															
															for (var i=0; i < object.response.images.length; i++) {
																console.log(object.response.images[i]);
																url = url + "<li><img src=" + object.response.images[i].url + "></li>";
																//console.log(url);
																document.getElementById("band_pics").innerHTML = url;	

															}

													}	
											}

										}

									requestBandImages.send();
									*/

									var requestBandBio = new XMLHttpRequest();
									requestBandBio.open("GET", "http://developer.echonest.com/api/v4/artist/biographies?api_key=N6E4NIOVYMTHNDM8J&id=" +bandId+ "&format=json&results=1&start=0", true);

									   requestBandBio.onreadystatechange = function() {
									           //console.log(requestBandBio.status);
									           if (requestBandBio.readyState == 4) {   
													if (requestBandBio.status == 200) {

									                   		var object = JSON.parse(requestBandBio.responseText);

															var bio = object.response.biographies[0].text;
															document.getElementById("band_bio").innerHTML = bio; 

														}	
											}

										}

									requestBandBio.send();

									var requestBandHotness = new XMLHttpRequest();
									requestBandHotness.open("GET", "http://developer.echonest.com/api/v4/artist/hotttnesss?api_key=N6E4NIOVYMTHNDM8J&id=" + bandId + "&format=json", true);

									   requestBandHotness.onreadystatechange = function() {
									           //console.log(requestBandHotness.status);
									           if (requestBandHotness.readyState == 4) {   
													if (requestBandHotness.status == 200) {

									                   		var object = JSON.parse(requestBandHotness.responseText);

															hotness = object.response.artist.hotttnesss;

														}	
											}

										}

									requestBandHotness.send();

							}
						}
					} 
					         
			}

			requestBand.send();
}

function loadBands()  {
	
		myAwesomePlaylist = new models.Playlist("BNPlaylist " + show_date1+"-"+show_date2);     
        	var tempBands = getSelected(document.getElementById("multistore2").options);
       				    var i=0;
						artist=[];
						artist_name=[];
						costs=[];
						firstset=true;
						var testdup=true;
						var tempan ="";
						for (var k=0; k<tempBands.length; k++)
							{
							testdup=true;
							for (i=0; i<BandsDB.arr.length; i++)
								{
								if (BandsDB.arr[i].name == tempBands[k].value && testdup)
									{
			 						venue=BandsDB.arr[i].venue;
			 						testdup=false;
			 						if (BandsDB.arr[i].url != "") 
			    						urltemp = " (<a href=" + BandsDB.arr[i].url + " target=_blank>link</a>)";
									else urltemp = "";
									tempan='"'+ BandsDB.arr[i].name +'"';
									artist.push(BandsDB.arr[i].name + urltemp + " at " + BandsDB.arr[i].venue +", " + BandsDB.arr[i].show_date + ", "+  BandsDB.arr[i].show_hour +"<BR><a href='#ytplayer' onclick='BandList(" + tempan + ")'>Make a new playlist for this band</a><BR><BR>");
									artist_name.push(BandsDB.arr[i].name);
									//alert(artist_name.length);
									costs.push(BandsDB.arr[i].cost);
									GetTracks(BandsDB.arr[i].name, myAwesomePlaylist);
									}
								}
						     }	
				 		
				 		update_results();
						playingNow();
						
                    
      //TwilSet();
}


function convertToMilitaryTime(str) {
     
     var fulltime=str;
     var hours;
     var minutes;
     var index = fulltime.indexOf('M');
     var ampm = fulltime.substring(index-1);
     var timetest = fulltime.substring(0,index-1); 
    
     if (fulltime.indexOf(':') != -1)
        {
            hours = timetest.substring(0, timetest.indexOf(':'));
            minutes = timetest.substring(timetest.indexOf(':')+1);
        }
     else
        {
            hours = timetest;
            minutes = "00";
        }
     var militaryHours;
     if( ampm == "PM" ) {
         militaryHours = hours;
         
         
     } else {
         if( ampm == "AM" ) {
             // get the interger value of hours, then add
             tempHours = parseInt( hours ) + 2;
             // adding the numbers as strings converts to strings
             if( tempHours < 10 ) tempHours = "1" + tempHours;
             else tempHours = "2" + ( tempHours - 10 );
             // check for special case: noon
             if( tempHours == "24" ) { tempHours = "12"; }
             militaryHours = tempHours;
         }
     }
     var temptime = parseInt(militaryHours + minutes) + 1200; 
     return temptime;
 }


function fixArtist(str)
 {
     
     var result = str;
     var index = result.indexOf(':');
     return result.substring(index+1);
     
 }
 
 function update_results()
 {
   //results_string = "Venue cover price: $"+ costs[0] +"<BR><BR>";
   //document.getElementById("ytplayer_div3").innerHTML = "";
   //artist.sort();
   //for ( var i = 0; i < artist.length; i++ )
   // {
   //   results_string = results_string + artist[i]; 
   // }
   //document.getElementById("ytplayer_div3").innerHTML = results_string;  
 }

 
 


function playingNow() {
 
	
	updatePageWithTrackDetails();

       player.observe(models.EVENT.CHANGE, function (e) {

               // Only update the page if the track changed
               if (e.data.curtrack == true) {
                       updatePageWithTrackDetails();
		
	          }
       });


}

function updatePageWithTrackDetails() {

       var header = document.getElementById("ytplayer_div1");

       // This will be null if nothing is playing.
       var playerTrackInfo = player.track;

       if (playerTrackInfo == null) {
               header.innerText = "Nothing playing!";
       } else {
               var track = playerTrackInfo.data;
		//var ytplayer_playitem = myAwesomePlaylist.indexOf(track); alert(ytplayer_playitem);
               var albumImg = '<img class="albumCover" src = "' + track.album.cover + '">';
               var str1 = '<h2 class="songTitle">'+ track.name + '</h2><h3>on <a href="'+track.album.uri+'">' + track.album.name + '</a></h3>';
               var str2 = '<h3>by ' + '<a href="'+track.album.artist.uri+'">'+track.album.artist.name+'</a></h2>';
       header.innerHTML = albumImg + str1 + str2;
       }
		// Boris Code
		
			var track = playerTrackInfo.data;
			
			loadBandInfo(track.album.artist.name);
			
			for ( var h = 0; h < BandsDB.arr.length; h++ ) {
				
				if (BandsDB.arr[h].name.toLowerCase == track.album.artist.name.toLowerCase) {
					
					loadVenueInfo(BandsDB.arr[h].venue);
					
				}
	
			}
	
}

function GetTracks(name, playlist) {
	   fakePlaylist = [];
       var req = new XMLHttpRequest();
       req.open("GET", "http://ws.spotify.com/search/1/track.json?q=" + name, true);
       req.onreadystatechange = function() {
               //console.log(req.status);

               if (req.readyState == 4) {
                       if (req.status == 200) {
                       		var obj = JSON.parse(req.responseText);
                       		if (obj.tracks.length>10) songcount = 10; 
							else songcount = obj.tracks.length;
							for (var j=0; j < songcount; j++) {
								if (j==0) firstsong = obj.tracks[j].href; 
								for (var k=0; k < obj.tracks[j].artists.length; k++){
									if(typeof obj.tracks[j].artists[k] != 'undefined'){
										if (obj.tracks[j].artists[k].name.toLowerCase().trim() == name.toLowerCase().trim()){
										  playlist.add(obj.tracks[j].href);
										  fakePlaylist.push(obj.tracks[j]);
									  }
									}
								}
				        	}
							populateFakePlaylist();
						 if (firstset) { 
							 if(playlist.length > 0 ){
								 player.track = playlist.get(0);
								 player.context = playlist;
						 		//player.play(playlist.indexOf(firstsong), playlist);
               					firstset=false;
							 }
               				}
               			}
               	}
       };

       req.send();
}

function BandList(name) {
	    
	    var bplaylist = new models.Playlist(name);     
  
       var req7 = new XMLHttpRequest();
       req7.open("GET", "http://ws.spotify.com/search/1/track.json?q=" + name, true);
       req7.onreadystatechange = function() {
               //console.log(req7.status);

               if (req7.readyState == 4) {
                       if (req7.status == 200) {
                       		var obj7 = JSON.parse(req7.responseText);
                       		console.log(obj7);
                       		if (obj7.tracks.length>10) songcount = 10; 
							else songcount = obj7.tracks.length;
							for (var j=0; j < songcount; j++) {
								for (var k=0; k<obj7.tracks[j].artists.length; k++)
									if (obj7.tracks[j].artists[k].name == name)
										bplaylist.add(obj7.tracks[j].href);
				        	}
               			}
               	}
       };

       req7.send();
	   tweet(name);	
}


function checkBand(name) {
	    
	   var notEmpty = false;
       var req7 = new XMLHttpRequest();
       req7.open("GET", "http://ws.spotify.com/search/1/track.json?q=" + name, true);
       req7.onreadystatechange = function() {
               //console.log(req7.status);

               if (req7.readyState == 4) {
                       if (req7.status == 200) {
                       		var obj7 = JSON.parse(req7.responseText);
                       		if (obj7.tracks.length>10) songcount = 10; 
							else songcount = obj7.tracks.length;
							for (var j=0; j < songcount; j++) 
								for (var k=0; k < obj7.tracks[j].artists.length; k++)
									if(typeof obj7.tracks[j].artists[k] != 'undefined')
										if (obj7.tracks[j].artists[k].name.toLowerCase().trim() == name.toLowerCase().trim())
										  notEmpty = true;
							if (notEmpty)
								for (q=0; q < BandsDB.arr.length; q++)
									if (BandsDB.arr[q].name == name)
										checkDB[q] = 1;				
				        	
               			}
               	}
       };

       req7.send();
}



function tweet(artist1) {
    var url = "http://pinzler.kodingen.com/test/bnby/spot/tweet.php";
    var req7 = new XMLHttpRequest();
       req7.open("GET", "http://pinzler.kodingen.com/test/bnby/spot/tweet.php?artist=" + artist1, true);
       req7.onreadystatechange = function() {
               //console.log(req7.status);

               if (req7.readyState == 4) {
                       if (req7.status == 200) {
                       		
				        	}
               			}
               	
       };

       req7.send();
}


//Twilio Remote Control 
function TwilSet() {
    var socket = new io.Socket("nodaphone.dtrejo.com", {port: 8082}); // IMPORTANT. HAVE THE PORT CORRECT.
    
    socket.connect();
    
    socket.on('message', function(obj) {
      console.log('message:');
      //console.log(obj);
      
      var digits = obj;
	//alert(digits.action[0]);
	if (digits.action[0] == "+XXX-xxx-7639") //Only works from Pinzler's phone. 
		TwilControl(digits.action[1]);
      
    });
    
    socket.on('disconnect', function(obj) {
      //console.log('disconnect');
      //console.log(obj);
      var digits = obj;
	if (digits.action[0] == "+XXX-xxx-7639")
			TwilControl(digits.action[1]);
      socket.connect();
      
    });
}

function TwilControl(num) {

	switch(num) {
      
      	case '1': player.next();
		break;
		case '2': player.playing = 0;
		break;
		case '3': player.previous();
		break;
		case '4': alert(4);
		break;
		case '5': player.playing = 1;
		break;
		case '6':
		break;
		case '7': //if (ytplayer_scores[ytplayer_playitem] != 1) ytplayer_up();
		break;
		case '8': 
		break;
		case '9': //if (ytplayer_scores[ytplayer_playitem] != -1) ytplayer_down();
		break;

	}

}

function populateFakePlaylist(){
	if(fakePlaylist.length){
	  var html = '';
	  var zebra;
	  for(var i=0; i<fakePlaylist.length; i++){
		zebra = i%2 == 1 ? ' zebra' :'';
		//console.log(fakePlaylist[i]);
	    html += '<li class="playlistItem'+zebra+'" song_url='+fakePlaylist[i].href+'><span class="songName">'+fakePlaylist[i].name+'</span><span class="artistName">'+fakePlaylist[i].artists[0].name+'</span><span class="albumName"><a href="'+fakePlaylist[i].album.href+'">'+fakePlaylist[i].album.name+'</a></span></li>';
	  }
	  $('#playlistContainer').show();
	  $('#playlist').html(html);
	}
}

$(function(){
	
	 $('#playlist .playlistItem').live('click', function(){
		 if($(this).hasClass('active')){
				console.log($(this).attr('song_url'));
				player.play($(this).attr('song_url'));
			 }
		 $('#playlist .playlistItem').each(function(){
			 $(this).removeClass('active');
		 }); 
		 $(this).addClass('active');
	 });
	 $('button').live('click', function(e){
		  e.preventDefault();
	 });
});
