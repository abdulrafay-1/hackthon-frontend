import React from 'react'
import { ToastContainer } from 'react-toastify'

const MyToastConntainer = () => {
    return (
        <ToastContainer autoClose={3000} pauseOnHover={false} pauseOnFocusLoss={false} />
    )
}

export default MyToastConntainer