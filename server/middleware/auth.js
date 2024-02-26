import jwt from "jsonwebtoken";

export function verifyJWT (req, res, next) {
   const token = req.headers.authorization;
   
   if(!token){
      return res.status(401).json({error: true, message: "Not authorized"});
   }

   const splitedToken = token.split(" ");
   if (splitedToken[0] === "Bareer" && splitedToken[1].match(/\S+\.\S+\.\S+/) !== null) {
      try{
         const verification = jwt.verify(splitedToken[1], process.env.SECRET, { algorithms: ["HS256"] });
         req.user = verification;
         next();
      }catch(err){
         return res.status(500).json({error: true, message: err.message});
      }
   }else{
      return res.status(401).json({ error: true, message: "Not authorized" });
   }
   
}
