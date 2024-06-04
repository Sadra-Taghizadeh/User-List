// selectors
const btnWrapper = document.querySelector("#btn-wrapper");
const usersWrapper = document.querySelector("#user-wrapper");

function generateCardHTML(data) {
  const fullName = `${data.name.first} ${data.name.last}`;
  return `<article class="user-card flex--xs">
            <img
              src="${data.headshot}"
              alt="${fullName}"
              class="user-image"
              width="60"
              height="60"
            />
            <div class="grid--xs user-deets">
              <div>
                <h3>${fullName}</h3>
                <p class="user-location">${data.location}</p>
              </div>
              <div class="flex--xs flex-wrap pill-wrapper">
                ${data.tags.map((t) => `<p class="pill">${t}</p>`).join("")}
              </div>
            </div>
          </article>`;
}

function clearAllPressed() {
  btnWrapper
    .querySelectorAll(".btn")
    .forEach((b) => b.removeAttribute("aria-pressed"));
}

function setPressed(button) {
  button.setAttribute("aria-pressed", "true");
}

function updateQueryParam(area) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set("area", area);
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  history.pushState({}, "", newUrl);
}

btnWrapper.addEventListener("click", (e) => {
  if (e.target.dataset.area) {
    // clear all aria-pressed
    clearAllPressed();
    // set aria-pressed on clicked button
    setPressed(e.target);
    // update the query param
    updateQueryParam(e.target.dataset.area);
    // update displayed users
    filterAndDisplayUsers(e.target.dataset.area);
  }
});

function generateFilterButton(area) {
  return `<button class="btn" data-area="${area}">${area}</button>`;
}

async function filterAndDisplayUsers(area) {
  try {
    // fetch data
    const res = await fetch("http://localhost:3000/users");
    if (!res.ok) {
      throw new Error("Error fetching users data");
    }
    const data = await res.json();

    // clear previous cards
    usersWrapper.innerHTML = "";

    // filter and fill the cards
    let filteredData;
    if (area === "All" || !area) {
      filteredData = data;
    } else {
      filteredData = data.filter((p) => p.area === area);
    }
    const cardHTML = filteredData.map(generateCardHTML).join("");
    usersWrapper.insertAdjacentHTML("beforeend", cardHTML);
  } catch (e) {
    console.error(e.message);
  }
}

// event listeners
window.addEventListener("DOMContentLoaded", async () => {
  let params = new URLSearchParams(document.location.search);
  let area = params.get("area") || "All";

  try {
    // fetch data
    const res = await fetch("http://localhost:3000/users");
    if (!res.ok) {
      throw new Error("Error fetching users data");
    }
    const data = await res.json();

    // fill the buttons
    const areas = [...new Set(data.map((person) => person.area))];
    const btnHTML = areas.map(generateFilterButton).join("");
    btnWrapper.insertAdjacentHTML("beforeend", btnHTML);

    // set aria-pressed based on query param
    const activeButton = btnWrapper.querySelector(`[data-area="${area}"]`);
    if (activeButton) {
      setPressed(activeButton);
    }

    // filter and display users based on query param
    filterAndDisplayUsers(area);
  } catch (e) {
    console.error(e.message);
  }
});
