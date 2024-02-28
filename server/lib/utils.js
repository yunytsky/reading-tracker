import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

// Password generation 
export async function generatePassword(plainTextPassword) {
    try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(plainTextPassword, salt);
        return password;
    } catch (error) {
        throw error;
    }
}
// Password validation
export async function validatePassword(plainTextPassword, hashedPassword) {
    try {
        const match = bcrypt.compare(plainTextPassword, hashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
}

// Issuing JWT
export function issueJWT(user){
    const payload = {
        sub: user.userId,
        iat: Date.now()
    };

    const token = jsonwebtoken.sign(payload, process.env.SECRET, {expiresIn: "7d", algorithm: "HS256"});
    return token;
}

//Generate verification code


//Send verification email
