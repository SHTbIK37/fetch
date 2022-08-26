// Создай отдельный репозиторий для этого
// Запросить список 20 запусков с сервера (SpaceX API, https://docs.spacexdata.com/#5fc4c846-c373-43df-a10a-e9faf80a8b0a)
// и построить таблицу с полученными данными
// -- launch_year, mission_name, rocket -> rocket_name, flight_number
// Добавить клиентскую сортировку по клику на заголовок mission_name
// добавить состояние загрузки - loading... +
// добавить состояние ошибки - вывести пользователю +
//
// заменить клиентскую сортировку серверной +
// добавить порядок сортировки (order), показывать вверх-вниз стрелка +
// убрать стартбутон, кнопка бэк по умолчанию выкл (disabled), по клику вперед делать запрос, +
// если запрос приходит с 0 элементами - откл вперед (значит элементов больше нет), но если нажать назад кнопка вперед снова активна +
// вывести промежуток показываемых элементов между вперед назад (1-20 21-40) +

(async function () {
  const limit = 20;
  // const spaceXUrlSort =
  //   "https://api.spacexdata.com/v3/launches?limit=20&sort=mission_name";
  // let spaceXUrlOffset =
  //   "https://api.spacexdata.com/v3/launches?limit=20&offset=";
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
    if (desc == 1) {
      specialLaunches = await getLaunches({
        limit,
        offset: position,
        order: "asc",
        sort: "mission_name",
      });
    } else {
      if (desc == 0) {
        specialLaunches = await getLaunches({
          limit,
          offset: position,
          order: "desc",
          sort: "mission_name",
        });
      }
    }
    if (desc == undefined) {
      specialLaunches = await getLaunches({ limit, offset: position });
      showNumbers(specialLaunches);
    } else {
      showSort();
    }
  }
  function showSort() {
    const numbers = document.getElementById("numbers");
    const string = `sort by mission name`;
    numbers.innerHTML = string;
  }
  function showNumbers(specialLaunches) {
    const numbers = document.getElementById("numbers");
    const string = `${specialLaunches[0].flight_number} - ${
      specialLaunches[specialLaunches.length - 1].flight_number
    }`;
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
    showSort();
    if (desc == 1) {
      const alive = document.getElementById("arrowDown");
      if (alive) {
        deleteArrowDown();
      }
      desc = 0;
      deleteRows();
      showLoading();
      try {
        let launchesSortServer = await getLaunches({
          limit,
          sort: "mission_name",
          order: "desc",
        });
        createTable(launchesSortServer);
        createArrowUp();
      } catch (error) {
        showError(error);
      } finally {
        hideLoading();
      }
    } else {
      const alive = document.getElementById("arrowUp");
      if (alive) {
        deleteArrowUp();
      }
      desc = 1;
      deleteRows();
      showLoading();
      try {
        let launchesSortServer = await getLaunches({
          limit,
          sort: "mission_name",
          order: "asc",
        });
        createTable(launchesSortServer);
        createArrowDown();
      } catch (error) {
        showError(error);
      } finally {
        hideLoading();
      }
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
