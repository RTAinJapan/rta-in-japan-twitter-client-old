import fetchJsonpLib from 'fetch-jsonp';

/**
 * JSONの取得
 * @param url 取得先のURL
 * @return JSONオブジェクト
 * @throws 通信エラー
 * @throws JSON変換エラー
 */
export const fetchJson = async (url: string) => {
  const result = await fetch(url);
  const config = await result.json();
  return config;
};

/**
 * JSONPの取得
 * @param url URL
 */
export function fetchJsonp(url: string): Promise<{ data: object }> {
  return new Promise((resolve, reject) => {
    fetchJsonpLib(url, {
      jsonpCallback: 'callback',
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        resolve({ data: json });
      })
      .catch(error => {
        reject({ error });
      });
  });
}

export const postJson = async (url: string, body: object) => {
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await result.json();
};

export const postFile = async (url: string, file: File) => {
  const formData = new FormData();
  formData.append(file.name, file);

  const result = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  return await result.json();
};