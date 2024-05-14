import {readAllCGLs} from "../../api/CGLs.js";
import Form from "./form.jsx";
import {InstagramIcon} from "../../Icon/InstagramIcon.jsx";
import {ThreadsIcon} from "../../Icon/ThreadsIcon.jsx";
import {YoutubeIcon} from "../../Icon/YoutubeIcon.jsx";
import {FacebookIcon} from "../../Icon/FacebookIcon.jsx";
import {useFormStore} from "../../store/formStore.js";
import {useEffect, useState} from "react";
import TutorialConfirm from "../AttendancePage/TutorialConfirm.jsx";
import {Avatar} from "@arco-design/web-react";
import {IconUser} from "@arco-design/web-react/icon";
import {useNavigate} from "react-router-dom";

function SocialMedia({position}) {
    function goToSocialMedia(type) {
        const url = {
            "fb": "https://www.facebook.com/FGACYC",
            "ig": "https://www.instagram.com/fgacyc",
            "yt": "https://www.youtube.com/@fgacyc",
            "th": "https://www.threads.net/@fgacyc",
        }
        window.open(url[type], "_blank")
    }

    return (
        <div className={` flex-row w-[200px] justify-between absolute left-0 bottom-0 
            ${position === "left" ? "lg:flex hidden" : "lg:hidden flex"}
        `}>
            <FacebookIcon className={"cursor-pointer scale-100"}
                          onClick={() => goToSocialMedia("fb")}
            />
            <InstagramIcon className={"cursor-pointer scale-100"}
                           onClick={() => goToSocialMedia("ig")}
            />
            <ThreadsIcon className={"cursor-pointer scale-100"}
                         onClick={() => goToSocialMedia("th")}
            />
            <YoutubeIcon className={"cursor-pointer scale-100"}
                         onClick={() => goToSocialMedia("yt")}
            />
        </div>
    )
}

export default function Submit() {
    const initData = useFormStore(state => state.initData);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        // navigate("/503")
        void initData();
        const isTutorial = localStorage.getItem("isTutorial");
        if (isTutorial === null) {
            setConfirmModalVisible(true);
        }
    }, []);



    return (
        <div className={`w-full h-full bg-[#00D97C] rounded-bl flex flex-row flex-wrap justify-between relative
            sm:p-[50px] p-0`
        }>
            <div className={"relative flex flex-col justify-center"}>
                <div className={`text-white 
                            lg:text-5xl lg:h-[400px] lg:mb-0
                            md:text-4xl md:h-[300px] md:mb-0
                            sm:text-3xl sm:h-[250px] sm:mb-2 sm:ml-0
                            text-3xl h-[200px] mb-6 ml-8`}>
                    <div className={"my-8"}>Let's Achieve</div>
                    <div className={"my-8"}>The <b className={"text-[#313131]"}>M100</b> Mission</div>
                    <div className={"my-8"}>Together</div>
                </div>
                <SocialMedia position={"left"}/>
            </div>
            <div className={`sm:w-[600px] h-[100%] bg-white rounded-[12px]  sm:p-8 p-4 w-full`}>
                <Form/>
            </div>
            {/*<SocialMedia position={"bottom"}/>*/}
            {
                confirmModalVisible && <TutorialConfirm visible={confirmModalVisible} setVisible={setConfirmModalVisible} />
            }
        </div>
    )
}
