var btnReset = document.getElementById('reset');
btnReset.classList.add('btn', 'btn-primary');
var btnAdd = document.getElementById('add');
btnAdd.classList.add('btn', 'btn-primary');
var textOfNote = document.getElementById('text');
var dateOfNote = document.getElementById('date');
var user = document.getElementById('name');
var rowForNotes = document.getElementById('noteHere');


var notes = [];

btnReset.addEventListener('click', function(event) {
    textOfNote.value = '';
    dateOfNote.value = '';
    user.value = '';
});

btnAdd.addEventListener('click', function(event) { 
    
    var divForNotes = document.createElement('div');
    var newNote = document.createElement('div');
    var buttX = document.createElement('button');

    createNote(divForNotes, newNote, buttX);

    createTextInNote(newNote, textOfNote.value, user.value, dateOfNote.value);

    var addedNote = {
        text: textOfNote.value,
        creator: user.value,
        date: dateOfNote.value
    };

    notes.push(addedNote);

    var noteInLs = JSON.stringify(notes);
    write('notes_david', noteInLs);

    textOfNote.value = '';
    dateOfNote.value = '';
    user.value = '';

    delOneNote(buttX, newNote, divForNotes, notes);
    // console.log(notes);
});


function write(notes_david, value) {
    window.localStorage.setItem(notes_david, value);
}

function read(key) {
    var noteFromLs = window.localStorage.getItem(key);
    return JSON.parse(noteFromLs);
}

function init() {
    var initData = read('notes_david');
    if (initData != null) {
        for (var i = 0; i < initData.length; i++) {
            notes.push(initData[i])
            buildDomNote(initData[i]) ; 
        }   
    }
}



function buildDomNote(note) {

    var divForNotes = document.createElement('div');
    var newNote = document.createElement('div');
    var buttX = document.createElement('button');

    createNote(divForNotes, newNote, buttX);

    createTextInNote(newNote, note.text, note.creator, note.date);

    delOneNote(buttX, newNote, divForNotes, notes);

}

function setIdToButtonClose() {
    var notToDel = document.getElementsByClassName('note'); 
    for (var k = 0; k < notToDel.length; k++) {
        document.getElementsByClassName('spanClose')[k].id = k;
    } 
}

function delOneNote(buttX, newNote, divForNotes, notes) {
    buttX.addEventListener('click', function(event) {
        setIdToButtonClose();
        // console.log(event.target.id);
        newNote.remove();
        divForNotes.remove();
        var i = event.target.id;
        // console.log(notes);
        notes.splice(i, 1);
        var noteInLs = JSON.stringify(notes);
        write('notes_david', noteInLs);
    });
}

function createTextInNote(newNote, text, creator, deadline) {
    var areaForText = document.createElement('p');
    newNote.appendChild(areaForText);
    areaForText.innerText = text;

    var signOfUser = document.createElement('span');
    newNote.appendChild(signOfUser);
    signOfUser.innerText = creator;

    var dateOfUser = document.createElement('span');
    newNote.appendChild(dateOfUser);
    dateOfUser.innerText = deadline;
}

function createNote(divForNotes, newNote, buttX) {
    
    divForNotes.classList.add('col-md-3', 'col-sm-6');
    rowForNotes.appendChild(divForNotes);

    divForNotes.appendChild(newNote);
    newNote.style.backgroundImage = "url('styles/notebg.png')";
    newNote.classList.add('note');

    buttX.type = 'button';
    buttX.className = 'close';
    var spanOfButX = document.createElement('span');
    spanOfButX.className = 'spanClose';
    spanOfButX.innerHTML = '&times;';
    buttX.appendChild(spanOfButX);
    newNote.appendChild(buttX);
}

init();