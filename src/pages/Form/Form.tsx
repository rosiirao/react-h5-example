import {ClipboardEventHandler, FormEventHandler, useCallback} from 'react';
import './Form.scss';

import authApi from '../../api/auth';

const {register, login, user} = authApi;

export default () => {
  const formAction: Record<string, <T>(form: FormData) => Promise<T | void>> = {
    register: async form => {
      const [, error] = await register(form);
      if (error !== undefined) {
        console.error(error);
        alert(`register failed: ${error.message}`);
        return;
      }
      alert('register succeed!');
    },
    login: async form => {
      const [, error] = await login(form);
      if (error !== undefined) {
        console.error(error);
        alert(`login failed: ${error.message}`);
        return;
      }
      alert('login succeed!');
    },
    user: async () => {
      const [u, error] = await user();
      if (error !== undefined) {
        alert(`can't get user info: ${error.message}`);
        return;
      }
      if (u === undefined) {
        alert("You haven't login!");
        return;
      }
      alert(`You are ${u}`);
    },
  };

  const handleSubmit = useCallback<FormEventHandler>(e => {
    e.preventDefault();
    window.navigator.vibrate(5000);
    const form = e.target as HTMLFormElement;
    const name = form.getAttribute('name') ?? '';
    const action = formAction[name];
    if (action === undefined) {
      alert(`Undefined submit action to form : "${name}"`);
      return;
    }
    action(new FormData(form));
  }, []);

  const handlePaste: ClipboardEventHandler = useCallback(e => {
    e.preventDefault();
    console.log(e.clipboardData);
  }, []);

  return (
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      <form
        name="register"
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
          <label htmlFor="password">
            Password:
            <input
              id="password"
              type="password"
              name="password"
              required
              onPaste={handlePaste}
            />
          </label>
        </div>
        <div className="form-example">
          <input type="submit" value="Register!" />
        </div>
      </form>
      <form
        name="login"
        method="post"
        className="form-example"
        onSubmit={handleSubmit}
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
        name="user"
        method="get"
        onSubmit={handleSubmit}
      >
        <h2>Who am i</h2>
        <div className="form-example">
          <input type="submit" value="Check!" />
        </div>
      </form>
    </div>
  );
};
