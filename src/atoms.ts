import { atom } from "recoil";
import { skyBlueTheme } from "./theme";

export const colorScheme = atom({
  key: "color",
  default: skyBlueTheme,
});

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
});
