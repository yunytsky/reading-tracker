import { findByUsername, findByEmail, createUser, findById, changeUserPassword, getVerificationInstance, updateUserVerifiedStatus, deleteVerificationInstance, deleteUser, updateVerificationInstanceConfirmationStatus, updateUserEmail } from "../database/functions.js";
import { generatePassword, issueJWT, sendCode, validatePassword } from "../lib/utils.js";

export async function signup(req, res) {
    try {
        //Check if the user already exists 
        let [data] = await findByEmail(req.body.email);
        let existingUser = data[0];
        if(existingUser) {
            return res.status(409).json({error: true, message: "Email is already taken"});
        }

        [data] = await findByUsername(req.body.username);
        existingUser = data[0];
        if(existingUser) {
            return res.status(409).json({error: true, message: "Username is already taken"});
        }

        //Generate password and send verification email
        const password = await generatePassword(req.body.password);
        await sendCode(req.body.email, "account-verification"); 

        //Create new user
        const [newUser] = await createUser(req.body.email, req.body.username, req.body.country, password);

        //Log new user in
        const [userData] = await findById(newUser.insertId);
        const user = userData[0];
        const token = issueJWT(user);
        delete user.password;
        
        return res.status(201).cookie("token", token, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000}).json({ error: false, message: "Account created", user: user});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: true, message: error.message });
    }
}

export async function login(req, res) {
    try {
        //Check a user by email
        let [data] = await findByEmail(req.body.email);
        let user = data[0];
        if(!user) {
            return res.status(401).json({error: true, message: "Wrong credentials"});
        }

        //Check password if a user exists
        const match = await validatePassword(req.body.password, user.password);
        if(!match){
            return res.status(401).json({error: true, message: "Wrong credentials"});
        }
        const token = issueJWT(user);

        delete user.password;

        return res.status(200).cookie("token", token, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000}).json({ error: false, message: "Successfully authorized", user: user});
    
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

export async function logout(req, res) {
    try {   
    
        return res.status(200).clearCookie("token").json({error: false, message: "Successfully logged out"})
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


export async function changePassword(req, res) {
    try {
        //Check if current password is correct
        const [data] = await findById(req.user.sub);
        const user = data[0];

        const match = await validatePassword(req.body.currentPassword, user.password);
        if(!match) {
            return res.status(400).json({error: true, message: "Wrong current password"});
        }

        //Update password
        const password = await generatePassword(req.body.password);
        await changeUserPassword(password, req.user.sub);

        return res.status(200).json({error: false, message: "Password changed"});

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

export async function updateEmail(req, res) {
    try {
        


    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

export async function checkIfEmailTaken(req, res){
    try {
        if(!req.query.email){
            return res.status(400).json({ error: true, message: "No email provided"})
        }
        const [userData] = await findByEmail(req.query.email);
        const user = userData[0];
        if(user){
            return res.status(200).json({ error: false, message: "", taken: true })
        }else{
            return res.status(200).json({ error: false, message: "", taken: false })
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message })

    }
}

export async function sendVerificationCode (req, res) {
    try{
        await sendCode(req.body.email, req.body.type); 
       
        return res.status(200).json({ error: false, message: "Verification code has been sent" })

    }catch(error) {
       return res.status(500).json({ error: true, message: error.message })
    }
}

export async function verifyAccount(req, res) {
    try {
        const [userData] = await findById(req.user.sub);
        const user = userData[0];
        
        //Get the code for this user 
        const [verificationInstances] = await getVerificationInstance(user.email, "account-verification");
        const verificationInstance = verificationInstances[0];
 
        if(!verificationInstance || verificationInstance.expireAt < new Date()){
            return res.status(400).json({error: true, message: "Incorrect code"});
        }

        //Check if code is correct
        if(req.body.code == verificationInstance.code){
            await updateUserVerifiedStatus(1, req.user.sub);
            await deleteVerificationInstance(verificationInstance.verificationId);

            const [updatedUserData] = await findById(req.user.sub);
            const updatedUser = updatedUserData[0];
            
            return res.status(200).json({error: false, message: "Account successfully verified", user: updatedUser});
        }else{
            return res.status(400).json({error: true, message: "Incorrect code"});
        }

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

export async function deleteAccount(req, res) {
    try {
        const [userData] = await findById(req.user.sub);
        const user = userData[0];
        //Check if password is correct
        const match = await validatePassword(req.body.password, user.password);

        if(!match){
            return res.status(400).json({error: true, message: "Wrong password"});
        }

        await deleteUser(req.user.sub);

        return res.status(200).clearCookie("token").json({error: false, message: "Account successfully deleted"})

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

export async function confirmPasswordReset(req,res) {
    try {
        //Get the code for this user 
        const [verificationInstances] = await getVerificationInstance(req.body.email, "password-reset");
        const verificationInstance = verificationInstances[0];

        //Check if code is correct
        if(req.body.code == verificationInstance.code){
            await updateVerificationInstanceConfirmationStatus(true, verificationInstance.verificationId);
            
            return res.status(200).json({error: false, message: "Code successfully confirmed"});
        }else{
            return res.status(400).json({error: true, message: "Incorrect code"});
        }


    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });

    }
}

export async function resetPassword(req, res) {
    try {
        //Get the code for this user 
        const [verificationInstances] = await getVerificationInstance(req.body.email, "password-reset");
        const verificationInstance = verificationInstances[0];

        //Check if code was confirmed
        if(!verificationInstance.confirmed){
            return res.status(403).json({error: true, message: "Action forbidden"});
        }else{            
            //Update password
            const [userData] = await findByEmail(req.body.email);
            const user = userData[0];

            const password = await generatePassword(req.body.password);
            await changeUserPassword(password, user.userId);

            //Delete verification instance
            await deleteVerificationInstance(verificationInstance.verificationId);

            return res.status(200).json({error: false, message: "Password has been successfully reset"});
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

export async function changeEmail(req, res) {
    try {
        //Get the code for this user 
        const [verificationInstances] = await getVerificationInstance(req.body.email, "email-change");
        const verificationInstance = verificationInstances[0];

        //Check if code is correct
        if(req.body.code == verificationInstance.code){
         await updateUserEmail(req.body.email, req.user.sub);
         await deleteVerificationInstance(verificationInstance.verificationId);

         const [updatedUserData] = await findById(req.user.sub);
         const updatedUser = updatedUserData[0];
         
         return res.status(200).json({error: false, message: "Email successfully changed", user: updatedUser});
        }else{
            return res.status(400).json({error: true, message: "Incorrect code"});
        }
      
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });

    }
}