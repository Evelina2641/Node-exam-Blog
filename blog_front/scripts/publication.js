function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let publicationId = getParameterByName('publicationID');

window.addEventListener('DOMContentLoaded', () => {
  token = localStorage.getItem('author-auth');
  getPublication(publicationId);
});

let getPublication = async (id) => {
  try {
    const response = await fetch(
      'http://localhost:3000/blog/publicationInfo/' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status != 200) throw await response.json();
    let publication = await response.json();
    displayPublication(publication);
  } catch (err) {
    console.log(err);
  }
};

let displayPublication = (publication) => {
  let publicationPlace = document.querySelector('.publicationContainer');
  let publicationItem = '';


  let avatarImgUrl = '';
  if (!publication.author.avatarURL) {
    avatarImgUrl = `src = '../assets/blank-profile.png'`;
  } else {
    avatarImgUrl = `src= 'http://localhost:3000/${publication.author.avatarURL}'`;
  }

  let publicationImgUrl = '';
  if (publication.imageURL) {
    publicationImgUrl = `src= 'http://localhost:3000/${publication.imageURL}'`;
  }

  publicationItem = `
      <div class="container-about">
      <div class="container-about__title">
        <h1>${publication.title}</h1>
      </div>
      <div class="container-about__author">
        <div class="author__img">
          <img
            id="header-avatar"
            class="img-conteiner"
            ${avatarImgUrl}
            alt=""
          />
        </div>
        <div class="author-info">
          <h4>${publication.author.name} ${publication.author.surname}</h4>
          <p>${buildDate(publication.publicationDate)}</p>
        </div>
      </div>
    </div>
    <div class="container-main">`;
  if (publicationImgUrl != '') {
    publicationItem += `
      <div class="container-main__img">
        <img ${publicationImgUrl} alt="" />
      </div>
      `;
  }
  publicationItem += `
  <div class="container-main__story">${publication.content}
      </div>
    </div>
  <hr />
    <div class="container-feedback">
    <p class="feedback-error"></p>
      <div class="feedback__claps claps-btn">
      <img class="clap" src="../assets/clap.png">
        <p class="claps-amount">${publication.claps}</p>
      </div>
      <div class="feedback__comments">
        <i class="far fa-comment"></i>
        <p class ="comments-length">0</p>
      </div>
      <div class="comments__section" id="hidden">
      </div>
    </div>
        `;
  publicationPlace.innerHTML = publicationItem;
  displayClaps();
  displayComments(publication);

  document
    .querySelector('.feedback__comments')
    .addEventListener('click', (e) => {
      e.preventDefault();
      let comments = document.querySelector('#hidden');
      let comments2 = document.querySelector('.comments__section');
      if (comments) {
        comments.style.display = 'flex';
        comments.removeAttribute('id');
      } else {
        comments2.style.display = 'none';
        comments2.setAttribute('id', 'hidden');
      }
    });
};

let displayClaps = () => {
  let claps = document.querySelector('.claps-btn');
  let clapsAmount = document.querySelector('.claps-amount');
  let feedbackError = document.querySelector('.feedback-error');
  let clapIcon = document.querySelector('.clap');
  if (claps != null) {
    claps.addEventListener('click', async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/blog/publication/' + publicationId, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'author-auth': token,
            },
          }
        );

        if (response.status != 200) {
          return (feedbackError.innerText = `You need to log in.`);
        }
        let publicationClaps = await response.json();
        clapsAmount.innerText = publicationClaps;
        clapIcon.src = '../assets/claped.png';
      } catch (err) {
        console.log(err);
      }
    });
  }
};

let displayComments = (publication) => {
  let commentsPlace = document.querySelector('.comments__section');
  let comments = '';

  comments = `
   <div class="all_comments">`;

  let allComments = publication.comments;
  allComments.forEach((comment) => {
    comments += `<div class="comment">
      <div>
       <div class="comment-author-cont">  <img class="comment-img" src="http://localhost:3000/${comment.author.avatarURL}" >
       <p class="comment-author-name">${comment.author.name} ${comment.author.surname}</p></div> 
      <p class="comment-date">${buildDate(comment.date)}</p>
      </div>
      <div>
       <p class="comment-content">${comment.comment}</p>
      </div>
     </div>`;
  });

  comments += ` </div>

   <div class="comment-input">
      <div>
        <textarea type="text" name="name" id="comment" placeholder="Your comment"></textarea>
      </div>
      <div>
        <button class="submitBtn">Comment</button>
        <p class="one-more-error"></p>
      </div>
   </div>


  `;

  commentsPlace.innerHTML = comments;
  document.querySelector('.comments-length').innerText = allComments.length;
  document.querySelector('.submitBtn').addEventListener('click', (e) => {
    e.preventDefault();
    postComment(publication._id);
  });
};

let postComment = async (id) => {
  let commentInputValue = document.getElementById('comment').value;
  if (commentInputValue != '') {
    let data = {
      comment: commentInputValue,
    };

    try {
      const response = await fetch(
        'http://localhost:3000/blog/publication/comment/' + id, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'author-auth': token,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.status != 200) throw await response.json();
      let publication = await response.json();
      displayComments(publication);
    } catch (err) {
      console.log(err);
    }
  }
};

let buildDate = (dateparametre) => {
  let date;
  let month;
  let year;
  let dateStr;
  let seconds;
  let minutes;
  let hour;
  let publicationDate = new Date(dateparametre);
  year = publicationDate.getFullYear();
  date = publicationDate.getDate();
  month = publicationDate.getMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
  hour = publicationDate.getHours();
  minutes = publicationDate.getMinutes();
  seconds = publicationDate.getSeconds();

  dateStr =
    date +
    '/' +
    month +
    '/' +
    year +
    ' ' +
    hour +
    ':' +
    minutes +
    ':' +
    seconds;

  return dateStr;
};