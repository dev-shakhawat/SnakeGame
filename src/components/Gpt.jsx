import React, { useEffect, useRef, useState } from 'react';

export const Game = () => {

    // constants
    const GRID_SIZE = 20;
    const CELL_SIZE = 20;
    const INITIAL_SNAKE = [{ x: 10, y: 10 }];
    const INITIAL_FOOD = { x: 15, y: 15 };
    const INITIAL_DIRECTION = "RIGHT";

    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState(INITIAL_FOOD);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameover, setGameover] = useState(false);

    // useRef for smoother control
    const directionRef = useRef(direction);

    useEffect(() => {
        directionRef.current = direction;
    }, [direction]);

    const FoodGenerate = () => {
        const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

        return snake.some((snk) => snk.x === newFood.x && snk.y === newFood.y)
            ? FoodGenerate()
            : newFood;
    };

    const MoveSnake = () => {
        if (gameover) return;

        let head = { ...snake[0] };

        switch (directionRef.current) {
            case "UP":
                head.y -= 1;
                break;
            case "DOWN":
                head.y += 1;
                break;
            case "LEFT":
                head.x -= 1;
                break;
            case "RIGHT":
                head.x += 1;
                break;
            default:
                break;
        }

        // check game over
        if (
            head.x < 0 ||
            head.x >= GRID_SIZE ||
            head.y < 0 ||
            head.y >= GRID_SIZE ||
            snake.some((snk) => snk.x === head.x && snk.y === head.y)
        ) {
            setGameover(true);
            return;
        }

        const newSnake = [head, ...snake];

        if (head.x === food.x && head.y === food.y) {
            setScore(prev => prev + 1);
            setFood(FoodGenerate());
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    // keyboard control
    useEffect(() => {
        const handleKeyPress = (e) => {
            const current = directionRef.current;
            switch (e.key) {
                case "ArrowUp":
                    if (current !== "DOWN") setDirection("UP");
                    break;
                case "ArrowDown":
                    if (current !== "UP") setDirection("DOWN");
                    break;
                case "ArrowLeft":
                    if (current !== "RIGHT") setDirection("LEFT");
                    break;
                case "ArrowRight":
                    if (current !== "LEFT") setDirection("RIGHT");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    // game loop
    useEffect(() => {
        const interval = setInterval(MoveSnake, 200);
        return () => clearInterval(interval);
    }, [snake, gameover]);

    const renderGrids = () => {
        const grid = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const isSnake = snake.some((snk) => snk.x === j && snk.y === i);
                const isFood = food.x === j && food.y === i;

                grid.push(
                    <div
                        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-black/10 
                            ${isSnake && !isFood ? "bg-green-600" : ""} 
                            ${isFood && !isSnake ? "bg-red-600" : ""} 
                            ${!isSnake && !isFood ? "bg-white" : ""}`}
                        key={`${i}-${j}`}
                    ></div>
                );
            }
        }
        return grid;
    };

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setFood(FoodGenerate());
        setDirection("RIGHT");
        directionRef.current = "RIGHT";
        setScore(0);
        setGameover(false);
    };

    return (
        <div className="grid place-items-center h-screen bg-gray-100">
            <div className="lg:w-1/2 w-11/12 rounded-xl shadow-[rgba(0,0,0,0.24)_0px_3px_8px] overflow-hidden">
                {/* score board */}
                <div className="flex justify-between bg-[#47565A] p-2 text-white items-center">
                    <h2 className="font-bold">Snake Game</h2>
                    <div>
                        <h3>Best Score: {Math.max(score, bestScore)}</h3>
                        <h3>Your Score: {score}</h3>
                    </div>
                </div>

                {/* game board */}
                <div
                    className="overflow-auto bg-gray-200"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                        gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                        width: `${GRID_SIZE * CELL_SIZE}px`,
                        height: `${GRID_SIZE * CELL_SIZE}px`,
                    }}
                >
                    {renderGrids()}
                </div>

                {/* controls */}
                <div>
                    <button onClick={resetGame} type="button" className="bg-[#47565A] text-white p-2 w-full" > Start Game  </button>
                </div>
            </div>
        </div>
    );
};
