let logoutButton = document.querySelector('.logout');


// Pagal tokena skirtingi headeriai; 

window.addEventListener('DOMContentLoaded', () => {
  token = localStorage.getItem('author-auth')
  displayProfilePhoto();
});
if (localStorage.hasOwnProperty("author-auth")) {
  let kitiNereikalingi = document.querySelectorAll('.loginAndGetStarted')
  for (let i = 0; i < kitiNereikalingi.length; i++) {
    kitiNereikalingi[i].style.display = "none"
  }

  if (document.querySelector('.sec-1')) {
    document.querySelector('.sec-1').style.display = "none"
  }
}

if (localStorage.getItem("author-auth") === null) {
  let nereikalingi = document.querySelectorAll('.logout-avatar-home')
  for (let i = 0; i < nereikalingi.length; i++) {
    nereikalingi[i].style.display = "none"
  }
}
if (document.getElementById('header-avatar-home')) {
  document.getElementById('header-avatar-home').addEventListener('click', () => {
    window.location = '../pages/author-homepage.html'
  })
}

let displayProfilePhoto = async () => {
  try {
    const response = await fetch('http://localhost:3000/blog/author', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'author-auth': token,
      },
    });

    if (response.status != 200) throw await response.json();
    let author = await response.json();
    const avatariMG = document.getElementById('avatar-upload');
    const avatariMG2 = document.getElementById('header-avatar');
    const avatariMG3 = document.getElementById('header-avatar-home')
    if (avatariMG || avatariMG2) {
      if (author.avatarURL === undefined) {
        return (
          (avatariMG.src = '../assets/blank-profile.png'),
          (avatariMG2.src = '../assets/blank-profile.png')
        );
      } else {
        return (
          (avatariMG.src = 'http://localhost:3000/' + author.avatarURL),
          (avatariMG2.src = 'http://localhost:3000/' + author.avatarURL)
        );
      }
    }
    if (avatariMG3) {
      if (author.avatarURL === undefined) {
        return (
          (avatariMG3.src = '../assets/blank-profile.png')
        );
      } else {
        return (
          (avatariMG3.src = 'http://localhost:3000/' + author.avatarURL)
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
};
let logout = async () => {
  localStorage.removeItem('author-auth');
  try {
    const response = await fetch('http://localhost:3000/blog/author/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'author-auth': token,
      },
    });
    if (response.status != 200) throw await response.json();

    window.location.href = '../pages/main.html';
  } catch (e) {
    alert(e);
  }
};

logoutButton.addEventListener('click', logout);