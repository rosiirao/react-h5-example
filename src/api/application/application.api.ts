import {fetchWithAuth} from '../auth.api';

const applicationApi = '/api/application';
const roleApi = (applicationId: string, roleId?: string) =>
  `${applicationApi}/${applicationId}/role/${roleId ?? ''}`;

export function getApplication(id?: string) {
  return fetchWithAuth(`${applicationApi}/${encodeURIComponent(id ?? '')}`);
}

export function addApplicationRole(applicationId: string, name: string) {
  return fetchWithAuth(roleApi(applicationId), {
    body: new URLSearchParams({name}),
    method: 'POST',
  });
}

export function getApplicationRole(applicationId: string, id: string) {
  return fetchWithAuth(roleApi(applicationId, id));
}

export function updateApplicationRole(
  applicationId: string,
  id: string,
  name: string
) {
  return fetchWithAuth(roleApi(applicationId, id), {
    body: new URLSearchParams({name}),
    method: 'PUT',
  });
}

export function deleteApplicationRole(applicationId: string, id: string) {
  return fetchWithAuth(roleApi(id, id), {
    method: 'DELETE',
  });
}
