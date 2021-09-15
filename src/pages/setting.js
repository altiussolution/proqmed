import React from "react";
// import ColorPicker, { useColor } from "react-color-palette";


const Setting = () => {

    //  const [color, setColor] = useColor("hex", "#121212");
const submitColor = (color)=>{
   console.log(color)
}

    return(
        <>
        <input type="color" id="color" name="color" />
        <button onClick={()=>{submitColor(document.getElementById('color').value)}}>Change Color</button>
        </>
    )
}

export default Setting