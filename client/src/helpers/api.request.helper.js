const handleResponse = (response) => {
  if (response.status === 401) {
    // unauthorized
  }

  return new Promise((resolve, reject) => {
    if (response.ok) {
      if (response.status === 200) {
        var contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          response.json().then((json) => {
            resolve(json);
          });
        } else {
          resolve(response);
        }
      }
    } else {
      response.text().then((error) => {
        try {
          error = JSON.parse(error);
        } catch (err) {
          if (response.status === 403)
            error = {
              code: 'UNAUTHORIZED_ERROR',
              errors: ['UNAUTHORIZED_ERROR'],
            };
          else error = { code: 'UNHANDLED_ERROR', errors: ['Unhandled Error'] };
        }
        reject(error);
      });
    }
  });
};

const handleError = (error) => {
  let err = error;
  try {
    err = JSON.parse(err);
  } catch (e) {
    err = { code: 'UNHANDLED_ERROR', errors: ['Unhandled Error'] };
  }

  return Promise.reject(err);
};

export const jsonRequest = (url, body, method = 'GET') => {
  const headers = new Headers();

  headers.append('Accept', 'application/json');

  var options = { headers, mode: 'cors', method: method };

  if (body) {
    options.method = method;
    options.body = JSON.stringify(body);
    headers.append('Content-Type', 'application/json');
  }

  return fetch(url, options).then(
    (response) => {
      return handleResponse(response);
    },
    (error) => {
      return handleError(error, url);
    }
  );
};
