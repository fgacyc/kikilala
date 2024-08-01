const host_url = import.meta.env.VITE_HOST_URL;

// create
export async function getAnylisisData(month) {
    const month1 = month.replace("/", "+");
    const response = await fetch(`${host_url}/attendance/analyse1/${month1}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}