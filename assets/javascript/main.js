
$(document).ready(function () {

    // List of characters we know have descriptions in Marvel.
    var characters = [
        "Spider-Man", "Thor", "Hulk", "Wolverine", "Thanos",
        "Loki", "Magneto", "Cyclops", "DeadPool"
    ];

    // Marvel Key
    const marvelKey = "3825528115714235769b996819f21ef0";
    // Giphy Key
    const giphyKey = "F0y8OeTPpYSZkVLz2fLvNXdxqtpfpPSp";
    // Array for keeping track of how many characters have been chosen
    var charsOnScreen = []


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBuVunkkdUj9Lh7ghjP2JmLXJLI42K55jQ",
        authDomain: "marveltest-9558a.firebaseapp.com",
        databaseURL: "https://marveltest-9558a.firebaseio.com",
        projectId: "marveltest-9558a",
        storageBucket: "marveltest-9558a.appspot.com",
        messagingSenderId: "557399982087"
    };
    firebase.initializeApp(config);
    database = firebase.database();


    function createCharCard(snapshot) {
        var cardName = snapshot.name;
        var cardDescription = snapshot.description;
        var cardBattleCreds = snapshot.battlecred;
        var cardIMG = snapshot.gif;
        var card = $("<div>").addClass("card");
        var header = $("<h3>").addClass("card-header text-center").text(cardName);
        var img = $("<img>").addClass("card-img-top").attr("src", cardIMG);
        var cardbody = $("<div>").addClass("card-body");
        var paragraph = $("<p>").addClass("card-text").text(cardDescription);
        var creds = $("<h5>").attr("id", cardName).text(cardName + " has been favorited in battle " + cardBattleCreds + " times!")
        var btn = $("<button>").addClass("winner").attr("data-name", cardName).text("WINNER");

        cardbody.append(paragraph, btn, creds);
        card.append(header, img, cardbody);
        $("#character-cards").append(card);

        // Add character to the array of current characters
        charsOnScreen.push(cardName);


    };

    function gameLoop(charToSearch) {

        // Check firebase to see if character exists
        database.ref("characters/").orderByChild("name").equalTo(charToSearch).once("value", snapshot => {
            if (snapshot.exists()) {
                var snap = snapshot.val();
                snap = snap[Object.keys(snap)[0]]
                createCharCard(snap);
            } else {
                // Create the character based on calls
                // Marvel Query 
                var marvelQuery = "https://gateway.marvel.com:443/v1/public/characters?name=" + charToSearch + "&limit=2&apikey=" + marvelKey;
                // Giphy Query 
                var giphyQuery = "https://api.giphy.com/v1/gifs/search?q=" + charToSearch + "&limit=1&api_key=" + giphyKey;

                $.ajax({
                    url: marvelQuery,
                    method: "GET"
                }).then(response => {
                    console.log(response);
                    // Store description in variable
                    var description = response.data.results[0].description;

                    $.ajax({
                        url: giphyQuery,
                        method: "GET"
                    }).then(response => {
                        console.log(response);
                        // Store gif url in variable
                        var gifURL = response.data[0].images.fixed_height.url;
                        // Initialize battlecred to 0
                        var battleCred = 0;

                        // Create object to push to database
                        var charToPush = {
                            description: description,
                            battlecred: battleCred,
                            name: charToSearch,
                            gif: gifURL
                        }
                        database.ref("characters/").push(charToPush);
                        createCharCard(charToPush);
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            }
        });
    }

    $("#start-fight").on("click", (e) => {
        console.log('Click worked');
        e.preventDefault();
        if (charsOnScreen.length == 0) {
            var charIndex = Math.floor(Math.random() * characters.length);
            var charOne = characters[charIndex];
            while (charsOnScreen.includes(charOne)) {
                charIndex = Math.floor(Math.random() * characters.length);
                charOne = characters[charIndex];
            }
            charsOnScreen.push(charOne);
            charIndex = Math.floor(Math.random() * characters.length);
            var charTwo = characters[charIndex];
            while (charsOnScreen.includes(charTwo)) {
                charIndex = Math.floor(Math.random() * characters.length);
                charTwo = characters[charIndex];
            }
            charsOnScreen.push(charTwo);
            gameLoop(charOne);
            gameLoop(charTwo);
        }

    })

    // Define on click for the winner button
    $("body").on("click", ".winner", (e) => {
        e.preventDefault();
        // Change the background of the winner card? Maybe?
        // Hide the winner buttons?

        // Get the winner
        var nameToUpdate = $(e.target).data("name");
        // Get the child based on the character name
        database.ref("characters/").orderByChild("name").equalTo(nameToUpdate).once("value", snapshot => {
            var snap = snapshot.val();
            // Get the key for that entry so we can update it
            var key = Object.keys(snap)[0];
            // Get the battlecreds and increment it
            var credsToUpdate = snap[Object.keys(snap)[0]].battlecred;
            credsToUpdate++;
            // Update the DB with the key and the new creds
            database.ref("characters/" + key).update({ battlecred: credsToUpdate });
            // Update the DOM with the incremented battlecred
            $("#" + nameToUpdate).text(nameToUpdate + " was chosen to win! " + "They have been favorited to win in battle " + credsToUpdate + " times!");
            // setTimeout(gameLoop(), 5)
            // $(".winner").remove();
            // numOfChars = 0;
            // timeout starts...after ten seconds:
            // numOfChars = 0
            // remove both cards from the screen and call gameloop() under while loop

        })



    })

})




// TO DO
// 2. Write winner on click function!
// 3. Look at GIPHY Api...limit based on rating and cyclops is not marvel cyclops?
// 4. README!!!

