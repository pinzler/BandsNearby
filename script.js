	var sp = getSpotifyApi(1);
	var models = sp.require('sp://import/scripts/api/models');
	var views = sp.require('sp://import/scripts/api/views');
	//var ui = sp.require('sp://import/scripts/api/ui');
	var player = models.player;
	var myAwesomePlaylist;
	var firstsong; 
	var firstset;


	 var artist = [];
	 var artist_name = [];
	 var urls = [];
	 var costs = [];
	  
	 var results_string = "";
	 var share_string = "";
	 var venue = "";
	 var show_date = "";

window.onload = function(){


	//Loads the initial pull down menu to pick dates
	    
	       var req1 = new XMLHttpRequest();
	       req1.open("GET", "http://pinzler.kodingen.com/test/bnby/spot/getDates.php", true);
	       req1.onreadystatechange = function() {
	               console.log(req1.status);

	               if (req1.readyState == 4) {
	                       if (req1.status == 200) {
				           var obj = JSON.parse(req1.responseText);
				var i=0;
				var sd = "";
				var listform="<form name='view'><select id='venue_date'>";
				
				for (h=0; h<obj.arr.length; h++) {
					sd = obj.arr[h].show_date;
					listform = listform + "<option value='" + sd + "'>" + sd +"</option>";
					}
				listform = listform + "</select> <input type='button' value='Submit' onClick='prepVenues()'></form>"

				document.getElementById("list_div0").innerHTML = listform; 
	                       
	               	}
	               }
	       };

	       req1.send();
	
}

function prepVenues() {
	var x=document.getElementById("venue_date").selectedIndex;
	var y=document.getElementById("venue_date").options;
	show_date = y[x].text;
	
	   var req4 = new XMLHttpRequest();
       req4.open("GET", "http://pinzler.kodingen.com/test/bnby/spot/getVenues.php?show_date=" + show_date, true);
       req4.onreadystatechange = function() {
               console.log(req4.status);

               if (req4.readyState == 4) {
                       if (req4.status == 200) {
			           var obj9 = JSON.parse(req4.responseText);
						var ven = "";
						var listform="<form name='view2'><select id='venueslist'>";
			
			for (h=0; h<obj9.arr.length; h++) {
				ven = obj9.arr[h].venue;
				listform = listform + "<option value='" + ven + "'>" + ven + "</option>";
				}
			listform = listform + "</select> <input type='button' value='Submit' onClick='prepBands()'></form>";

			document.getElementById("list_div1").innerHTML = ""; 
			document.getElementById("list_div1").innerHTML = listform; 
                       
               	}
               }
       };

       req4.send();

}
       
       
function prepBands() {
	var x=document.getElementById("venueslist").selectedIndex;
	var y=document.getElementById("venueslist").options;
	venue = y[x].text;
	loadBands(); 
	
         }


function loadBands()  {
	
       myAwesomePlaylist = new models.Playlist(venue + " " + show_date);     
  
       var req2 = new XMLHttpRequest();
       req2.open("GET", "http://pinzler.kodingen.com/test/bnby/spot/getBands.php?venue=" + venue + "&show_date=" + show_date, true);
       req2.onreadystatechange = function() {
               //console.log(req2.status);
               if (req2.readyState == 4) {
                       if (req2.status == 200) {
                        var obj3 = JSON.parse(req2.responseText);
                        console.log(obj3);
						var i=0;
						artist=[];
						artist_name=[];
						costs=[];
						firstset=true;
						var tempan ="";
						for (i=0; i<obj3.arr.length; i++)									
							{
			 				if (obj3.arr[i].url != "") 
			    					urltemp = " (<a href=" + obj3.arr[i].url + " target=_blank>link</a>)";
							else urltemp = "";
							tempan='"'+ obj3.arr[i].name +'"';
						artist.push(convertToMilitaryTime(obj3.arr[i].show_hour) +": "+ obj3.arr[i].name + urltemp + " playing at " + obj3.arr[i].show_hour +"<BR><a href='#ytplayer' onclick='BandList(" + tempan + ")'>Make a new playlist for this band</a><BR><BR>");
						artist_name.push(obj3.arr[i].name);
						costs.push(obj3.arr[i].cost);
						GetTracks(obj3.arr[i].name, myAwesomePlaylist);
			
						}
							
				 		update_results();
						playingNow();
						
                      }
            	}
               	
       	  };

       req2.send();
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
   results_string = "Venue cover price: $"+ costs[0] +"<BR><BR>";
   document.getElementById("ytplayer_div3").innerHTML = "";
   artist.sort();
   for ( var i = 0; i < artist.length; i++ )
    {
      results_string = results_string + fixArtist(artist[i]); 
    }
   document.getElementById("ytplayer_div3").innerHTML = results_string;  
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
               var str1 = track.name + " on the album " + track.album.name + " by "
		+ track.album.artist.name + ".<BR><img src = '" + track.album.cover + "'>";



       header.innerHTML = str1;
       }
}

function GetTracks(name, playlist) {

       var req = new XMLHttpRequest();
       req.open("GET", "http://ws.spotify.com/search/1/track.json?q=" + name, true);
       req.onreadystatechange = function() {
               console.log(req.status);

               if (req.readyState == 4) {
                       if (req.status == 200) {
                       		var obj = JSON.parse(req.responseText);
                       		if (obj.tracks.length>10) songcount = 10; 
							else songcount = obj.tracks.length;
							for (var j=0; j < songcount; j++) {
								if (j==0) firstsong = obj.tracks[j].href; 
								for (var k=0; k<obj.tracks[j].artists.length; k++)
									if (obj.tracks[j].artists[k].name == name)
										playlist.add(obj.tracks[j].href);
				        	}
						 if (firstset) { 
						 	player.track = playlist.get(0);
                			player.context = playlist;
						 	//player.play(playlist.indexOf(firstsong), playlist);
               				firstset=false;
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
               console.log(req7.status);

               if (req7.readyState == 4) {
                       if (req7.status == 200) {
                       		var obj7 = JSON.parse(req7.responseText);
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


function tweet(artist1) {
    var url = "http://pinzler.kodingen.com/test/bnby/spot/tweet.php";
    var req7 = new XMLHttpRequest();
       req7.open("GET", "http://pinzler.kodingen.com/test/bnby/spot/tweet.php?artist=" + artist1, true);
       req7.onreadystatechange = function() {
               console.log(req7.status);

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
      console.log(obj);
      
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