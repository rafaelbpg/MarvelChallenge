import { useState, useEffect } from "react"
interface LoginScreenControllerReturnType {
    setEmail: Function,
    setPassword: Function,
}
function LoginScreenController(): LoginScreenControllerReturnType {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    return {
        setEmail, 
        setPassword
    }
}

export default LoginScreenController