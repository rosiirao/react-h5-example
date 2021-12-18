import {fetchWithAuth} from '../auth.api';

const applicationApi = '/api/application';
const roleApi = (applicationName: string, roleId?: number) =>
  `${applicationApi}/${applicationName}/role/${roleId ?? ''}`;
const grantRoleApi = (applicationName: string, roleId: number) =>
  `${applicationApi}/${applicationName}/grantRole/${roleId}`;

const privilegeApi = (applicationName: string) =>
  `${applicationApi}/${applicationName}/privilege`;

const roleInheritApi = (
  applicationName: string,
  roleId: string,
  inheritToId: string
) =>
  `${applicationApi}/${applicationName}/roleInherit/${roleId}/${inheritToId}`;

export function getApplication(id?: string) {
  return fetchWithAuth(`${applicationApi}/${encodeURIComponent(id ?? '')}`);
}

export function getUserIdentities(applicationName: string) {
  return fetchWithAuth(`${applicationApi}/${applicationName}/userIdentities`);
}

export function addApplicationRole(applicationName: string, name: string) {
  return fetchWithAuth(roleApi(applicationName), {
    body: new URLSearchParams({name}),
    method: 'POST',
  });
}

export function getApplicationRole(applicationName: string, id: number) {
  return fetchWithAuth(roleApi(applicationName, id));
}

export function updateApplicationRole(
  applicationName: string,
  id: number,
  name: string
) {
  return fetchWithAuth(roleApi(applicationName, id), {
    body: new URLSearchParams({name}),
    method: 'PUT',
  });
}

export function deleteApplicationRole(applicationName: string, id: number) {
  return fetchWithAuth(roleApi(applicationName, id), {
    method: 'DELETE',
  });
}

export function grantRoleInherit(
  applicationName: string,
  id: string,
  inheritToId: string
) {
  return fetchWithAuth(roleInheritApi(applicationName, id, inheritToId), {
    method: 'PUT',
  });
}

export function revokeRoleInherit(
  applicationName: string,
  id: string,
  inheritToId: string
) {
  return fetchWithAuth(roleInheritApi(applicationName, id, inheritToId), {
    method: 'DELETE',
  });
}

export function grantRole(
  applicationName: string,
  id: number,
  payload: {user: Array<number> | number} | {group: Array<number> | number}
) {
  return fetchWithAuth(grantRoleApi(applicationName, id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(payload),
  });
}

export function revokeRole(
  applicationName: string,
  id: number,
  payload: {user: Array<number> | number} | {group: Array<number> | number}
) {
  return fetchWithAuth(grantRoleApi(applicationName, id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-HTTP-METHOD': 'DELETE',
    },
    body: JSON.stringify(payload),
  });
}

type IDS = Array<string>;
export type EffectiveAssignee = {role: IDS; group: IDS; user: IDS};

export function updatePrivilege(
  applicationName: string,
  assignee: EffectiveAssignee,
  privilege: Array<string>
) {
  return fetchWithAuth(`${privilegeApi(applicationName)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      assignee: Object.keys(assignee).reduce<{
        role: Array<number>;
        user: Array<number>;
        group: Array<number>;
      }>(
        (acc, key) => {
          acc[key as keyof typeof assignee] = assignee[
            key as keyof typeof assignee
          ].map(v => Number(v));
          return acc;
        },
        {role: [], user: [], group: []}
      ),
      privilege,
    }),
  });
}

const namesApi = '/api/names';

export function queryNames({type}: {type?: 'user' | 'group'} = {}) {
  return fetchWithAuth(
    namesApi + (type ? `?${new URLSearchParams({type})}` : '')
  );
}
