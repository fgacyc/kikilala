import React, {useEffect, useState} from "react";
import {useFormStore} from "../../store/formStore.js";

export  default  function ButtonGroup({ setCurrentSatellite }) {
    const [active, setActive] = useState(-1)
    const [satellite, setSatellite] =
        useFormStore(state => [state.satellite,state.setSatellite])
    const satellites = [
        'Kuchai YW',
        'Kuchai WK',
        'Kuchai GS',
        'Serdang',
        'Kepong',
        'USJ',
        'Setapak',
        'SG Long',
        'Seremban'
    ]
    async function getData() {
        if (!satellite) return;
        for (let i = 0; i < satellites.length; i++) {
            if (satellites[i] === satellite) {
                handleClick(i);
                setCurrentSatellite(satellites[i])
            }
        }
    }


    useEffect(() => {
        getData();
    }, [satellite]);

    useEffect(() => {
        const sate = localStorage.getItem("headcount-satellite")
        if (sate) {
            setSatellite(sate)
        }
    }, []);

    function handleClick(index) {
        setActive(index)
        setCurrentSatellite(satellites[index])
        setSatellite(satellites[index])
    }

    return (
        <div>
            {
                satellites.map((satellite, index) => {
                    return (
                        <button key={index}
                                className={`hover:bg-[#00B05C] hover:text-white 
                        border-2 font-bold hover:border-[#00B05C] 
                        ${active === index ? 'bg-[#00B05C] border-[#00B05C] text-white'
                                    : 'bg-white border-[#2E024930] text-[#2E024930]'
                                }
                        rounded-[8px] px-[10px] py-[10px] my-[10px] mr-[10px] `}
                                onClick={() => handleClick(index)}
                        >{satellite}</button>
                    )
                })
            }
        </div>
    )
}
