import React, { useEffect, useReducer, useState } from "react";
//import SwipeableViews from 'react-swipeable-views';
export const Slider = () => {

    const width = useWindowWidth(); // determine the width of windows initially 
    const [state, dispatch] = useReducer(reducer, {
        currentIndex: 0,
        items: [
            { id: 1, name: "1", pic: require("./../Pics/Ad1.PNG")},
            { id: 2, name: "2", pic: require("./../Pics/Ad2.PNG")},
            { id: 3, name: "3", pic: require("./../Pics/Ad3.PNG")}
        ]
    });
    const NavAd = (
    <div className="text-center h-8 flex ">
        <div className="w-1/5">{state.currentIndex > 0 ? (<button className="bg-orange-500 hover:bg-orange-600 w-16 lg:w-32 text-white rounded-full border-white border-2" onClick={() => dispatch({ type: "PREV" })} > Prev</button>) : ("")} </div>
            <div className="w-1/5 flex  " />
            <div className="w-1/5 flex text-center justify-center " >
            {state.items.map((i, index) => {
            return (
                <div className="bg-orange-600 w-4 h-4 lg:w-6 lg:h-6 border-2 hover:bg-orange-800 justify-center  rounded-full" onClick={() => dispatch({ type: "GOTO", index })}> {' '}
               </div>);
            })} 
               </div>
        <div className="w-1/5" />
            <div className="w-1/5"> {state.currentIndex < state.items.length - 1 ? (<button className="bg-orange-500 hover:bg-orange-600 w-16 lg:w-32 text-white rounded-full border-white border-2 " onClick={() => dispatch({ type: "NEXT" })}> Next </button>) : ("")}</div>
    </div>);
    return (<><div className="adSlide border-2 border-black rounded ">

        <div className=" wrapper h-full  " width={width} style={{
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

const Slide = ({ item, width }) => {
    return (
        <>
            <div id="slider"className="flex  lg:h-full " style={{ width: width + "px" || "100%" }}>
                    <img src={item.pic} alt="item pic" />
            </div>
        </>)
}