// DOM elements
const ipAddressEl = document.querySelector(".info__data--ip");
const locationEl = document.querySelector(".info__data--location");
const timeZoneEl = document.querySelector(".info__data--tz");
const ispEl = document.querySelector(".info__data--isp");
const inputEl = document.querySelector("#search");
const searchSubmitEl = document.querySelector(".search__submit");
let map;

// getting IP adress
async function getIPAdress() {
  const data = await fetch("https://api.ipify.org/?format=json");
  const { ip } = await data.json();
  return ip;
}

// generating object for url
async function generateObj(ip = "") {
  let obj = {
    apiKey: "at_38zuK4YajSyUsLGBmRWZVuEBkgXDo",
    ipAddress: "",
  };
  if (ip == "") {
    obj.ipAddress = await getIPAdress();
  } else {
    obj.ipAddress = ip;
  }
  return obj;
}

// generating url
function generateUrl(obj) {
  let str = "";

  for (let key in obj) {
    if (str != "") {
      str += "&";
    }
    str += key + "=" + encodeURIComponent(obj[key]);
  }

  const url = `https://geo.ipify.org/api/v2/country,city?${str}`;
  return url;
}

// fetching data from given url

async function fetchData(url) {
  let data = await fetch(url);
  if (data?.ok) {
    let json = await data.json();

    const {
      ip,
      location: { city, lat, lng, region, timezone },
      isp,
    } = json;
    console.log(ip, city, lat, lng, region, timezone, isp);
    ipAddressEl.innerHTML = ip;
    locationEl.innerHTML = `${city}, ${region}`;
    timeZoneEl.innerHTML = `UTC ${timezone}`;
    ispEl.innerHTML = isp;
    if (map != undefined) {
      map.remove();
    }
    map = L.map("map").setView([lat, lng], 8);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    var marker = L.marker([lat, lng]).addTo(map);
    let markerEl = document.querySelector(".leaflet-marker-icon");
    markerEl.src = "./img/icon-location.svg";
  } else {
    console.log(`HTTP Response Code: ${data?.status}`);
  }
}

// initial ip adress
generateObj("").then((o) => {
  let url = generateUrl(o);
  fetchData(url);
});

// input ip adress
searchSubmitEl.addEventListener("click", () => {
  let inputValue = inputEl.value;
  generateObj(inputValue).then((o) => {
    let url = generateUrl(o);
    fetchData(url);
  });
});
