// Создай отдельный репозиторий для этого
// Запросить список 20 запусков с сервера (SpaceX API, https://docs.spacexdata.com/#5fc4c846-c373-43df-a10a-e9faf80a8b0a)
// и построить таблицу с полученными данными
// -- launch_year, mission_name, rocket -> rocket_name, flight_number
// Добавить клиентскую сортировку по клику на заголовок mission_name
// добавить состояние загрузки - loading...
// добавить состояние ошибки - вывести пользователю

(async function () {
  const spaceXUrl = "https://api.spacexdata.com/v3/launches?limit=20";

  try {
    const launches = await getLaunches();
    for (let i = 0; i < launches.length; i++) {
      addLaunch(launches[i]);
    }
  } catch (error) {
    console.error("MY ERROR", error);
  }
  let columnHeader = document.getElementById("sort");
  columnHeader.addEventListener("click", sort);

  // *****************************************

  async function getLaunches() {
    const result = await fetch(spaceXUrl);
    return result.json();
  }

  function addLaunch(launch) {
    let tableElem = document.getElementById("table");
    let newstring = document.createElement("tr");
    newstring.setAttribute("id", "tr");
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
