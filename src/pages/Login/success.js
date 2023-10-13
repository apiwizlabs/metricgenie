import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const LoginSuccess = () => {
    const navigate = useNavigate()

    useEffect(() => {

        const params = new URLSearchParams(window.location.search)
        console.log(params.get("token"))
        localStorage.setItem("token", params.get("token"))
        if(localStorage.getItem("token")){
            document.location.href = "/"
        }
        
    },[])
    
    return (
        <h2>Login SuccessFull</h2>
    )
}