import {readAllCGLs} from "../api/CGLs.js";
import {Button} from "@arco-design/web-react";

export  default  function  Submit()  {
    function getAllCGLs() {
        readAllCGLs().then((data) => {
            console.log(data);
        })
    }

    return (
        <Button type='primary'
                onClick={getAllCGLs}
        >Primary</Button>
    )
}
