
$(document).ready(function () {

    function createCharCard(snapshot) {
        var cardName = snapshot.name;
        var cardDescription = snapshot.description;
        var cardBattleCreds = snapshot.battlecred;
        var cardIMG = snapshot.gif;
        var card = $("<div>").addClass("card");
        var header = $("<h5>").addClass("card-header text-center").text(cardName);
        var img = $("<img>").addClass("card-img-top").attr("src", cardIMG);
        var cardbody = $("<div>").addClass("card-body");
        var paragraph = $("<p>").addClass("card-text").text(cardDescription);
        var creds = $("<h3>").text(cardName + "has been favorited in battle "+ cardBattleCreds + "times");
        var btn = $("<button>").addClass("winner").attr("data-name", cardName).text("WINNER");

        cardbody.append(paragraph, btn, creds);
        card.append(header, img, cardbody);
        $("#character-cards").append(card);
        // Add Battle Creds!
    };

    function gameLoop() {
        var charIndex = Math.floor(Math.random() * 9);
        var chartoSearch = characters[charIndex];
        console.log(chartoSearch);

        // Check firebase to see if character exists
        database.ref("characters/").orderByChild("name").equalTo(chartoSearch).once("value", snapshot => {
            if (snapshot.exists()) {
                var snap = snapshot.val();
                snap = snap[Object.keys(snap)[0]]
                createCharCard(snap);
            } else {
                // Create the character based on calls
                // Marvel Query 
                var marvelQuery = "https://gateway.marvel.com:443/v1/public/characters?name=" + chartoSearch + "&limit=2&apikey=" + marvelKey;
                // Giphy Query 
                var giphyQuery = "https://api.giphy.com/v1/gifs/search?q=" + chartoSearch + "&limit=1&api_key=" + giphyKey;

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
                        database.ref("characters/").push({
                            description: description,
                            battlecred: battleCred,
                            name: chartoSearch,
                            gif: gifURL
                        });
                        // Load the characters card based on the calls made
                        createCharCard(snap);
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            }
        });
        numOfChars++;
    }

    // List of characters we know have descriptions in Marvel.
    var characters = [
        "Spider-Man", "Thor", "Hulk", "Wolverine", "Thanos",
        "Loki", "Magneto", "Cyclops", "Deadpool"
    ];

    // Marvel Key
    const marvelKey = "3825528115714235769b996819f21ef0";
    // Giphy Key
    const giphyKey = "F0y8OeTPpYSZkVLz2fLvNXdxqtpfpPSp";
    // Variable for keeping track of how many characters have been chosen
    var numOfChars = 0;

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


    $("#start-fight").on("click", (e) => {
        e.preventDefault();

        while (numOfChars < 2) {
            gameLoop();
        }
    })

    // Define on click for the winner button
    $(".winner").on("click", (e) => {
        e.preventDefault();
        // Change the background of the winner card? Maybe?
        // use the data name of THIS to go into firebase and update their battle creds
        // Update this on screen and use a modal or something to show that they won?

    })

})