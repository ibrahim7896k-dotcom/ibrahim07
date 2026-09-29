const form =
    document.getElementById("comicForm");

const result =
    document.getElementById("result");

const errorBox =
    document.getElementById("errorBox");

const generateBtn =
    document.getElementById("generateBtn");

const buttonText =
    document.getElementById("buttonText");

const loader =
    document.getElementById("loader");


form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        hideError();

        result.classList.add("hidden");

        generateBtn.disabled = true;

        buttonText.textContent =
            "Creating your comic...";

        loader.classList.remove(
            "hidden"
        );


        const payload = {

            topic:
                document
                    .getElementById("topic")
                    .value,

            genre:
                document
                    .getElementById("genre")
                    .value,

            tone:
                document
                    .getElementById("tone")
                    .value,

            audience:
                document
                    .getElementById("audience")
                    .value,

            panels:
                Number(
                    document
                        .getElementById("panels")
                        .value
                ),

            characters:
                document
                    .getElementById("characters")
                    .value

        };


        try {

            const response =
                await fetch(
                    "/api/generate",
                    {

                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Something went wrong."
                );

            }


            renderComic(data);

            result.classList.remove(
                "hidden"
            );

            result.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "start"
            });


        } catch(error) {

            showError(
                error.message
            );

        } finally {

            generateBtn.disabled =
                false;

            buttonText.textContent =
                "✨ Create My Comic";

            loader.classList.add(
                "hidden"
            );

        }

    }
);


function renderComic(comic) {

    document.getElementById(
        "comicTitle"
    ).textContent =
        comic.title ||
        "Untitled Comic";


    document.getElementById(
        "logline"
    ).textContent =
        comic.logline ||
        "";


    const charactersList =
        document.getElementById(
            "charactersList"
        );

    charactersList.innerHTML =
        "";


    (
        comic.characters ||
        []
    ).forEach(
        function(character) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "character";


            card.innerHTML = `

                <strong>
                    ${escapeHtml(
                        character.name
                    )}
                </strong>

                <div class="role">

                    ${escapeHtml(
                        character.role
                    )}

                </div>

                <p>

                    ${escapeHtml(
                        character.description
                    )}

                </p>

            `;


            charactersList.appendChild(
                card
            );

        }
    );


    const panelsList =
        document.getElementById(
            "panelsList"
        );

    panelsList.innerHTML =
        "";


    (
        comic.panels ||
        []
    ).forEach(
        function(panel) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "panel";


            const dialogue =
                (
                    panel.dialogue ||
                    []
                )
                .map(
                    function(line) {

                        return `

                            <div class="bubble">

                                <b>
                                    ${escapeHtml(
                                        line.character
                                    )}:
                                </b>

                                ${escapeHtml(
                                    line.text
                                )}

                            </div>

                        `;

                    }
                )
                .join("");


            card.innerHTML = `

                <div class="panel-number">

                    PANEL
                    ${panel.panel}

                </div>


                <div class="scene">

                    ${escapeHtml(
                        panel.scene
                    )}

                </div>


                ${
                    panel.narration

                    ?

                    `
                    <div class="narration">

                        ${escapeHtml(
                            panel.narration
                        )}

                    </div>
                    `

                    :

                    ""
                }


                ${
                    dialogue

                    ?

                    `
                    <div class="dialogue">

                        ${dialogue}

                    </div>
                    `

                    :

                    ""
                }


                <div class="image-prompt">

                    <strong>
                        AI Image Prompt:
                    </strong>

                    <br>

                    ${escapeHtml(
                        panel.image_prompt ||
                        ""
                    )}

                </div>

            `;


            panelsList.appendChild(
                card
            );

        }
    );

}


function escapeHtml(value) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function showError(message) {

    errorBox.textContent =
        "Error: " +
        message;

    errorBox.classList.remove(
        "hidden"
    );

}


function hideError() {

    errorBox.classList.add(
        "hidden"
    );

    errorBox.textContent =
        "";

}


document
    .getElementById("printBtn")
    .addEventListener(
        "click",
        function() {

            window.print();

        }
    );
