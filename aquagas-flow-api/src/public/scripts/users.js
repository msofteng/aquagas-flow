const DateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const formatDate = (date) => DateFormatter.format(new Date(date));

displayUsers();

function displayUsers() {
    Http
        .get('/users/all')
        .then(resp => resp.json())
        .then(resp => {
            var allUsersTemplate = document.getElementById('all-users-template'),
                allUsersTemplateHtml = allUsersTemplate.innerHTML,
                template = Handlebars.compile(allUsersTemplateHtml);
            var allUsersAnchor = document.getElementById('all-users-anchor');
            allUsersAnchor.innerHTML = template({
                users: resp.users.map(user => ({
                    ...user,
                    createdFormatted: formatDate(user.created),
                })),
            });
        });
}

document.addEventListener('click', event => {
    event.preventDefault();
    var ele = event.target;
    if (ele.matches('#add-user-btn')) {
        addUser();
    } else if (ele.matches('.edit-user-btn')) {
        showEditView(ele.parentNode.parentNode);
    } else if (ele.matches('.cancel-edit-btn')) {
        cancelEdit(ele.parentNode.parentNode);
    } else if (ele.matches('.submit-edit-btn')) {
        submitEdit(ele);
    } else if (ele.matches('.delete-user-btn')) {
        deleteUser(ele);
    } else if (ele.matches('#logout-btn')) {
        logoutUser();
    }
}, false);

function addUser() {
    var nameInput = document.getElementById('name-input');
    var emailInput = document.getElementById('email-input');
    var data = {
        user: {
            id: -1,
            name: nameInput.value,
            email: emailInput.value,
            created: new Date(),
        },
    };

    Http
        .post('/users/add', data)
        .then(() => {
            nameInput.value = '';
            emailInput.value = '';
            displayUsers();
        });
}

function showEditView(userEle) {
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'none';
    editView.style.display = 'block';
}

function cancelEdit(userEle) {
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'block';
    editView.style.display = 'none';
}

function submitEdit(ele) {
    var userEle = ele.parentNode.parentNode;
    var nameInput = userEle.getElementsByClassName('name-edit-input')[0];
    var emailInput = userEle.getElementsByClassName('email-edit-input')[0];
    var id = ele.getAttribute('data-user-id');
    var created = ele.getAttribute('data-user-created');
    console.log(ele, created)
    var data = {
        user: {
            id: Number(id),
            name: nameInput.value,
            email: emailInput.value,
            created: new Date(created),
        },
    };
    Http
        .put('/users/update', data)
        .then(() => displayUsers());
}

function deleteUser(ele) {
    var id = ele.getAttribute('data-user-id');
    Http
        .delete('/users/delete/' + id)
        .then(() => displayUsers());
}

function logoutUser() {
    Http
        .get('/auth/logout')
        .then(() => window.location.href = '/');
}