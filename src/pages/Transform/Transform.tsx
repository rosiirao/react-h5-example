/**
 * none | <transform-list>
 * where <transform-list> = <transform-function>+
 * where <transform-function> = <matrix()> | <translate()> | <translateX()> | <translateY()>
 *    | <scale()> | <scaleX()> | <scaleY()>
 *    | <rotate()> | <skew()> | <skewX()> | <skewY()>
 *    | <matrix3d()> | <translate3d()> | <translateZ()> | <scale3d()> | <scaleZ()>
 *    | <rotate3d()> | <rotateX()> | <rotateY()> | <rotateZ()> | <perspective()>
 * where <matrix()> = matrix( <number>#{6} )
 *   <translate()> = translate( <length-percentage> , <length-percentage>? )
 *   <translateX()> = translateX( <length-percentage> )
 *   <translateY()> = translateY( <length-percentage> )
 *   <scale()> = scale( <number> , <number>? )
 *   <scaleX()> = scaleX( <number> )
 *   <scaleY()> = scaleY( <number> )
 *   <rotate()> = rotate( [ <angle> | <zero> ] )
 *   <skew()> = skew( [ <angle> | <zero> ] , [ <angle> | <zero> ]? )
 *   <skewX()> = skewX( [ <angle> | <zero> ] )
 *   <skewY()> = skewY( [ <angle> | <zero> ] )
 *   <matrix3d()> = matrix3d( <number>#{16} )
 *   <translate3d()> = translate3d( <length-percentage> , <length-percentage> , <length> )
 *   <translateZ()> = translateZ( <length> )
 *   <scale3d()> = scale3d( <number> , <number> , <number> )
 *   <scaleZ()> = scaleZ( <number> )
 *   <rotate3d()> = rotate3d( <number> , <number> , <number> , [ <angle> | <zero> ] )
 *   <rotateX()> = rotateX( [ <angle> | <zero> ] )
 *   <rotateY()> = rotateY( [ <angle> | <zero> ] )
 *   <rotateZ()> = rotateZ( [ <angle> | <zero> ] )
 *   <perspective()> = perspective( <length> )
 * where <length-percentage> = <length> | <percentage>
 */

import React, { useState } from "react";
import "./Transform.scss";

const Transform: React.FC<{}> = (props) => {
  const box = ["192px", "192px"];
  const [matrixStyle, setMatrixStyle] = useState([1, 0, 0, 1, 0, 0]);
  const handleMatrix = (index: number, value: number) => {
    setMatrixStyle((matrixStyle) =>
      matrixStyle.map((v, i) => (i === index ? value : v))
    );
  };
  // useEffect(() => {
  //   setTimeout(() => {
  //     setMatrixStyle(matrixTransition[1]);
  //   }, 1000);
  // }, [matrixTransition]);
  return (
    <div className="transform-box">
      <h2>
        matrix: scaleX(
        <input
          type="number"
          value={matrixStyle[0]}
          onChange={(event) => {
            handleMatrix(0, Number(event.currentTarget.value));
          }}
        />
        ), skewY(
        <input
          type="number"
          value={matrixStyle[1]}
          onChange={(event) => {
            handleMatrix(1, Number(event.currentTarget.value));
          }}
        />
        ), skewX(
        <input
          type="number"
          value={matrixStyle[2]}
          onChange={(event) => {
            handleMatrix(2, Number(event.currentTarget.value));
          }}
        />
        ), scaleY(
        <input
          type="number"
          value={matrixStyle[3]}
          onChange={(event) => {
            handleMatrix(3, Number(event.currentTarget.value));
          }}
        />
        ), translateX(
        <input
          type="number"
          value={matrixStyle[4]}
          step="10"
          onChange={(event) => {
            handleMatrix(4, Number(event.currentTarget.value));
          }}
        />
        ), translateY(
        <input
          type="number"
          value={matrixStyle[5]}
          step="10"
          onChange={(event) => {
            handleMatrix(5, Number(event.currentTarget.value));
          }}
        />
        )
      </h2>
      <div>
        transform(
        {[
          matrixStyle[0],
          matrixStyle[1],
          0,
          0,
          matrixStyle[2],
          matrixStyle[3],
          0,
          0,
          0,
          0,
          1,
          0,
          matrixStyle[4],
          matrixStyle[5],
          0,
          1,
        ].join(",")}
        )
      </div>
      <div
        style={{
          backgroundColor: "rgba(150,50,0,0.5)",
          border: "1px solid grey",
          height: box[1],
          width: box[0],
          transition: "transform 3s",
          transform: `matrix(${matrixStyle.join(",")})`,
        }}
      >
        <img src={"logo192.png"} alt="log" />
      </div>
    </div>
  );
};

export default Transform;
