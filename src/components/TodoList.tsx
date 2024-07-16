import React, {
  useState,
  useCallback,
  useMemo,
  FunctionComponent,
} from "react";

import { useSelector } from "react-redux";
import { RootState } from "../store";
import TodoItem from "./TodoItem";
import SearchBox from "./ui/SearchBox";
import styles from "../style/todos.module.scss";
import { TodoType } from "../types/types";
import addIcon from "../assets/icons/add.svg";

import get from "lodash/get";

type ListProps = {
  modalToggler: () => void;
};

const TodoList: FunctionComponent<ListProps> = ({ modalToggler }) => {
  const todoArray = useSelector((state: RootState) => state.todos.todoArray);
  const [search, setSearch] = useState("");
  function buildTree(data: TodoType[]) {
    const idMap: { [id: string]: TodoType } = {};
    const tree: TodoType[] = [];

    data.forEach((node) => {
      idMap[node.id] = { ...node, subTasks: [] };
    });

    data.forEach((node) => {
      if (node?.path) {
        if (node.path.length === 0) {
          tree.push(idMap[node.id]);
        } else {
          const parent = idMap[node.path[node.path.length - 1]];
          if (parent) {
            parent.subTasks.push(idMap[node.id]);
          } else {
            tree.push(idMap[node.id]);
          }
        }
      }
    });

    return tree;
  }

  const HandlesetSearch = (
    searchValue: string,
    searchedElemArr: TodoType[],
    searchFieldsArr: string[]
  ): TodoType[] => {
    if (!searchValue) return searchedElemArr;

    const findelems = searchedElemArr.filter((item) => {
      return searchFieldsArr.some((searchField) => {
        const val = get(item, searchField, null);

        if (val && (typeof val === "number" || typeof val === "string")) {
          return `${val}`
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase());
        }
        return false;
      });
    });
    const elementsInPath = new Set<any>();

    // Collect IDs from paths if more than one findelem
    if (findelems.length) {
      findelems.forEach((item) => {
        elementsInPath.add(item.id.toString());
        if (item.path) {
          item.path.forEach((id) => elementsInPath.add(id));
        }
      });

      // Find elements whose IDs are in the path
      searchedElemArr.forEach((item) => {
        if (item.path && item.path.some((id) => elementsInPath.has(id))) {
          elementsInPath.add(item.id);
        }
      });
    }

    return searchedElemArr.filter((item) =>
      Array.from(elementsInPath).includes(item.id)
    );
  };

  const filteredList = useMemo(() => {
    return HandlesetSearch(search, todoArray, ["title", "id"]);
  }, [search, todoArray]);
  const treeData = buildTree(filteredList);

  return (
    <>
      <div className="input-box">
        <SearchBox onChange={setSearch} searchValue={search} />
      </div>
      <div className={styles.containerList}>
        <div className={styles.todoListContainer}>
          <div className={styles.titleList}>
            <span>ToDo List</span>
            <div>
              <img
                src={addIcon}
                onClick={modalToggler}
                alt="add todo icon"
                className={styles.addIcon}
                tabIndex={0}
              />
            </div>
          </div>
          <div className={styles.todoList}>
            {treeData.map((todoItem) => (
              <TodoItem key={todoItem.id} todoItem={todoItem} search={search} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoList;
