import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_PORT = 4444;
const PI = import.meta.env.VITE_PI

function Temp() {
  const [temp, setTemp] = useState<number | null>(null);
  const [socketOpen, setSocketOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!PI) {
      console.log('VITE_PI enviroment variable undefined. Temperature monitoring disabled.');
      return;
    }
    const socket = io(`http://localhost:${SOCKET_PORT}`, {
      reconnectionAttempts: 5
    });

    socket.on('newTemp', (newTemp) => {
      setTemp(newTemp);
    });

    socket.on("connect", () => {
        setSocketOpen(true);
      });

    return () => {
      socket.disconnect();
      setSocketOpen(false);
    };
  }, []);

  return socketOpen && temp && temp >= 0 ? (
  <div style={{ height: '100px', width: '100px' }} className="absolute flex justify-center items-center top-0 right-0 text-4xl">
    {temp && <p className="text-slate-100">{temp}°C</p>}
    {temp >= 70 &&  <p className='text-red-500'>{temp}°C</p>}
  </div>
) : null;
}

export default Temp;