import React, { useEffect, useRef, useState } from 'react'

export const Game = () => {

    // variables
    const GRID_SIZE = 20
    const CELL_SIZE = 20
    const INITIAL_SNAKE = [{x: 10 , y: 10}]
    const INITIAL_FOOD = {x: 15 , y: 15}
    const INITIAL_DIRECTION = "RIGHT"

    const [snake , setSnake] = useState(INITIAL_SNAKE)
    const [food , setFood] = useState(INITIAL_FOOD)
    const [direction ,  setDirection] = useState(INITIAL_DIRECTION)
    const [score , setScore] = useState(0)
    const [bestScore , setBestScore] = useState(localStorage.getItem("bestScore") || score)
    const [gameover , setGameover] = useState(false) 
    const [pause , setPause] = useState(false)

    // useRef for smoother control
    const directionRef = useRef(direction);
    
    useEffect(() => {
        directionRef.current = direction;
    }, [direction]);
    

    const FoodGenerate = ()=>{
        const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        }

        return snake.some((snk)=> snk.x == newFood.x && snk.y == newFood.y ) ? FoodGenerate() :  newFood
    }

    const MoveSnake = ()=>{

        if(gameover) return;

        let head = {...snake[0]}
        
        switch(directionRef.current){
            case "UP": 
                head.y -= 1;
                break;

            case "DOWN" : 
                head.y +=1;
                break

            case "LEFT":
                head.x -= 1;
                break;
            
            case "RIGHT" : 
                head.x +=1;
        }

        if(head.x < 0 || 
            head.x >= GRID_SIZE ||
            head.y < 0 ||
            head.y >= GRID_SIZE ||
            snake.some((snk)=> snk.x == head.x && snk.y == head.y)
        ){
            if(score > bestScore) setBestScore(score)
            setGameover(true);
            return;
        }

        const newSnake = [head , ...snake]
        if(head.x == food.x && head.y == food.y){
            setScore(prev => prev + 1)
            setFood(FoodGenerate())
        }
        else{
            newSnake.pop()
        }

        setSnake(newSnake)

        
    }


    useEffect(()=>{
        const handelKeyPress = (e)=>{
            const currentdir = directionRef.current;
            switch(e.key){
                case "ArrowUp" : 
                if(currentdir !== "DOWN") setDirection("UP")
                    break;
                
                case "ArrowDown" : 
                if(currentdir !== "UP") setDirection("DOWN")
                    break;

                case "ArrowLeft" : 
                if(currentdir !== "RIGHT") setDirection("LEFT")
                    break;

                case "ArrowRight" : 
                if(currentdir !== "LEFT") setDirection("RIGHT")
                    break;
            }
            console.log(e.key , direction);
            
        }

        window.addEventListener("keydown" , handelKeyPress)

        return ()=>{
            window.removeEventListener("keydown" , handelKeyPress)
        }
    } , [])
      
      





    // game loop
    useEffect(()=>{
        if (gameover || pause) return;
        const interval = setInterval(   MoveSnake  , (250 - score) < 50 ? 50 : (250 - score) )
        return ()=>clearInterval(interval)
    } , [snake , direction , gameover , pause])

    const renderGrids = ()=>{
        const grid = [];
        for (let i = 0 ; i < GRID_SIZE ; i++){
            for(let j = 0 ; j < GRID_SIZE ; j++){
                const isSnake = snake.some((snk)=> snk.x == j && snk.y == i)
                const isFood = food.x == j && food.y == i

                grid.push(<div className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border  border-black/10 ${isSnake && !isFood && "bg-[#97866A]"} ${isFood && !isSnake && "bg-[#4F1C51] animate-food rounded-full "} ${!isSnake && !isFood && "bg-white"}`} key={`${i}-${j}`}></div>)

            }
        }
        return grid
    }


    const handelResetGame = ()=>{
        if(score > bestScore){
            localStorage.setItem("bestScore" , score)
            setBestScore(score)
        }
        setSnake(INITIAL_SNAKE)
        setFood(INITIAL_FOOD)
        setDirection(INITIAL_DIRECTION)
        directionRef.current = "RIGHT";
        setScore(0)
        setGameover(false)
        setPause(false)
    }
    
  return (
    <div className='grid place-items-center h-screen  '>

        <div className=" w-fit  rounded-xl shadow-[rgba(0,0,0,0.24)_0px_3px_8px]   ">

            {/* score board */}
            <div className="flex justify-between bg-[#47565A] p-2 text-white items-center      ">
                <h2 className="font-bold">Snake Game</h2>
                <div className="">
                    <h3>Best Score : {bestScore}</h3>
                    <h3>Your Score : {score}</h3>
                </div>
            </div>

            {/* game board */}
            <div className="h-[400px] overflow-auto "
                 style={{
                     display: 'grid',
                     gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                     gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                     width: `${GRID_SIZE * CELL_SIZE}px`
                 }}>
                {renderGrids()}
            </div>

            {/* controls */}
            <div className={`   `}>
                <button onClick={()=>setPause(!pause)}  type="button" className="bg-[#47565A] text-white p-2 w-full cursor-pointer  " >{pause ? "Continue" : "Pause"}</button>
            </div>

           {/* mobile controls */}
           <div className="relative w-[100px] mx-auto h-[100px] p-2 text-white items-center  md:hidden mt-7 rotate-45   ">
                <button onClick={()=>setDirection("UP")}  type="button" className="bg-[#47565A] text-white w-[30px] rounded-md rotate-[-45deg] cursor-pointer absolute top-0 left-0 " >&#8593;</button>
                <button onClick={()=>setDirection("DOWN")}  type="button" className="bg-[#47565A] text-white w-[30px] rounded-md rotate-[-45deg] cursor-pointer absolute bottom-0 right-0 " >&#8595;</button>
                <button onClick={()=>setDirection("RIGHT")}  type="button" className="bg-[#47565A] text-white w-[30px] rounded-md rotate-[-45deg] cursor-pointer absolute top-0 right-0 " >&#8594;</button>
                <button onClick={()=>setDirection("LEFT")}  type="button" className="bg-[#47565A] text-white w-[30px] rounded-md rotate-[-45deg] cursor-pointer absolute bottom-0 left-0 " >&#8592;</button>
           </div>

        </div>

        {gameover && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg py-2 px-5  ">
                <h2 className="text-2xl font-bold mb-4">Game Over</h2>
                <p className="text-lg mb-2">Your score: {score}</p>
                <p className="text-lg mb-2">{score > bestScore ? "New Record" : "Best Score"} : {bestScore}</p>
                <button onClick={handelResetGame} className="bg-[#47565A] text-white px-4 py-2 rounded-lg cursor-pointer">Play Again</button>
            </div>)}

        .
    </div>
  )
}
