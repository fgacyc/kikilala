import {useNavigate} from "react-router-dom";
import { Card } from '@arco-design/web-react';
const { Meta } = Card;

function UICard({item}){
    const navigate = useNavigate()
    return (
        <Card
            hoverable
            style={{ width: 360, margin:20 ,cursor:"pointer"}}
            cover={
                <div style={{ height: 204, overflow: 'hidden' }}>
                    <img
                        style={{ width: '100%', transform: 'translateY(-20px)' }}
                        alt='dessert'
                        src='//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
                    />
                </div>
            }
            onClick={()=>navigate(item.url)}
        >
            <Meta
                title={item.title}
                description={
                    <>
                        {item.description}
                    </>
                }
            />
        </Card>
    )
}

export default function AdminMenu() {
    const data = [
        {
            title:"Attendance Submit",
            url:"/",
            description:"CGL submit their attendance"
        },
        {
            title:"Headcount submit",
            url:"/headcount",
            description:"Usher submit headcount"
        },
        {
            title:"Attendance Management",
            url:"/admin",
            description:"Admin manage attendance"
        },
        {
            title:"Headcount Management",
            url:"/nb-headcount",
            description:"Admin manage headcount"
        },
        {
            title:"CGLs Management",
            url:"/nb-admin",
            description:"Admin manage CGLs"
        },
        {
            title:"Admin User Management",
            url:"/nb-user",
            description:"Admin manage users"
        }
    ]


    return(
        <div className={"h-full w-full sm:px-8 px-2 py-4 flex flex-row flex-wrap justify-between"}>
            {
                data.map((item,index)=>{
                    return (
                        <UICard key={index} item={item}/>
                    )
                })
            }
        </div>
    )
}
