import React, { useState, useEffect } from 'react';
import { Stage, Layer, Circle, Rect } from 'react-konva';
import ColorPicker from './ColorPicker';

interface Ball {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  isDragging: boolean;
}

const BallCanvas: React.FC = () => {
  const [balls, setBalls] = useState<Ball[]>([
    { id: 1, x: 50, y: 50, radius: 20, color: '#ffffff', vx: 0, vy: 0, isDragging: true },
    { id: 2, x: 150, y: 100, radius: 30, color: 'yellow', vx: 0, vy: 0, isDragging: false },
    { id: 3, x: 250, y: 150, radius: 40, color: 'black', vx: 0, vy: 0, isDragging: false },
  ]);
  const [color,setColor] = useState<{background:string}>({
    background:'#fff'
})
const [picker,setPicker] = useState(false)
  const changePicker=()=>{
    setPicker(prevst=>!prevst)
  }
  useEffect(() => {
    let animationFrame = requestAnimationFrame(animate);

    function animate() {
      const updatedBalls = balls.map((ball) => {
        let newVx = ball.vx;
        let newVy = ball.vy;

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > 500) {
          newVx *= -0.8;
        }

        if (ball.y - ball.radius < 0 || ball.y + ball.radius > 300) {
          newVy *= -0.8;
        }

        balls.forEach((otherBall) => {
          if (ball.id !== otherBall.id) {
            const dx = otherBall.x - ball.x;
            const dy = otherBall.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDist = ball.radius + otherBall.radius;

            if (distance < minDist) {
              const angle = Math.atan2(dy, dx);
              const targetX = ball.x + Math.cos(angle) * minDist;
              const targetY = ball.y + Math.sin(angle) * minDist;

              const ax = (targetX - otherBall.x) * 0.05;
              const ay = (targetY - otherBall.y) * 0.05;

              newVx -= ax;
              newVy -= ay;
            }
          }
        });

        ball.x += newVx;
        ball.y += newVy;

        return { ...ball, vx: newVx, vy: newVy };
      });

      setBalls(updatedBalls);
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [balls]);

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    const mousePos = stage.getPointerPosition();

    const updatedBalls = balls.map((ball) =>
      ball.isDragging ? { ...ball, x: mousePos.x, y: mousePos.y } : ball
    );

    setBalls(updatedBalls);
  };

const handleChangeComplete = (color:any) => {
    setColor({ background: color.hex });
const newArr = [...balls]
const newObj = {...newArr[0],color:color.hex}
newArr[0] = newObj
setBalls(newArr)
  };

  return (
    <>
    {picker && <ColorPicker handle={handleChangeComplete} color={color}/>}
    <Stage
      width={500}
      height={300}
      style={{position:'relative',left:'50px'}}
      onMouseMove={handleMouseMove}
      onClick={changePicker}
    >
      <Layer>
        <Rect width={500} height={300} fill="green" />
        {balls.map((ball) => (
          <Circle
            key={ball.id}
            x={ball.x}
            y={ball.y}
            radius={ball.radius}
            fill={ball.color}
          />
        ))}
      </Layer>
    </Stage>
    </>
  );
};

export default BallCanvas;



