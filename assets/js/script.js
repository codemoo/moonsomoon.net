/*
Scripts for the initialing the environments.
*/
var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', vh.toString()+'px');

window.addEventListener('resize', function(){
    // Adjust the size of divs to fit screen
    resizeWindow();
    resizeRoomDivs();
});

function resizeWindow() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh.toString()+'px');
}

function resizeRoomDivs() {
    // Resize the size of the room divs
    // Assume that the all backgrounds have 10:7 ratio
    var rooms       = document.getElementsByClassName("room");
    var gdiv        = document.getElementById("game");
    var common_div  = document.getElementById("common");
    var answer      = document.getElementById("answer");
    var back        = document.getElementById("back");

    for(var i=0;i<rooms.length;i++){
        rooms[i].setAttribute("style","margin:"+((gdiv.offsetHeight - rooms[i].offsetWidth*0.7)/2)+"px 0;"+"background-size:"+rooms[i].offsetWidth+"px, "+rooms[i].offsetWidth*0.7+"px;height:"+rooms[i].offsetWidth*0.7+"px;");
    }

    if (common_div !== undefined && common_div !== null) {
        // Override the size and margins to fit the screen
        common_div.setAttribute("style","margin:"+((gdiv.offsetHeight - rooms[0].offsetWidth*0.7)/2)+"px 0;"+"width:"+rooms[0].offsetWidth+"px; height:"+rooms[0].offsetWidth*0.7+"px;");
        answer.setAttribute("style","font-size:"+rooms[0].offsetWidth*0.026+"px;padding:"+rooms[0].offsetWidth*0.005+"px;");
        back.setAttribute("style","margin:"+((gdiv.offsetHeight - rooms[0].offsetWidth*0.7 + rooms[0].offsetWidth*0.7 * 0.06)/2)+"px 0 0 "+rooms[0].offsetWidth*0.02+"px; height:"+rooms[0].offsetWidth*0.7+"px;");
        if (zoomed === true) {
            show(back);
        }

        // Reinit the room
        hideAllRooms();
        show(room(room_id))

        // Set the size of the Item slot
        node("#item_slot").style.height = rooms[0].offsetWidth*0.1 + "px";
    }
}

// Get the node with the selector
function node(nid) {
    var r = document.querySelectorAll(nid)
    if (r.length == 1) {
        return r[0]
    }
    return r
}

// Hide and show using visibility
function hide(node) {
    node.style.visibility = "hidden";
}

function hideMulti(nodes) {
    for(var i=0;i<nodes.length;i++){
        hide(nodes[i]);
    }
}

function show(node) {
    node.style.visibility = "visible";
}

function showMulti(nodes) {
    for(var i=0;i<nodes.length;i++){
        show(nodes[i]);
    }
}

function hideAllRooms() {
    var rooms = document.getElementsByClassName("room");
    for(var i=0;i<rooms.length;i++){
        hide(rooms[i])
    }
}

// Get the room node
function room(room_id) {
    return document.getElementById("room_"+(room_id+1).toString())
}

// Global variables for envs.
var players = {}; // video players
var stage = '01';
var is_playing = false;

var width = 1000;
var height = 700;

var room_id = 0; // Init room index

// Video width and height for the mobile screens
if (window.innerWidth <= 375) {
    width = window.innerWidth;
    height = window.innerHeight;
}

document.addEventListener('DOMContentLoaded', function(){ 
    var common_div = document.getElementById("common");

    if (common_div !== undefined && common_div !== null) {
        // Init Game Env.
        resizeRoomDivs();
        changeRoom(room_id);

        show(node("#game"));

        playSound("#bgm")
    } else {
        // Init Intro Env.
        var options = {
            "controls":false,
            "width":width,
            "height":height,
            controlBar: { fullscreenToggle: false }
        };
    
        showBtn("tap");
    
        players['01'] = videojs('player-01', options, function onPlayerReady() {
            videojs.log('01.mp4 is ready!');
    
            this.on('ended', function() {
                videojs.log('01.mp4 Finished');
                is_playing = false;
                hideAllVideo();
                stage = '02';
                players[stage].posterImage.show();
                showVideo(stage);
                showBtn("tap");
            });
        });
    
        players['02'] = videojs('player-02', options, function onPlayerReady() {
            videojs.log('02.mp4 is ready!');

            this.on('ended', function() {
                videojs.log('02.mp4 Finished');
                is_playing = false;
                hideAllVideo();
                stage = '03';
                players[stage].posterImage.show();
                showVideo(stage);
                showBtn("tap");
            });
        });
    
        players['03'] = videojs('player-03', options, function onPlayerReady() {
            videojs.log('03.mp4 is ready!');

            this.on('ended', function() {
                videojs.log('03.mp4 Finished');
                is_playing = false;
                hideAllVideo();

                // Enable the link to game when opened
                var today = new Date();
                var openday = new Date('2020-10-19')
                openday.setHours(12)

                if (today < openday) {
                    stage = '04_pre';
                } else {
                    stage = '04';
                }
                players[stage].posterImage.show();
                showVideo(stage);
                showBtn("tap");
            });
        });

        players['04'] = videojs('player-04', options, function onPlayerReady() {
            videojs.log('04.mp4 is ready!');

            this.on('ended', function() {
                videojs.log('04.mp4 Finished');
                is_playing = false;
                stage = 'end';
                showBtn("tap");
            });
        });

        // Before open    
        players['04_pre'] = videojs('player-04_pre', options, function onPlayerReady() {
            videojs.log('04_pre.mp4 is ready!');

            this.on('ended', function() {
                videojs.log('04.mp4 Finished');
                is_playing = false;
                hideAllVideo();
                stage = '01-re';
                players[stage].posterImage.show();
                showVideo(stage);
                showBtn("restart");
            });
        });
    
        players['01-re'] = videojs('player-01-re', options, function onPlayerReady() {
            videojs.log('01.mp4 is ready!');

            this.on('ended', function() {
                videojs.log('01.mp4 Finished');
                is_playing = false;
                hideAllVideo();
                stage = '02';
                players[stage].posterImage.show();
                showVideo(stage);
                showBtn("tap");
            });
        });

        // Show the div when the videos are fully loaded
        show(node(".container"));
    }


});

// Switching the video players
function proceed() {
    if (is_playing === false) {
        // players[stage].reset();
        if (stage == '01-re') {
            location.reload();
        }
        if (stage == 'end') {
            location.href = 'https://moonsomoon.net/game.html'
        }
        hideAllBtns();
        players[stage].play();
        is_playing = true;
    } else {
        console.log("Click while playing")
    }
}

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        proceed()
    }
}

// Toggle video players
function hideAllVideo() {
    var divsToHide = document.getElementsByClassName("video-js");
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.width = "0"; 
        divsToHide[i].style.height = "0";
    }
}

function showVideo(id) {
    var divsToShow = document.getElementById("player-"+id);
    divsToShow.style.width = width.toString() + "px";
    divsToShow.style.height = height.toString() + "px";
}

// Toggle button
function hideAllBtns() {
    var divsToHide = document.getElementsByClassName("btns");
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.display = "none";
    }
}

function showBtn(id) {
    var divsToShow = document.getElementById("btn-"+id);
    if (divsToShow !== null) {
        divsToShow.style.display = "block";
    }
    
}
