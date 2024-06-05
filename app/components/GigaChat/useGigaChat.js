

export const useGigaChat = () => {
  const user_id = process.env.NEXT_PUBLIC_GIGACHAT_SECRET
  const auth = process.env.NEXT_PUBLIC_GIGACHAT_AUTHORIZATION
  const url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'RqUID': `${user_id}`,
    'Authorization': `Basic ${auth}`
  };
  const body = new URLSearchParams({
    'scope': 'GIGACHAT_API_PERS'
  });

  const getToken = fetch(url, {
    method: 'POST',
    headers: headers,
    body: body
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data
    })
    .catch(error => {
      console.error(error);
    });
  return{
    getToken
  }
}