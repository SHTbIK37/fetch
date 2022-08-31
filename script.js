(async function () {
  const limit = 20;
  let launches;
  let position = 0;
  let specialLaunches;
  let desc;

  let sortColumn = document.getElementById("missionName");
  sortColumn.addEventListener("click", sort);

  let buttonBack = document.getElementById("back");
  buttonBack.addEventListener("click", back);

  let buttonForward = document.getElementById("forward");
  buttonForward.addEventListener("click", forward);

  showLoading();
  try {
    launches = await getLaunches({ limit });
    fillTable(launches);
    setPagination(launches);
  } catch (error) {
    showError(error);
  } finally {
    hideLoading();
  }

  // *****************************************

  async function forward() {
    position += 20;
    await paginate();
    if (specialLaunches.length < limit) {
      buttonForward.setAttribute("disabled", "disabled");
    }
    buttonBack.removeAttribute("disabled");
  }

  async function back() {
    position -= 20;
    await paginate();
    if (position == 0) {
      buttonBack.setAttribute("disabled", "disabled");
    }
    buttonForward.removeAttribute("disabled");
  }
  async function paginate() {
    try {
      deleteRows();
      showLoading();
      specialLaunches = await getLaunches({
        limit,
        offset: position,
        sort: desc == undefined ? undefined : "mission_name",
        order: desc == 1 ? "asc" : desc == undefined ? undefined : "desc",
      });
      setPagination(specialLaunches);
      fillTable(specialLaunches);
    } catch (error) {
      showError(error);
    } finally {
      hideLoading();
    }
  }
  function setPagination(specialLaunches) {
    const numbers = document.getElementById("numbers");
    const string = `${position + 1} - ${position + specialLaunches.length}`;
    numbers.innerHTML = string;
  }
  function createArrowUp() {
    const arrow = document.createElement("p");
    arrow.setAttribute("id", "arrowUp");
    arrow.innerHTML = "&uarr;";
    createSortArrow(arrow);
  }
  function createArrowDown() {
    const arrow = document.createElement("p");
    arrow.setAttribute("id", "arrowDown");
    arrow.innerHTML = "&darr;";
    createSortArrow(arrow);
  }
  function createSortArrow(arrowEl) {
    const tableElem = document.getElementById("missionName");
    tableElem.append(arrowEl);
  }
  function deleteArrowUp() {
    deleteSortArrow(document.getElementById("arrowUp"));
  }
  function deleteArrowDown() {
    deleteSortArrow(document.getElementById("arrowDown"));
  }
  function deleteSortArrow(arrowEl) {
    const tableElem = document.getElementById("missionName");
    tableElem.removeChild(arrowEl);
  }
  async function sort() {
    if (desc == 1) {
      const isActiveSort = document.getElementById("arrowDown");
      if (isActiveSort) {
        deleteArrowDown();
      }
      createArrowUp();
      desc = 0;
      await sortRequest();
    } else {
      const isActiveSort = document.getElementById("arrowUp");
      if (isActiveSort) {
        deleteArrowUp();
      }
      createArrowDown();
      desc = 1;
      await sortRequest();
    }
  }
  async function sortRequest() {
    deleteRows();
    showLoading();
    try {
      let launchesSortServer = await getLaunches({
        limit,
        sort: "mission_name",
        order: desc == 0 ? "desc" : "asc",
        offset: position,
      });
      fillTable(launchesSortServer);
    } catch (error) {
      showError(error);
    } finally {
      hideLoading();
    }
  }
  function fillTable(launches) {
    for (let i = 0; i < launches.length; i++) {
      addLaunch(launches[i]);
    }
  }

  function deleteRows() {
    const table = document.getElementsByClassName("table");

    for (let i = table[0].rows.length - 1; i > 0; i--) {
      let time = table[0].rows[i];
      table[0].removeChild(time);
    }
  }

  function showError(error) {
    alert("Error!\n" + error);
    console.log(error);
  }

  function showLoading() {
    const loadingElem = document.createElement("p");
    loadingElem.setAttribute("id", "load");
    loadingElem.innerHTML = "Loading...";
    document.body.append(loadingElem);
  }

  function hideLoading() {
    const loadingElem = document.getElementById("load");
    document.body.removeChild(loadingElem);
  }

  async function getLaunches(params) {
    const spaceXUrl = "https://api.spacexdata.com/v3/launches";
    for (let key in params) {
      if (params[key] == undefined) {
        delete params[key];
      }
    }
    const result = await fetch(
      `${spaceXUrl}?${new URLSearchParams(Object.entries(params))}`
    );
    return result.json();
  }

  function addLaunch(launch) {
    const table = document.getElementsByClassName("table");
    const newRow = document.createElement("tr");
    table[0].append(newRow);
    const year = document.createElement("td");
    year.innerHTML = launch.launch_year;
    newRow.append(year);
    const mission = document.createElement("td");
    mission.innerHTML = launch.mission_name;
    newRow.append(mission);
    const rocket = document.createElement("td");
    rocket.innerHTML = launch.rocket.rocket_name;
    newRow.append(rocket);
    const number = document.createElement("td");
    number.innerHTML = launch.flight_number;
    newRow.append(number);
  }
})();
