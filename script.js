this.mockData = [
		{
			id : 0,
			title : "(Default notebook)",
			notes : [
				{
					id : 0,
					title : "note1",
					text : "asda"
				},
				{
					id : 1,
					title : "note2",
					text : "note2 asdasd"
				}
			]
		},
		{
			id : 1,
			title : "College",
			notes : [
				{
					id : 0,
					title : "Biology",
					text : "Lorem ipsu, adsa, bulshit ala bala"
  			},
  			{
  				id : 1,
  				title : "Mathematics",
  				text : "some other bullshit ala bala"
  			}
			]
		},
		{
			id : 2,
			title : "Diary",
			notes: [
				{
					id : 0,
					title : "Yestarday",
					text : "Blq lbqlbql lorem ipsum"
  			},
  			{
  				id : 1,
  				title : "Last week",
  				text : "bqlbqllqlew random text"
  			}
			]
		}
	];

this.currentlySelectedNote = {
	noteBookId : 0,
	noteId : 0
}

$(document).ready(function () {
  //On init function
    //Mock data

  	//Load notebooks
  	mockData.forEach(function(notebook) {
  		if (notebook.id != 0) {
  			$("#noteBooksNavList").append('<li id=' + "noteBook" + notebook.id + '><a class="listItems leftItems" href="#" onclick="onNoteBookClick(' + notebook.id + ')">' + notebook.title +
  			'</a><a class="listItems smallDelete" href="#deleteNoteBook"><img class="small-buttons" src="img/delete-button.png"</a></li>');
  		} else {
  			$("#noteBooksNavList").append('<li id=' + "noteBook" + notebook.id + '><a class="listItems leftItems" href="#" onclick="onNoteBookClick(' + notebook.id + ')">' + notebook.title +
  			'</a></li>');
  		}
  		
  	})

  	onNoteBookClick(0);
  	onNoteClick(0, 0);
});

function onNoteBookClick(notebookId) {
	var clickedNoteBook = getNoteBookById(notebookId);
	
	//Load notes
	var ulNotes = $("#notesNavList");
	ulNotes.find('li').slice(2).remove();
	
	clickedNoteBook.notes.forEach(function (note) {	
		ulNotes.append('<li id=' + "note" +  note.id + '><a href="#" onclick="(function() {onNoteClick(' + clickedNoteBook.id + "," + note.id + ')})()">' + note.title + '</a></li>');
	})

	onNoteClick(clickedNoteBook.id, 0);
}

function onNoteBookCreate(newNotebookTitle) {
	var prevId = mockData[mockData.length - 1].id;
	var newNoteBook = {
		id : prevId + 1,
		title : newNotebookTitle,
		notes : []
	}
	mockData.push(newNoteBook);
	$("#noteBooksNavList").append('<li id='+ "noteBook" + newNoteBook.id + '><a class="listItems leftItems" href="#" onclick="onNoteBookClick(' + newNoteBook.id + ')">' + newNoteBook.title +
		'</a><a class="listItems smallDelete" href="#deleteNoteBook"><img class="small-buttons" src="img/delete-button.png"</a></li>');
	onNoteBookClick(newNoteBook.id);
}

function onNoteCreate(newNoteTitle) {
	var noteBook = getNoteBookById(currentlySelectedNote.noteBookId);
	var prevId;
	if (noteBook.notes.length == 0) {
		prevId = -1;
	} else {
		prevId = noteBook.notes[noteBook.notes.length -1].id;
	}
	var newNote = {
		id : prevId + 1,
		title : newNoteTitle,
		text : ""
	}
	noteBook.notes.push(newNote);
	$("#notesNavList").append('<li id=' + "note" + newNote.id + '><a href="#" onclick="onNoteClick(' + noteBook.id + ", " + newNote.id + ')">' + newNote.title + '</a></li>');
	onNoteClick(noteBook.id, newNote.id);
}

function onNoteClick(noteBookId, noteId) {
	var note = getNoteById(noteBookId, noteId);
	if (note) {
		tinymce.get('noteText').setContent(note.text);
		updateSelection(noteBookId, noteId);
	} else {
		tinymce.get('noteText').setContent("");
		updateSelection(noteBookId, undefined);
	}

	
}

function onSaveClick() {
	var note = getNoteById(currentlySelectedNote.noteBookId, currentlySelectedNote.noteId);
	if (note) {
		note.text = tinymce.get('noteText').getContent();
	}
}

function onDeleteNote() {
	var noteForDelete = getNoteById(currentlySelectedNote.noteBookId, currentlySelectedNote.noteId);
	var noteBook = getNoteBookById(currentlySelectedNote.noteBookId);
	noteBook.notes = noteBook.notes.filter(function (note) {
		return note.id != noteForDelete.id;
	});

	$('#note' + noteForDelete.id)[0].remove();
	onNoteClick(noteBook.id, 0);
}

function onDeleteNoteBook() {
	var noteBookForDelete = getNoteBookById(currentlySelectedNote.noteBookId);
	mockData = mockData.filter(function(noteBook) {
		return noteBook.id != noteBookForDelete.id;
	});

	$('#noteBook' + noteBookForDelete.id)[0].remove();
	onNoteBookClick(0, 0);
}

//UTILS

function getNoteBookById(id) {
	return this.mockData.filter(function (noteBook) {
			return noteBook.id == id;
		})[0];
}

function getNoteById(noteBookId, noteId) {
	var notebook = this.mockData.filter(function (noteBook) {
			return noteBook.id == noteBookId;
	})[0];

	return notebook.notes.filter(function(note) {
		return note.id == noteId;
	})[0];
}

function updateSelection(noteBookId, noteId) {
	var noteUlId = noteId + 2;
	var noteBookUlId = noteBookId + 2;

	$("#notesNavList li").removeClass("selected");
	$('#notesNavList li:eq(' + noteUlId + ')').addClass("selected");
	$("#noteBooksNavList li").removeClass("selected");
	$('#noteBooksNavList li:eq(' + noteBookUlId + ')').addClass("selected");

	currentlySelectedNote = {
		noteBookId : noteBookId,
		noteId : noteId
	}
}