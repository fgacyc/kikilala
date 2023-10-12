import {readAllCGLs} from "../api/CGLs.js";
import {Button} from "@arco-design/web-react";
import Form from "./form.jsx";
import {IconFaceBookCircleFill} from "@arco-design/web-react/icon";
import {InstagramIcon} from "../Icon/InstagramIcon.jsx";
import {ThreadsIcon} from "../Icon/ThreadsIcon.jsx";
import {YoutubeIcon} from "../Icon/YoutubeIcon.jsx";
import {FacebookIcon} from "../Icon/FacebookIcon.jsx";

export  default  function  Submit()  {
    function getAllCGLs() {
        readAllCGLs().then((data) => {
            console.log(data);
        })
    }

    return (
        <div className={"w-screen h-screen bg-[#00D97C] rounded-bl flex flex-row flex-wrap-reverse justify-between p-[50px]"}>
            <div className={"relative flex flex-col justify-center"}>
                <div className={"text-white text-5xl h-[400px]"}>
                    <div className={"my-8"}>Let's Achieve</div>
                    <div className={"my-8"}>The <b className={"text-[#313131]"}>M100</b> Vision</div>
                    <div className={"my-8"}>Together</div>
                </div>
                <div className={"flex flex-row w-[200px] justify-between absolute left-0 bottom-0"}>
                        <FacebookIcon  class={"cursor-pointer scale-100"} />
                        <InstagramIcon class={"cursor-pointer scale-100"} />
                        <ThreadsIcon class={"cursor-pointer scale-100"} />
                        <YoutubeIcon class={"cursor-pointer scale-100"} />
                </div>
            </div>
            <div className={"w-[600px] h-[100%] bg-white rounded-[12px] p-8"}>
                <Form />
            </div>
        </div>
    )
}
