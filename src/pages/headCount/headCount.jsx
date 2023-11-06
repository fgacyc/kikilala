import HeadCountForm from "./headcountForm.jsx";
export default function HeadCount() {

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
                {/*<SocialMedia position={"left"}/>*/}
            </div>
            <div className={`sm:w-[600px] h-[100%] bg-white rounded-[12px]  sm:p-8 p-4 w-full`}>
                <HeadCountForm />
            </div>
        </div>
    )
}
