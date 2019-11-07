export default async function(method,  url, getTokenSilently, loginWithRedirect, body) {
  try {
    let token = await getTokenSilently();
    let init = null;

    if(method === "GET" || method === "DELETE"){
      init = {
        method: method,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    }else{
      init = {
        method: method,
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    }

    let response = await fetch(url, init);

    let data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
    await loginWithRedirect();
  }
}
