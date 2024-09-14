import { onAuthStateChanged } from "firebase/auth";
import { child, onValue, push, ref, update } from "firebase/database";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Item from "../components/home/Item";
import { auth, db } from "../util/firebase";

interface MessagesType {
  email: string;
  id: string | null;
  message: string;
  username: string;
}

function Home() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Array<MessagesType>>([]);
  const [typeText, setTypeText] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [date, setDate] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const checkSignedStatus = async () => {
    onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");

      setEmail(user?.email ? user.email : "");
      setDisplayName(user?.displayName ? user.displayName : "");
    });
  };
  useEffect(() => {
    checkSignedStatus();
    getData();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getData = async () => {
    const userRef = ref(db, "chatroom/");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const dataArray = Object.keys(data).map((key) => {
        return data[key];
      }) as Array<MessagesType>;

      setMessages(dataArray);
    });
  };

  const postData = async () => {
    if (typeText === "") return;

    const newKey = push(child(ref(db), "chatroom/")).key;
    // set(ref(db, "chatroom/" + newKey), {
    //   username: "jacky",
    //   email: "jackyemail",
    //   message: "hi333",
    //   id: newKey,
    // });
    const updates: { [key: string]: MessagesType } = {};
    updates["/chatroom/" + newKey] = {
      username: displayName,
      email,
      message: typeText,
      id: newKey,
    };

    await update(ref(db), updates);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    setTypeText("");
  };
  const handleTypeTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTypeText(event.target.value);
  };
  const enterKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      postData();
    }
  };

  return (
    <Main>
      <Container ref={chatContainerRef}>
        {messages.map((v) => {
          const isCurrentUser = displayName === v.username;
          return (
            <Item
              isCurrentUser={isCurrentUser}
              id={v.id}
              username={v.username}
              message={v.message}
              key={v.id}
            />
          );
        })}
      </Container>
      <div className="input__container">
        <input
          type="text"
          id="expenseItem"
          placeholder="Say something ..."
          onChange={handleTypeTextChange}
          value={typeText}
          onKeyDown={enterKeyDown}
        />
        <button onClick={postData}>
          <BiSend />
        </button>
      </div>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  grid-area: main;
  gap: 1rem;

  .input__container {
    width: 100%;
    flex: 0 0 4rem;
    /* background-color: var(--inputs-bg); */
    background-color: var(--input-secondary);
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-inline: 0.75rem;

    input {
      border: none;
      height: 2.75rem;
      padding-inline: 1.5rem;
      font-size: 1.25rem;
      color: #555;
      background-color: var(--inputs-bg);
      /* border-bottom: 0.125rem solid #ccc; */
      border: none;
      flex: 1 1;
      width: 100%;
      border-radius: 1.5rem;
      outline: 0.125rem solid #ccc;

      &::placeholder {
        color: #ccc;
      }

      &:focus-visible {
        outline: 0.125rem solid var(--input-border-focus);
        background-color: #fff;
      }

      &:not(:focus-visible):hover {
        outline: 0.125rem solid #aaa;
      }
    }

    button {
      flex: 0 0 2.75rem;
      height: 2.75rem;
      border: none;
      cursor: pointer;
      border-radius: 50%;
      background-color: var(--btn-primary);
      font-size: 1.5rem;
      color: #555;
      display: grid;
      place-items: center;

      &:active {
        background-color: #bce1c7;
      }
    }
  }
`;
const Container = styled.div`
  flex: 1 1;
  background-color: #fff;
  border-radius: 1.5rem;
  padding: 1rem;
  overflow: auto;
`;

export default Home;
