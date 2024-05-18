import { changeUserAvatar, changeUserCountry, findById } from "../database/functions.js";

export async function updateCountry(req, res) {
    try {
        
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }
        
        await changeUserCountry(req.body.country, req.user.sub);
        const [data] = await findById(req.user.sub);
        const user = data[0];
        delete user.password;
        return res.status(200).json({error: false, message: "Country changed", user: user});

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: true, message: error.message });
    }
}

export async function changeAvatar(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }
        
        await changeUserAvatar(req.body.avatarId, req.user.sub);
        const [data] = await findById(req.user.sub);
        const user = data[0];
        delete user.password;
        return res.status(200).json({error: false, message: "Avatar changed", user: user});

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: true, message: error.message });
    }
}

