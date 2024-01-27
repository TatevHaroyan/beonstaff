import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { requestForToken, onMessageListener } from './firebase';
// import { requestForToken, onMessageListener } from '../../firebase';

const Notification = () => {
    const [notification, setNotification] = useState();
    const notify = () => toast.success(notification, {
        position: toast.POSITION.TOP_CENTER
    });


    useEffect(() => {
        if (notification.title) {
            notify()
        }
    }, [notification])

    requestForToken();

    onMessageListener()
        .then((payload) => {
            console.log(payload,'payloadpayloadpayload');
            setNotification(payload);
        })
        .catch((err) => console.log('failed: ', err));

    return (
        <div></div>
    )
}

export default Notification