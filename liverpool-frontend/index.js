// GLOBAL VARIABLES
const usersUrl = "http://localhost:3000/users"
const postsUrl = "http://localhost:3000/posts"
const commentsUrl = "http://localhost:3000/comments"
const likesUrl = "http://localhost:3000/likes"
let user_id = null
let post_id = null


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

// WORKING BUT NEED TO LOGIN FIRST
function createPost(e) {
  e.preventDefault()
  
  if(user_id === null) {
    alert('You have to be logged in to post!')
  }
  else {
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
    .then(res => displayPost(res))
  }
  document.getElementById("post_form").reset()
}

function displayPost(post) {
  const post_id = post.id
  // let postLikes = 0
  // fetch(likesUrl)
  //   .then(res => res.json())
  //   .then(likes => likes.forEach(like => {
  //     if (post.id === like.post_id) postLikes++

  const postList = document.getElementById("post-list")

    const divPost = document.createElement("div")
    divPost.id = post.id
    divPost.className = "posts"

    const h2 = document.createElement("h2")
    h2.innerText = post.title

    const p = document.createElement("p")
    p.innerText = `"${post.content}"` 

    const author = document.createElement("p")
    author.className = 'author-tag'

    fetch(usersUrl+'/'+post.user_id)
    .then(resp => resp.json())
    .then(user => author.innerText = `by ${user.name}`)

    const postButton = document.createElement("button")
    postButton.id = post.id
    postButton.type = 'button'
    postButton.className = "btn btn-danger"
    postButton.dataset.toggle = "modal"
    postButton.dataset.target = "#post-modal"
    postButton.innerText = "Post Details"

    const like_btn = document.createElement("button")
    like_btn.className = 'btn btn-primary'
    like_btn.innerText = "Likes: "

    const like_span = document.createElement("span")
    like_span.innerText = post.likes.length
    like_btn.append(like_span)
    like_btn.addEventListener("click", function (){
      like_span.innerText = parseInt(like_span.innerText) + 1
      fetch(likesUrl, {
        method: "POST",
        headers: {"Accept": "application/json",
        'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: post.user_id, post_id: post.id})
      })
      
    })
    console.log(like_span)
    divPost.append(h2, p, author, postButton, like_btn)
    postList.append(divPost)
    
    postButton.addEventListener("click", postDetailsModal)
    // like_btn.addEventListener("click", postlike)
  // }))
}

// POST LIKE
// function postlike(e) {
//   console.log(e.target.post_id)
//   let like_span = e.target
//   like_span.innerText = parseInt(like_span.innerText)+1
// console.log(like_span.innerText)
    
//     fetch(likesUrl, {
//       method: 'POST',
//       headers: {'Accept': 'application/json',
//       'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         post_id: postId,
//         user_id: userId
//       }).then(console.log(user_id))
//     })
// }

// POST DETAILS MODAL
function postDetailsModal(e) {
  console.log(e.target.id)
  post_id = e.target.id
    fetch(`http://localhost:3000/posts/${post_id}`)
    .then(resp => resp.json())
    .then(displayPostModal)

    // .then(post =>{
    //   displayPostModal(post)
    // })
}

// NOT WORKING YET
function displayPostModal(post) {
  // console.log(post)
  const postModal = document.getElementById("post-modal")
  console.log(post)
  postModal.querySelector('h5').innerText = post.title
  postModal.querySelector('#post-details').innerText = post.content
  postModal.querySelector('#post-details').innerHTML += `<img src=${post.media}>`
}


// Display Users in a modal when clicked on
function displayUser(user){
  const modalBody = document.getElementById("userModal")
  modalBody.innerHTML +=
    `<li>${user.name}</li>`   
}

// WANT TO ADD TO DISPLAY POST H2 TAG
// by ${user.name}