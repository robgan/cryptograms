import "./Bio.css"
import React from "react";

function Bio(author) {
    const [bio, setBio] = React.useState(null);

    async function updateBio() {
        try {
            const response = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + author.author.split(" ").join("_"));
            const {statusCode, statusMessage, ...bio} = await response.json();
            if (!response.ok) throw new Error(`${statusCode} ${statusMessage}`);
            setBio(bio);
        } catch (error) {
            // If the API request failed, log the error to console and update state
            // so that the error will be reflected in the UI.
            console.error(error);
            setBio({content: "Oops... Something went wrong"});
        }
    }

    React.useEffect(() => {
        updateBio();
    }, [author]);

    if (!bio) return null;

    return (
        <div className={"description"}>
            <p>{"Quote by " + author.author}</p>
            <p className={"biography"}>{bio.extract}</p>
        </div>
    )
}

export default Bio