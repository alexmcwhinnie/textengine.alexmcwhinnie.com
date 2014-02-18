// TO DO : Let players inspect items


/*-----------------------
INDEX
1.  Variables
    a) Variables
    b) Arrays
    c) Booleans
    d) Set starting items

2.  Onload Listener

3.  Submit Listener

4.  Objects
    a) Define Objects
    b) Instantiate Objects

5.  Functions
-----------------------*/


/*-----------------------
1. Variables
-----------------------*/
// a) Variables
var command;
var commandVerb;
var commandPostVerb;
var moveMessage;
var actionMessage;
var feedbackMessage;
var additionalMessage;
var dataMessage;
var loadData;
var currentRoom = 2;
var inventorySize = 4;

var lockString;
var allLockString = "";
var visibleItemsString;
var allVisibleItemsString = "";

var altitude = 30000;
var gameEnd = false;
var gameWon = false;

// b) Arrays
var room = new Array();
var item = new Array();
var inventory = new Array();
var visibleItems = new Array();
var visibleItems2 = new Array();
var roomObjects = new Array();
var roomExits = new Array();
var roomDirections = new Array("north", "east", "south", "west", "up", "down");
var availableDirections = new Array();
var preTotal = new Array();
var total = new Array();
var roomLocked = new Array();

// c) Booleans
var inventoryFull = false;



// e) Strings
var openingMessage = "You wake up disoriented, head pounding, wearing nothing but tattered jeans and a shirt that isn’t even yours. The taste of whiskey and regret are thick on your tongue. You pat yourself down and realize all you have on you is a wrist watch and a load of regret. Suddenly you notice you are on an out of control plane plummeting to your death. What do you do?"
var descriptionCabin = "You are standing in the cabin, empty except for some scattered debris. All of the emergency oxygen masks have been deployed except for yours. Typical."
var descriptionBathroom = "You are standing in the bathroom, not surprisingly, there was no line.  Huh. There is a small hatch on the floor. How could you never have noticed that before. You ponder its purpose, poop hatch or something cooler?! Only one way to find out…"
var descriptionCargo = "Whoa. You climb down the floor hatch into a narrow access tunnel leading to what appears to be the Cargo Hold. Sadly, no cargo to explore. Just empty and cold. So very cold. You wonder if this is because there is less insulation down here or something. You really should have paid more attention when watching Executive Decision. "
var descriptionGalley = "You are standing in the galley. Visions of free mini booze and snacks dance through your head. Instead there is just an empty wet bar and a door."
var descriptionCockpit = "You are standing in the Cockpit. The instrument console appears to be destroyed, and the pilots are dead. Well that sucks."



/*-----------------------
2. Onload functions
-----------------------*/
$( document ).ready(function() {
    checkVisibleItems();
    showItem();
    showNarrative();
    convertRoomExits();
    gameMap();
});


/*-----------------------
3. Submit Listener
-----------------------*/
$( "#commandForm" ).submit(function(event) {
    // Run functions
    commandHandling();
    clearOutputs();
    totalCommands();
    roomMover();    
    negativeFeedback();    
    convertRoomExits();
    showNarrative();
    getItem();
    useItem();
    dropItem();
    inspectItem();
    checkVisibleItems();
    showItem();
    emptyLists();

    //Gane Specific
    updateAltitude();
    gameMap();
    gameStatus();
    event.preventDefault();
});


$( "#save" ).click(function() {
    saveSession();
    dataMessage = "Game Saved";
    $('#data-output').html(dataMessage);
});

$( "#load" ).click(function() {
    loadSession();
    dataMessage = "Game Loaded";
    $('#data-output').html(dataMessage);
});

$( "#new" ).click(function() {
    // Reset game to factory defaults
    location.reload(true);
    // Save game state
    newSession();
    // Output status
    dataMessage = "New Game";
    $('#data-output').html(dataMessage);
});

/*-----------------------
4. Objects
-----------------------*/
// a) Define Objects
function Room (_roomNumber, _roomName, _roomDescription, _roomExits, _visibleItems, _doorLocked) {
    this.roomNumber = _roomNumber;
    this.roomName = _roomName;
    this.roomDescription = _roomDescription;
    this.roomExits = _roomExits;
    this.visibleItems = _visibleItems;
    this.doorLocked = _doorLocked;
} 

function Item (_itemNumber, _itemName, _itemDescription, _itemUseCorrect, _itemUseIncorrect, _itemLimitless, _itemDiscardable) {
    this.itemNumber = _itemNumber;
    this.itemName = _itemName;
    this.itemDescription = _itemDescription;
    this.itemUseCorrect = _itemUseCorrect;
    this.itemUseIncorrect = _itemUseIncorrect;
    this.itemLimitless = _itemLimitless;
    this.itemDiscardable = _itemDiscardable;
} 

var item0 = new Item(0, "watch", "This is an analog wrist watch that also has an altimeter", "", "You check the time, which doesnt seem to accomplish much except for wasting it.", false, false);
item[0] = item0;
var item1 = new Item(1, "skymall catalogue", "This appears to be a rather generic symall catalogue. You might be able to roll it up and do some damage", "You don't know if its a pavlovian response, but having a magazine coupled with proximity to a toilet just seems to get things moving. Feeling sassy, you decide to poop with the door open. Take that FAA!", "You leaf through the pages of the skymall catalogue and laugh at the ridiculousness of some of the items. Who would buy such cra...OOHH! A pierogi shaped Christmas ornament. You make a mental note to get that for your mother-in-law. Sweet. One gift down. You will be the star of Christmas.", false, false);
item[1] = item1;
var item2 = new Item(2, "nail clippers", "They appear to have been recently used. If you survive, you may want to pick up some anti-fungal spray.", "", "As you grasp the cool metal in your hands, you cannot help wonder if this piece of contraband was the cause of your predicament. You hang onto them in case you need a shiv, you know, for science.", false, false);
item[2] = item2;
var item3 = new Item(3, "loafer", "It looks well worn and has a smell to match", "", "You throw the loafer down the aisle and laugh menacingly, and in your best Austin Powers impression say “who throws a shoe, honestly”. Unfortunately there is no one around to hear you and you start sobbing. You slowly get your shit together and decide to keep the shoe as a souvenir and contemplate a new career as a prop comic.", false, false);
item[3] = item3;
var item4 = new Item(4, "fire extinguisher", "The label reads CO2 Dry Powder", "", "You have always wanted to use a fire extinguisher, now is your chance! You pull the pin and engage the trigger. The fire extinguisher sputters and sprays out a few drops of something and then does nothing. That was anticlimactic. Good thing you aren’t in an emergency situation. Oh wait.", false, false);
item[4] = item4;
var item5 = new Item(5, "flare gun", "This is an orange plastic flare gun that contains a single flare. Looks like you're only going to get one shot with this", "You point the flare gun towards the side of the plane and successfully blow a hole in hull. You feel yourself getting sucked out. You start to panic and hope that maybe you will fall and land someplace soft, no such luck. You plummet to your death.", "Whoooosh! What seemed like a good idea has gone horribly wrong. Maybe you should use it in a less fortified and dangerous area.", false, true);
item[5] = item5;
var item6 = new Item(6, "keys", "There appear to be three keys attached to a key ring", "You slide one of the keys into the lock of the door. It must be your lucky day because it opened the door on your first try! Yep. Lucky day indeed!", "Jingle jingle jingle... if video games taught you anything, it is keys can always come in handy", false, false);
item[6] = item6;
var item7 = new Item(7, "can of mountain dew", "This is an unopened 16oz can of warm soda", "", "You open the can of mountain dew. As you drink it, you hope it gives you the power to take things to the extreme. It doesn't. You forgot about your raging diabetes and you die.", false, false);
item[7] = item7;
var item8 = new Item(8, "cargo net", "You stare at it for a few seconds before deciding that this is a pretty standard cargo net", "", "You try to figure out what you would do with this thing, and only succeed in getting tangled. Great. Maybe you should stop horsing around.", false, false);
item[8] = item8;
var item9 = new Item(9, "toilet paper", "Yep. This is toilet paper", "Ah, the good old reliable single ply 'I hate my ass' brand toilet paper. You make a mental note to wash your hands twice.", "You start throwing the roll around watching it cover the area with TP streamers. You decide to gather up the toilet paper as best you can and remind yourself that hangover shits come in waves, so you shouldnt be wasting such a precious commodity.", false, false);
item[9] = item9;
var item10 = new Item(10, "parachute", "You've never seen one outside of the movies, but this appears to be a parachute. Oh boy. Shit just got real", "", "Carefully, you strap the parachute to your back. You look like an idiot, but you figure it is better to be safe than sorry. Hopefully you cinched all the buckles and attached all the straps correctly… ", false, false);
item[10] = item10;

// b) Instantiate Objects (note: roomExits array [0]North, [1]East, [2]South, [3]West, [4]Up, [5]Down)
var room1 = new Room(1, "Cockpit", descriptionCockpit, _roomExits = [0, 0, 2, 0, 0, 0], _visibleItems = [item[5].itemName, item[10].itemName], _doorLocked = [false, false, false, false, false, false]);
room[1] = room1;
var room2 = new Room(2, "Galley", descriptionGalley, _roomExits = [1, 0, 3, 0, 0, 0], _visibleItems = [item[4].itemName, item[7].itemName], _doorLocked = [true, false, false, false, false, false]);
room[2] = room2;
var room3 = new Room(3, "Cabin", descriptionCabin, _roomExits = [2, 0, 4, 0, 0, 0], _visibleItems = [item[1].itemName, item[3].itemName], _doorLocked = [false, false, false, false, false, false]);
room[3] = room3;
var room4 = new Room(4, "Bathroom", descriptionBathroom, _roomExits = [3, 0, 0, 0, 0, 5], _visibleItems = [item[2].itemName, item[9].itemName], _doorLocked = [false, false, false, false, false, false]);
room[4] = room4;
var room5 = new Room(5, "Cargo Hold", descriptionCargo, _roomExits = [0, 0, 0, 0, 4, 0], _visibleItems = [item[8].itemName, item[6].itemName], _doorLocked = [false, false, false, false, false, false]);
room[5] = room5;


// Set starting items
inventory[0] = item[0].itemName;


/*-----------------------
5. Functions
-----------------------*/
function encodeVisibleItems() {

    for (var i = 1; i < room.length; i++) {
        // Loop through the rooms and make visible items a string
        visibleItemsString = room[i].visibleItems.toString()
        // Add a marker at the end to assist with extraction
        visibleItemsString = visibleItemsString.concat("!");
        // Concatinate them all together for injecting into the DB
        allVisibleItemsString = allVisibleItemsString.concat(visibleItemsString);
    }
}

function decodeVisibleItems() {

    var decodedItems = loadData[0].visible_items.split("!");

     for (var i = 1; i < room.length; i++) {
        var j = (i - 1);
        room[i].visibleItems = decodedItems[j].split(',');    
     }
}

function encodeLocks() {

    for (var i = 1; i < room.length; i++) {
        // Loop through the rooms and make visible items a string
        lockString = room[i].doorLocked.toString()
        // Add a marker at the end to assist with extraction
        lockString = lockString.concat("!");
        // Concatinate them all together for injecting into the DB
        allLockString = allLockString.concat(lockString);
    }
    console.log(allLockString);
}

function decodeLocks() {

    var decodedLocks = loadData[0].door_locks.split("!");

     for (var i = 1; i < room.length; i++) {
        var j = (i - 1);
        room[i].doorLocked = decodedLocks[j].split(',');    
        console.log("Room " + i + " locks: " + room[i].doorLocked);
     }
}




function saveSession() {

    // Convert inventory array to string in prep for sending to DB
    var inventoryString = inventory.toString();

    // Get all visible items from room objects
    encodeVisibleItems();
    // Get status of all door locks from room objects
    encodeLocks();

    $.ajax({
        type: "POST",
        url: "game/p_save",
        data: {currentRoom: currentRoom, inventory: inventoryString, visible_items: allVisibleItemsString, door_locks: allLockString},
        complete: function(data){
                //data contains the response from the php file.
                //u can pass it here to the javascript function
        }
    });
}

function processLoad(data) { 
    loadData = jQuery.parseJSON( data.responseText );

    // Get Current Room
    currentRoom = loadData[0].room_number;
    
    // Get Inventory
    var inventoryString = loadData[0].inventory;
    
    // Update inventory
    inventory = inventoryString.split(',');
    // room[2].doorLocked[1] = loadData[0].lock_bathroom;

    // Complex function to decode visible item string from DB
    decodeVisibleItems();
    // Complex function to decode lock string from DB
    decodeLocks();

    showNarrative();
}

function loadSession() {
    $.ajax({
        type: "POST",
        url: "game/load",
        data: {},
        complete: function(data){
                //data contains the response from the php file.
                //u can pass it here to the javascript function
                
                //console.log(data);
                processLoad(data);
        }
    }); 
}

function newSession() {

    // Convert inventory array to string in prep for sending to DB
    var inventoryString = inventory.toString();

    $.ajax({
        type: "POST",
        url: "game/p_save",
        data: {currentRoom: currentRoom, inventory: inventoryString, lockBathroom: room[2].doorLocked[1]},
        complete: function(data){
                //data contains the response from the php file.
                //u can pass it here to the javascript function
        }
    });
}

function commandHandling() {
    // When the form is submitted, grab the value of the input text and set it to variable 'command'
    command = $('#command').val();
    // Set command to lowercase
    command = command.toLowerCase();
    //split command. Look for GET and do what comes after it
    commandVerb = command.split(" ", 1);
    commandPostVerb = command.substr(command.indexOf(" ") + 1); 
} 

function roomMover() {
    // Note: roomExits array [0]North, [1]East, [2]South, [3]West
    if (commandVerb == "move" || commandVerb == "go") {
        if (commandPostVerb == "north") {
            if (room[currentRoom].roomExits[0] != 0) {
                
                if (room[currentRoom].doorLocked[0] == false) {
                    currentRoom = room[currentRoom].roomExits[0];
                    moveMessage = "You move " + commandPostVerb;
                    $('#move-output').html(moveMessage);
                } else {
                    moveMessage = "The door appears to be locked";
                    
                }
            } 
        } else if (commandPostVerb == "east") {
            if (room[currentRoom].roomExits[1] != 0) {

                if (room[currentRoom].doorLocked[1] == false) {
                    currentRoom = room[currentRoom].roomExits[1];
                    moveMessage = "You move " + commandPostVerb;
                    $('#move-output').html(moveMessage);
                } else {
                    moveMessage = "The door appears to be locked";
                    $('#move-output').html(moveMessage);
                }
            } 
        } else if (commandPostVerb == "south") {
            if (room[currentRoom].roomExits[2] != 0) {
                
                if (room[currentRoom].doorLocked[2] == false) {
                    currentRoom = room[currentRoom].roomExits[2];
                    moveMessage = "You move " + commandPostVerb;
                    $('#move-output').html(moveMessage);
                } else {
                    moveMessage = "The door appears to be locked";
                    $('#move-output').html(moveMessage);
                }
            } 
        } else if (commandPostVerb == "west") {
            if (room[currentRoom].roomExits[3] != 0) {
                
                if (room[currentRoom].doorLocked[3] == false) {
                    currentRoom = room[currentRoom].roomExits[3];
                    moveMessage = "You move " + commandPostVerb;
                    $('#move-output').html(moveMessage);
                } else {
                    moveMessage = "The door appears to be locked";
                    $('#move-output').html(moveMessage);
                }
            } 
        } else if (commandPostVerb == "up") {
            if (room[currentRoom].roomExits[4] != 0) {
                
                if (room[currentRoom].doorLocked[4] == false) {
                    currentRoom = room[currentRoom].roomExits[4];
                    moveMessage = "You move " + commandPostVerb;
                    $('#move-output').html(moveMessage);
                } else {
                    moveMessage = "The door appears to be locked";
                    $('#move-output').html(moveMessage);
                }
            } 
        } else if (commandPostVerb == "down") {
            if (room[currentRoom].roomExits[5] != 0) {
                
                if (room[currentRoom].doorLocked[5] == false) {
                    currentRoom = room[currentRoom].roomExits[5];
                    moveMessage = "You move " + commandPostVerb;
                    $('#move-output').html(moveMessage);
                } else {
                    moveMessage = "The door appears to be locked";
                    $('#move-output').html(moveMessage);
                }
            } 
        }
    }
}

function checkVisibleItems() {
    visibleItems = room[currentRoom].visibleItems;
    // for (i = 0; i < visibleItems.length; i++) {
    //     for (j = 0; j < inventory.length; j++) {

            // Test visible items agains inventory
            // if (visibleItems[i] == inventory[j]) {
            //     // You already have the item, clear it from the visible item array
            //     visibleItems.splice(i, 1);
            // }
    //     }
    // }
    // Output visible items again, post-filtering    
    $('#visibleItems-output').html(visibleItems.join(', '));  
}

function showItem() {
    $('#inventory-output').html(inventory.join(', '));       
}

function checkInventorySize() {
    if (inventory.length >= inventorySize) {
        inventoryFull = true;
    } else {
        inventoryFull = false;
    }
}

function getItem() {
    // Check inventory size
    checkInventorySize();
    // Show the visible items within each instantiated room object
    visibleItems = room[currentRoom].visibleItems;
    // Only do this stuff if command is preceded by GET
    if ((commandVerb[0] == "get" || commandVerb[0] == "take") && inventoryFull == false) {
        // Check the visible items array by looping through it
        for (var i = 0; i < visibleItems.length; i++) {
            // Make sure our command matches a visible item
            if (commandPostVerb == visibleItems[i]) {

                // Add visible item to inventory
                inventory.push(visibleItems[i]);

                // Set a message to assist with narrative
                actionMessage = "You take the " + visibleItems[i] + ". ";
                $('#action-output').html(actionMessage);
                
                // Loop through all the items
                for (var j = 0; j < item.length; j++) {
                    // Find the one equal to the commandPostVerb entered
                    if (commandPostVerb == item[j].itemName) {
                        // Check to see if itemLimitless is set to false
                        if (item[j].itemLimitless == false) {
                            // If so, remove the added item from the visible item array
                            visibleItems.splice(i, 1);
                        }
                    }
                }
            } 
        }
    } else if ((commandVerb[0] == "get" || commandVerb[0] == "take") && inventoryFull == true) {
        feedbackMessage = "Try as you might, you can't find enough pockets to hold all this loot";
        $('#negativeFeedback-output').html(feedbackMessage);
    }
}

function useItem() {
    if (commandVerb[0] == "use") {
        for (var i = 0; i < inventory.length; i++) {
            if (commandPostVerb == inventory[i]) {
                // Update action message
                actionMessage = "You use the " + inventory[i];
                $('#action-output').html(actionMessage);
                // Reset feedback message
                feedbackMessage = "";
                $('#negativeFeedback-output').html(feedbackMessage);

                // Look for a match between the item name and commandPostVerb (what the player has tried to use)
                for (var j = 0; j < item.length; j++) {
                    if (item[j].itemName == commandPostVerb) {
                        

                        // THIS IS WHERE THE MAGIC WILL HAPPEN (Maybe move this to a function at the bottom)

                        // use box
                        if (commandPostVerb == "keys" && currentRoom == 2) {
                            additionalMessage = item[j].itemUseCorrect;
                            // unlock cockpit door
                            room[2].doorLocked[0] = false;
                            $('#additional-output').html(additionalMessage);
                            feedbackMessage = ""                 
                        } 
                        if (commandPostVerb == "skymall catalogue" && currentRoom == 4) {
                            additionalMessage = item[j].itemUseCorrect;
                            $('#additional-output').html(additionalMessage);
                            feedbackMessage = ""                 
                        }
                        if (commandPostVerb == "can of mountain dew") {
                            additionalMessage = item[j].itemUseCorrect;
                            $('#additional-output').html(additionalMessage);
                            feedbackMessage = ""
                            gameEnd = true;     
                        }
                        if (commandPostVerb == "flare gun" && currentRoom == 5){
                            additionalMessage = item[j].itemUseCorrect;
                            $('#additional-output').html(additionalMessage);

                        // Otherwise use incorrect message
                        } else {
                            additionalMessage = item[j].itemUseIncorrect;
                            $('#additional-output').html(additionalMessage);
                        }





                        // Check to see if item is discardable and remove from inventory if true
                        if (item[j].itemDiscardable == true) {
                            inventory.splice(i, 1);
                            $('#negativeFeedback-output').html("You lose the " + commandPostVerb);
                        }
                    }
                }

                


                // if (inventory[i] == "keys" && currentRoom == 4) {
                //     // Update Object
                //     room[currentRoom].doorLocked[2] = false;

                //     // Set action message
                //     actionMessage = "You use the " + inventory[i];

                //     // Set additional message
                //     additionalMessage = "You use one of the many keys and finally open the door. You are standing on the threshold of what appears to be the parlor.";
                //     $('#additional-output').html(additionalMessage);
                // }
            }
        }
    }
    $('#action-output').html(actionMessage);
}


function dropItem() {
    if (commandVerb[0] == "drop" || commandVerb[0] == "discard") {
        for (var i = 0; i < inventory.length; i++) {
            if (commandPostVerb == inventory[i]) {

                // // Loop through all the items
                // for (var j = 0; j < item.length; j++) {
                //     // Find the one equal to the commandPostVerb entered
                //     if (commandPostVerb == item[j].itemName) {
                //         // Check to see if itemLimitless is set to false
                //         if (item[j].itemLimitless == false) {

                            // Update action message
                            actionMessage = "You drop the " + inventory[i];
                            $('#action-output').html(actionMessage);
                            // Push item from inventory to room's visible items array
                            room[currentRoom].visibleItems.push(inventory[i]);
                            // Remove the dropped item from inventory
                            inventory.splice(i, 1);
                            // Reset feedback message
                            feedbackMessage = "";
                            $('#negativeFeedback-output').html(feedbackMessage);
                            // Check for new inventory size
                            checkInventorySize();
                //         }
                //     }
                // }
            }
        }
    }
}   



// function dropItem() {
//     if (commandVerb[0] == "drop" || commandVerb[0] == "discard") {
//         for (var i = 0; i < inventory.length; i++) {
//             if (commandPostVerb == inventory[i]) {
//                 // Update action message
//                 actionMessage = "You drop the " + inventory[i];
//                 $('#action-output').html(actionMessage);
//                 // Push item from inventory to room's visible items array
//                 room[currentRoom].visibleItems.push(inventory[i]);
//                 // Remove the dropped item from inventory
//                 inventory.splice(i, 1);
//                 // Reset feedback message
//                 feedbackMessage = "";
//                 $('#negativeFeedback-output').html(feedbackMessage);
//                 // Check for new inventory size
//                 checkInventorySize();
//             }
//         }
//     }
// }   


function inspectItem() {
    if (commandVerb[0] == "inspect") {
        for (var i = 0; i < inventory.length; i++) {
            if (commandPostVerb == inventory[i]) {

                // Update action message
                actionMessage = "You decide to take a closer look at the " + inventory[i];
                $('#action-output').html(actionMessage);

                // Look for a match between the item name and commandPostVerb (what the player has tried to use)
                for (var j = 0; j < item.length; j++) {
                    if (item[j].itemName == commandPostVerb) {

                        additionalMessage = item[j].itemDescription;
                        $('#additional-output').html(additionalMessage);
                    }
                }
            }
        }
    }
}

function convertRoomExits() {
    // Begin by clearing array
    availableDirections.length = 0;
    // Loop through exits availble to current room object
    for (var i = 0; i < room[currentRoom].roomExits.length; i++) {
        // If roomExit interger isn't 0 (which indicates an unavailable direction)
        if (room[currentRoom].roomExits[i] > 0) {
            // Push the text equivilent (north, east, etc) from roomDirections into availableDirections
            availableDirections.push(roomDirections[i]);
        }
    }
    // Output available directions
    $('#exits-output').html(availableDirections.join(', '));
}

function totalCommands() {
    // Compile all arrays into one for testing
    preTotal = visibleItems.concat(inventory);
    total = preTotal.concat(availableDirections);
    for (var i = 0; i < total.length; i++) {
    }
}

function negativeFeedback() {
    //VALID OPTION (clear negative feedback)
    // Check for valid commandVerb
    if (commandVerb == "get" || commandVerb == "take" || commandVerb == "move" || commandVerb == "go" || commandVerb == "use" || commandVerb == "drop" || commandVerb == "discard") {
        for (var i = 0; i < total.length; i++) {
            // Check for valid commandPostVerb from all possible options (total = inventory, directions, visible items)
            if (commandPostVerb == total[i]) {
                // Valid action! Clear error
                feedbackMessage = "";
            }
        }
    }

    //INVALID TESTS (personalised negative feedback)
    // You're trying to go in an invalid direction
    if (commandVerb == "move" || commandVerb == "go") {
        var legalMove = false;
        for (var i = 0; i < availableDirections.length; i++) {
            if (commandPostVerb == availableDirections[i]) {
                legalMove = true;
            }
        } 
        if (legalMove == false) {
            feedbackMessage = "You cant go in that direction";
        }
    }
    // You're trying to use something you dont have   
    else if (commandVerb == "use") {
        for (var i = 0; i < preTotal.length; i++) {
            if (commandPostVerb != preTotal[i]) {
                feedbackMessage = "I dont understand what you're trying to use";
            }
        }
    }
    // You're trying to drop an item you dont have
    else if (commandVerb == "drop" || commandVerb == "discard") {
        var legalDrop = false;
        for (var i = 0; i < inventory.length; i++) {
            if (commandPostVerb == inventory[i]) {
                legalDrop = true;
            }
        } if (legalDrop == false) {
            feedbackMessage = "You can't drop an item you don't have";
        }
    }
    // You're trying to get something you already have
    else if (commandVerb == "get" || commandVerb == "take") {
        for (var i = 0; i < inventory.length; i++) {
            if (commandPostVerb == inventory[i]) {
                feedbackMessage = "You already have that item";
            } 
        }
    } 
    // You're trying to inspect something you don't have in your inventory, or something that doesnt exist
    else if (commandVerb == "inspect") {
        var legalInspect = false;
        for (var i = 0; i < inventory.length; i++) {
            // Check to see if item being inspected is in inventory
            if (commandPostVerb == inventory[i]) {
                legalInspect = true;
                feedbackMessage = "";
            } 
        }
        // If item isnt in inventory, perform a second check to see if it is at least a visible item
        if (legalInspect == false) {
            var itemVisible = false;
            for (var i = 0; i < visibleItems.length; i++) {
                if (commandPostVerb == visibleItems[i]) {
                    feedbackMessage = "You can't inspect an item you don't have";
                    itemVisible = true;
                } if (itemVisible == false) {
                    feedbackMessage = "I dont know what you are trying to inspect";
                }
            }
        }
    }
    // You haven't entered anything
    else if (command == "") {
        feedbackMessage = "You shouldn't waste time";
    }
    // That makes no sense (Anything else such as trying to GET or TAKE an item that doesnt exist or jibberish)
    else {
        feedbackMessage = "That makes no sense, pal";
    }
    // BONUS! Give error if item is visible, but trying to be used as if in inventory
    if (commandVerb == "use") {
        for (var i = 0; i < visibleItems.length; i++) {
            if (commandPostVerb == visibleItems[i]) {
                feedbackMessage = "You can't use an item you dont have";
            }
        }
    }
    // You're trying to get something that doesnt exist
    if (commandVerb == "get" || commandVerb == "take") {
        var legalTake = false;
        for (var i = 0; i < visibleItems.length; i++) {
            if (commandPostVerb == visibleItems[i]) {
                feedbackMessage = "";
                legalTake = true;
            } if (legalTake == false) {
                feedbackMessage = "Not sure what you are trying to take";
            }
        }
    } 
    
    // Output feedback message
    $('#negativeFeedback-output').html(feedbackMessage);
}

function showNarrative() {
    $('#move-output').html(moveMessage);
    $('#room-output').html("You are currently standing in the " + room[currentRoom].roomName);
    $('#message-output').html(room[currentRoom].roomDescription);
    $('#action-output').html(actionMessage);
    $('#data-output').html(dataMessage);
    $('#altitude-output').html(altitude+' Feet');

    showItem();
    checkVisibleItems();
}

function clearOutputs() {
    moveMessage = "";
    $('#move-output').html(moveMessage);
    actionMessage = "";
    $('#action-output').html(actionMessage);
    additionalMessage = "";
    $('#additional-output').html(additionalMessage);
    dataMessage = "";
    $('#data-output').html(dataMessage);
}

function emptyLists() {
    if (inventory.length == 0) {
        $('#inventory-output').html("Your pack contains nothing");
    } else if (visibleItems.length == 0) {
        $('#visibleItems-output').html("You can't see anything worth taking");
    }
}


// GAME SPECIFIC

function updateAltitude() {
    // Update the altitude
    if (gameEnd == false && altitude > 0) {
        var altitudeLoss = Math.floor((Math.random()*1500)+400);
        altitude = altitude - altitudeLoss;

        if (altitude < 15000) {
            $('#altitude-output').css('color', 'orange');
        } 
        if (altitude < 5000) {
            $('#altitude-output').css('color', 'red');
        }

        // Keep altitude at 0 and set game end to true
        if (altitude <= 0) {
            altitude = 0;
            gameEnd = true;
        }
        $('#altitude-output').html(altitude+' Feet');
    } 
}

function gameMap () {
        // Display room name above marker
        $('#planeMarker').html(room[currentRoom].roomName);

        // Cockpit
        if (currentRoom == 1) {
                $('#planeMarker').css('top', '-20px');
                $('#plane').css('background-image', "url('images/plane-upper.png')");
        } 
        // Galley
        else if (currentRoom == 2) {
                $('#planeMarker').css('top', '20px');
                $('#plane').css('background-image', "url('images/plane-upper.png')");
        } 
        // Cabin
        else if (currentRoom == 3) {
                $('#planeMarker').css('top', '80px');
                $('#plane').css('background-image', "url('images/plane-upper.png')");
        } 
        // Bathroom
        else if (currentRoom == 4) {
                $('#planeMarker').css('top', '148px');
                $('#plane').css('background-image', "url('images/plane-upper.png')");
        } 
        // Cargo Hold
        else if (currentRoom == 5) {
                $('#planeMarker').css('top', '165px');
                $('#plane').css('background-image', "url('images/plane-lower.png')");
        } 
}


function gameStatus() {
    if (gameEnd == true && gameWon == false) {
        console.log("game end");
        // message2 = message2 + loseMessage;
        // $('#messageItem-output').html(message2);
        $('#gameStatus-output').html("You Died!");
        $('#gameStatus').css('display', 'block');
    } else if (gameWon == true) {
        gameEnd = true;
        $('#gameStatus-output').html("You Escaped!");
        $('#gameStatus').css('display', 'block');
    }
}

