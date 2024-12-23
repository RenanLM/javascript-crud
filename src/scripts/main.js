// Sistema de Cadastro de Usuários by Renan Moura
// V. 2.1.0 (Bug Fix: conflito na edição de user c/ email cadastrado)

// Criação da factory de usuários
function createUser(name, birthDate, phone, email) {
    return {
        name,
        birthDate,
        phone,
        email
    };
}

// Função para salvar no LocalStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Função para carregar do LocalStorage
function loadFromLocalStorage(key) {
    const dataString = localStorage.getItem(key);
    if (dataString) {
        return JSON.parse(dataString);
    } else {
        return [];
    }
}

// Função para formatar a data de nascimento
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Função para listar cadastrados
function listRegistered() {
    const registered = loadFromLocalStorage('registered');
    const registeredList = document.getElementById('registeredList');
    registeredList.innerHTML = '';

    if (registered.length === 0) {
        registeredList.innerHTML = '<p>Nenhum cadastro encontrado.</p>';
    } else {
        let list = '<ul>';
        registered.forEach((user, index) => {
            const formattedDate = formatDate(user.birthDate);
            list += `
                <li>
                    ${user.name} - ${formattedDate} - ${user.phone} - ${user.email}
                    <button class="edit" onclick="startEditUser(${index})">Editar</button>
                    <button class="delete" onclick="deleteUser(${index})">Deletar</button>
                </li>
            `;
        });
        list += '</ul>';
        registeredList.innerHTML = list;
    }
}

// Função para validar dados antes de cadastrar
function validateRegistrationData(name, birthDate, phone, email, editingUserIndex) {
    if (!name || !birthDate || !phone || !email) {
        alert('Preencha todos os campos obrigatórios!');
        return false;
    }

    const registered = loadFromLocalStorage('registered');
    const isEmailTaken = registered.some((user, index) => user.email === email && index !== editingUserIndex);
    if (isEmailTaken) {
        alert('O email informado já está cadastrado!');
        return false;
    }

    return true;
}

// Função para cadastrar novo usuário
function registerUser() {
    const name = document.getElementById('name').value;
    const birthDate = document.getElementById('birthDate').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    if (!validateRegistrationData(name, birthDate, phone, email, null)) {
        return; // Aborta a função se a validação falhar
    }

    const newUser = createUser(name, birthDate, phone, email);
    const registered = loadFromLocalStorage('registered');
    registered.push(newUser);
    saveToLocalStorage('registered', registered);

    alert('Cadastro realizado com sucesso!');
    listRegistered(); // Atualiza a lista após o cadastro
    clearForm(); // Limpa o formulário
}

// Função para limpar o formulário
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('birthDate').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
}

// Variável para armazenar o índice do usuário sendo editado
let editingUserIndex = null;

// Função para iniciar a edição de um usuário
function startEditUser(index) {
    const registered = loadFromLocalStorage('registered');
    const user = registered[index];

    document.getElementById('name').value = user.name;
    document.getElementById('birthDate').value = user.birthDate;
    document.getElementById('phone').value = user.phone;
    document.getElementById('email').value = user.email;

    editingUserIndex = index; // Armazena o índice do usuário sendo editado
}

// Função para atualizar um usuário
function updateUser() {
    const name = document.getElementById('name').value;
    const birthDate = document.getElementById('birthDate').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    if (!validateRegistrationData(name, birthDate, phone, email, editingUserIndex)) {
        return; // Aborta a função se a validação falhar
    }

    const updatedUser = createUser(name, birthDate, phone, email);
    const registered = loadFromLocalStorage('registered');
    registered[editingUserIndex] = updatedUser; // Atualiza o usuário no índice armazenado
    saveToLocalStorage('registered', registered);

    alert('Cadastro atualizado com sucesso!');
    listRegistered(); // Atualiza a lista após a edição
    clearForm();
    editingUserIndex = null; // Reseta o índice de edição
}

// Função para deletar um usuário
function deleteUser(index) {
    if (confirm('Deseja realmente excluir este usuário?')) {
        const registered = loadFromLocalStorage('registered');
        registered.splice(index, 1);
        saveToLocalStorage('registered', registered);
        listRegistered(); // Atualiza a lista após a exclusão
    }
}

let listVisible = false; // Lista não visível inicialmente

// Função para mostrar ou esconder a lista
function toggleList() {
    const registeredList = document.getElementById('registeredList');
    const toggleListButton = document.getElementById('toggleListButton');

    if (listVisible) {
        registeredList.style.display = 'none';
        toggleListButton.textContent = 'Mostrar Lista';
    } else {
        registeredList.style.display = 'block';
        toggleListButton.textContent = 'Esconder Lista';
    }
    listVisible = !listVisible;
}

// Evento de submit do formulário
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', function(event) {
    event.preventDefault();

    if (editingUserIndex === null) {
        registerUser();
    } else {
        updateUser();
    }
});

// Evento de click no botão Mostrar/Esconder
const toggleListButton = document.getElementById('toggleListButton');
toggleListButton.addEventListener('click', toggleList);

// Carregar cadastros na inicialização
listRegistered();
document.getElementById('registeredList').style.display = 'none'; // Esconde a lista inicialmente
toggleListButton.textContent = 'Mostrar Lista'; // Configura o texto do botão

