(async function () {
  const limit = 20;
  let launches;
  let position = 0;
  let specialLaunches;
  let desc;

  let columnHeader = document.getElementById("sort");
  columnHeader.addEventListener("click", sortServer);

  let buttonBack = document.getElementById("back");
  buttonBack.addEventListener("click", back);
  buttonBack.setAttribute("disabled", "disabled");

  let buttonForward = document.getElementById("forward");
  buttonForward.addEventListener("click", forward);

  showLoading();
  try {
    launches = await getLaunches({ limit });
    createTable(launches);
    showNumbers(launches);
  } catch (error) {
    showError(error);
  } finally {
    hideLoading();
  }

  // *****************************************

  async function forward() {
    try {
      deleteRows();
      showLoading();
      position += 20;
      await checkDesc();
      if (specialLaunches.length < limit) {
        buttonForward.setAttribute("disabled", "disabled");
      }
      createTable(specialLaunches);
      buttonBack.removeAttribute("disabled");
    } catch (error) {
      showError(error);
    } finally {
      hideLoading();
    }
  }

  async function back() {
    try {
      deleteRows();
      showLoading();
      position -= 20;
      await checkDesc();
      if (position == 0) {
        buttonBack.setAttribute("disabled", "disabled");
      }
      createTable(specialLaunches);
      buttonForward.removeAttribute("disabled");
    } catch (error) {
      showError(error);
    } finally {
      hideLoading();
    }
  }
  async function checkDesc() {
    specialLaunches = await getLaunches({
      limit,
      offset: position,
      sort: desc == undefined ? undefined : "mission_name",
      order: desc == 1 ? "asc" : desc == undefined ? undefined : "desc",
    });
    showNumbers(specialLaunches);
  }
  function showNumbers(specialLaunches) {
    const numbers = document.getElementById("numbers");
    const string = `${position + 1} - ${position + specialLaunches.length}`;
    numbers.innerHTML = string;
  }
  function createArrowUp() {
    const tableElem = document.getElementById("sort");
    const arrow = document.createElement("p");
    arrow.setAttribute("id", "arrowUp");
    arrow.innerHTML = "&uarr;";
    tableElem.append(arrow);
  }
  function createArrowDown() {
    const tableElem = document.getElementById("sort");
    const arrow = document.createElement("p");
    arrow.setAttribute("id", "arrowDown");
    arrow.innerHTML = "&darr;";
    tableElem.append(arrow);
  }
  function deleteArrowUp() {
    const tableElem = document.getElementById("sort");
    const arrow = document.getElementById("arrowUp");
    tableElem.removeChild(arrow);
  }
  function deleteArrowDown() {
    const tableElem = document.getElementById("sort");
    const arrow = document.getElementById("arrowDown");
    tableElem.removeChild(arrow);
  }
  async function sortServer() {
    if (desc == 1) {
      const alive = document.getElementById("arrowDown");
      if (alive) {
        deleteArrowDown();
      }
      createArrowUp();
      desc = 0;
      await logicSortServer();
    } else {
      const alive = document.getElementById("arrowUp");
      if (alive) {
        deleteArrowUp();
      }
      createArrowDown();
      desc = 1;
      await logicSortServer();
    }
  }
  async function logicSortServer() {
    deleteRows();
    showLoading();
    try {
      let launchesSortServer = await getLaunches({
        limit,
        sort: "mission_name",
        order: desc == 0 ? "desc" : "asc",
        offset: position,
      });
      createTable(launchesSortServer);
    } catch (error) {
      showError(error);
    } finally {
      hideLoading();
    }
  }
  function createTable(launches) {
    for (let i = 0; i < launches.length; i++) {
      addLaunch(launches[i]);
    }
  }

  function deleteRows() {
    const table = document.getElementById("table");

    for (let i = table.rows.length - 1; i > 0; i--) {
      let time = table.rows[i];
      table.removeChild(time);
    }
  }

  function showError(error) {
    alert("Error!\n" + error);
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
    const tableElem = document.getElementById("table");
    const newRow = document.createElement("tr");
    tableElem.append(newRow);
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
