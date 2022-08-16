// Создай отдельный репозиторий для этого
// Запросить список 20 запусков с сервера (SpaceX API, https://docs.spacexdata.com/#5fc4c846-c373-43df-a10a-e9faf80a8b0a)
// и построить таблицу с полученными данными
// -- launch_year, mission_name, rocket -> rocket_name, flight_number
// Добавить клиентскую сортировку по клику на заголовок mission_name
// добавить состояние загрузки - loading... +
// добавить состояние ошибки - вывести пользователю +
// сортировка готова проблема что я вынес launches в глобал

(async function () {
  const spaceXUrl = "https://api.spacexdata.com/v3/launches?limit=20";
  let launches;
  showLoading();
  try {
    launches = await getLaunches();
    hideLoading();
    createTable();
  } catch (error) {
    hideLoading();
    showError(error);
  }
  let columnHeader = document.getElementById("sort");
  columnHeader.addEventListener("click", sort);

  // *****************************************

  function createTable() {
    for (let i = 0; i < launches.length; i++) {
      addLaunch(launches[i]);
    }
  }

  function deleteRows() {
    let table = document.getElementById("table");
    let firstRow = table.rows.length;
    for (let i = table.rows.length - 1; i > 0; i--) {
      let time = table.rows[i];
      table.removeChild(time);
    }
  }

  function bubbleSortConcept() {
    for (let j = launches.length - 1; j > 0; j--) {
      for (let i = 0; i < j; i++) {
        if (launches[i].mission_name > launches[i + 1].mission_name) {
          let temp = launches[i];
          launches[i] = launches[i + 1];
          launches[i + 1] = temp;
        }
      }
    }
  }

  function sort() {
    deleteRows();
    bubbleSortConcept();
    createTable();
  }

  function showError(error) {
    alert("Error!\n" + error);
  }

  function showLoading() {
    let loadingP = document.createElement("p");
    loadingP.setAttribute("id", "load");
    loadingP.innerHTML = "Loading...";
    document.body.append(loadingP);
  }

  function hideLoading() {
    let removeElem = document.getElementById("load");
    document.body.removeChild(removeElem);
  }

  async function getLaunches() {
    const result = await fetch(spaceXUrl);
    return result.json();
  }

  function addLaunch(launch) {
    let tableElem = document.getElementById("table");
    let newstring = document.createElement("tr");
    tableElem.append(newstring);
    let year = document.createElement("td");
    year.innerHTML = launch.launch_year;
    newstring.append(year);
    let mission = document.createElement("td");
    mission.innerHTML = launch.mission_name;
    newstring.append(mission);
    let rocket = document.createElement("td");
    rocket.innerHTML = launch.rocket.rocket_name;
    newstring.append(rocket);
    let number = document.createElement("td");
    number.innerHTML = launch.flight_number;
    newstring.append(number);
  }
})();
