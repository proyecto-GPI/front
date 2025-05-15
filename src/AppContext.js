// AppContext.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cfirstName, csetFirstName] = useState("");
  const [clastName, csetLastName] = useState("");
  const [cdni, csetDni] = useState("");
  const [cemail, csetEmail] = useState("");
  const [cpassword, csetPassword] = useState("");
  const [cconfirmPassword, csetConfirmPassword] = useState("");
  const [cid, cSetid] = useState("");
  const [cofinicio, csetofinicio]= useState("");
  const [cofinal, csetofinal]= useState("");
  const [cfecharec, csetfecharec]= useState("");
  const [cfechadev, csetfechadev]= useState("");
  const [idcoche,csetidcoche]= useState("");
  const [tipouser,settipouser]= useState("");



  return (
    <AppContext.Provider value={{
      cfirstName, csetFirstName,
      clastName, csetLastName,
      cdni, csetDni,
      cemail, csetEmail,
      cpassword, csetPassword,
      cconfirmPassword, csetConfirmPassword,
      cid, cSetid,
      cofinicio, csetofinicio, 
      cofinal, csetofinal,
      cfecharec, csetfecharec,
     cfechadev, csetfechadev,
     idcoche,csetidcoche,
     tipouser,settipouser

    }}>
      {children}
    </AppContext.Provider>
  );
};
