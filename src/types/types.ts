export type TodoType = {
  id: string;
  title: string;
  text: string;
  isCompleted: boolean;
  subTasks: TodoType[];
  checked: boolean;
  indeterminate: boolean;
  path: string[];
};
