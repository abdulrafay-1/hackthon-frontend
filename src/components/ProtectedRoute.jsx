import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useUser } from '../context/userContext'

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate()
    const user = useUser()
    console.log(user)
    useEffect(() => {
        if (false) {
            navigate('/login')
        }
    }, [])

    return (
        user && children
    )
}

export default ProtectedRoute