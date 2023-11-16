import {Modal} from "@arco-design/web-react";
import {satellite_pastoralTeam} from "../../config.js";
import {useEffect, useState} from "react";
import {useHeadCountStore} from "../../store/headcountStore.js";

export default function HeadcountReminderModal({ visible, setVisible }){
    const currentHeadCountTableData = useHeadCountStore(state => state.currentHeadCountTableData);
    const [pendingSatellites, setPendingSatellites] = useState(null)
    useEffect(() => {
        let satellites = Object.keys(satellite_pastoralTeam)
        // console.log(currentHeadCountTableData)
        for(let item of currentHeadCountTableData){
           // if item.satellite
           const index = satellites.indexOf(item.satellite)
              if(index !== -1){
                satellites.splice(index,1)
              }
        }
        setPendingSatellites(satellites)
    }, [currentHeadCountTableData]);



    return (
        <Modal
            title="Headcount Reminder"
            visible={visible}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
        >
            <div></div>
            {
                pendingSatellites &&
                <div>
                    <div className={"mb-2"}>Please remember to submit headcount for the following satellites:</div>
                    <ul>
                        {pendingSatellites.map((item,index) => {
                            return <li key={index} className="list-disc list-inside">{item}</li>
                        })}
                    </ul>
                </div>
            }
        </Modal>
    )
}
