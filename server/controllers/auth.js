import { findByUsername, findByEmail, createUser, findById, changeUserPassword, getVerificationInstance, updateUserVerifiedStatus, deleteVerificationInstance } from "../database/functions.js";
import { generatePassword, issueJWT, sendVerificationCode, validatePassword } from "../lib/utils.js";

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
        await sendVerificationCode(req.body.email, "verification"); 

        //Create new user
        const [newUser] = await createUser(req.body.email, req.body.username, req.body.country, password);

        //Log new user in
        const [userData] = await findById(newUser.insertId);
        const user = userData[0];
        console.log(user)
        const token = issueJWT(user);
        console.log(token)
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

export async function resendVerificationCode (req, res) {
    try{
        const [userData] = await findById(req.user.sub);
        const user = userData[0];
        
        await sendVerificationCode(user.email, "verification"); 
       
        return res.status(200).json({ error: false, message: "Verification code has been resent" })

    }catch(err) {
        console.log(err)
       return res.status(500).json({ error: false, message: err.message })
    }
 }

export async function verifyAccount(req, res) {
    try {
        const [userData] = await findById(req.user.sub);
        const user = userData[0];
        
        //Get the code for this user 
        const [verificationInstances] = await getVerificationInstance(user.email, "verification");
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