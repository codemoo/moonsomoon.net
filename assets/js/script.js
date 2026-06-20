var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', vh.toString()+'px');

window.addEventListener('resize', function(){
    // We execute the same script as before
    resizeWindow();
    resizeRoomDivs();
});

function resizeWindow() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh.toString()+'px');
}

function resizeRoomDivs() {
    var rooms = document.getElementsByClassName("room");
    var gdiv = document.getElementById("game");
    var common_div = document.getElementById("common");
    var answer = document.getElementById("answer");
    var back = document.getElementById("back");

    for(var i=0;i<rooms.length;i++){
        // rooms[i].setAttribute("style",)
        rooms[i].setAttribute("style","margin:"+((gdiv.offsetHeight - rooms[i].offsetWidth*0.7)/2)+"px 0;"+"background-size:"+rooms[i].offsetWidth+"px, "+rooms[i].offsetWidth*0.7+"px;height:"+rooms[i].offsetWidth*0.7+"px;")
    }

    if (common_div !== undefined && common_div !== null) {

        common_div.setAttribute("style","margin:"+((gdiv.offsetHeight - rooms[0].offsetWidth*0.7)/2)+"px 0;"+"width:"+rooms[0].offsetWidth+"px; height:"+rooms[0].offsetWidth*0.7+"px;")
        answer.setAttribute("style","font-size:"+rooms[0].offsetWidth*0.026+"px;padding:"+rooms[0].offsetWidth*0.005+"px;")
        back.setAttribute("style","margin:"+((gdiv.offsetHeight - rooms[0].offsetWidth*0.7 + rooms[0].offsetWidth*0.7 * 0.06)/2)+"px 0 0 "+rooms[0].offsetWidth*0.02+"px; height:"+rooms[0].offsetWidth*0.7+"px;")
        if (zoomed === true) {
            show(back);
        }
        hideAllRooms();
        show(room(room_id))
        node("#item_slot").style.height = rooms[0].offsetWidth*0.1 + "px";
    }
}

function hide(node) {
    node.style.visibility = "hidden";
}

function hideMulti(nodes) {
    for(var i=0;i<nodes.length;i++){
        hide(nodes[i]);
    }
}

function node(nid) {
    var r = document.querySelectorAll(nid)
    if (r.length == 1) {
        return r[0]
    }
    return r
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

function room(room_id) {
    return document.getElementById("room_"+(room_id+1).toString())
}

// Toast 메세지
function showToast(msg) {
    // Get the snackbar DIV
    var x = document.getElementById("toast");
    
    x.innerHTML = msg;
    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

var players = {};
var stage = '01';
var is_playing = false;

var width = 1000;
var height = 700;

var room_id = 0;

if (window.innerWidth <= 375) {
    width = window.innerWidth;
    height = window.innerHeight;
}

document.addEventListener('DOMContentLoaded', function(){ 
    // resizeWindow();
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
            // html5: {
            //     hls: {
            //         overrideNative: !videojs.browser.IS_SAFARI,
            //     },
            // },
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
    
        players['04_pre'] = videojs('player-04_pre', options, function onPlayerReady() {
            videojs.log('04_pre.mp4 is ready!');

            this.on('ended', function() {
                videojs.log('04.mp4 Finished');
                is_playing = false;
                hideAllVideo();
                stage = '01-re';
                players[stage].posterImage.show();
                showVideo(stage);
                // showAllPosters();
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

        players['04'] = videojs('player-04', options, function onPlayerReady() {
            videojs.log('04.mp4 is ready!');

            this.on('ended', function() {
                videojs.log('04.mp4 Finished');
                is_playing = false;
                stage = 'end';
                showBtn("tap");
            });
        });

        show(node(".container"));
    }


});

function proceed() {
    if (is_playing === false) {
        // players[stage].reset();
        if (stage == '01-re') {
            location.reload();
        }
        if (stage == 'end') {
            location.href = 'game.html'
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

function hideAllVideo() {
    var divsToHide = document.getElementsByClassName("video-js"); //divsToHide is an array
    for(var i = 0; i < divsToHide.length; i++){
        // divsToHide[i].style.visibility = "hidden"; // or
        // divsToHide[i].style.display = "none"; // depending on what you're doing
        divsToHide[i].style.width = "0"; // depending on what you're doing
        divsToHide[i].style.height = "0"; // depending on what you're doing
    }
}

function showVideo(id) {
    var divsToShow = document.getElementById("player-"+id);
    // divsToShow.style.display = "block";
    divsToShow.style.width = width.toString() + "px";
    divsToShow.style.height = height.toString() + "px";
}

function hideAllBtns() {
    var divsToHide = document.getElementsByClassName("btns"); //divsToHide is an array
    for(var i = 0; i < divsToHide.length; i++){
        // divsToHide[i].style.visibility = "hidden"; // or
        divsToHide[i].style.display = "none"; // depending on what you're doing
        // divsToHide[i].style.width = "0"; // depending on what you're doing
        // divsToHide[i].style.height = "0"; // depending on what you're doing
    }
}

function showBtn(id) {
    var divsToShow = document.getElementById("btn-"+id);
    if (divsToShow !== null) {
        divsToShow.style.display = "block";
    }
    
}

// function showAllPosters() {
//     var posters = document.getElementsByClassName("vjs-poster");
//     for(var i = 0; i < posters.length; i++){
//         // divsToHide[i].style.visibility = "hidden"; // or
//         posters[i].style.display = "block"; // depending on what you're doing
//         // divsToHide[i].style.width = "0"; // depending on what you're doing
//         // divsToHide[i].style.height = "0"; // depending on what you're doing
//     }
// }