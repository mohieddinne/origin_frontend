import axios from 'axios';

const apiURL = process.env.REACT_APP_BC_API_URL;

export async function upload(file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('avatar', file, file.name);
    axios.post(`${apiURL}/file/upload`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      }
    })
      .then(({ data }) => {
        if (data) {
          resolve(`${apiURL}/file/getFile${data}`);
        } else {
          reject('error.generic_error');
        }
      }).catch((e) => {
        console.error(e);
        reject('error.server_catch');
      });
  });
}