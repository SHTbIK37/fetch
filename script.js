// Создай отдельный репозиторий для этого
// Запросить список 20 запусков с сервера (SpaceX API, https://docs.spacexdata.com/#5fc4c846-c373-43df-a10a-e9faf80a8b0a)
// и построить таблицу с полученными данными
// -- launch_year, mission_name, rocket -> rocket_name, flight_number
// Добавить клиентскую сортировку по клику на заголовок mission_name
const url = "https://api.spacexdata.com/v3/launches";

async function get() {
  const result = await fetch(url);
  let json = result.json();
  console.log(json);
}
get();
