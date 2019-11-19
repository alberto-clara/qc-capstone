import React, { useEffect, useReducer, useState } from "react";

export const Slider = () => {
    const width = useWindowWidth(); // determine the width of windows initially 
    const [state, dispatch] = useReducer(reducer, {
        currentIndex: 0,
        items: [
            { id: 1, name: "1", pic: require("./../Pics/Ad2.PNG")},
        //    { id: 2, name: "2", pic: require("./../Pics/Ad3.PNG")},
          //  { id: 3, name: "3", pic: require("./../Pics/Ad1.PNG")}
        ]
    });
    const NavAd = (<div className="text-center h-8 flex">
        <div className="w-1/5">{state.currentIndex > 0 ? (<button className="bg-orange-500 hover:bg-orange-600 h-6 lg:h-12 w-20 rounded-full" onClick={() => dispatch({ type: "PREV" })} > Prev</button>) : ("")} </div>
        <div className="w-1/5" />
        {/*   {state.items.map((i, index) => {
            return (
                <div className="bg-orange-600 flex cursor-pointer justify-center w-1/5 border-2 hover:bg-orange-800  h-6 lg:h-10 rounded-full" active={index === state.currentIndex} onClick={() => dispatch({ type: "GOTO", index })}> {index+1}
               </div>);
      })} */}
        <div className="w-1/5" />
        <div className="w-1/5"> {state.currentIndex < state.items.length - 1 ? (<button className="bg-orange-500 hover:bg-orange-600 rounded-full lg:h-12 w-20 " onClick={() => dispatch({ type: "NEXT" })}> Next </button>) : ("")}</div>
    </div>);
    return (<><div className="adSlide border-2 border-black">
        <div className="wrapper h-full " width={width} style={{
            transform: `translateX(${-(state.currentIndex * width)}px)`,
            transition: "transform ease-out 0.40s",
            width: width * state.items.length + "px"
        }}  >
            {state.items.map((i, index) => {
                return (
                    <Slide
                        key={i.id}
                        item={i}
                        index={index}
                        dispatch={dispatch}
                        width={width}
                    />)
            })}
            
        </div>
       
    </div>
        <br/>
        {NavAd}
        <br/>
        <hr className="border-orange-600 border-2"/>
    </>)
}

function reducer(state, action) {
    switch (action.type) {
        case "NEXT":
            return {
                ...state,
                currentIndex: state.currentIndex + 1
            };
        case "PREV":
            return {
                ...state,
                currentIndex: state.currentIndex - 1 
            };
        case "GOTO":
            return {
                ...state,
                currentIndex: action.index
            };
        default:
            return state;
    }
}
const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const Resize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", Resize);
        return () => {
            window.removeEventListener("resize", Resize);
        };
    });
    return width;
};
//   <div className="text-center bg-green-200 w-full h-auto">{item.name}</div>
//<img src={item.pic}/>
const Slide = ({ item, width }) => {
    return (
        <>
            <div className=" flex bg-red-200 lg:h-full" style={{ width: width + "PX" || "100%" }}>
                <img src={item.pic}/>
            </div>
        </>)
}