export const handleUploadFile = (file, okapi) => {
  const formData = new FormData();
  formData.append('upload', file);

  return fetch(`${okapi.url}/erm/files`, {
    method: 'POST',
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
    },
    body: formData,
  }).then(response => response.json());
};

export const handleDeleteFile = (file, okapi) => {
  return fetch(`${okapi.url}/erm/files/${file.id}`, {
    method: 'DELETE',
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
    },
  });
};

export const handleDownloadFile = (file, okapi) => {
  return fetch(`${okapi.url}/erm/files/${file.id}/raw`, {
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
    },
  }).then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
};
