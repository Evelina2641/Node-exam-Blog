// Global variables
let form = document.querySelector('form')

// Function 
let login = async (e) => {
    e.preventDefault();
    //Variables
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value

    let data = {
        username,
        password
    }
    try {
        let response = await fetch('http://localhost:3000/blog/author/login', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status != 200) throw await response.json()
        let token = response.headers.get('author-auth')
        localStorage.setItem('author-auth', token)
        window.location.href = '../pages/author-homepage.html'
    } catch (e) {
        if (status = 200) {
            let message = document.querySelector('.message')
            message.innerText = 'Incorrect Username or Password'
        }
    }
}
// Events
form.addEventListener('submit', login)