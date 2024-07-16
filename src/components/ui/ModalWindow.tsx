import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { titleHandler, textHandler } from "../../todosSlice"; // Import only the necessary actions

import styles from "../../style/ui/modalWindow.module.scss";
import Button from "./Button";
import Input from "./Input";
import TextArea from "./TextArea";

type ModalProps = {
  children: JSX.Element | JSX.Element[];
  modalToggler: () => void;
};

const ModalWindow: FunctionComponent<ModalProps> = ({
  children,
  modalToggler,
}) => {
  const dispatch = useDispatch();
  const { todoTitle, todoText } = useSelector(
    (state: RootState) => state.todos // Assuming 'todos' is the slice name in your rootReducer
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(titleHandler(e.target.value.trim()));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(textHandler(e.target.value));
  };

  return (
    <div className={styles.blackout}>
      <div className={`${styles.flexColumn} ${styles.controls}`}>
        <div className={styles.flexColumn}>
          <Input
            value={todoTitle}
            onChange={handleTitleChange}
            placeholder="Todo title..."
          />
          <TextArea
            value={todoText}
            onChange={handleTextChange}
            placeholder="Todo text..."
          />
        </div>
        {children}
        <Button btnText="close window" onClick={modalToggler} />
      </div>
    </div>
  );
};

export default ModalWindow;
