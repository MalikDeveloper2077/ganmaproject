import axios from 'axios';

export const sendMessage = (message) => {
    axios.post('http://localhost:3000/api/send_message', {message}).then(function (response) {
        console.log(response);
    });
    // fetch('http://localhost:3000/send-message', {method: 'POST', body: JSON.stringify({message})}).then(function (response) {
    //     console.log(response);
    // });
}