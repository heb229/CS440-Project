fetch("/api/critiques")
    .then((res) => res.json())
    .then((critiques) => {
        const list = document.getElementById("critiques");

        if (!critiques || critiques.length === 0) {
        list.innerHTML =
            '<li class="list-group-item">No critiques available.</li>';
        return;
        }

        critiques.forEach((c) => {
        const li = document.createElement("li");
        li.className = "list-group-item";

        li.innerHTML = `
            <h5 class="mb-1">${c.title}</h5>
            <small class="text-muted">
            by ${c.author} • ${new Date(c.created_at).toLocaleDateString()}
            </small>

            <div class="mt-2">
            Movie:
            <a href="movie.html?id=${c.movie_id}">
                ${c.movie_title}
            </a>
            </div>

            <p class="mt-2 mb-0">${c.content}</p>
        `;

        list.appendChild(li);
        });
    })
    .catch((err) => {
        console.error("Error fetching critiques:", err);
        document.getElementById("critiques").innerHTML =
        '<li class="list-group-item text-danger">Error loading critiques.</li>';
    });