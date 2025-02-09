import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useUser } from '../context/userContext'
import { auth } from '../config/firebase'

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate()
    const { user, setUser } = useUser()
    useEffect(() => {
        const myUser = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"))
        setUser(myUser)
        if (!myUser) {
            navigate('/login')
        }
    }, [])

    return (
        user && children
    )
}

export default ProtectedRoute