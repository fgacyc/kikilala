import {useFormStore} from "../../store/formStore.js";
import React from "react";

export  default  function UIInput({ type }) {
    const [total_members_num,setTotalMembersNum] = useFormStore(state => [
        state.total_members_num, state.setTotalMembersNum
    ])

    function handleChange(e) {
        const val = e.target.value
        if (!val) {
            setTotalMembersNum("")
            return;
        }
        const value = parent.parseInt(val)
        setTotalMembersNum(value)
    }

    return (
        <input type={type}
               onChange={handleChange}
               value={total_members_num}
               className={"w-full  border-b-2 border-[#2E024930] h-[30px] my-0"} />
    )
}
