// Global variables
let token;
let authorEditModal = document.getElementById('authorModal');
let modalSpan = document.getElementsByClassName('modal-close__span')[0];
let editAuthorBtn = document.getElementById('edit-authorInfo');
let editBioBtn = document.querySelectorAll('.editBtn');
let saveBioBtn = document.querySelectorAll('.saveBtn');
let publishBtn = document.querySelector('#pub-submit');
let deleteAccountBtn = document.querySelector('#delete-account');
let authorPublications = [];

window.addEventListener('DOMContentLoaded', () => {
  token = localStorage.getItem('author-auth');
  if (!token) window.location.href = '../pages/main.html';
  getUsernameOnHeader();
  displayAuthorInfo();
  getAllAuthorPublications();
});

// Functions

let editAuthor = () => {
  authorEditModal.style.display = 'block';
  displayProfilePhoto();
};

let closeModal = () => {
  authorEditModal.style.display = 'none';
};

let getUsernameOnHeader = async () => {
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
    const helloUsernamePlace = document.getElementById('helloUsername');
    helloUsernamePlace.innerText = `${author.username}!`;
  } catch (e) {
    console.log(e);
  }
};


document
  .getElementById('profile-img-input')
  .addEventListener('change', async (e) => {
    if (
      document.getElementById('profile-img-input').isDefaultNamespace.length ===
      0
    )
      return;
    let file = document.getElementById('profile-img-input').files[0];
    let formData = new FormData();
    let errorMessage = document.querySelector('.error-message');
    formData.append('test', file);
    try {
      const response = await fetch(
        'http://localhost:3000/blog/author/uploadProfilePhoto', {
          method: 'POST',
          headers: {
            'author-auth': token,
          },
          body: formData,
        }
      );
      displayProfilePhoto();
      if (response.status != 200) {
        errorMessage.innerText = `Something went wrong. Please make sure your file is one of the following types:  .jpeg, .jpg, .png or .gif`;
      }
    } catch (e) {
      console.log(e);
    }
  });

// author's info in modale

displayAuthorInfo = async () => {
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
    let authorName = document.querySelector('#name');
    let authorSurname = document.querySelector('#surname');
    let authorBio = document.querySelector('#bio');

    authorName.value = author.name || '';
    authorSurname.value = author.surname || '';
    authorBio.value = author.bio || '';
  } catch (err) {
    console.log(err);
  }
};

// update and save authors info

updateAndSaveInfo = async () => {
  let name = document.querySelector('#name').value;
  let surname = document.querySelector('#surname').value;
  let bio = document.querySelector('#bio').value;

  let data = {
    name,
    surname,
    bio,
  };

  try {
    const response = await fetch('http://localhost:3000/blog/author', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'author-auth': token,
      },
      body: JSON.stringify(data),
    });
    if (response.status != 200) throw await response.json();
    let author = await response.json();
  } catch (err) {
    console.log(err);
  }
};

// Edit author name and bio

let editInfo = (e) => {
  let nameInput = document.querySelector('#name');
  let surnameInput = document.querySelector('#surname');
  let bioInput = document.querySelector('#bio');
  let saveBioBtn1 = document.querySelector('.saveBtn1');
  let saveBioBtn2 = document.querySelector('.saveBtn2');

  if (e.target.classList.contains('editBtn1')) {
    saveBioBtn1.style.display = 'inline';
    nameInput.readOnly = false;
    surnameInput.readOnly = false;
  } else if (e.target.classList.contains('editBtn2')) {
    saveBioBtn2.style.display = 'inline';
    bioInput.readOnly = false;
  }

  saveBioBtn1.addEventListener('click', () => {
    nameInput.readOnly = true;
    surnameInput.readOnly = true;
  });
  saveBioBtn2.addEventListener('click', () => {
    bioInput.readOnly = true;
  });
};

// Save publication to server

let savePublication = async (e) => {
  e.preventDefault();

  if (document.getElementById('pub-file').isDefaultNamespace.length === 0)
    return;
  let file = document.getElementById('pub-file').files[0];
  let formData = new FormData();
  let publicationImgUrl;
  formData.append('test', file);
  try {
    const response = await fetch(
      'http://localhost:3000/blog/publication/uploadPublicationPhoto', {
        method: 'POST',
        headers: {
          'author-auth': token,
        },
        body: formData,
      }
    );
    if (response.status != 200) throw await response.json();
    publicationImgUrl = await response.json();
  } catch (err) {
    console.log(err);
  }

  let title = document.querySelector('#title').value;
  let content = document.querySelector('.publication').value;

  let data = {
    title,
    content,
    imageURL: publicationImgUrl,
  };


  try {
    const response = await fetch('http://localhost:3000/blog/publication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'author-auth': token,
      },
      body: JSON.stringify(data),
    });
    if (response.status != 200) throw await response.json();
    let publication = await response.json();
    authorPublications.push(publication);
    displayAllAuthorPublications(authorPublications);
  } catch (err) {
    console.log(err);
  }
};

// Post all author publications in author home page
let getAllAuthorPublications = async () => {
  try {
    let response = await fetch(
      'http://localhost:3000/blog/authorPublications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'author-auth': token,
        },
      }
    );
    let items = await response.json();
    authorPublications = items;
    displayAllAuthorPublications(items);
  } catch (e) {
    console.log(e);
  }
};
let displayAllAuthorPublications = (items) => {
  let publications = document.querySelector('.my-publications');
  let publicationsItems = '';

  items.forEach((item, index) => {
    publicationsItems += `
      <div class="publicationsContainer">
      <div class="publicationsContainer__btns">
      <button class="btnPreview" onclick="previewPost(${index})">Preview</button>
      <button class="btnEdit" onclick="editPost(${index})">Edit</button>
      <button class="btnSave${index}" style="display:none" onclick="updateAndSavePost('${item._id}', ${index})">Save</button>
      <i class="far fa-trash-alt fa-lg" onclick="removeItem('${item._id}', ${index})" style="color: var(--accent-color);"></i>
      </div>
      <div class="publicationsContainer__info">
      <textarea class="textareaTitle textareaTitle${index}" name="text"  wrap="soft" maxlength="100" readonly style="resize:none; overflow:hidden" >${item.title}</textarea>
      <img src="http://localhost:3000/${item.imageURL}" id="publication-img" alt="">
      </div>
      <textarea class="content${index} textareaContent" style="display:none"> </textarea>
    </div>
      `;
    publications.innerHTML = publicationsItems;
  });
};
// remove one publication
let removeItem = async (id, index) => {
  try {
    authorPublications.splice(index, 1);
    displayAllAuthorPublications(authorPublications);
    const response = await fetch(
      'http://localhost:3000/blog/publication/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'author-auth': token,
        },
      }
    );
    location.reload();
  } catch (e) {
    console.log(e);
  }
};
// preview post in author home page
let previewPost = (index) => {
  let content = document.querySelector(`.content${index}`);
  let title = document.querySelector(`.textareaTitle`);
  content.readOnly = true
  title.readOnly = true
  if (content.style.display === "none") {
    content.style.display = "block"
  } else {
    content.style.display = "none"
  }
  content.innerText = authorPublications[index].content
};
// edit post in author home page
let editPost = index => {
  let content = document.querySelector(`.content${index}`);
  let title = document.querySelector(`.textareaTitle${index}`)
  let btnSave = document.querySelector(`.btnSave${index}`)
  btnSave.style.display = "block"
  content.style.display = "block"
  content.innerText = authorPublications[index].content
  content.readOnly = false;
  title.readOnly = false;
}
let updateAndSavePost = async (id, index) => {
  let title = document.querySelector(`.textareaTitle${index}`)
  let content = document.querySelector(`.content${index}`)
  let btnSave = document.querySelector(`.btnSave${index}`)
  let data = {
    title: title.value,
    content: content.value,
    _id: id
  }
  try {
    let response = await fetch('http://localhost:3000/blog/publication', {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'author-auth': token
      },
      body: JSON.stringify(data)
    })
    title.readOnly = true
    content.readOnly = true
    btnSave.style.display = "none"
  } catch (e) {
    console.log(e);
  }
}
// explore permetimas i main page be headerio
// let exploreToMainPage = () => {
//   window.location = '../pages/main.html';
//   let header = document.querySelector('.homepage-links');
// };

// Delete my account

let deleteAccount = async () => {
  try {
    const response = await fetch('http://localhost:3000/blog/author', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'author-auth': token,
      },
    });
    if (response.status != 200) throw await response.json();
    localStorage.removeItem('author-auth');
    window.location.href = '../pages/main.html';
  } catch (err) {
    console.log(err);
  }
};

// Events


editAuthorBtn.addEventListener('click', editAuthor);

modalSpan.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
  if (e.target == authorEditModal) {
    closeModal();
  }
});

document.getElementById('avatar-upload').addEventListener(
  'click',
  () => {
    const fileInput = document.getElementById('profile-img-input');
    if (fileInput) {
      fileInput.click();
    }
  },
  false
);

editBioBtn.forEach((btn) => {
  btn.addEventListener('click', editInfo);
});

saveBioBtn.forEach((btn) =>
  btn.addEventListener('click', () => {
    updateAndSaveInfo();
    saveBioBtn.forEach((btn) => {
      btn.style.display = 'none';
    });
  })
);

publishBtn.addEventListener('click', savePublication);

deleteAccountBtn.addEventListener('click', deleteAccount)