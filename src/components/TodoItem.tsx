import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addSubtask, removeTask, completeToggler } from "../todosSlice";

import addIcon from "../assets/icons/add.svg";
import deleteIcon from "../assets/icons/delete.svg";
import chevronIcon from "../assets/icons/chevron.svg";
import styles from "../style/todos.module.scss";

import Checkbox from "./ui/Checkbox";
import ModalWindow from "./ui/ModalWindow";
import Button from "./ui/Button";
import { TodoType } from "../types/types";

type TodoItemProps = {
  todoItem: TodoType;
  search: string;
};

const TodoItem: React.FunctionComponent<TodoItemProps> = ({
  todoItem,
  search,
}) => {
  const { id, title, text, checked, indeterminate } = todoItem;
  const [isModalShown, setIsModalShown] = useState(false);
  const [isSubTasksShown, setIsSubTasksShown] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const handleModalWindowToggle = () => {
    setIsModalShown((prevModalState) => !prevModalState);
  };

  const handleSubTasksToggle = () => {
    setIsSubTasksShown((prevSubTasks) => !prevSubTasks);
  };

  const handleAddSubtask = () => {
    dispatch(addSubtask(id));
    handleModalWindowToggle();
  };

  const highlightText = (
    text: string,
    highlight: string
  ): React.ReactNode[] => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <h3 key={index} className={`midHeader ${styles.titleHighlight}`}>
          {part}
        </h3>
      ) : (
        <h3 key={index} className={`midHeader ${styles.title}`}>
          {part}
        </h3>
      )
    );
  };

  return (
    <>
      {isModalShown && (
        <ModalWindow modalToggler={handleModalWindowToggle}>
          <Button btnText="Add Subtask" onClick={handleAddSubtask} />
        </ModalWindow>
      )}
      <div className={styles.todoItem}>
        <img
          src={chevronIcon}
          alt=""
          className={
            isSubTasksShown ? `${styles.icons} ${styles.rotated}` : styles.icons
          }
          onClick={handleSubTasksToggle}
        />
        <div className={styles.title}>
          <h3 className="midHeader">
            {search ? highlightText(title, search) : title}
          </h3>
          <h5>{text}</h5>
        </div>
        <img
          src={addIcon}
          alt="Add Subtask"
          className={styles.icons}
          onClick={handleModalWindowToggle}
        />
        <Checkbox
          id={id}
          checked={checked}
          indeterminate={indeterminate}
          onChange={() =>
            dispatch(completeToggler({ idToToggle: id, checked: !checked }))
          }
        />
        <img
          src={deleteIcon}
          alt="Delete Task"
          className={styles.icons}
          onClick={() => dispatch(removeTask(id))}
        />
      </div>
      {todoItem.subTasks.length > 0 && (
        <div className={isSubTasksShown ? styles.subTasks : styles.hide}>
          {todoItem?.subTasks?.map((subTask) => (
            <TodoItem key={subTask.id} todoItem={subTask} search={search} />
          ))}
        </div>
      )}
    </>
  );
};

export default TodoItem;
