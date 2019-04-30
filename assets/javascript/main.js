
$(document).ready(function () {

    function createCharCard(snapshot) {
        var cardName = snapshot.name;
        var cardDescription = snapshot.description;
        var cardBattleCreds = snapshot.battlecred;
        var cardIMG = snapshot.gif;

        // Create a card with class _____ and data-name = cardName
        // set the card aspects according to the above variables
        // append it to the div on the page
    }


    var characters = [
        "Spider-Man", "Thor", "Hulk", "Iron-Man", "Wolverine", "Thanos",
        "Loki", "Magneto", "Cyclops", "Superman", "Black-Widow"
    ];


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

    // Marvel Key
    const marvelKey = "3825528115714235769b996819f21ef0";
    // Giphy Key
    const giphyKey = "F0y8OeTPpYSZkVLz2fLvNXdxqtpfpPSp";


    $("#submit").on("click", (e) => {
        e.preventDefault();
        // Choose a random character from the pool that we know have descriptions.
        var charIndex = Math.floor(Math.random() * 9);
        var chartoSearch = characters[charIndex];
        console.log(chartoSearch);

        // Check firebase to see if character exists
        database.ref("characters/").orderByChild("name").equalTo(chartoSearch).once("value", snapshot => {
            if (snapshot.exists()) {
                var snap = snapshot.val(); // Why doesn't this work??
                console.log("IT WORKED! " + snap);
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
    $(".charcard").on("click", (e) => {
        // This card was chosen to win the battle!
        // Increment the battlecred by one!
        // Hide the other card, make a call to Marvel to post some comics they are in!?
        // This can be used as a reset of the game on a timeout of like 20 seconds.
    })
})