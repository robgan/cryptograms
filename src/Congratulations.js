import React from "react";

function Congratulations() {
    return (
        <div className={"description"}>
            <p>{"Quote by " + author.author}</p>
            <p className={"biography"}>{bio.extract}</p>
        </div>
    )
}

export default Congratulations