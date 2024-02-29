import jwt from "jsonwebtoken";

export function verifyJWT (req, res, next) {
   const token = req.cookies.token;
   
   if(!token){
      return res.status(401).json({error: true, message: "Not authorized"});
   }
   if (token.match(/\S+\.\S+\.\S+/) !== null) {
      try{
         const verification = jwt.verify(token, process.env.SECRET, { algorithms: ["HS256"] });
         req.user = verification;
         next();
      }catch(err){
         return res.status(500).json({error: true, message: err.message});
      }
   }else{
      return res.status(401).json({ error: true, message: "Not authorized" });
   }
   
}
