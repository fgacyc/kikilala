import {IconMenu} from "@arco-design/web-react/icon";
import {useState} from "react";
import {admin_urls} from "../../config.js";




export  default  function Header(){
    const [showMenu, setShowMenu] = useState(false);

    const currentUrl = window.location.pathname;
    // console.log(currentUrl)

    function goToPage(name) {
        window.open(admin_urls[name], "_self")
    }

    return (
        <div className={"w-full h-[80px] bg-[#33CC99] sm:px-8 py-4 px-2 relative"}>
           <div className={"bg-[#00D97C] flex flex-row justify-between items-center py-2 rounded-xl shadow-lg"}>
               <div className={"text-white text-2xl font-bold ml-2 cursor-pointer"}
                    onClick={() => goToPage("dashboard")}
               >Numbers</div>
               <div className={"sm:flex flex-row justify-between items-center hidden"}>
                   <div className={`text-white text-lg mr-8 cursor-pointer hover:underline
                        ${currentUrl === admin_urls["dashboard"] && "font-bold"}`}
                        onClick={() => goToPage("dashboard")}
                   >Dashboard
                   </div>
                   <div className={`text-white text-lg mr-8 cursor-pointer hover:underline
                        ${currentUrl === admin_urls["attendance"] && "font-bold"}`}
                        onClick={() => goToPage("attendance")}
                   >Attendance
                   </div>
                   <div className={`text-white text-lg mr-8 cursor-pointer hover:underline
                   ${currentUrl === admin_urls["headcount"] && "font-bold"}`}
                        onClick={() => goToPage("headcount")}
                   >Headcount
                   </div>
                   <div className={`text-white text-lg mr-8 cursor-pointer hover:underline
                      ${currentUrl === admin_urls["cgl"] && "font-bold"}`}
                        onClick={() => goToPage("cgl")}
                   >CGLs
                   </div>
                   <div className={`text-white text-lg mr-8 cursor-pointer hover:underline
                   ${currentUrl === admin_urls["admin"] && "font-bold"}`}
                        onClick={() => goToPage("admin")}
                   >Admins
                   </div>

                   <div className={`text-white text-lg mr-8 cursor-pointer hover:underline
                   ${currentUrl === admin_urls["structure"] && "font-bold"}`}
                        onClick={() => goToPage("structure")}
                   >Structure
                   </div>
               </div>
               <div className={"sm:hidden block mr-2"}>
                   <IconMenu className={"text-white text-2xl cursor-pointer"}
                             onClick={() => setShowMenu(!showMenu)}
                   />
               </div>
           </div>
            {
                showMenu && <div className={"absolute top-[65px] bg-white right-[10px] rounded z-10 p-4 shadow "}>
                    <div className={"text-lg hover:bg-gray-200 cursor-pointer"}
                            onClick={() => goToPage("attendance")}
                    >Attendance</div>
                    <div className={"text-lg hover:bg-gray-200 cursor-pointer"}
                            onClick={() => goToPage("headcount")}
                    >Headcount</div>
                    <div className={"text-lg hover:bg-gray-200 cursor-pointer"}
                            onClick={() => goToPage("cgl")}
                    >CGLs</div>
                    <div className={"text-lg hover:bg-gray-200 cursor-pointer"}
                            onClick={() => goToPage("admin")}
                    >Admins</div>
                    <div className={"text-lg hover:bg-gray-200 cursor-pointer"}
                            onClick={() => goToPage("structure")}
                    >Structure</div>
                </div>
            }

        </div>
    )
}
