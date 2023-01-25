async function fetchHelper(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`failed to fetch: ${res.status} - ${res.statusText}`);
  }
  return res.json();
}

export async function requestAccessToken(url, code) {
  return fetchHelper(url, {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export async function fetchResource(url, accessToken) {
  return fetchHelper(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
  });
}
