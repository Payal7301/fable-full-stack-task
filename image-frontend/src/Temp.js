import React, { useRef,useState, useEffect } from "react";

const Temp =  ({ imageSrc }) => {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = 'anonymous';
    if(localStorage.getItem("editedImage")!=null)img.src=localStorage.getItem("editedImage")
    else img.src = imageSrc;
    img.onload = function() {
        setWidth(img.width);
        setHeight(img.height);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, [imageSrc]);
  const handleResize = (newWidth, newHeight) => {
    const canvas = canvasRef.current;
    canvas.width = newWidth;
    canvas.height = newHeight;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;
    img.onload = function() {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
    };
  };

  const handleApplyFilter = (filter) => {
    const imgData = canvasRef.current.getContext("2d").getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const data = imgData.data;
    if(filter==="blur"){
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            data[i] = (r + g + b) / 3;
            data[i + 1] = (r + g + b) / 3;
            data[i + 2] = (r + g + b) / 3;
          }   
    }else if(filter==="high-contrast"){
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            data[i] = (r * 2 > 255) ? 255 : r * 2;
            data[i + 1] = (g * 2 > 255) ? 255 : g * 2;
            data[i + 2] = (b * 2 > 255) ? 255 : b * 2;
          }
    }else if(filter==="hue-rotation"){
        const angle = 120; // hue rotation angle in degrees
        const radian = angle * Math.PI / 180;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i]     = (r * cos - g * sin + 255) / 2;
          data[i + 1] = (r * sin + g * cos + 255) / 2;
          data[i + 2] = b;
        }
         
    }

    canvasRef.current.getContext("2d").putImageData(imgData, 0, 0);
  };
 
  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={() => handleApplyFilter("blur")}>Blur</button>
      <button onClick={() => handleApplyFilter("high-contrast")}>High Contrast</button>
      <button onClick={() => handleApplyFilter("hue-rotation")}>Hue Rotation</button>
      <br />
      <label>Resize to:</label>
      <input
        type="number"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
      />
      x
      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <button onClick={() => handleResize(width, height)}>Resize</button>
      <br />
      <button onClick={async function () {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL();
        localStorage.setItem("editedImage", dataURL);
        const response = await fetch("localhost:8080/save-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ image: dataURL })
        });
        const result = await response.json();
        console.log(result);
      }}>Save</button>
    </div>
  );
};


export default Temp
 


