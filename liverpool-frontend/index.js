// GLOBAL VARIABLES
const usersUrl = "http://localhost:3000/users"
const postsUrl = "http://localhost:3000/posts"
const commentsUrl = "http://localhost:3000/comments"
const likesUrl = "http://localhost:3000/likes"
let user_id = 0
let post_id = 0


document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content has loaded")
  fetchPosts()
  fetchUsers()
  const postForm = document.getElementById("post_form")
  postForm.addEventListener("submit", createPost)

  const userForm = document.getElementById("userForm")
  userForm.addEventListener("submit", createUser)
})

function fetchUsers() {
  fetch (usersUrl)
  .then(resp => resp.json())
  .then(data => data.forEach(user => {displayUser(user)
  }))
}

function fetchPosts() {
  fetch (postsUrl)
  .then(resp => resp.json())
  .then(data => data.forEach(post => {displayPost(post)
  }))
}


// WORKING
function createUser(e) {
  e.preventDefault()
  let user = {name: e.target.name.value}
  fetch(usersUrl, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
  }, 
    body: JSON.stringify(user)
  }).then(res => res.json())
  .then(e.target.reset())
  .then(res => {
    console.log("This is my user: ", res)
    user_id = res.id
    console.log("This is the user_id: ", user_id)
    displayUser(res)
  })
}

// WORKING BUT NEED LOGIN FIRST
function createPost(e) {
  e.preventDefault()
  let postInput = {
    title: e.target.title.value,
    content: e.target.content.value,
    media: e.target.media.value,
    user_id: user_id
  }
  fetch(postsUrl, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postInput)
  }).then(res => res.json())
  .then(res => {
    post_id = res.id
    (displayPost(res))
  })
  .then(console.log(res))
}

// SETUP COMMENTS IN HTML
// function createComment(e) {
//   e.preventDefault()
//   let commentInput = {
//     text: e.target.text.value,
//     user_id: user_id,
//     post_id: post_id
//   }
//   fetch(commentsUrl, {
//     method: "POST",
//     headers: {
//       "Accept": "application/json",
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(commentInput)
//   }).then(res => res.json())
//   .then(res => {(displayComment(res))
//   })
// }

function displayPost(post) {
  const postList = document.getElementById("post-list")
  postList.innerHTML += 
    `<div>
      <h2>${post.title}</h2>
      <p>${post.content}</p>
    </div>`
}
// Display Users in a modal when clicked on
function displayUser(user){
  const modalBody = document.querySelector(".modal-body")
  modalBody.innerHTML +=
    `<li>${user.name}</li>`
}