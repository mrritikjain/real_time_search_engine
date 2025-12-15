let input = document.querySelector("#input");
let loading = document.querySelector(".loading");
let results = document.querySelector(".results");
let usercard = document.querySelector(".user-card");

function debounc(delay) {
  let timer;
  return function (callback) {
    clearTimeout(timer);
    timer = setTimeout(callback, delay);
  };
}
let debouncingSearch = debounc(300);

async function fetchUser(query) {
  if (!query) {
    results.innerHTML = "";
    return;
  }
  try {
    loading.style.display = "block";
    const res = await fetch(`https://api.github.com/search/users?q=${query}`);
    const data = await res.json();
    renderResults(data.items);
  } catch (err) {
    console.error(err);
  } finally {
    loading.style.display = "none";
  }
}

function renderResults(users) {
  results.innerHTML = "";
  usercard.innerHTML = "";
  users.slice(0, 10).forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.login;
    results.appendChild(li);

    usercard.innerHTML = `
             <div class="user-image-box">
            <img src="${user.avatar_url}" />
          </div>
           <div class="user-details">
            <h2>Userid: ${user.id || "No Name"}</h2>
            <p><span>Username:</span> ${user.login}</p>
            <p><span>Score:</span> ${user.score}</p>
          </div>
            `;
  });
}
input.addEventListener("input", (e) => {
  const value = e.target.value;

  debouncingSearch(() => {
    fetchUser(value);
  });
});

let currentIndex = -1;

document.addEventListener("keydown", (e) => {
  const items = document.querySelectorAll(".results li");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    currentIndex++;
    if (currentIndex >= items.length) currentIndex = 0;
  }

  if (e.key === "ArrowUp") {
    currentIndex--;
    if (currentIndex < 0) currentIndex = items.length - 1;
  }

  if (e.key === "Enter") {
    if (currentIndex >= 0) {
      input.value = items[currentIndex].innerText; // ✅ set input
      document.querySelector(".results").innerHTML = ""; // close dropdown
      currentIndex = -1;
    }
    return;
  }

  items.forEach((item) => item.classList.remove("active"));
  items[currentIndex].classList.add("active");
});
