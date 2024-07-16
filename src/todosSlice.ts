import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "./store";

export interface TodoType {
  id: string;
  title: string;
  text: string;
  label: string;
  indeterminate: boolean;
  checked: boolean;
  isCompleted: boolean;
  subTasks: TodoType[];
  path: string[];
  color?: string;
}

export interface Toggler {
  idToToggle: string;
  checked: boolean;
}

interface TodosState {
  todoArray: TodoType[];
  taskIndex: { [id: string]: TodoType };
  activeTask: TodoType | null;
  todoTitle: string;
  todoText: string;
}

const initialState: TodosState = {
  todoArray: localStorage.todos ? JSON.parse(localStorage.todos) : [],
  activeTask: null,
  todoTitle: "",
  todoText: "",
  taskIndex: {},
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    titleHandler(state, action: PayloadAction<string>) {
      state.todoTitle = action.payload;
    },
    textHandler(state, action: PayloadAction<string>) {
      state.todoText = action.payload;
    },

    addTask(state) {
      if (state.todoTitle.trim().length) {
        const newTask: TodoType = {
          id: uuidv4(),
          title: state.todoTitle,
          label: state.todoTitle,
          text: state.todoText,
          checked: false,
          indeterminate: false,
          isCompleted: false,
          subTasks: [],
          path: [],
        };
        // state.taskIndex[newTask.id] = newTask;

        state.todoArray.push(newTask); // Update todoArray for display
        localStorage.setItem("todos", JSON.stringify(state.todoArray));
        state.todoTitle = "";
        state.todoText = "";
      }
    },

    addSubtask(state, action: PayloadAction<string>) {
      const parentId = action.payload;
      const parent = state.todoArray.find((item) => item.id === parentId);

      if (parent && state.todoTitle.trim().length) {
        const newTask: TodoType = {
          id: uuidv4(),
          title: state.todoTitle,
          text: state.todoText,
          isCompleted: false,
          label: state.todoTitle,
          indeterminate: false,
          checked: false,
          subTasks: [],
          path: [...(parent.path || []), parentId],
        };
        state.todoArray.push(newTask);
        localStorage.setItem("todos", JSON.stringify(state.todoArray));
        state.todoTitle = "";
        state.todoText = "";
      }
    },

    removeTask(state, action: PayloadAction<string>) {
      const idToRemove = action.payload;

      const index = state.todoArray.findIndex((item) => item.id === idToRemove);
      if (index !== -1) {
        const path = state.todoArray[index].path.concat(idToRemove);

        state.todoArray = state.todoArray.filter(
          (item) =>
            item.id !== idToRemove &&
            !item.path.join("/").startsWith(path.join("/"))
        );
      }

      localStorage.setItem("todos", JSON.stringify(state.todoArray));
      if (!state.todoArray.length) {
        state.activeTask = null;
        localStorage.removeItem("todos");
      }
    },

    completeToggler(state, action: PayloadAction<Toggler>) {
      const { idToToggle, checked } = action.payload;
      const node = state.todoArray.find((item) => item.id === idToToggle);
      if (node) {
        node.checked = checked;
        node.indeterminate = false;

        // Update children
        if (node.path) {
          const path = node.path.concat(idToToggle);
          state.todoArray.forEach((item) => {
            if (path.every((p, idx) => item?.path[idx] === p)) {
              item.checked = checked;
              item.indeterminate = false;
            }
          });
        }

        // Update parents
        for (let i = node.path.length - 1; i >= 0; i--) {
          const parentId = node?.path[i];
          const parent = state.todoArray.find((item) => item.id === parentId);
          if (parent) {
            const children = state.todoArray.filter(
              (item: TodoType) =>
                item.path.length === parent.path.length + 1 &&
                item.path[parent.path.length] === parentId
            );
            const allChecked = children.every((child) => child.checked);
            const allUnchecked = children.every(
              (child) => !child.checked && !child.indeterminate
            );

            if (allChecked) {
              parent.checked = true;
              parent.indeterminate = false;
            } else if (allUnchecked) {
              parent.checked = false;
              parent.indeterminate = false;
            } else {
              parent.checked = false;
              parent.indeterminate = true;
            }
          }
        }
        localStorage.setItem("todos", JSON.stringify(state.todoArray));
      }
    },
  },
});

export const {
  titleHandler,
  textHandler,
  addTask,
  addSubtask,
  removeTask,
  completeToggler,
} = todosSlice.actions;

export const selectTodos = (state: RootState) => state.todos;

export default todosSlice.reducer;
