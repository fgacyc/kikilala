import {Input, Message, Modal} from '@arco-design/web-react';
import {useAdminUserStore} from "../../store/adminUserStore.js";
import {updateAdmin} from "../../api/admin.js";
import PubSub from "pubsub-js";
export default function AdminUserInfoModifyModal({ visible, setVisible }){
    const [name,email,remark,id] =
        useAdminUserStore(state => [state.name, state.email, state.remark, state.id]);
    const [setName, setEmail, setRemark] =
        useAdminUserStore(state => [state.setName, state.setEmail, state.setRemark]);

    function submit(){
        const data = {
            name: name,
            email: email,
            remark: remark
        };
        updateAdmin(id, data).then((res) => {
            if(res !== false){
                setVisible(false);
                Message.success('Submitted successfully!')
                PubSub.publish('updateAdmins');
            }else{
                Message.error('Submitted failed!')
            }
        });
    }

    return (
        <Modal
            title="Modal Title"
            visible={visible}
            onOk={() => {
                submit();
            }}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
        >
            <div>
                <div className={"flex flex-row items-center mb-4"}>
                    <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>Name</div>
                    <Input className={"w-[80%]"}
                           value={name}
                           defaultValue={name}
                           onChange={setName}
                           placeholder='please enter name...' />
                </div>
                <div className={"flex flex-row items-center mb-4"}>
                    <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>Email</div>
                    <Input className={"w-[80%]"}
                           value={email}
                           defaultValue={email}
                           onChange={setEmail}
                           placeholder='please enter email...' />
                </div>
                <div className={"flex flex-row items-center mb-4"}>
                    <div className={"w-[20%] text-right pr-3 text-[#4E5969]"}>Remark</div>
                    <Input className={"w-[80%]"}
                           value={remark}
                           defaultValue={remark}
                           onChange={setRemark}
                           placeholder='please enter remark...' />
                </div>
            </div>
        </Modal>
    );
}
