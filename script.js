// 할일 목록을 저장할 배열
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM 요소
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

// 통계 업데이트 함수
function updateStats() {
    totalCount.textContent = todos.length;
    completedCount.textContent = todos.filter(todo => todo.completed).length;
}

// 할일 추가 함수
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === '') {
        Swal.fire({
            icon: 'warning',
            title: '알림',
            text: '할일을 입력해주세요!',
            confirmButtonText: '확인'
        });
        return;
    }

    const todo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';

    Swal.fire({
        icon: 'success',
        title: '추가 완료!',
        text: '할일이 추가되었습니다.',
        timer: 1500,
        showConfirmButton: false
    });
}

// 할일 삭제 함수
function deleteTodo(id) {
    Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: "삭제된 할일은 복구할 수 없습니다!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
            Swal.fire(
                '삭제 완료!',
                '할일이 삭제되었습니다.',
                'success'
            );
        }
    });
}

// 할일 완료 상태 토글 함수
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// 할일 목록을 로컬 스토리지에 저장
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateStats();
}

// 할일 목록 렌더링
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item list-group-item ${todo.completed ? 'completed' : ''}`;
        
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input me-3';
        checkbox.checked = todo.completed;
        checkbox.onclick = () => toggleTodo(todo.id);

        const span = document.createElement('span');
        span.className = 'flex-grow-1';
        span.textContent = todo.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        div.appendChild(checkbox);
        div.appendChild(span);
        div.appendChild(deleteBtn);
        li.appendChild(div);
        todoList.appendChild(li);
    });
    updateStats();
}

// Enter 키로 할일 추가
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// 초기 렌더링
renderTodos(); 