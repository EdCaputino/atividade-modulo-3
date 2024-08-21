// Interface de tipos da tarefa
interface Task {
    id: number;
    text: string;
    completed: boolean;
}

// Capitura dos elementos do DOM
const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const addTaskButton = document.getElementById("addTaskButton") as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;
const filterButtons = document.querySelectorAll(".filter-btn") as NodeListOf<HTMLButtonElement>;

let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
let filter: string = "all";

// Função para salvar tarefas no localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Função para adicionar uma nova tarefa
function addTask(text: string) {
    const newTask: Task = {
        id: Date.now(),
        text,
        completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}

// Função para mostrar as tarefas na lista
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const taskItem = document.createElement("li");  //cria um no "li" na lista não ordenada
        taskItem.className = `task-item ${task.completed ? "completed" : ""}`;  //adiciona classe dinâmica à "li"

        const checkbox = document.createElement("input");   //cria um input
        checkbox.type = "checkbox"; //do tipo checkbox
        checkbox.checked = task.completed;  //se marcado, a task está concluída
        checkbox.addEventListener("change", () => toggleTaskCompletion(task.id));   //chama função para mudar o estado da task

        const taskText = document.createElement("span");    //cria um span com o nome da task
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");  //cria botão para excluir task
        deleteButton.textContent = "Excluir";   //adiciona texo "Excluir" ao botão
        deleteButton.addEventListener("click", () => deleteTask(task.id));  //chama método para apagar task passando o seu id

        //adiciona itens criados à task
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
    });
}

// Função para mudar o status de uma tarefa recebendo seu id
function toggleTaskCompletion(id: number) {
    const task = tasks.find(task => task.id === id);    //procura a task pelo id
    if (task) { //se a task existir
        task.completed = !task.completed;   //atribua o valor contrário à task
        saveTasks();
        renderTasks();
    }
}

// Função para apagar uma tarefa recebendo seu id
function deleteTask(id: number) {
    tasks = tasks.filter(task => task.id !== id);   //atualiza a lista excluindo a task com id correspondente
    saveTasks();
    renderTasks();
}

// Função que define o filtro de exibição
function setFilter(newFilter: string) {
    filter = newFilter;
    renderTasks();
    filterButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.filter === filter);
    });
}

// Método para adicionar tarefa
addTaskButton.addEventListener("click", () => {
    console.log("Botão 'Adicionar' clicado."); // Log de depuração
    if (taskInput.value.trim() !== "") {    //se o valor do input for diferente de vazio
        console.log("Adicionando tarefa:", taskInput.value.trim()); // Log de depuração
        addTask(taskInput.value.trim());
        taskInput.value = "";   //esvazia o input
    } else {
        console.log("O campo de entrada está vazio."); // Log de depuração
    }
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => setFilter(button.dataset.filter!));  //envia botão clicado
});

// Renderiza as tarefas ao carregar a página
renderTasks();
