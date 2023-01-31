import React,{useEffect,useState} from 'react'
import Temp from './Temp'
import {
  generateDiceBearAvataaars,
} from "./utils";

const App = () => {
  const [id,setId]=useState(0);
  function getRandomImageFromBackend(){
  
  }
  function changeId(){
    var temp=Math.random();
    setId(temp);
  }
  useEffect(()=>{
    changeId();
  },[])
  return (
    <>
  
    <Temp imageSrc={generateDiceBearAvataaars(id)}/>
    </>
  )
}

export default App