/*
Functions for the game play.
*/
// Global Variables
var end_flag = false;
var current_zoom = undefined
var zoomed = false;

// Item variables
var items = [];

// Play the bgm when game started
function gameStart() {
    if (node("#moonsomoon").paused) {
        playSound("#bgm");
    }
}

// Change the room
function changeRoom(room_id) {
    // Show the target room div
    hideAllRooms();
    show(room(room_id))

    // Hide all sub nodes
    hideMulti(document.getElementsByClassName('click'))
    // Show all nodes in target room
    showMulti(document.querySelectorAll('#room_'+(room_id+1).toString()+' .click'))
    // Show the item slot and the handles
    show(document.getElementById("common"));
}

// Move to the right-hand side room
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

// Move to the left-hand side room
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

// Zoom when click a clickable node
function zoom(target) {
    hide(document.getElementById("common"));
    hideMulti(document.getElementsByClassName("click"));
    show(document.getElementById(target+"_zoom"));
    showMulti(document.querySelectorAll('#'+target+'_zoom .zoom_objects'))
    showBack();
    current_zoom = target;

    // Room 1 Answer
    // Focus to the input field
    // Resume music if game ended
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

// Zoom out when click a back button
function zoomout() {
    target = current_zoom;
    hide(document.getElementById(target+"_zoom"));
    hideMulti(document.getElementsByClassName("zoom_objects"))
    changeRoom(room_id);
    hideBack();
    hideActiveObjects();
    current_zoom = undefined;

    // Room 1 Answer
    // De-focus from the input field
    if (target === 'computer') {
        node("#answer").blur();
    }

    // Room4 Bed
    // Toggle the paper on the bed
    if (node("#bed_zoom").classList.contains("touch")) {
        node("#zoomed_paper").style.display = 'block';
    }

    zoomed = false;
}

// Hide second-depth objects
function hideActiveObjects() {
    var o = node(".active_objects");
    for (var i=0;i<o.length;i++) {
        o[i].style.display = 'none';
    }
}

// Toggle Back buttons when zoomed
function showBack() {
    show(node("#back"));
}

function hideBack() {
    hide(node("#back"));
}

// Add items to the item slot up to three
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

// Play the sound if not playing
function playSound(nid) {
    var sound = node(nid)

    if (sound.paused) {
        sound.pause();sound.currentTime = 0;sound.play()
    }
}

// Stop the sound
function stopSound(nid) {
    var sound = node(nid)
    sound.pause();
}

// Play cat sound (Room1)
function playCatSound() {
    event.stopPropagation();

    playSound("#room_1_cat_sound");

}

// Get the key from the cat and add to the item slot (Room1)
function getRoom1Key() {
    event.stopPropagation();

    if (items.indexOf("key") === -1) {
        playSound("#room_1_key_sound");

        node("#zoomed_key").style.display = 'none';

        addItem('key')

        node("#cat_with_key").classList.add('no_key');
    }
}

// Open the box if user has key in the item slot (Room1)
function openRoom1Box(flag) {
    if (flag !== 'close') {

        event.stopPropagation();
    
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

// Get the broom and add to the item slot (Room2)
function getRoom2Broom() {
    playSound("#room_2_broom_sound")

    addItem('broom');

    node('#broom').style.display = 'none';
}

// Show the card on the sofa (Room2)
function getRoom2Card(flag) {
    event.stopPropagation();

    if (flag === 'open') {
        node('#zoomed_card_active').style.display = 'block';
    } else {
        node('#zoomed_card_active').style.display = 'none';
    }
}

// Open the closed closet (Room 2)
function openRoom2Closet() {
    
    if (!node("#zoomed_closet").classList.contains('open')) {
        event.stopPropagation();

        playSound("#room_2_closet_sound")

        node("#zoomed_closet").classList.add('open')
        node('#zoomed_match').style.display = 'block';

        node('#closet').classList.add('open')
    } else {

    }
}

// Get the match in the closet and add to the item slot (Room 2)
function getRoom2Match() {
    event.stopPropagation();

    playSound("#room_2_match_sound")

    addItem('match');

    node('#zoomed_match').style.display = 'none';
}

// Light the candle if the user has the match in the item slot (Room 2)
function lightRoom2Candle() {
    if (items.indexOf('match') === -1) {

    } else {

        if (!node('#candle').classList.contains('light')) {

            event.stopPropagation();
            
            playSound("#room_2_candle_sound")
    
            node('#zoomed_candle_active').style.display = 'block';
            node('#candle').classList.add('light')
        }
    }
}

// Open the Book & Turn the book over & Close the book when finished (Room 3)
var room_3_book_page = 0
function openRoom3Book(flag) {
    event.stopPropagation();
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

// Sweep the ash on the floor if the user has the broom in the item slot (Room 3)
var room_3_ash_level = 1
function removeRoom3Ash() {
    var sound = node("#room_3_ash_sound")

    if (room_3_ash_level < 5 && items.indexOf('broom') !== -1) {
        event.stopPropagation();

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

// Touch the bed if the card hasn't shown yet (Room 4)
function touchRoom4Bed() {
    event.stopPropagation();

    if (!node("#bed_zoom").classList.contains("touch")) {
        playSound("#room_4_bed_sound")
    
        node("#bed_zoom").classList.add("touch")
        node("#bed").classList.add("touch")
        node("#zoomed_paper").style.display = 'block';
        node("#zoomed_bed_touch_area").style.display = 'none';
    } else {

    }
}

// Enlarge the paper & Close the paper (Room 4)
function openRoom4Paper(flag) {
    event.stopPropagation();

    if (flag === 'open') {
        node("#zoomed_paper_active").style.display = 'block';
        node("#zoomed_paper").style.display = 'none';
    } else {
        node("#zoomed_paper_active").style.display = 'none';
        node("#zoomed_paper").style.display = 'block';
    }
} 

// Play locked sound if the answer hasn't filled yet (Room 4)
// Show black person when the answer is filled.
var door_level = 0;
function openRoom4Door() {
    event.stopPropagation();
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
            // No going back after the ending.
            // setTimeout(showBack, 4500);
        }
    } else if (door_level === 5) {
        playSound("#room_4_door_sound");
    } else {
        playSound("#room_4_door_closed_sound")
    }
}

// Show the red eyes
function gameEnd() {
    node('#door_zoom').classList.remove("step_"+door_level.toString());
    door_level += 1
    node('#door_zoom').classList.add("step_"+door_level.toString());
}

// Check the Answer
function answer(e) {
    event.stopPropagation();
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