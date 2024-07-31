import {withRetry} from "../tools.js";

const host_url = import.meta.env.VITE_HOST_URL;


// get
export async function getPastoralLeader() {
    const response = await fetch(`${host_url}/cg/pastoral_leader`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data
}

// create
export async function addPastoralLeader(name,nickname,role_id,cg_id_list){
    const pastoral_leader_data= {
        name,
        nickname,
        role_id,
        cg_id_list
    }
    const response = await fetch(`${host_url}/cg/pastoral_leader`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pastoral_leader_data)
    });
    const data = await response.json();
    return data;

}

// update
export async function updatePastoralLeader(name,nickname,role_id,cg_id_list){
    const pastoral_leader_data= {
        name,
        nickname,
        role_id,
        cg_id_list
    }

    const response = await fetch(`${host_url}/cg/pastoral_leader`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pastoral_leader_data)
    });
    const data = await response.json();
    return data;
}

// delete

export async function deletePastoralLeader(user_name,nickname,role_id) {
    const pastoral_leader_data= {
        user_name,
        nickname,
        role_id
    }
    const response = await fetch(`${host_url}/cg/pastoral_leader`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pastoral_leader_data)
    });
    const data = await response.json();
    console.log(data)
    return data;
}