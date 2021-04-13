// Global Variables
let form = document.querySelector('form')

// Functions

let registration = async (e) => {
    e.preventDefault();

    // Variables
    let username = document.getElementById('username').value
    let name = document.getElementById('name').value
    let surname = document.getElementById('surname').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let message = document.querySelector('.message')

    let data = {
        username,
        name,
        surname,
        password,
        email
    }

    try {
        const response = await fetch('http://localhost:3000/blog/author/signup', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.status != 200) throw await response.json()

        window.location.href = '../pages/login.html'
    } catch (e) {
        // Variables ir vel, nes nemokejau kitaip ju paimt, be value
        let usernameInput = document.getElementById('username')
        let nameInput = document.getElementById('name')
        let surnameInput = document.getElementById('surname')
        let emailInput = document.getElementById('email')
        let passwordInput = document.getElementById('password')

        let inputs = [
            usernameInput,
            nameInput,
            surnameInput,
            emailInput,
            passwordInput
        ]
        // Loopas, kad uzdetu borderius neuzpildytiems laukams
        inputs.forEach(item => {
            item.classList.remove("border-red")
            if (item.value === '') {
                item.classList.add("border-red")
                message.innerText = "All fields are required"
            }
        })
        // Validacija jeigu username arba email jau egzistuoja
        if (e.keyValue) {
            if (e.keyValue.username === username) {
                let input = document.getElementById('username')
                message.innerText = 'Username already exists'
                input.classList.add("border-red")
            } else if (e.keyValue.email === email) {
                let input = document.getElementById('email')
                message.innerText = 'Email already exists'
                input.classList.add("border-red")
            }
        }

    }
}
// events
form.addEventListener('submit', registration)