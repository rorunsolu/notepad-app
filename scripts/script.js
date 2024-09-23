function popup() {
    const popupContainer = document.createElement("div");

    popupContainer.innerHTML = `
        <div id="popupContainer">

            <h1>New Note</h1>
            <textarea id="note-text" class="note-textarea" placeholder="Enter your note..."></textarea>

            <div id="btncontainer">
                <button id="submitBtn" onclick="createNote()">Add Note</button>
                <button id="closeBtn" onclick="closePopup()">Cancel</button>
            </div>

        </div>
    `;

    document.body.appendChild(popupContainer);
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if (popupContainer) {
        popupContainer.remove();
    }
}

function createNote() {
    const popupContainer = document.getElementById("popupContainer");
    const noteText = document.getElementById("note-text").value;

    if (noteText.trim() !== "") {
        const note = {
            id: new Date().getTime(),
            text: noteText
        };

        //converts the JSON string to readable JS 
        const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];

        // adds new note to the end of the list
        //existingNotes.push(note);
        // now ads the new note tot he start of the list
        existingNotes.unshift(note);

        // converts the note back to a JSON string and stores it
        localStorage.setItem("notes", JSON.stringify(existingNotes));

        // sets the value to an empty string
        document.getElementById("note-text").value = "";

        popupContainer.remove();
        displayNotes();
    }

    else {
        errorPopup();
    }
}

function errorPopup() {
    const errorModal = document.createElement("div");

    errorModal.innerHTML = `
    <div class="error-container">

        <div id="js-error-modal">

            <p>Please add some text to the note</p>
            <button id="closeBtn" onclick="closeModal()">Close</button>
            
        </div>

    </div>

        `;

    document.body.appendChild(errorModal);
};

function closeModal() {
    const errorModal = document.getElementById("js-error-modal");
    const errorContainer = document.querySelector(".error-container");

    if (errorModal) {
        errorModal.remove();
        errorContainer.remove();
    }
}

function displayNotes() {
    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = "";

    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.forEach(note => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <p>${note.text}</p>

            <div id="noteBtns-container">

                <button id="editBtn" onclick="editNote(${note.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button id="deleteBtn" onclick="deleteNote(${note.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
        `;
        notesList.appendChild(listItem);
    });
}

function editNote(noteId) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteToEdit = notes.find(note => note.id == noteId);
    const noteText = noteToEdit ? noteToEdit.text : "";
    const editingPopup = document.createElement("div");

    editingPopup.innerHTML = `
        <div id="editing-container" data-note-id="${noteId}">

            <h1>Edit Note</h1>

            <textarea id="note-text" class="note-textarea">${noteText}</textarea>

            <div id="btn-container">
                <button id="submitBtn" onclick="updateNote()">Done</button>
                <button id="closeBtn" onclick="closeEditPopup()">Cancel</button>
            </div>

        </div>
    `;

    document.body.appendChild(editingPopup);
}

function closeEditPopup() {
    const editingPopup = document.getElementById("editing-container");

    // it will only close if the editing container (popup) exists
    if (editingPopup) {
        editingPopup.remove();
    }
}

function updateNote() {
    // the whitespace gets removed NOT the text
    const noteText = document.getElementById("note-text").value.trim();
    const editingPopup = document.getElementById("editing-container");

    // if the note IS NOT empty
    if (noteText !== "") {
        const noteId = editingPopup.getAttribute("data-note-id");
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        const updateNotes = notes.map(note => {

            // displays the required note if the note id matches
            if (note.id == noteId) {
                return { id: note.id, text: noteText };
            }
            return note;
        });

        localStorage.setItem("notes", JSON.stringify(updateNotes));

        editingPopup.remove();

        displayNotes();
    }
}

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes = notes.filter(note => note.id !== noteId);

    localStorage.setItem("notes", JSON.stringify(notes));

    displayNotes();
}

displayNotes();
