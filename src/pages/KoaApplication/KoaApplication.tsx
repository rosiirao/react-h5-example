import {useState} from 'react';
import {
  addApplicationRole,
  deleteApplicationRole,
  getApplication,
  getApplicationRole,
  updateApplicationRole,
} from '../../api/application';

export default function KoaApplication() {
  const [applicationId, setApplicationId] = useState<string>();
  const [roleName, setRoleName] = useState<string>();
  const [roleId, setRoleId] = useState<string>();
  const onClickGetApplicition = function () {
    return getApplication(applicationId);
  };
  const onClcikAddRole = function () {
    if (applicationId === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleName === undefined) {
      alert('The role name is not indicated');
      return;
    }
    return addApplicationRole(applicationId, roleName);
  };
  const onClickGetRole = async function () {
    if (applicationId === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    const [role, error] = await getApplicationRole(applicationId, roleId);
    if (error !== undefined) return;
    if (role === undefined) return;
    setRoleName((await role.json()).name);
  };
  const onClickUpdateRole = function () {
    if (applicationId === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    if (roleName === undefined) {
      alert('The new role name is not indicated');
      return;
    }
    return updateApplicationRole(applicationId, roleId, roleName);
  };
  const onClcikDeleteRole = function () {
    if (applicationId === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    return deleteApplicationRole(applicationId, roleId);
  };
  return (
    <form name="koa-application">
      <ul>
        <li>
          <label>
            application id
            <input
              name="application-id"
              value={applicationId}
              onChange={e => setApplicationId(e.target.value)}
            />
          </label>
        </li>
        <li>
          <label>
            role id
            <input
              name="role-id"
              required
              value={roleId}
              onChange={e => setRoleId(e.target.value)}
            />
          </label>
        </li>
        <li>
          <label>
            role name
            <input
              name="role-name"
              required
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
            />
          </label>
        </li>
      </ul>
      <ul>
        <li>
          <button type="button" onClick={onClickGetApplicition}>
            get application
          </button>
        </li>
        <li>
          <button type="button" onClick={onClcikAddRole}>
            add role
          </button>
        </li>
        <li>
          <button type="button" onClick={onClickGetRole}>
            get role
          </button>
        </li>
        <li>
          <button type="button" onClick={onClickUpdateRole}>
            update role
          </button>
        </li>
        <li>
          <button type="button" onClick={onClcikDeleteRole}>
            delete role
          </button>
        </li>
      </ul>
    </form>
  );
}
