let weather = {
  apiKey: "f327a81a2a120fd158a88e9528340ec5", 
  unsplashKey: "13LHSFlB7wrUNyEr8etcHcUW9K_lbuM9QcqXV7zkeng", 

  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
        this.fetchBackgroundImage(city); // fetch Unsplash image
      });
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
  },

  fetchBackgroundImage: function (location) {
  const randomPage = Math.floor(Math.random() * 10) + 1; // Random page 1–10

  fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      location
    )}&client_id=${this.unsplashKey}&orientation=landscape&per_page=1&page=${randomPage}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        const imageUrl = data.results[0].urls.regular;
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center center";
        document.body.style.transition = "background-image 0.7s ease-in-out";
      } else {
        document.body.style.backgroundImage = "";
      }
    })
    .catch((err) => {
      console.log("Unsplash image fetch failed:", err);
    });
},

  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

// Event listeners
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
  document.querySelector(".search-bar").blur();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

// Initial default search
weather.fetchWeather("Lucknow");
