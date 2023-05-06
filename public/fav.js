let trash = document.getElementsByClassName("fa-xmark");

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[0].innerText
    console.log(name)
    fetch('delete', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'favorite': name
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});