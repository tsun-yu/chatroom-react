import classNames from "classnames";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import styled from "styled-components";
import LoginSection from "../components/loginPage/LoginSection";
import { auth } from "../util/firebase";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [hasMember, setHasMember] = useState(true);
  const loginClass = classNames({ active: hasMember }, "switch__option");
  const signupClass = classNames({ active: !hasMember }, "switch__option");
  const checkSignedStatus = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true);
        return;
      }
      setIsLogin(false);
    });
  };

  useEffect(() => {
    checkSignedStatus();
  }, []);

  const hasMemeberToggle = () => {
    setHasMember((prev) => !prev);
  };

  return (
    <Container>
      <div className="login">
        {isLogin ? (
          <h1>Logged In</h1>
        ) : (
          <>
            <div className="switch">
              <div className={loginClass} onClick={hasMemeberToggle}>
                Log In
              </div>
              <div className={signupClass} onClick={hasMemeberToggle}>
                Sign Up
              </div>
            </div>
            {hasMember ? (
              <LoginSection label="Login" hasMember={hasMember} />
            ) : (
              <LoginSection label="Signup" hasMember={hasMember} />
            )}
          </>
        )}
      </div>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  background-color: var(--bg-secondary);
  /* width: 100vw; */
  height: 100vh;
  display: flex;
  justify-content: center;

  .login {
    width: min(100%, 400px);

    > h1 {
      text-align: center;
    }

    .switch {
      background-color: var(--input-secondary);
      border-radius: 2rem;
      display: flex;
      align-items: center;
      margin-bottom: 1rem;

      .switch__option {
        flex: 1 1 100%;
        display: flex;
        justify-content: center;
        font-size: 1.25rem;
        font-weight: 600;
        border-radius: 2rem;
        padding: 1rem;
        cursor: pointer;

        &.active {
          background-color: var(--card-hover);
          color: var(--color-primary);
        }

        &:hover:not(.active) {
          background: linear-gradient(
            0deg,
            rgba(68, 71, 70, 0.08),
            rgba(68, 71, 70, 0.08)
          );
        }
      }
    }
  }
`;
