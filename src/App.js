import './App.css';
import Bio from "./Bio"
import React from "react"

const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
    document.body.classList.add("dark-theme");
}

function generateRandomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    return alphabet[Math.floor(Math.random() * alphabet.length)]
}

function scrambleMap() {
    let scrambled = {
        "a": "a",
        "b": "b",
        "c": "c",
        "d": "d",
        "e": "e",
        "f": "f",
        "g": "g",
        "h": "h",
        "i": "i",
        "j": "j",
        "k": "k",
        "l": "l",
        "m": "m",
        "n": "n",
        "o": "o",
        "p": "p",
        "q": "q",
        "r": "r",
        "s": "s",
        "t": "t",
        "u": "u",
        "v": "v",
        "w": "w",
        "x": "x",
        "y": "y",
        "z": "z",
    };
    let usedLetters = "";
    for (const letter in scrambled) {
        let newLetter = generateRandomLetter();
        while (usedLetters.includes(newLetter) || newLetter === letter) {
            newLetter = generateRandomLetter()
        }
        usedLetters = usedLetters + newLetter
        scrambled[letter] = newLetter
    }
    return scrambled;
}

function getFrequency(quote) {
    let freq = {};
    for (let i = 0; i < quote.length; i++) {
        const character = quote.charAt(i);
        if (freq[character]) {
            freq[character]++;
        } else {
            freq[character] = 1;
        }
    }
    return freq;
}

function App() {
    let words = [];

    const [data, setData] = React.useState(null)

    async function updateQuote() {
        try {
            const response = await fetch("https://api.quotable.io/random");
            const {statusCode, statusMessage, ...data} = await response.json();
            if (!response.ok) throw new Error(`${statusCode} ${statusMessage}`);
            setData(data);
        } catch (error) {
            // If the API request failed, log the error to console and update state
            // so that the error will be reflected in the UI.
            console.error(error);
            setData({content: "Oops... Something went wrong"});
        }
    }

    // Run `updateQuote` once when component mounts
    React.useEffect(() => {
        updateQuote();
    }, []);

    if (!data) return null;

    let frequency = getFrequency(data.content.toLowerCase())
    let scrambled = scrambleMap()

    let wordArr = data.content.split(" ");
    for (let i = 0; i < wordArr.length; i++) {
        let word = [];
        for (let j = 0; j < wordArr[i].length; j++) {
            let regex = new RegExp(/[a-zA-Z]/);
            if (regex.test(data.content.split(" ")[i][j])) {
                word[j] = <div className={"quoteBlock"} key={j}>
                    <textarea maxLength={1} className={"quoteText"} onKeyUp={triggerTab}/>
                    <p className={"scrambledText"}>{scrambled[wordArr[i][j].toLowerCase()].toUpperCase()}</p>
                    <p className={"letterCount"}>{frequency[wordArr[i][j].toLowerCase()]}</p>
                </div>
            } else {
                word[j] = <div className={"quotePunct"} key={j}>
                    <textarea maxLength={1} className={"punct"}/>
                    <p>{wordArr[i][j]}</p>
                    <p className={"punct"}>blank</p>
                </div>
            }
        }
        words[i] = <div className={"word"} id={i} key={i}>
            {word}
        </div>;
    }

    function triggerTab(event) {
        // //Note that this doesn't honour tab-indexes
        //
        // event.preventDefault();
        //
        // //Isolate the node that we're after
        // const currentNode = event.target;
        //
        // //find all tab-able elements
        // const allElements = document.querySelectorAll("textarea");
        //
        // //Find the current tab index.
        // const currentIndex = Array.prototype.findIndex.call(allElements, el => currentNode.isEqualNode(el))        // const currentIndex = allElements.get(allElements.index(document.activeElement) + 1)
        // console.log(currentIndex)
        // console.log(document.activeElement)
        //
        // //focus the following element
        // const targetIndex = (currentIndex + 1) % allElements.length;
        // allElements[targetIndex].focus();
    }

    function checkAnswer() {
        let userAnswer = "";
        let answer = data.content.replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, "").toLowerCase();
        let textareaList = document.getElementsByTagName("textarea");
        for (let i = 0; i < textareaList.length; i++) {
            userAnswer += textareaList[i].value
        }
        console.log(userAnswer)
        if (userAnswer === answer) {
            let x = document.getElementById("tryAgain");
            x.style.display = "none";

            let y = document.getElementById("congratulations");
            y.style.display = "block";
        } else {
            let x = document.getElementById("tryAgain");
            x.style.display = "block";

            let y = document.getElementById("congratulations");
            y.style.display = "none";
        }
    }

    function reset() {
        let textareaList = document.getElementsByTagName("textarea");
        for (let i = 0; i < textareaList.length; i++) {
            textareaList[i].value = "";
        }
        let x = document.getElementById("tryAgain");
        x.style.display = "none";

        let y = document.getElementById("congratulations");
        y.style.display = "none";
    }

    function help() {
        let x = document.getElementById("help");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    function toggleMode() {
        const btn = document.querySelector(".btn-toggle");

        const currentTheme = localStorage.getItem("theme");
        if (currentTheme === "dark") {
            document.body.classList.add("dark-theme");
        }

        btn.addEventListener("click", function () {
            document.body.classList.toggle("dark-theme");

            let theme = "light";
            if (document.body.classList.contains("dark-theme")) {
                theme = "dark";
            }
            localStorage.setItem("theme", theme);
        });
    }

    // function postToTwitter(){
    // const OAuth = require('oauth');
    //
    // const twitter_application_consumer_key = 'y0Njrh6HsfuuPabkUd37LYJN9';  // API Key
    // const twitter_application_secret = 'yuEBf3rZey36w9piqlIO4NZWYFzYMpZhjFWELFzohlSJw26snq';  // API Secret
    // const twitter_user_access_token = '1068275224246927361-toIQphfqBeuWND6j0ix5raQjVzqZja';  // Access Token
    // const twitter_user_secret = 'FdyN15mvLWvL60zXJvg30oyg18Kxd6XubzmlyUwt8n7yS';  // Access Token Secret
    //
    // const oauth = new OAuth.OAuth(
    //     'https://api.twitter.com/oauth/request_token',
    //     'https://api.twitter.com/oauth/access_token',
    //     twitter_application_consumer_key,
    //     twitter_application_secret,
    //     '1.0A',
    //     null,
    //     'HMAC-SHA1'
    // );
    //
    // const status = "";
    // // let status = "I deciphered a quote playing Cryptograms;  // This is the tweet (ie status)
    //
    // const postBody = {
    //     'status': status
    // }
    //
    // // console.log('Ready to Tweet article:\n\t', postBody.status);
    // oauth.post('https://api.twitter.com/1.1/statuses/update.json',
    //     twitter_user_access_token,  // oauth_token (user access token)
    //     twitter_user_secret,  // oauth_secret (user secret)
    //     postBody,  // post body
    //     '',  // post content type ?
    //     function(err, data, res) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             // console.log(data);
    //         }
    //     });
    // }

    return (
        <div className={"cryptograms"}>
            <div className={"header"}>
                <h1> Cryptograms</h1>
                <div className={"help-button"}>
                    <button onClick={help}>Help</button>
                    <button className="btn-toggle" onClick={toggleMode}>Toggle Theme</button>
                </div>
            </div>
            <div id={"help"} style={{display: "none"}}>
                <p className={help}>Welcome to Cryptograms, a cryptography game where a secret message has been encoded
                    with a monoalphabetic substitution cipher.
                    This means that every letter has been changed to a different letter. For example, every "a" could
                    have been transformed into a "j".
                    A letter cannot be transformed into itself. Good luck and happy decoding!</p>
            </div>
            <Bio author={data.author}/>
            <div className={"quote"} id={"quote"}>{words}</div>
            {/*<p>{data.content + " -" + data.author}</p>*/}
            <div>
                <p id={"tryAgain"} style={{display: "none"}}>Something was incorrect. Try Again</p>
                <div id={"congratulations"} style={{display: "none"}}>
                    <p>Congratulations! You deciphered the code</p>
                    {/*<button onClick={postToTwitter}>Post to Twitter</button>*/}
                </div>
            </div>
            <div className={"multi-button"}>
                <button className={"checkAnswer"} onClick={checkAnswer}>Check Answer</button>
                <button className={"reset"} onClick={reset}>Reset</button>
                <button className={"newPuzzle"} onClick={function (event) {
                    updateQuote();
                    reset()
                }}>New Puzzle
                </button>
            </div>
        </div>
    )
}

export default App;