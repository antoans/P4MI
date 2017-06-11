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
  		$("#noteBooksNavList").append('<li><a href="#" onclick="onNoteBookClick(' + notebook.id + ')">' + notebook.title + '</a></li>');
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
		ulNotes.append('<li id='+ note.id + '><a href="#" onclick="(function() {onNoteClick(' + clickedNoteBook.id + "," + note.id + ')})()">' + note.title + '</a></li>');
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
	$("#noteBooksNavList").append('<li id='+ newNoteBook.id + '><a href="#" onclick="onNoteBookClick(' + newNoteBook.id + ')">' + newNoteBook.title + '</a></li>');
	onNoteBookClick(newNoteBook.id);
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

	$('#' + noteForDelete.id)[0].remove();
	onNoteClick(noteBook.id, 0);
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
	currentlySelectedNote = {
		noteBookId : noteBookId,
		noteId : noteId
	}
}