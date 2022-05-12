import styled, { ThemeProvider } from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { colorScheme, toDoState } from "./atoms";
import {
  darkTheme,
  redTheme,
  orangeTheme,
  yellowTheme,
  greenTheme,
  skyBlueTheme,
  purpleTheme,
} from "./theme";
import { GlobalStyle } from "./GlobalStyle";
import { Row, Col } from "react-flexbox-grid";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Board } from "./components/Board";
import trashCan from "./img/open-trash-can.png";
import { useEffect } from "react";

const Header = styled(Row)`
  width: 100%;
  height: 40px;
  background-color: white;
  display: flex;
  justify-content: center;
  color: grey;
  font-weight: 500;
  margin-left: 0px;
  margin-right: 0px;
`;

const ColorScheme = styled(Col)`
  justify-self: end;
`;

const Title = styled(Col)`
  margin: auto;
  margin-left: 50px;
  font-weight: 600;
  font-size: large;
`;

const ColorCircles = styled.button<{ color: string }>`
  display: inline-block;
  flex-direction: row;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin: 10px 5px;
  background-color: ${(props) => props.color};
  border: solid 2px;
  cursor: pointer;
`;

const colors = [
  "#e74c3c",
  "#e67e22",
  "#f1c40f",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
];

const colorSwitch = (color: string) => {
  switch (color) {
    case "#e74c3c":
      return redTheme;
    case "#e67e22":
      return orangeTheme;
    case "#f1c40f":
      return yellowTheme;
    case "#2ecc71":
      return greenTheme;
    case "#3498db":
      return skyBlueTheme;
    case "#9b59b6":
      return purpleTheme;
    case "#34495e":
      return darkTheme;
  }
};

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 30px;
`;

const Trash = styled.div`
  display: flex;
  margin: 30px;
  margin-left: 60px;
`;

const Image = styled.img<{ isDraggingOver: boolean }>`
  width: 60px;
  height: 60px;
  transform: ${(props) =>
    props.isDraggingOver
      ? "scale(1.8) rotate(10deg)"
      : "scale(1) rotate(0deg)"};
  transition: transform 0.5s;
`;

function App() {
  const theme = useRecoilValue(colorScheme);

  const setBackgroundColor = useSetRecoilState(colorScheme);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const backgroundColorChange = (color: string) => {
    const colorScheme = colorSwitch(color);
    if (!colorScheme) return;
    setBackgroundColor(colorScheme);
  };

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination.droppableId === "trash") {
      setToDos((allBoards) => {
        const newBoard = [...allBoards[source.droppableId]];
        newBoard.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: newBoard,
        };
      });
    } else if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const newBoard = [...allBoards[source.droppableId]];
        const reorderedObj = newBoard[source.index];
        newBoard.splice(source.index, 1);
        newBoard.splice(destination?.index, 0, reorderedObj);
        return {
          ...allBoards,
          [source.droppableId]: newBoard,
        };
      });
    } else if (destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const reorderedObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, reorderedObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  useEffect(() => {
    const savedToDos = localStorage.getItem("toDos");
    if (!savedToDos) return;
    setToDos(JSON.parse(savedToDos));
  }, [setToDos]);

  useEffect(() => {
    localStorage.setItem("toDos", JSON.stringify(toDos));
  }, [toDos]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header between="xs">
        <Title xs={3}>What-To-Do</Title>
        <ColorScheme xs={7}>
          {colors.map((color) => (
            <ColorCircles
              color={color}
              onClick={() => backgroundColorChange(color)}
            />
          ))}
        </ColorScheme>
      </Header>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
        <Droppable droppableId="trash">
          {(provided, snapshot) => (
            <Trash ref={provided.innerRef} {...provided.droppableProps}>
              <Image
                isDraggingOver={snapshot.isDraggingOver}
                src={trashCan}
                alt="Trash"
              />
            </Trash>
          )}
        </Droppable>
      </DragDropContext>
    </ThemeProvider>
  );
}

export default App;
