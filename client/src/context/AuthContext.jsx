import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

  
export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
     useEffect(() => {console.log("User value changed (context)", user)}, [user])
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}