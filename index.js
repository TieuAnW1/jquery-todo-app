const Text = {
	keysInLocalStorage: {
		todos: 'todos',
	},
};

$(document).ready(function () {
	$('#todoName').focus();
	renderTodoList();
	toggleAddButton();
});

$('#addButton').click(function (event) {
	event.preventDefault();

	const nameTodo = $('#todoName').val();
	const deadlineTodo = $('#todoDeadline').val();

	const newTodo = {
		id: Date.now(),
		nameTodo,
		deadlineTodo,
		isCompleted: false,
	};

	let todos = localStorage.getItem(Text.keysInLocalStorage.todos);
	if (todos) {
		todos = JSON.parse(todos);
		todos.push(newTodo);
	} else {
		todos = [newTodo];
	}
	localStorage.setItem(Text.keysInLocalStorage.todos, JSON.stringify(todos));

	renderTodoList();
	$('#todoName').val('');
	$('#todoDeadline').val('');
	$('#todoName').focus();
	toggleAddButton();
});

$('body').on('input', '#todoName, #todoDeadline', function () {
	toggleAddButton();
});

$('.listTodo').on('click', '.delete-icon', function () {
	let todoItem = $(this).closest('.itemTodo');
	let todoId = todoItem.data('id');
	let todoName = todoItem.find('span').text().slice(0, 20);

	let confirmMessage = 'Are you sure you want to delete todo with name "' + todoName + '"... ?';

	if (confirm(confirmMessage)) {
		deleteTodo(todoId);
		renderTodoList();
	}
});

$('#search').on('input', function () {
	renderTodoList();
});

function renderTodoList() {
	let todos = localStorage.getItem(Text.keysInLocalStorage.todos);
	if (todos && todos.length > 0) {
		todos = JSON.parse(todos);
		$('.listTodo').empty();
		const searchValue = $('#search').val().toLowerCase();

		todos.forEach(function (todo) {
			if (
				todo.nameTodo.toLowerCase().includes(searchValue) ||
				todo.deadlineTodo.toLowerCase().includes(searchValue)
			) {
				let todoItem = $('<div>').addClass('itemTodo').attr('data-id', todo.id);
				let todoText = $('<span>')
					.text(todo.nameTodo + ' - ' + todo.deadlineTodo)
					.attr('title', todo.nameTodo + ' - ' + todo.deadlineTodo);
				let deleteIcon = $('<i>').addClass('delete-icon fas fa-trash-alt').attr('title', 'Delete todo');

				todoItem.append(todoText);
				todoItem.append(deleteIcon);
				$('.listTodo').append(todoItem);
			}
		});

		$('.noTodo').hide();
		$('.existenceTodo').show();
	} else {
		$('.noTodo').show();
		$('.existenceTodo').hide();
	}
}

function checkInputValues() {
	const nameTodo = $('#todoName').val();
	const deadlineTodo = $('#todoDeadline').val();

	return nameTodo.trim() !== '' && deadlineTodo.trim() !== '';
}

function toggleAddButton() {
	const isInputsValid = checkInputValues();
	$('#addButton').prop('disabled', !isInputsValid);
}

function deleteTodo(todoId) {
	let todos = localStorage.getItem(Text.keysInLocalStorage.todos);
	if (todos) {
		todos = JSON.parse(todos);
		let todoIndex = todos.findIndex((todo) => todo.id === todoId);
		if (todoIndex !== -1) {
			todos.splice(todoIndex, 1);
			localStorage.setItem(Text.keysInLocalStorage.todos, JSON.stringify(todos));
		}
	}
}
