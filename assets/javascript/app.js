/*
    element selection 
*/
const elements = {
    cancel_edit_button: document.querySelector('[js_cancel_edit_button]'),
    search_input: document.querySelector('[js_search_input]'),
    erase_button: document.querySelector('[js_erase_button]'),
    todo_input: document.querySelector('[js_todo_input]'),
    edit_input: document.querySelector('[js_edit_input]'),
    todo_form: document.querySelector('[js_todo_form]'),
    todo_list: document.querySelector('[js_todo_list]'),
    edit_form: document.querySelector('[js_edit_form]'),
    progress: document.querySelector('[js_progress]'),
    filter: document.querySelectorAll('[js_filter]'),
    date: document.querySelectorAll('[js_date]'),
};

let saved_progress = Number(localStorage.getItem("progress"));
let progress = 0;
let old_input_value;


/********** functions ***********/

// capturing data system
(() => {
    const system_date = new Date();

    const getDayWeekString = (day_week) => {
        const days_week_string = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        return days_week_string[day_week];
    };

    const getMonthNameString = (number_month) => {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        return months[number_month];
    };

    elements.date.forEach((element) => {
        if (element.getAttribute('js_date') === 'day_and_month') {
            element.innerHTML = `${system_date.getDate()} de ${getMonthNameString(system_date.getMonth())}`;
            return;
        };

        if (element.getAttribute('js_date') === 'years') {
            element.innerHTML = `${system_date.getFullYear()}`;
            return;
        };

        if (element.getAttribute('js_date') === 'week') {
            element.innerHTML = `${getDayWeekString(system_date.getDay())}`;
            return;
        };
    });
})();

// progress bar
const updateProgressBar = () => {
    elements.progress.style.width = progress + '%';
    localStorage.setItem('progress', progress);
};

if (saved_progress) {
    progress = saved_progress;
    updateProgressBar();
};

const increase = () => {
    progress += 5;

    if (progress > 100) {
        progress = 100;
    };

    updateProgressBar();
};

const decrement = () => {
    progress -= 5;

    if (progress < 0) {
        progress = 0;
    };

    updateProgressBar();
};

const createElement = (name) => {
    return document.createElement(name);
};

const saveTodo = (text, done = 0, save = 1) => {
    const todo = createElement('div');
    todo.classList.add('todo');
    todo.setAttribute('js_todo', '');

    const div_todo_title = createElement('div');
    div_todo_title.classList.add('todo_title');
    div_todo_title.setAttribute('js_todo_title', '');

    const todo_title = createElement('h3');
    todo_title.innerText += text;
    div_todo_title.appendChild(todo_title);
    todo.appendChild(div_todo_title);

    const div_todo_buttons = createElement('div');
    div_todo_buttons.setAttribute('id', 'todo_buttons');

    const done_button = createElement('button');
    done_button.classList.add('finish_todo');
    done_button.setAttribute('js_finish_todo', '');
    done_button.setAttribute('title', 'Marcar tarefa');
    done_button.innerHTML = '<i class="bx bx-check"></i>';
    div_todo_buttons.appendChild(done_button);
    todo.appendChild(div_todo_buttons);

    const edit_button = createElement('button');
    edit_button.classList.add('edit_todo');
    edit_button.setAttribute('js_edit_todo', '');
    edit_button.setAttribute('title', 'Editar tarefa');
    edit_button.innerHTML = '<i class="bx bxs-edit-alt"></i>';
    div_todo_buttons.appendChild(edit_button);

    const remove_button = createElement('button');
    remove_button.classList.add('remove_todo');
    remove_button.setAttribute('js_remove_todo', '');
    remove_button.setAttribute('title', 'Excluir tarefa');
    remove_button.innerHTML = '<i class="bx bxs-trash"></i>';
    div_todo_buttons.appendChild(remove_button);
    todo.appendChild(div_todo_buttons);

    /* using data from localstorage */
    if (done) {
        todo.classList.add('done');
    };

    if (save) {
        saveTodoLS({ text, done });
    }

    elements.todo_list.appendChild(todo);

    elements.todo_input.value = '';
    elements.todo_input.focus();
};

const toggleForms = () => {
    elements.edit_form.classList.toggle('hide');
    elements.todo_form.classList.toggle('hide');
    elements.todo_list.classList.toggle('hide');
};

const updateTodo = (text) => {
    const todos = document.querySelectorAll('[js_todo]');

    todos.forEach((todo) => {
        let todo_title = todo.querySelector('h3');

        if (todo_title.innerText === old_input_value) {
            todo_title.innerText = text;
            updateTodoLS(old_input_value, text);
        };
    });
};

const getSearchTodos = (search) => {
    const todos = document.querySelectorAll('[js_todo]');

    todos.forEach((todo) => {
        let todo_title = todo.querySelector('h3').innerText.toLowerCase();
        const normalized_search = search.toLowerCase();

        todo.style.display = 'flex';

        if (!todo_title.includes(normalized_search)) {
            todo.style.display = 'none';
        };
    });
};


/********** events ***********/
// create task
elements.todo_form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input_value = elements.todo_input.value;

    if (input_value && input_value.length <= 60) {
        saveTodo(input_value);
        return;
    } else {
        alert('Campo vazio ou quatidade de caracteres excedido...');
        return;
    };
});

// mark, edit and delete task actions
document.addEventListener('click', (event) => {
    const target_element = event.target;
    const grand_parent_element = target_element.closest('div').parentNode;
    let todo_title;

    // verifica se possui um elemento pai e um elemento h3
    if (grand_parent_element && grand_parent_element.querySelector('h3')) {
        todo_title = grand_parent_element.querySelector('h3').innerText;
    };

    if (target_element.getAttribute('js_finish_todo') === '') {
        grand_parent_element.classList.toggle('done');
        // grand_parent_element.classList.add('done');
        updateTodoStatusLS(todo_title);

        (() => {
            if (grand_parent_element.classList.contains('done')) {
                // grand_parent_element.children[0].children[0].className = tasks_status.done.icon_class;
                // grand_parent_element.children[0].children[0].setAttribute('title', tasks_status.done.title);

                increase();

                // grand_parent_element.children[1].children[0].setAttribute('title', tasks_status.todo.title);
            }
            else {
                // grand_parent_element.children[0].children[0].className = tasks_status.todo.icon_class;
                // grand_parent_element.children[0].children[0].setAttribute('title', tasks_status.todo.title);
                decrement();
            };
        })();
    };

    if (target_element.getAttribute('js_remove_todo') === '') {
        const delete_task = window.confirm('Realmente deseja remover tarefa?');

        if (delete_task) {
            grand_parent_element.remove();
            removeTodoLS(todo_title);
            decrement();
        };

    };

    if (target_element.getAttribute('js_edit_todo') === '') {
        toggleForms();
        elements.edit_input.value = todo_title;
        old_input_value = todo_title;
    };
});

// 
elements.cancel_edit_button.addEventListener('click', (event) => {
    event.preventDefault();
    toggleForms();
});

elements.edit_form.addEventListener('submit', (event) => {
    event.preventDefault();
    const edit_input_value = elements.edit_input.value;

    if (edit_input_value) {
        updateTodo(edit_input_value);
    };

    toggleForms();
});

elements.search_input.addEventListener('keyup', (event) => {
    const search = event.target.value;
    getSearchTodos(search);
});

elements.erase_button.addEventListener('click', (event) => {
    event.preventDefault();
    elements.search_input.value = '';
    elements.search_input.dispatchEvent(new Event('keyup'));
});

elements.filter.forEach((element) => {
    element.addEventListener('click', () => {
        const todos = document.querySelectorAll('[js_todo]');

        switch (element.getAttribute('js_filter')) {
            case 'all':
                todos.forEach((todo) => {
                    todo.style.display = 'flex';
                });
                break;

            case 'done':
                todos.forEach((todo) => {
                    todo.classList.contains('done')
                        ? todo.style.display = 'flex'
                        : todo.style.display = 'none'
                });
                break;

            case 'todo':
                todos.forEach((todo) => {
                    !todo.classList.contains('done')
                        ? todo.style.display = 'flex'
                        : todo.style.display = 'none'
                });
                break;

            default:
                break;
        };
    });
});

/*
    localStorage
*/
const getTodosLS = () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    return todos;
};

const loadTodos = () => {
    const todos = getTodosLS();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });
};

const saveTodoLS = (todo) => {
    const todos = getTodosLS();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
};

const removeTodoLS = (todo_text) => {
    const todos = getTodosLS();
    const filtered_todos = todos.filter((todo) => todo.text !== todo_text);
    localStorage.setItem('todos', JSON.stringify(filtered_todos));
};

const updateTodoStatusLS = (todo_text) => {
    const todos = getTodosLS();
    todos.map((todo) => todo.text === todo_text ? (todo.done = !todo.done) : null);
    localStorage.setItem('todos', JSON.stringify(todos));
};

const updateTodoLS = (todo_old_text, todo_new_text) => {
    const todos = getTodosLS();
    todos.map((todo) => todo.text === todo_old_text ? (todo.text = todo_new_text) : null);
    localStorage.setItem('todos', JSON.stringify(todos));
};

loadTodos();