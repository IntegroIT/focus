import React from "react";
import { useObserver } from "mobx-react-lite";
import counterStore from "../store/Appstate";

const Counter = () => {
  return useObserver(() => (
    <div>
      <h2>Count: {counterStore.count}</h2>
      <button onClick={counterStore.decrement}>Decrement</button>
      <button onClick={counterStore.increment}>Increment</button>
    </div>
  ));
};

export default Counter;
