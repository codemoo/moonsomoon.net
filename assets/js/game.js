var items = [];

// Cross-browser event guard: prefer the event passed by the handler,
// fall back to the legacy global (window.event), no-op if neither exists.
// Avoids relying on the bare/deprecated global `event` identifier.
function stopProp(ev) {
    ev = ev || window.event;
    if (ev && ev.stopPropagation) {
        ev.stopPropagation();
    }
}

function gameStart() {
    if (node("#moonsomoon").paused) {
        playSound("#bgm");
    }
}

function changeRoom(room_id) {
    hideAllRooms();
    show(room(room_id))
    hideMulti(document.getElementsByClassName('click'))
    showMulti(document.querySelectorAll('#room_'+(room_id+1).toString()+' .click'))
    // showMulti(document.getElementsByClassName('click'))
    show(document.getElementById("common"));
}

var current_zoom = undefined
var end_flag = false;
function showBack() {
    show(node("#back"));
}

function hideBack() {
    hide(node("#back"));
}

function hideActiveObjects() {
    // Use querySelectorAll directly: node() returns a single element when there
    // is exactly one match, which would break the .length loop below.
    var o = document.querySelectorAll(".active_objects");
    for (var i=0;i<o.length;i++) {
        o[i].style.display = 'none';
    }
}

function rightRoom() {
    if (room_id === 0) {
        room_id = 1;
    } else if (room_id === 1) {
        room_id = 3;
    } else if (room_id === 3) {
        room_id = 2;
    } else if (room_id === 2) {
        room_id = 0;
    }

    changeRoom(room_id);
}

function leftRoom() {
    if (room_id === 0) {
        room_id = 2;
    } else if (room_id === 2) {
        room_id = 3;
    } else if (room_id === 3) {
        room_id = 1;
    } else if (room_id === 1) {
        room_id = 0;
    }

    changeRoom(room_id);
}

var zoomed = false;
function zoom(target) {
    hide(document.getElementById("common"));
    hideMulti(document.getElementsByClassName("click"));
    show(document.getElementById(target+"_zoom"));
    showMulti(document.querySelectorAll('#'+target+'_zoom .zoom_objects'))
    showBack();
    current_zoom = target;

    // Room 1 Answer
    if (target === 'computer') {
        if (end_flag === true) {
            stopSound("#bgm");
            var music = node("#moonsomoon")
            music.play()
        } else {
            node("#answer").focus();
        }
    }
    zoomed = true;
}

function zoomout() {
    // event.stopPropagation();

    target = current_zoom;
    hide(document.getElementById(target+"_zoom"));
    hideMulti(document.getElementsByClassName("zoom_objects"))
    changeRoom(room_id);
    hideBack();
    hideActiveObjects();
    current_zoom = undefined;

    // Room 1 Answer
    if (target === 'computer') {
        node("#answer").blur();
    }

    // Room4 Bed
    if (node("#bed_zoom").classList.contains("touch")) {
        node("#zoomed_paper").style.display = 'block';
    }

    zoomed = false;


}

function addItem(name) {
    items.push(name)

    for(var i=0;i<items.length;i++) {
        var item = items[i];
        node("#item_"+item).style.display = 'block';
        if (i == 1) {
            node("#item_"+item).style.left = '39%';
        } else if (i == 2) {
            node("#item_"+item).style.left = '70.3%';
        }
    }
}

function playSound(nid) {
    var sound = node(nid)

    if (sound.paused) {
        sound.pause();sound.currentTime = 0;sound.play()
    }
}

function stopSound(nid) {
    var sound = node(nid)
    sound.pause();
}

function playCatSound(ev) {
    stopProp(ev);

    playSound("#room_1_cat_sound");

}

function getRoom1Key(ev) {
    stopProp(ev);

    if (items.indexOf("key") === -1) {
        playSound("#room_1_key_sound");

        node("#zoomed_key").style.display = 'none';

        addItem('key')

        node("#cat_with_key").classList.add('no_key');
    }
}

function openRoom1Box(flag, ev) {
    if (flag !== 'close') {

        stopProp(ev);

        if (items.indexOf("key") === -1) {
            playSound("#room_1_close_box_sound")
        } else {
            if (!node("#zoomed_box_closed").classList.contains('open')) {
                playSound("#room_1_open_box_sound")
                node("#zoomed_box_closed").classList.add('open');
            } else {
                node("#zoomed_box_active").style.display = 'block';
            }
        }
    } else {
        node("#zoomed_box_active").style.display = 'none';
    }
}

function getRoom2Broom() {
    playSound("#room_2_broom_sound")

    addItem('broom');

    node('#broom').style.display = 'none';
}

function getRoom2Card(flag, ev) {
    stopProp(ev);

    if (flag === 'open') {
        node('#zoomed_card_active').style.display = 'block';
    } else {
        node('#zoomed_card_active').style.display = 'none';
    }
}

function openRoom2Closet(ev) {

    if (!node("#zoomed_closet").classList.contains('open')) {
        stopProp(ev);

        playSound("#room_2_closet_sound")

        node("#zoomed_closet").classList.add('open')
        node('#zoomed_match').style.display = 'block';

        node('#closet').classList.add('open')
    } else {

    }
}

function getRoom2Match(ev) {
    stopProp(ev);

    playSound("#room_2_match_sound")

    addItem('match');

    node('#zoomed_match').style.display = 'none';
}

function lightRoom2Candle(ev) {
    if (items.indexOf('match') === -1) {

    } else {

        if (!node('#candle').classList.contains('light')) {

            stopProp(ev);

            playSound("#room_2_candle_sound")

            node('#zoomed_candle_active').style.display = 'block';
            node('#candle').classList.add('light')
        }

    }
}


var room_3_book_page = 0
function openRoom3Book(flag, ev) {
    stopProp(ev);
    if (flag == 'open') {
        node('#zoomed_book_active').style.display = 'block';
    } else {

        if (room_3_book_page < 5) {
            playSound("#room_3_book_sound")
        }

        node('#zoomed_book_active').classList.remove("page_"+room_3_book_page.toString());
        room_3_book_page += 1
        node('#zoomed_book_active').classList.add("page_"+room_3_book_page.toString());
        if (room_3_book_page > 5) {
            node('#zoomed_book_active').style.display = 'none';
            node('#zoomed_book_active').classList.remove("page_"+room_3_book_page.toString());
            room_3_book_page = 0;
            node('#zoomed_book_active').classList.add("page_"+room_3_book_page.toString());
        }
    }
}

var room_3_ash_level = 1
function removeRoom3Ash(ev) {
    var sound = node("#room_3_ash_sound")

    if (room_3_ash_level < 5 && items.indexOf('broom') !== -1) {
        stopProp(ev);

        playSound("#room_3_ash_sound")

        node('#zoomed_ash').classList.remove("level_"+room_3_ash_level.toString());
        room_3_ash_level += 1
        node('#zoomed_ash').classList.add("level_"+room_3_ash_level.toString());

        if (room_3_ash_level == 5) {
            node('#ash').classList.add("remove");
            setTimeout(stopSound, 600, "#room_3_ash_sound");
        }
    }
}

function touchRoom4Bed(ev) {
    stopProp(ev);

    if (!node("#bed_zoom").classList.contains("touch")) {
        playSound("#room_4_bed_sound")

        node("#bed_zoom").classList.add("touch")
        node("#bed").classList.add("touch")
        node("#zoomed_paper").style.display = 'block';
        node("#zoomed_bed_touch_area").style.display = 'none';
    } else {

    }
}

function openRoom4Paper(flag, ev) {
    stopProp(ev);

    if (flag === 'open') {
        node("#zoomed_paper_active").style.display = 'block';
        node("#zoomed_paper").style.display = 'none';
    } else {
        node("#zoomed_paper_active").style.display = 'none';
        node("#zoomed_paper").style.display = 'block';
    }
}

var door_level = 0;
function openRoom4Door(ev) {
    stopProp(ev);
    var music = node("#moonsomoon")
    if (door_level < 5 && end_flag === true) {
        music.pause();
        stopSound("#bgm");
        var sound = node("#room_4_heart_sound")
        hideBack();

        node('#door_zoom').classList.remove("step_"+door_level.toString());
        door_level += 1
        node('#door_zoom').classList.add("step_"+door_level.toString());

        playSound("#room_4_heart_sound")

        if (door_level === 4) {
            sound.pause();
            playSound("#room_4_door_sound");
            setTimeout(gameEnd, 1500);
            // setTimeout(showBack, 4500);
        }
    } else if (door_level === 5) {
        playSound("#room_4_door_sound");
    } else {
        playSound("#room_4_door_closed_sound")
    }
}

function gameEnd() {
    node('#door_zoom').classList.remove("step_"+door_level.toString());
    door_level += 1
    node('#door_zoom').classList.add("step_"+door_level.toString());
}

function answer(e, ev) {
    stopProp(ev);
    if (e.value.toUpperCase() === "ENTROPY") {
        e.style.display = 'none';
        node("#computer_zoom").classList.add("play");
        node("#computer").classList.add("play");
        node("#door").classList.add("play");
        node("#door_zoom").classList.add("play");
        stopSound("#bgm");
        playSound("#moonsomoon");
        end_flag = true;
        node("#answer").blur();
    }
}
