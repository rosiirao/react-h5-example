import {ClipboardEventHandler, FormEventHandler, useCallback} from 'react';
import './Form.scss';

let inMemoryToken: {jwt_token: string; jwt_token_exp: string};

const loginApi = 'https://dev.notacup.com:3443/auth/login';
const authApi = 'https://dev.notacup.com:3443/auth/who';
const login = async (form: HTMLFormElement) => {
  const response = await fetch(loginApi, {
    method: 'post',
    credentials: 'include',
    mode: 'cors',
    body: new URLSearchParams(
      new FormData(form) as unknown as Record<string, string>
    ),
  });
  const {jwt_token, jwt_token_exp} = await response.json();
  inMemoryToken = {jwt_token, jwt_token_exp};
};

export default () => {
  const handleSubmit = useCallback(e => {
    e.preventDefault();
    window.navigator.vibrate(5000);
  }, []);

  const handlePaste: ClipboardEventHandler = useCallback(e => {
    e.preventDefault();
    console.log(e.clipboardData);
  }, []);

  const handleLogin: FormEventHandler = useCallback(async e => {
    e.preventDefault();
    login(e.target as HTMLFormElement)
      .then(() => {
        alert('login success!');
      })
      .catch(e => {
        console.error(e);
        alert('login failed!');
      });
  }, []);

  const handleAuth: FormEventHandler = useCallback(async e => {
    e.preventDefault();
    const response = await fetch(authApi, {
      headers: {
        Authorization: 'Bearer ' + inMemoryToken?.jwt_token,
      },
    }).catch(() => {
      alert('Please Login First!');
    });
    if (response === undefined) return;
    alert(await response.text());
  }, []);

  return (
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      <form
        action=""
        method="get"
        className="form-example"
        onSubmit={handleSubmit}
      >
        <h2>Register</h2>
        <div className="form-example">
          <label htmlFor="name">Enter your name: </label>
          <input
            type="text"
            name="name"
            required
            pattern="[\S\-_]{1,14}(\s[\S\-_]{1,14}){0,3}"
          />
        </div>
        <div className="form-example">
          <label htmlFor="email">Enter your email: </label>
          <input type="email" name="email" required onPaste={handlePaste} />
        </div>
        <div className="form-example">
          <input type="submit" value="Subscribe!" />
        </div>
      </form>
      <form
        action=""
        method="post"
        className="form-example"
        onSubmit={handleLogin}
      >
        <h2>Login</h2>
        <div className="form-example">
          <label htmlFor="username">Email: </label>
          <input type="email" name="username" required onPaste={handlePaste} />
        </div>
        <div className="form-example">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            required
            onPaste={handlePaste}
          />
        </div>
        <div className="form-example">
          <input type="submit" value="Login!" />
        </div>
      </form>
      <form
        className="form-example"
        action=""
        method="get"
        onSubmit={handleAuth}
      >
        <h2>Who am i</h2>
        <div className="form-example">
          <input type="submit" value="Check!" />
        </div>
      </form>
    </div>
  );
};
