let NotesData = [];

// local storage

const accessLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem("notes"));
    if (data == null) {
        localStorage.setItem("notes", JSON.stringify(NotesData));
    } else {
        NotesData = data;
    }
}

const setLocalStorage = () => {
    localStorage.setItem("notes", JSON.stringify(NotesData));
}

let maxCount = 10;

const colors = {
    color1: "rgb(229,205,233)",
    color2: "rgb(252,252,252)",
    color3: "rgb(247,204,127)",
    color4: "rgb(230,237,256)",
    color5: "rgb(243,171,145)",
    color6: "rgb(216,243,175)",
}

let alreadySelectedElement;
var localNote = {
    id: NotesData.length,
    title: "",
    img_url: "",
    date: "",
    content: "",
    color: "rgb(229,205,233)",
    edit: false
}


var inputElements = [
    {
        element: "input",
        className: "notes-title-input notes-data",
        attributes: {
            type: "text",
            value: "",
            name: "title",
            placeholder: "Notes Title"
        }

    },
    {
        element: "input",
        className: "notes-data",
        attributes: {
            type: "text",
            value: "",
            name: "img_url",
            placeholder: "Add image URL",
        }


    },
    {
        element: "textarea",
        className: "notes-data",
        attributes: {
            value: "",
            name: "content",
            placeholder: "Add Content Here",
            rows: "20"
        }
    }
]

const deleteDialog = {
    deleteOne: {
        value: 0,
        heading: " Are you sure you want to delete this note?",
        class: "confirm-delete",
        for: "one"
    },
    deleteAll: {
        value: 0,
        heading: " Are you sure you want to delete all the notes?",
        class: "confirm-delete",
        for: "all"
    }
}

const mainContainer = document.querySelector(".main-container");


// month
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// function for create elements
const createElement = (type, className, components = {}, userDefined = "") => {
    let element = document.createElement(type);
    element.className = className;
    for (let iterator in components) {
        element[iterator] = components[iterator];
    }

    if (userDefined !== {}) {
        for (let iterator in userDefined) {
            element.setAttribute(iterator, userDefined[iterator]);
        }
    }

    return element;
}

// Create single card

const createSingleCard = (data) => {
    let card = createElement("div", "card", {}, { "data-id": data.id, "style": "background-color:" + data.color });
    let cardCover = createElement("div", "card-cover")
    card.appendChild(cardCover);
    let cardHeader = createElement("h1", "card-header", { "textContent": data.title });
    card.appendChild(cardHeader);
    let cardDate = createElement("p", "card-date", { "textContent": data.date });
    card.appendChild(cardDate);
    if (data.img_url != "") {
        let imgHolder = createElement("div", "card-image-holder");
        let img = createElement("img", "", { "src": data.img_url, "alt": data.title });
        imgHolder.append(img);
        card.appendChild(imgHolder);
    }
    let cardDescrp = createElement("p", "card-descrp", { "textContent": data.content });
    card.appendChild(cardDescrp);
    return card;
}

// time function
const getTime = () => {
    let date = new Date();
    return month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
}

const empytyLocalData = () => {

    for (const i in localNote) {
        localNote[i] = "";
    }
    localNote.edit = false;
    localNote.color = "rgb(229,205,233)";
}


// access dom 
const insertMain = (element) => {
    mainContainer.appendChild(element);
}
const clearMain = () => {
    mainContainer.replaceChildren();
}



// showing notes in 1st page
const showNotes = () => {
    console.log(NotesData.length);
    let buttonFragment = document.createDocumentFragment();
    let deleteAll = createElement("button", "delete", { "textContent": "DELETE ALL" });
    let newbutton = createElement("button", "new", { "textContent": "NEW" });
    buttonFragment.append(deleteAll, newbutton);
    document.querySelector(".buttons-holder").replaceChildren(buttonFragment);
    document.querySelector(".arrow").style.display = "none";


    if (NotesData.length == 0) {
        document.querySelector(".delete").style.display = "none";
    }


    let count = 0;
    clearMain();
    let section = createElement("section", "cards-holder", {});
    let fragment = document.createDocumentFragment();
    for (; count < NotesData.length & count < maxCount; count++) {
        fragment.appendChild(createSingleCard(NotesData[count]));

    }

    // elements of card
    section.appendChild(fragment);
    const loadMore = createElement("button", "load-more", { "textContent": "Load More" });

    insertMain(section);
    if (count >= maxCount) {
        insertMain(loadMore)
        document.querySelector(".load-more").addEventListener("click", () => {
            maxCount += 10;
            for (let i = 0; i < maxCount; i++) {
                showNotes();
            }

        })
    }
    document.querySelectorAll(".card-cover").forEach(card => card.addEventListener("click", (e) => {
        let index = (NotesData.length - 1) - parseInt(e.target.parentNode.getAttribute("data-id"));
        showNotesContent(index);
    }))

    // new note
    document.querySelector(".new").addEventListener("click", () => displayNotesForm());
    document.querySelector(".delete").addEventListener("click", (e) => {
        let deleteData = deleteDialog.deleteAll;
        displayDeleteConfirm(deleteData)
    });

}


// show notes content on onclick
const showNotesContent = (index) => {
    document.querySelector(".arrow").style.display = "block";
    let section = createElement("section", "single-card-page");
    let fragment = document.createDocumentFragment();

    let cardHeader = createElement("div", "card-page-header");
    // color div
    let colorHolder = createElement("div", "card-color", {}, { "style": "background-color:" + NotesData[index].color });
    cardHeader.appendChild(colorHolder);
    // header data
    let headerdata = createElement("div", "card-page-header-data");
    let h1 = createElement("h1", "", { "textContent": NotesData[index].title });
    let notesDate = createElement("p", "card-page-date", { "textContent": NotesData[index].date });
    headerdata.append(h1, notesDate);
    cardHeader.appendChild(headerdata);

    // card contents Holder
    let cardContents = createElement("div", "card-content-holder");
    if (NotesData[index].img_url !== "") {
        let cardImgHolder = createElement("div", "card-image");
        let img = createElement("img", "", { "src": NotesData[index].img_url });
        cardImgHolder.appendChild(img);
        cardContents.appendChild(cardImgHolder);
    }

    let p = createElement("p", "card-written-data", { "textContent": NotesData[index].content });
    cardContents.appendChild(p);

    fragment.append(cardHeader, cardContents);
    section.appendChild(fragment);
    clearMain();
    insertMain(section);

    let buttonFragment = document.createDocumentFragment();
    let deleteButton = createElement("button", "delete", { "textContent": "DELETE" }, { "data-id": NotesData[index].id });
    let editButton = createElement("button", "new", { "textContent": "EDIT" });
    buttonFragment.replaceChildren(deleteButton, editButton);
    document.querySelector(".buttons-holder").replaceChildren(buttonFragment);

    // new note
    document.querySelector(".new").addEventListener("click", () => {
        localNote = { ...NotesData[index], edit: true };
        displayNotesForm()
    });
    document.querySelector(".delete").addEventListener("click", () => {
        let deleteData = deleteDialog.deleteOne;
        deleteData.value = NotesData[index].id;
        displayDeleteConfirm(deleteData)
    });
}

// Reusable form elements
const formHeader = (heading) => {
    let closeBox = createElement("div", "close-box");
    let h1 = createElement("h1", "", { "textContent": heading });
    let closebutton = createElement("button", "close-box-button");
    let closeIcon = createElement("i", "fa-solid fa-xmark ");
    closebutton.appendChild(closeIcon);
    closeBox.append(h1, closebutton);
    return closeBox;
}

const createDialogContainer = () => {
    let alertBoxContainer = createElement("div", "alertbox-holder");
    let blur = createElement("div", "blur");
    alertBoxContainer.appendChild(blur);
    return alertBoxContainer;

}

// display dialog
const displayNotesForm = () => {
    let container = createDialogContainer();
    // elememt inserted in middle
    // form holder
    let notesDetailsBox = createElement("div", "notes-details-box");
    // header
    notesDetailsBox.appendChild(formHeader("NEW NOTE"));
    // create form
    let inputFragment = document.createDocumentFragment();
    let form = createElement("form", "notes-details-box-form");
    let topForm = createElement("div", "form-top");
    inputElements.forEach(i => {
        let inputElement = createElement(i.element, i.className, { "value": localNote[i.attributes.name] }, i.attributes);
        inputFragment.appendChild(inputElement);
    })
    topForm.appendChild(inputFragment);
    let bottomForm = createElement("div", "form-bottom");
    let colorHolder = createElement("div", "color-holder");

    for (const iterator in colors) {
        let div = createElement("div", "color-circle", {}, { "style": "background-color:" + colors[iterator] });
        let tick = createElement("i", "fa-solid fa-check tick");
        div.appendChild(tick)
        if (localNote.color == colors[iterator]) {
            alreadySelectedElement = div;
        }
        colorHolder.appendChild(div);
    }
    let add = createElement("button", "add-card ", { "textContent": "ADD", "type": "button" });
    bottomForm.append(colorHolder, add);
    form.append(topForm, bottomForm);
    notesDetailsBox.appendChild(form)
    container.appendChild(notesDetailsBox);
    // alert  box holder
    mainContainer.insertAdjacentElement("afterend", container)

    document.querySelectorAll(".color-circle").forEach(i => i.addEventListener("click", (el) => {
        let element = el.target;
        if (alreadySelectedElement === undefined) {
            alreadySelectedElement = element;
            element.childNodes[0].classList.add("appear");
            localNote.color = element.style.backgroundColor.split(' ').join('')


        } else {
            alreadySelectedElement.childNodes[0].classList.remove("appear");
            element.childNodes[0].classList.add("appear");
            alreadySelectedElement = element;
            localNote.color = element.style.backgroundColor.split(' ').join('')
        }
    }))
    alreadySelectedElement.click();

    //    close listner
    document.querySelector(".close-box-button").addEventListener("click", () => {
        container.remove()
        if (localNote.edit) empytyLocalData();


    })

    //    color choose
    document.querySelector(".add-card").addEventListener("click", (e) => {
        for (const iterator of ["title", "img_url", "content"]) {
            localNote[iterator] = document.getElementsByName(iterator)[0].value;
        }
        localNote.date = getTime();
        if (localNote.edit) {
            NotesData[localNote.id] = localNote;
            setLocalStorage(NotesData);
            container.remove();
            showNotesContent(localNote.id);
        } else {
            localNote.id = NotesData.length;
            NotesData.unshift(localNote);
            setLocalStorage(NotesData);
            accessLocalStorage();
            container.remove();
            showNotes();
            empytyLocalData();

        }

    })



}

const displayDeleteConfirm = (data) => {
    let container = createDialogContainer();
    // elememt inserted in middle
    let deleteConfirmBox = createElement("div", "delete-confirm-box", {}, { "data-index": data.value });
    deleteConfirmBox.appendChild(formHeader("CONFIRM DELETE"));
    let deleteMessage = createElement("div", "delete-message-container");
    let h1 = createElement("div", "", { "textContent": data.heading });
    let button = createElement("button", data.class, { "textContent": "YES DELETE!" });
    deleteMessage.append(h1, button);
    deleteConfirmBox.appendChild(deleteMessage);

    container.appendChild(deleteConfirmBox);
    // alert  box holder
    mainContainer.insertAdjacentElement("afterend", container)
    //    close listner
    document.querySelector("." + data.class).addEventListener("click", (e) => {
        if (data.for === "one") {
            const index = e.target.parentNode.parentNode.getAttribute("data-index");
            NotesData.splice(index, 1)
            setLocalStorage(NotesData);
            container.remove();
            showNotes(NotesData);
        } else {
            NotesData = []
            setLocalStorage(NotesData);
            accessLocalStorage();
            container.remove();
            showNotes();

        }

    })


    document.querySelector(".close-box-button").addEventListener("click", (e) => {
        container.remove()
        empytyLocalData();
    })

}


// onload
window.addEventListener("load", () => {
    accessLocalStorage();
    setLocalStorage(NotesData);
    showNotes();
})

document.querySelector(".arrow").addEventListener("click", () => {
    showNotes();
})