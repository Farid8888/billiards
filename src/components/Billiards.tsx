import React, { useRef, useEffect, useState } from 'react';
import ColorPicker from './ColorPicker';
import classes from  './CanvasBilliard.module.css';

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  isDraggable: boolean;
}

const Billiards: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls,setBalls] = useState<Ball[]>([
    { x: 700, y: 500, dx: 0, dy: 0, radius: 20, color: '#ffffff', isDraggable: true },
    { x: 650, y: 450, dx: 0, dy: 0, radius: 25, color: '#33FF57', isDraggable: false },
    { x: 600, y: 400, dx: 0, dy: 0, radius: 30, color: 'yellow', isDraggable: false },
    { x: 525, y: 325, dx: 0, dy: 0, radius: 35, color: 'black', isDraggable: false },
    { x: 425, y: 225, dx: 0, dy: 0, radius: 40, color: 'purple', isDraggable: false },
    { x: 325, y: 125, dx: 0, dy: 0, radius: 45, color: 'blue', isDraggable: false },
  ]);
  const [color, setColor] = useState<{ background: string }>({
    background: "#fff",
  });
  const [picker, setPicker] = useState(false);
  const changePicker = () => {
    setPicker((prevst) => !prevst);
  };

console.log('xxx')
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawBall = (ball: Ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();
    };

    const moveBall = (ball: Ball) => {
      ball.x += ball.dx;
      ball.y += ball.dy;
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -0.8;
      }

      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -0.8;
      }
    };

    const checkCollision = (ball1: Ball, ball2: Ball) => {
      const dx = ball1.x - ball2.x;
      const dy = ball1.y - ball2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ball1.radius + ball2.radius) {
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const vx1 = ball1.dx * cos + ball1.dy * sin;
        const vy1 = ball1.dy * cos - ball1.dx * sin;
        const vx2 = ball2.dx * cos + ball2.dy * sin;
        const vy2 = ball2.dy * cos - ball2.dx * sin;

        const vxTotal = vx1 - vx2;
        const vx1Final = ((ball1.radius - ball2.radius) * vx1 + 2 * ball2.radius * vx2) / (ball1.radius + ball2.radius);
        const vx2Final = vxTotal + vx1Final;

        ball1.dx = vx1Final * cos - vy1 * sin;
        ball1.dy = vy1 * cos + vx1Final * sin;
        ball2.dx = vx2Final * cos - vy2 * sin;
        ball2.dy = vy2 * cos + vx2Final * sin;

        const overlap = ball1.radius + ball2.radius - distance + 1;
        ball1.x += overlap * cos;
        ball1.y += overlap * sin;
        ball2.x -= overlap * cos;
        ball2.y -= overlap * sin;
      }
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      balls.forEach((ball) => {
        moveBall(ball);
        drawBall(ball);
      });

      balls.forEach((ball, index) => {
        for (let i = index + 1; i < balls.length; i++) {
          checkCollision(ball, balls[i]);
        }
      });

      requestAnimationFrame(update);
    };

    update();
  }, [balls]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    balls.forEach((ball) => {
      const distX = mouseX - ball.x;
      const distY = mouseY - ball.y;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < ball.radius && ball.isDraggable) {
        const angle = Math.atan2(distY, distX);
        ball.dx = Math.cos(angle) * 5; 
        ball.dy = Math.sin(angle) * 5; 
      }
    });
  };

  const handleChangeComplete = (color: any) => {
    setColor({ background: color.hex });
    const newArr = [...balls];
    const newObj = { ...newArr[0], color: color.hex };
    newArr[0] = newObj;
    setBalls(newArr);
  };

  return (
    <div>
        {picker && <ColorPicker handle={handleChangeComplete} color={color}/>}
      <canvas
        className={classes.canvas}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseMove={handleMouseMove}
        onClick={changePicker}
      />
    </div>
  );
};

export default Billiards;
