import { FunctionComponent, useState } from "react";

import Button from "./ui/Button";
import Header from "./ui/Header";
import Footer from "./ui/Footer";
import Clock from "./ui/Clock";
import ModalWindow from "./ui/ModalWindow";
import TodoList from "./TodoList";

import { AppDispatch } from "../store";
import { useDispatch, useSelector } from "react-redux";

import { addTask } from "../todosSlice"; // Import only the necessary actions

const App: FunctionComponent = () => {
  const [isModalShown, setIsModalShown] = useState(false);

  function modalWindowToggler() {
    setIsModalShown((prevModalState) => !prevModalState);
  }
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <Header />

      <main className="container main">
        {isModalShown && (
          <ModalWindow modalToggler={modalWindowToggler}>
            <Button btnText="add todo" onClick={() => dispatch(addTask())} />
          </ModalWindow>
        )}
        <Clock />
        <TodoList modalToggler={modalWindowToggler} />
      </main>
      <Footer />
    </>
  );
};

export default App;
