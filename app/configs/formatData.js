export function convertDateFormat(dateTimeString) {
  let date = new Date(dateTimeString);

  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0'); // Увеличиваем на 1, так как месяцы в JavaScript начинаются с 0
  let day = String(date.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
}