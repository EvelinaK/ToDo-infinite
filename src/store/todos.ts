// import { makeAutoObservable } from 'mobx';
// import { v4 as uuidv4 } from 'uuid';

// import { TodoType } from '../types/types';
// import { recursionFilter, recursionCompleteToggler, recursionSearch, subTaskAdding } from '../utils/utils';

// class Todos {
//   todoArray:TodoType[] = localStorage.todos ? JSON.parse(localStorage.todos) : [];
//   activeTask:TodoType | null = null;
//   todoTitle = '';
//   todoText = '';

//   constructor() {
//     makeAutoObservable(this)
//   }

//   titleHandler = (str: string) => {
//     this.todoTitle = str;
//   }

//   textHandler = (str: string) => {
//     this.todoText = str;
//   }

//   addTask = () => {
//     if (this.todoTitle.trim().length) {
//       this.todoArray.push({
//         id: uuidv4(),
//         title: this.todoTitle,
//         text: this.todoText,
//         isCompleted: false,
//         subTasks: [],
//       });

//       localStorage.setItem('todos', JSON.stringify(this.todoArray));
//       this.todoTitle = '';
//       this.todoText = '';
//     }
//   }

//   addSubtask = (id: string) => {
//     if (this.todoTitle.trim().length) {
//       const task = {
//         id: uuidv4(),
//         title: this.todoTitle,
//         text: this.todoText,
//         isCompleted: false,
//         subTasks: [],
//       };

//       this.todoArray = subTaskAdding(id, this.todoArray, task);
//       localStorage.setItem('todos', JSON.stringify(this.todoArray));
//       this.todoTitle = '';
//       this.todoText = '';
//     }
//   }

//   removeTask = (id: string) => {
//     this.todoArray = recursionFilter(id, this.todoArray);
//     localStorage.setItem('todos', JSON.stringify(this.todoArray));

//     if (!this.todoArray.length) {
//       this.activeTask = null;
//       localStorage.removeItem('todos');
//     }
//   }

//   completeToggler = (id: string) => {
//     this.todoArray = recursionCompleteToggler(id, this.todoArray);
//     localStorage.setItem('todos', JSON.stringify(this.todoArray));
//   }

//   chooseTask = (id: string) => {
//     this.activeTask = recursionSearch(id, this.todoArray);
//   }
// }

// const todos = new Todos();

// export default todos;
import { makeAutoObservable, observable } from "mobx";
import { v4 as uuidv4 } from "uuid";

import { TodoType } from "../types/types";
import {
  recursionFilter,
  recursionCompleteToggler,
  recursionSearch,
} from "../utils/utils";

class Todos {
  todoArray: TodoType[] = localStorage.todos
    ? JSON.parse(localStorage.todos)
    : [];
  activeTask: TodoType | null = null;
  todoTitle = "";
  todoText = "";
  taskIndex: Map<string, TodoType>;

  constructor() {
    makeAutoObservable(this);
    this.taskIndex = makeAutoObservable(new Map<string, TodoType>());
    this.todoArray.forEach((task) => this.indexTasks(task));
  }

  indexTasks(task: TodoType) {
    this.taskIndex.set(task.id, task);
    task.subTasks.forEach((subTask) => this.indexTasks(subTask));
  }

  titleHandler = (str: string) => {
    this.todoTitle = str;
  };

  textHandler = (str: string) => {
    this.todoText = str;
  };

  addTask = () => {
    if (this.todoTitle.trim().length) {
      const newTask = {
        id: uuidv4(),
        title: this.todoTitle,
        text: this.todoText,
        isCompleted: false,
        subTasks: [],
        path: [], // Initialize path as an empty array for root tasks
      };

      this.todoArray.push(newTask);
      this.taskIndex.set(newTask.id, newTask);
      localStorage.setItem("todos", JSON.stringify(this.todoArray));
      this.todoTitle = "";
      this.todoText = "";
    }
  };
  // addTask(title: string) {
  //   console.log("Adding task:", title);
  //   this.todoArray.push({ id: uuidv4(), title, completed: false });
  // }
  addSubtask = (parentId: string) => {
    debugger;
    // if (this.todoTitle.trim().length) {
    //   const parentTask = this.taskIndex.get(parentId);
    //   if (!parentTask) throw new Error("Parent task not found");

    //   const parentPath = parentTask.path || []; // Ensure parentPath is not undefined
    //   const newTask = {
    //     id: uuidv4(),
    //     title: this.todoTitle,
    //     text: this.todoText,
    //     isCompleted: false,
    //     subTasks: [],
    //     path: [...parentPath, parentId], // Spread operator with parentPath
    //   };

    //   parentTask.subTasks.push(newTask);
    //   this.taskIndex.set(newTask.id, newTask);
    //   console.log(this, "this.todoArray");
    //   debugger;
    //   localStorage.setItem("todos", JSON.stringify(this.todoArray));

    //   this.todoTitle = "";
    //   this.todoText = "";
    //   console.log(`Subtask added to parent task with id ${parentId}`);
    // }
    if (this.todoTitle.trim().length) {
      const parentTask = this.taskIndex.get(parentId);

      if (!parentTask) throw new Error("Parent task not found");
      const parentPath = parentTask.path || [];

      const newTask = {
        id: uuidv4(),
        title: this.todoTitle,
        text: this.todoText,
        isCompleted: false,
        subTasks: [],
        path: [...parentPath, parentId], // Spread operator with parentPath
      };

      parentTask.subTasks.push(newTask);
      console.log(parentTask, "parentTask");

      this.taskIndex.set(newTask.id, newTask);
      localStorage.setItem("todos", JSON.stringify(this.todoArray));
      this.todoTitle = "";
      this.todoText = "";
      console.log("Subtask added:", newTask);
    } else {
      console.error("Subtask title is empty");
    }
  };

  removeTask = (id: string) => {
    const taskToRemove = this.taskIndex.get(id);
    if (!taskToRemove) return;

    const parentPath = taskToRemove.path || []; // Ensure parentPath is not undefined
    const parentTask = this.taskIndex.get(parentPath[parentPath.length - 1]);
    if (parentTask) {
      parentTask.subTasks = parentTask.subTasks.filter(
        (subTask) => subTask.id !== id
      );
    } else {
      this.todoArray = this.todoArray.filter((task) => task.id !== id);
    }

    this.taskIndex.delete(id);
    localStorage.setItem("todos", JSON.stringify(this.todoArray));

    if (!this.todoArray.length) {
      this.activeTask = null;
      localStorage.removeItem("todos");
    }
  };

  completeToggler = (id: string) => {
    const task = this.taskIndex.get(id);
    if (task) {
      task.isCompleted = !task.isCompleted;
      localStorage.setItem("todos", JSON.stringify(this.todoArray));
    }
  };

  chooseTask = (id: string) => {
    debugger;
    this.activeTask = this.taskIndex.get(id) || null;
  };

  // batchAddTasks(
  //   tasks: { id: string; title: string; text: string; parentId: string }[]
  // ) {
  //   tasks.forEach(({ id, title, text, parentId }) => {
  //     const parentTask = this.taskIndex.get(parentId);
  //     if (!parentTask) return;

  //     const parentPath = parentTask.path || []; // Ensure parentPath is not undefined
  //     const newTask = {
  //       id: uuidv4(),
  //       title,
  //       text,
  //       isCompleted: false,
  //       subTasks: [],
  //       path: [...parentPath, parentId], // Spread operator with parentPath
  //     };

  //     parentTask.subTasks.push(newTask);
  //     this.taskIndex.set(newTask.id, newTask);
  //   });

  //   localStorage.setItem("todos", JSON.stringify(this.todoArray));
  // }

  // batchRemoveTasks(ids: string[]) {
  //   ids.forEach((id) => {
  //     this.removeTask(id);
  //   });
  // }

  // generateInitialTasks(taskCount: number = 1000, subTaskCount: number = 5) {
  //   const initialTasks: TodoType[] = Array.from(
  //     { length: taskCount },
  //     (_, index) => {
  //       const id = uuidv4();
  //       const subTasks = Array.from({ length: subTaskCount }, (_, subIndex) => {
  //         const subTaskId = uuidv4();
  //         return {
  //           id: subTaskId,
  //           title: `Subtask ${subIndex + 1} of Task ${index + 1}`,
  //           text: `This is the description for subtask ${
  //             subIndex + 1
  //           } of task ${index + 1}`,
  //           isCompleted: false,
  //           subTasks: [],
  //           path: [id], // Initialize path with parent task id
  //         };
  //       });

  //       const newTask = {
  //         id,
  //         title: `Task ${index + 1}`,
  //         text: `This is the description for task ${index + 1}`,
  //         isCompleted: false,
  //         subTasks: subTasks,
  //         path: [], // Initialize path as an empty array for root tasks
  //       };

  //       subTasks.forEach((subTask) => this.taskIndex.set(subTask.id, subTask));
  //       this.taskIndex.set(id, newTask);
  //       return newTask;
  //     }
  //   );

  //   this.todoArray = initialTasks;
  //   localStorage.setItem("todos", JSON.stringify(this.todoArray));
  // }
}

const todos = new Todos();
// todos.generateInitialTasks();
export default todos;
