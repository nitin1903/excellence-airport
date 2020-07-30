const airportForm = document.forms.namedItem("get_airport");

let httpRequest;
airportForm.addEventListener("submit", function (ev) {
  ev.preventDefault();
  const oData = new FormData(airportForm);
  let url = new URL("http://localhost:3000/api/airports");
  for (let pair of oData.entries()) {
    url.searchParams.append(pair[0], pair[1]);
  }
  console.log(url);
  loadDoc(url, listAirports);
});

let getDistanceButton = document.getElementById("get-distance");
let getThreeNearestButton = document.getElementById("get-nearest");

getThreeNearestButton.addEventListener("click", function (ev) {
  clearError();
  clearResult();
  const selctedAirports = document.querySelectorAll(
    'input[name="airports[]"]:checked'
  );
  console.log(selctedAirports.length);
  if (selctedAirports.length != 1) {
    displayError({ message: "select one airport" });
    return;
  }
  let url = new URL(
    `http://localhost:3000/api/airports/three-nearest/${selctedAirports[0].value}`
  );
  loadDoc(url, displayResultList);
});

function displayResultList(httpRequest) {
  const airports = JSON.parse(httpRequest.responseText);
  const resultDiv = document.getElementById("result-div");
  if (resultDiv.childNodes.length != 0) {
    resultDiv.removeChild(resultDiv.childNodes[0]);
  }
  const table = document.createElement("table");
  let headerTr = document.createElement("tr");
  const airportKeys = Object.keys(airports[0]);
  for (key of airportKeys) {
    let td = document.createElement("td");
    td.innerText = key;
    headerTr.appendChild(td);
  }
  table.appendChild(headerTr);
  for (airport of airports) {
    let tr = document.createElement("tr");
    for (prop in airport) {
      let td = document.createElement("td");
      td.innerHTML = airport[prop];
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  resultDiv.appendChild(table);
  resultDiv.classList.add("active");
}

getDistanceButton.addEventListener("click", function (ev) {
  clearError();
  clearResult();
  const selctedAirports = document.querySelectorAll(
    'input[name="airports[]"]:checked'
  );
  console.log(selctedAirports.length);
  if (selctedAirports.length != 2) {
    displayError({ message: "select two airports" });
    return;
  }
  let url = new URL("http://localhost:3000/api/airports/distance");
  url.searchParams.append("airport1SiteNumber", selctedAirports[0].value);
  url.searchParams.append("airport2SiteNumber", selctedAirports[1].value);
  console.log(url);
  loadDoc(url, displayResult);
});

function displayResult(httpRequest) {
  const distance = JSON.parse(httpRequest.responseText);
  const resultDiv = document.getElementById("result-div");
  if (resultDiv.childNodes.length != 0) {
    resultDiv.removeChild(resultDiv.childNodes[0]);
  }
  resultDiv.innerText = `Distance : ${distance.distance}`;
  resultDiv.classList.add("active");
}

function clearResult() {
  const resultDiv = document.getElementById("result-div");
  resultDiv.classList.remove("active");
}

function clearError() {
  const errorDiv = document.getElementById("error-div");
  errorDiv.classList.remove("active");
}

function displayError(err) {
  const errorDiv = document.getElementById("error-div");
  errorDiv.innerText = err.message;
  errorDiv.classList.add("active");
}

function loadDoc(url, callBack) {
  let httpRequest;
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (this.readyState == 4) {
      if ((this.status = 200)) {
        callBack(this);
      } else {
        displayError(this);
      }
    }
  };
  httpRequest.open("GET", url);
  httpRequest.send();
}

function listAirports(httpRequest) {
  const airports = JSON.parse(httpRequest.responseText);
  console.log(airports);
  let listDiv = document.querySelector(".airport-list");
  let listTable = document.createElement("table");
  const airportKeys = Object.keys(airports[0]);
  let headerTr = document.createElement("tr");
  let headerTd = document.createElement("td");
  headerTd.innerText = "  ";
  headerTr.appendChild(headerTd);
  for (key of airportKeys) {
    let td = document.createElement("td");
    td.innerText = key;
    headerTr.appendChild(td);
  }
  listTable.appendChild(headerTr);
  for (airport of airports) {
    //let label = document.createElement('label')
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("name", "airports[]");
    checkbox.setAttribute("value", airport.SiteNumber);
    let tr = document.createElement("tr");
    let checkboxTd = document.createElement("td");
    checkboxTd.appendChild(checkbox);
    tr.appendChild(checkboxTd);
    for (prop in airport) {
      let td = document.createElement("td");
      td.innerHTML = airport[prop];
      tr.appendChild(td);
    }
    listTable.appendChild(tr);
  }
  listDiv.replaceChild(listTable, listDiv.childNodes[0]);
}
