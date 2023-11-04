import { Modal, Message } from '@arco-design/web-react';
export default function TutorialConfirm({setConfirmModalVisible}){
    Modal.confirm({
        title: 'Tutorial',
        content:
            'Are you sure you want to check the tutorial?',
        okButtonProps: {
            status: 'info',
        },
        onOk: () => {
            localStorage.setItem("isTutorial", "true");
            window.open("https://square.fgacyc.com/t/numbers-user-document/263", "_blank")
            setConfirmModalVisible(false);
        },
       onCancel: () => {
            localStorage.setItem("isTutorial", "false");
           setConfirmModalVisible(false);
        }
    });
}
