import {useEffect, useState} from 'react';
import {
  addApplicationRole,
  deleteApplicationRole,
  getApplication,
  getApplicationRole,
  getUserIdentities,
  grantRole,
  revokeRole,
  grantRoleInherit,
  revokeRoleInherit,
  updateApplicationRole,
  EffectiveAssignee,
  updatePrivilege,
  queryNames,
} from '../../api/application';

import './KoaApplication.scss';

function prettierJSON(json: object) {
  return JSON.stringify(json, null, '  ');
}

type Application = {
  Role: Array<{id: number; Privilege: Array<{privilege: string}>}>;
  UserPrivilege: Array<{privilege: string; userId: number}>;
  GroupPrivilege: Array<{privilege: string; groupId: number}>;
};

export default function KoaApplication() {
  const [applicationId, setApplicationId] = useState<string>('');
  const [applicationName, setApplicationName] = useState<string>('');
  const [roleName, setRoleName] = useState<string>('');
  const [roleId, setRoleId] = useState<string>('');
  const [roleInheritTo, setRoleInheritTo] = useState<Array<string>>([]);
  const [roleOnUser, setRoleOnUser] = useState<Array<string>>([]);
  const [roleOnGroup, setRoleOnGroup] = useState<Array<string>>([]);
  const [response, setResponse] = useState<string>('');

  const [applicationRole, setApplicationRole] = useState<Application['Role']>(
    []
  );
  const [privilegeUserAssignment, setPrivilegeUserAssignment] = useState<
    Application['UserPrivilege']
  >([]);
  const [privilegeGroupAssignment, setPrivilegeGroupAssignment] = useState<
    Application['GroupPrivilege']
  >([]);

  const setJSONResponse = (json: object) => setResponse(prettierJSON(json));
  const onClickGetApplication = async function () {
    const application = await (await getApplication(applicationId))
      .expect()
      .json();
    setApplicationName(application.name);
    const [user, group] = (
      application.Role as Array<{
        id: number;
        user: Array<{userId: number}>;
        group: Array<{groupId: number}>;
      }>
    ).reduce<[user: Array<string>, group: Array<string>]>(
      (acc, r) => {
        if (r.id !== Number(roleId)) return acc;
        acc[0].push(...r.user.map(({userId}) => String(userId)));
        acc[1].push(...r.group.map(({groupId}) => String(groupId)));
        return acc;
      },
      [[], []]
    );
    setRoleOnUser(user);
    setRoleOnGroup(group);
    setApplicationRole(application.Role);
    setPrivilegeGroupAssignment(application.PrivilegeGroupAssignment);
    setPrivilegeUserAssignment(application.PrivilegeUserAssignment);
  };
  const onClickGetUserIdentities = async function () {
    const userIdentities = await (await getUserIdentities(applicationName))
      .expect()
      .json();
    setJSONResponse(userIdentities);
  };
  const onClickAddRole = async function () {
    if (applicationId === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleName === undefined) {
      alert('The role name is not indicated');
      return;
    }
    const role = await (await addApplicationRole(applicationName, roleName))
      .expect()
      .json();
    setRoleId(role.id);
  };
  const onClickGetRole = async function () {
    if (applicationName === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    const role = await (
      await getApplicationRole(applicationName, Number(roleId))
    )
      .expect()
      .json();
    if (role === undefined) return;
    const {
      name,
      assignor,
    }: {assignor: Array<{id: number; assignorId: number}>; name: string} = role;
    setRoleName(name);
    setRoleInheritTo(assignor?.map(({assignorId}) => String(assignorId)) ?? []);
    setJSONResponse(role);
  };
  const onClickUpdateRole = function () {
    if (applicationName === undefined) {
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
    return updateApplicationRole(applicationName, Number(roleId), roleName);
  };
  const onClickDeleteRole = function () {
    if (applicationName === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    return deleteApplicationRole(applicationName, Number(roleId));
  };
  const onClickGrantRoleInherit = function () {
    if (applicationName === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    if (roleInheritTo.length === 0) {
      alert('The role id inherit to is not indicated');
      return;
    }
    return grantRoleInherit(applicationName, roleId, roleInheritTo[0]);
  };
  const onClickRevokeRoleInherit = function () {
    if (applicationName === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    if (roleInheritTo.length === 0) {
      alert('The role id inherit to is not indicated');
      return;
    }
    return revokeRoleInherit(applicationName, roleId, roleInheritTo[0]);
  };
  const onClickGrantRoleOnUser = function () {
    if (applicationName === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    if (roleOnUser.length === 0) {
      alert('The users the role grant on are not indicated');
      return;
    }
    return grantRole(applicationName, Number(roleId), {
      user: roleOnUser.map(v => Number(v)),
    });
  };
  const onClickRevokeRoleOnUser = function () {
    if (applicationName === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    if (roleOnUser.length === 0) {
      alert('The users the role revoke on are not indicated');
      return;
    }
    return revokeRole(applicationName, Number(roleId), {
      user: roleOnUser.map(v => Number(v)),
    });
  };
  const onClickGrantRoleOnGroup = function () {
    if (applicationName === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    if (roleOnGroup.length === 0) {
      alert('The groups the role grant on are not indicated');
      return;
    }
    return grantRole(applicationName, Number(roleId), {
      group: roleOnUser.map(v => Number(v)),
    });
  };
  const onClickRevokeRoleOnGroup = function () {
    if (applicationName === undefined) {
      alert('The application id is not indicated');
      return;
    }
    if (roleId === undefined) {
      alert('The role id is not indicated');
      return;
    }
    if (roleOnGroup.length === 0) {
      alert('The group the role revoke on are not indicated');
      return;
    }
    return revokeRole(applicationName, Number(roleId), {
      group: roleOnGroup.map(v => Number(v)),
    });
  };
  return (
    <form name="koa-application">
      <QueryName />
      <ul>
        <li>
          <label>
            application{applicationName ? `(${applicationName})` : ''} id
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
        <li>
          <label>
            role inherit to
            <input
              name="inherit-to-id"
              multiple
              required
              value={roleInheritTo}
              onChange={e => setRoleInheritTo(getArrayFromInput(e.target))}
            />
          </label>
        </li>
        <li>
          <label>
            grant role on user
            <input
              name="role-on-user"
              multiple
              required
              value={roleOnUser}
              onChange={e => setRoleOnUser(getArrayFromInput(e.target))}
            />
          </label>
        </li>
        <li>
          <label>
            grant role on group
            <input
              name="role-on-group"
              multiple
              required
              value={roleOnGroup}
              onChange={e => setRoleOnGroup(getArrayFromInput(e.target))}
            />
          </label>
        </li>
      </ul>
      <ul>
        <li>
          <button type="button" onClick={onClickGetApplication}>
            get application
          </button>
        </li>
        <li>
          <button type="button" onClick={onClickAddRole}>
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
          <button type="button" onClick={onClickDeleteRole}>
            delete role
          </button>
        </li>
        <li>
          <button type="button" onClick={onClickGrantRoleInherit}>
            grant role inherit
          </button>
        </li>
        <li>
          <button type="button" onClick={onClickRevokeRoleInherit}>
            revoke role inherit
          </button>
        </li>
        <li>
          <button type="button" onClick={onClickGrantRoleOnUser}>
            grant role on user
          </button>
        </li>
        <li>
          <button type="button" onClick={onClickRevokeRoleOnUser}>
            revoke role on user
          </button>
        </li>
        <li>
          <button type="button" onClick={onClickGrantRoleOnGroup}>
            grant role on group
          </button>
        </li>
        <li>
          <button type="button" onClick={onClickRevokeRoleOnGroup}>
            revoke role on group
          </button>
        </li>
        <li>
          <button type="button" onClick={onClickGetUserIdentities}>
            user identities
          </button>
        </li>
      </ul>

      <ApplicationPrivilege
        applicationName={applicationName}
        role={applicationRole}
        privilegeGroupAssign={privilegeGroupAssignment}
        privilegeUserAssign={privilegeUserAssignment}
      />
      <ul></ul>
      <code style={{whiteSpace: 'pre', fontSize: '0.8em'}}>{response}</code>
    </form>
  );
}

function QueryName() {
  const onClickQueryNames = () => {
    return queryNames({type});
  };
  const [type, setType] = useState<'user' | 'group'>();
  return (
    <ul>
      <li>
        <button type="button" onClick={onClickQueryNames}>
          query names
        </button>
        <label>
          type
          <select onChange={e => setType(e.target.value as 'user' | 'group')}>
            <option value=""></option>
            <option value="user">user</option>
            <option value="group">group</option>
          </select>
        </label>
      </li>
    </ul>
  );
}

function ApplicationPrivilege(
  props: React.PropsWithChildren<{
    applicationName: string;
    role: Application['Role'];
    privilegeUserAssign: Application['UserPrivilege'];
    privilegeGroupAssign: Application['GroupPrivilege'];
  }>
) {
  const {role, privilegeGroupAssign, privilegeUserAssign} = props;

  const [privilegeOnUser, setPrivilegeOnUser] = useState<Set<string>>();
  const [privilegeOnGroup, setPrivilegeOnGroup] = useState<Set<string>>();
  const [privilegeOnRole, setPrivilegeOnRole] = useState<Array<string>>([]);

  const [privilege, setPrivilege] = useState<Set<string>>();
  const [assignee, setAssignee] = useState<EffectiveAssignee>();

  const privilegeType = ['user', 'group', 'role'];
  const [privilegeAdder, setPrivilegeAdder] = useState<{
    type: string;
    id: string;
  }>({type: privilegeType[0], id: ''});

  useEffect(() => {
    const privilegeOnRole = role.reduce<Array<string>>((acc, r) => {
      if ((r.Privilege?.length ?? 0) === 0) return acc;
      acc.push(String(r.id));
      return acc;
    }, []);
    const privilegeOnUser = privilegeUserAssign.reduce<Set<string>>(
      (acc, {userId: id}) => (acc.add(String(id)), acc),
      new Set()
    );
    const privilegeOnGroup = privilegeGroupAssign.reduce<Set<string>>(
      (acc, {groupId: id}) => (acc.add(String(id)), acc),
      new Set()
    );
    setPrivilegeOnRole(privilegeOnRole);
    setPrivilegeOnUser(privilegeOnUser);
    setPrivilegeOnGroup(privilegeOnGroup);
  }, [role, privilegeUserAssign, privilegeGroupAssign]);

  const onSelectPrivilegeOn = (target: HTMLSelectElement) => {
    const selected =
      target.querySelectorAll<HTMLOptionElement>('option:checked');
    const {assignee, privilege} = [...selected.values()].reduce<{
      assignee: EffectiveAssignee;
      privilege: Set<string>;
    }>(
      ({assignee, privilege}, v) => {
        const key = v.dataset['type'];
        if (key !== 'role' && key !== 'group' && key !== 'user')
          return {assignee, privilege};
        const item = assignee[key];
        item.push(v.value);
        if (key === 'role') {
          role
            .find(({id}) => String(id) === v.value)
            ?.Privilege.forEach(v => privilege.add(v.privilege));
        }
        if (key === 'group') {
          privilegeGroupAssign.forEach(({groupId, privilege: p}) => {
            if (String(groupId) !== v.value) return;
            privilege.add(p);
          });
        }
        if (key === 'user') {
          privilegeUserAssign.forEach(({userId, privilege: p}) => {
            if (String(userId) !== v.value) return;
            privilege.add(p);
          });
        }
        return {assignee, privilege};
      },
      {
        assignee: {role: [], group: [], user: []},
        privilege: new Set<string>(),
      }
    );
    setAssignee(assignee);
    setPrivilege(privilege);
  };
  const onClickAddPrivilegeOn = () => {
    const {type, id} = privilegeAdder;
    if (id.trim() === '') return;
    if (type === 'user')
      setPrivilegeOnUser(new Set([...(privilegeOnUser ?? new Set()), id]));
    if (type === 'group')
      setPrivilegeOnGroup(new Set([...(privilegeOnGroup ?? new Set()), id]));
    if (type === 'role') setPrivilegeOnRole([...privilegeOnRole, id]);
  };
  const onClickUpdatePrivilege = () => {
    if (assignee === undefined || privilege === undefined) {
      alert('The assignee and privilege must be dictated');
      return;
    }
    updatePrivilege(props.applicationName, assignee, [...privilege]);
  };
  return (
    <ul>
      <li>
        <label>
          privilege on
          <select
            name="privilege-on"
            multiple
            onChange={e => onSelectPrivilegeOn(e.target)}
          >
            {[...(privilegeOnUser ?? [])].map(id => (
              <option key={`user-${id}`} value={id} data-type="user">
                {id}
              </option>
            ))}
            {[...(privilegeOnGroup ?? [])].map(id => (
              <option key={`group-${id}`} value={id} data-type="group">
                {id}
              </option>
            ))}
            {privilegeOnRole.map(id => (
              <option key={`role-${id}`} value={id} data-type="role">
                {id}
              </option>
            ))}
          </select>
        </label>
      </li>
      <li>
        <label>
          privilege on
          <select
            name="privilege-on-type"
            value={privilegeAdder.type}
            onChange={e =>
              setPrivilegeAdder(s => ({
                ...s,
                type: e.target.value,
              }))
            }
          >
            {privilegeType.map(v => (
              <option value={v} key={v}>
                {v}
              </option>
            ))}
          </select>
          <input
            name="privilege-on-id"
            value={privilegeAdder.id}
            onChange={e =>
              setPrivilegeAdder(s => ({
                ...s,
                id: e.target.value,
              }))
            }
          ></input>
          <button type="button" onClick={onClickAddPrivilegeOn}>
            add
          </button>
        </label>
      </li>
      <li>
        <select
          name="privilege"
          multiple
          value={[...(privilege ?? [])]}
          onChange={e => {
            setPrivilege(
              new Set(
                [
                  ...e.target
                    .querySelectorAll<HTMLOptionElement>('option:checked')
                    .values(),
                ].map(({value}) => value)
              )
            );
          }}
        >
          <option value="CREATE_RESOURCE">CREATE_RESOURCE</option>
          <option value="READ_RESOURCE">READ_RESOURCE</option>
          <option value="MODIFY_RESOURCE">MODIFY_RESOURCE</option>
          <option value="DELETE_RESOURCE">DELETE_RESOURCE</option>
        </select>
        <button type="button" onClick={onClickUpdatePrivilege}>
          update privilege
        </button>
      </li>
    </ul>
  );
}

function getArrayFromInput(target: HTMLInputElement) {
  return target.value.trim() === ''
    ? []
    : target.value.trim().split(/\s*(?:,|;)\s*/i);
}
