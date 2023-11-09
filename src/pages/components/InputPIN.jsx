import React, {useEffect} from "react";
export default function InputPIN({ name, setter,val ,className,range }) {
    if(!range) range= 2;

    function handleChange(e) {
        const valueStr = e.target.value;
        const val = valueStr.substring(0, range);
        if (!val) {
            setter("")
        }
        const value = parent.parseInt(val)
        setter(value)
    }

    useEffect(() => {
        if(val === 0){
            setter("")
        }
    }, [])


    return (
        <div className={`flex flex-col justify-center w-[64px] items-center ${className}`}>
            <input type="number"
                   className={`border-[#2E024930] 
                   text-center 
                   w-[32px] h-[32px] text-xl border rounded-lg
                   sm:w-[48px] sm:h-[48px] sm:text-2xl sm:border-2 sm:rounded-xl
                   my-0 inline-block  mx-[10px]`}
                   value={val}
                   onChange={handleChange}
            />
            <div className={"text-center"}>{name}</div>
        </div>
    )
}
