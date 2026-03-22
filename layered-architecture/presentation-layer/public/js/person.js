const id = new URLSearchParams(location.search).get('id')

fetch(`/api/person/${id}`)
.then(res => res.json())
.then(person => {
    document.getElementById('name').textContent = person.name
    document.getElementById('bio').textContent = person.bio

    person.actedMovies.forEach(movie => {
    const li = document.createElement('li')
    li.innerHTML = `<a href="movie.html?id=${movie.id}">
        ${movie.title} (${movie.year})
    </a>`
    document.getElementById('acted-movies').appendChild(li)
    })

    person.directedMovies.forEach(movie => {
    const li = document.createElement('li')
    li.innerHTML = `<a href="movie.html?id=${movie.id}">
        ${movie.title} (${movie.year})
    </a>`
    document.getElementById('directed-movies').appendChild(li)
    })
})