import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "src/util/firebase";
import classNames from "classnames";
interface ItemProps {
  id: string | null;
  username: string;
  message: string;
  isCurrentUser: boolean;
}

function Item(props: ItemProps) {
  const { username, message, isCurrentUser } = props;
  const messageClass = classNames({
    "msg--right": isCurrentUser,
  });
  return (
    <>
      <Msg className={messageClass}>
        <p>{username}</p>
        <div>{message}</div>
      </Msg>
    </>
  );
}

const Msg = styled.div`
  &.msg--right {
    text-align: end;

    div {
      background-color: var(--card-hover);
    }
  }

  p {
    margin: 0.5rem;
  }

  div {
    display: inline-block;
    background-color: var(--input-secondary);
    /* background-color: #d2e3fc; */
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
  }
`;

export default Item;
