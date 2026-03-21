// Critiques API - Django backend
export async function getCritiques(movieId = null) {
  try {
    const url = new URL("/api/critiques/", window.location.origin);
    if (movieId) {
      url.searchParams.append("movie_id", movieId);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const critiques = await response.json();
    return critiques;
  } catch (err) {
    console.error("Error fetching critiques:", err);
    throw err;
  }
}

export async function createCritique(movieId, title, author, content) {
  try {
    const response = await fetch("/api/critiques/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        movie_id: movieId,
        title,
        author,
        content,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const critique = await response.json();
    return critique;
  } catch (err) {
    console.error("Error creating critique:", err);
    throw err;
  }
}

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
