import React from 'react';
import { SketchPicker } from 'react-color';
import classes from './ColorPicker.module.css'

const ColorPicker:React.FC<{color:{background:string},handle:(color:any)=>void}> = ({color,handle}) => {
    
  return (
    <SketchPicker className={classes.picker} color={color.background} onChangeComplete={handle}/>
  )
}

export default ColorPicker
