
$(document).ready(function () {

    function createCharCard(snapshot) {
        var cardName = snapshot.name;
        var cardDescription = snapshot.description;
        var cardBattleCreds = snapshot.battlecred;
        var cardIMG = snapshot.gif;
        // create a div class card
        var card = $("<div>").addClass("card");
        // create an h5 class card-header text-center...set the text to cardName
        var header = $("<h5>").addClass("card-header text-center").text(cardName);
        // create an img class card-img-top and set the src to cardIMG
        var img = $("<img>").addClass("card-img-top").attr("src", cardIMG);
        // create div with class card-body
        var cardbody = $("<div>").addClass("card-body");
        // create a p with class card-text and set the text to cardDescription
        var paragraph = $("<p>").addClass("card-text").text(cardDescription);
               // create a button with class winner and create a data-name and set that equal to cardName
        var btn = $("<button>").addClass("winner").attr("data-name", cardName);

        cardbody.append(paragraph);
        card.append(header, img, cardbody);
        $("#character-cards").append(card);




        // <div class="card">
        //   <h5 class="card-header text-center">
        //     HULK
        //   </h5>
        //   <img class="card-img-top" src="https://media.giphy.com/media/aS8ypUweGOXMA/giphy.gif" alt="Card image cap">
        //   <div class="card-body">
        //     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
        //       content.</p>
        //   </div>
        //   <div class="card-body">
        //   <h5>Battle creds here!</h5>
        //   </div>
        // </div>
    }

    // List of characters we know have descriptions in Marvel.
    var characters = [
        "Spider-Man", "Thor", "Hulk", "Wolverine", "Thanos",
        "Loki", "Magneto", "Cyclops", "Deadpool", "Iron-Man", "Captain-America"
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


    $("#submit").on("click", (e) => {
        e.preventDefault();

        //If numOfChars < 2
        //      do the stuff
        //      at end of stuff increment numOfChars by 1
        // Choose a random character from the pool that we know have descriptions.
        var charIndex = Math.floor(Math.random() * 15);
        var chartoSearch = characters[charIndex];
        console.log(chartoSearch);

        // Check firebase to see if character exists
        database.ref("characters/").orderByChild("name").equalTo(chartoSearch).once("value", snapshot => {
            if (snapshot.exists()) {
                var snap = snapshot.val(); // Why doesn't this work??
                snap = snap[Object.keys(snap)[0]]
                console.log("IT WORKED! ",  snap);
                createCharCard(snap);
                // Call createCharCard and pass it the character node in firebase


            } else {
                // Create the character based on calls

                // Marvel Query Built
                var marvelQuery = "https://gateway.marvel.com:443/v1/public/characters?name=" + chartoSearch + "&limit=2&apikey=" + marvelKey;
                // Giphy Query Built
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
                        // Call createCharCard and pass it the character node in firebase

                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            }
        });
    })

    // Define on-click for class of cards, use data-name
    $(".winner").on("click", (e) => {
        // This card was chosen to win the battle!
        // Increment the battlecred by one!
        // Hide the other card, make a call to Marvel to post some comics they are in!?
        // This can be used as a reset of the game on a timeout of like 20 seconds.
    })
})