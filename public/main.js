let trash = document.getElementsByClassName("fa-trash");
let addButton = document.getElementsByClassName("fa-solid fa-plus");


// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });



document.querySelector('#results').addEventListener('click', makeReq)


let muscle = document.querySelector('#muscle')

function makeReq(event){

  input = muscle.value

  fetch( `https://api.api-ninjas.com/v1/exercises?muscle=${input}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', 
      'X-Api-Key': 'roqIxiiz0R2grHzwU/E3vg==yZoMZjG7RzUE3QSV'
    } 
  })
    .then(request => request.json())
		.then(response => {
      console.log(response)
        

      for (let exercise = 0; exercise < response.length; exercise++) {
        let workout = response[exercise].name
    
        let information = `${workout}`
        console.log(`${information}`)
   
        let table = document.getElementById('workoutInfo')
        let td = document.createElement('td')
        // td.id = exercise
        let icon = document.createElement("i");
        icon.dataset.exercise = information

        icon.setAttribute("class","fa-solid fa-plus")
        const textNode = document.createTextNode(information)
        td.appendChild(textNode)
        table.appendChild(td)

        table.appendChild(icon)

        icon.addEventListener("click", addToFav)


      }
      
    })
		.catch(err => console.error(err))
}



function addToFav(){
  // let favorite = this.parentNode.childNodes[2].innerText
  let favorite = this.dataset.exercise
  console.log (favorite)

  fetch('/favorites', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'favorite' : favorite,
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
}
