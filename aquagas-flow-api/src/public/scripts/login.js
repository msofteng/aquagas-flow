document.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.matches('#login-btn')) {
        var emailInput = document.getElementById('email-input');
        var pwdInput = document.getElementById('pwd-input');
        var data = {
            email: emailInput.value,
            password: pwdInput.value,
        };
        Http
            .post('/api/auth/login', data)
            .then((data) => {
                if (data.status == 200) {
                    window.location.href = '/users';
                } else {
                    console.log(data);
                }
            });
    }
}, false);