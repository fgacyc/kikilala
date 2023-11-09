import { Modal } from '@arco-design/web-react';
export default function TutorialConfirm({ visible, setVisible }) {
    return (
        <Modal
            title="Tutorial"
            visible={visible}
            onOk={() =>{
                setVisible(false)
                localStorage.setItem("isTutorial", "true");
                window.open("https://square.fgacyc.com/t/numbers-user-document/263", "_blank")
            }}
            onCancel={() => {
                setVisible(false)
                localStorage.setItem("isTutorial", "false");
            }}
            autoFocus={false}
            focusLock={true}
        >
            <div>Are you sure you want to check the tutorial?</div>
        </Modal>
    );
}
