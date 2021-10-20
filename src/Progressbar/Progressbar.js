import { useEffect, useState } from "react"

export const Progressbar = ({time}) => {

    const ratio = 100 //smoothness
    const refreshingTimer = 1000/ratio; //every second: 1000ms
    const limitTimer = 60*ratio; //every second: 1000ms
    

    const [timer, setTimer] = useState(limitTimer);

    const updateTimer = (time) =>{ //Will be better to avoid this call so many times and using a CSS animation but i don't know if it's allowed for the task
        if(time <= 1){
          return limitTimer
        }else{
          return time-1
        }
    }

    useEffect(() => {
        const timerP = setTimeout(() => {
        setTimer(updateTimer);
        }, refreshingTimer);
        return () => clearTimeout(timerP);
    });

    return(
        <div>
            <div className='HeaderBarTime'>Reloading in {(timer/ratio).toString().substr(0, 2)}</div>
            <progress id="progress" value={timer} max={limitTimer}></progress>
        </div>
    );
}