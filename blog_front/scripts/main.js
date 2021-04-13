window.addEventListener('DOMContentLoaded', () => {
  token = localStorage.getItem('author-auth');
  getAllPublications();
});

let getAllPublications = async () => {
  try {
    let response = await fetch('http://localhost:3000/blog/publication', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'author-auth': token,
      },
    });
    let items = await response.json();
    publications = items;
    publications.sort((a, b) => a.publicationDate > b.publicationDate ? -1 : 1)
    displayAllPublications(items);
  } catch (e) {
    console.log(e);
  }
};
let displayAllPublications = (items) => {
  let publications = document.querySelector('.sec-2');
  let publicationsItems = '';
  let date;
  let month;
  let year;
  let dateStr;

  items.forEach((item, index) => {
    dateStr = '';
    if (item.publicationDate) {
      let publicationDate = new Date(item.publicationDate);
      year = publicationDate.getFullYear();
      date = publicationDate.getDate();
      month = publicationDate.getMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12

      dateStr = date + '/' + month + '/' + year;
    }
    let avatarURL = '';
    if (item.author.avatarURL) {
      avatarURL = `src = "http://localhost:3000/${item.author.avatarURL}"`;
    }

    let imageURL = '';
    if (item.imageURL) {
      imageURL = `src = 'http://localhost:3000/${item.imageURL}'`;
    }

    publicationsItems += `
    <div class="publicationContainer">
    <div class="one-of-publication">

        <div class="author">
        <span>Writer:</span>
          <div>
            <img ${avatarURL} id="avatar-img" alt="">
          </div>
          <div>
            <p>${item.author.name} ${item.author.surname}</p>
          </div>
        </div>

        <a href="../pages/publication.html?publicationID=${item._id}">
          <div class="publication">
            <div class="date-container">
              <p>${dateStr}</p>
            </div>
            <div class="pub-img-cont">
              <img ${imageURL} id="publication-img" alt="">
            </div>
            <div class="publication-content">
              <p class="authorTitle"> ${item.title} </p>
            </div>
          </div>
        </a>
        
      </div>
    </div>
      `;
    publications.innerHTML = publicationsItems;
  });
};