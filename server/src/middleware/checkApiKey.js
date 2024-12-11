// auth.middleware.js
const checkApiKey = async (req, res, next) => {
    const apiKey = req.header('API-KEY');
    if (!apiKey) {
        return res.status(401).json({
            code: 401,
            message: "API-Key ist erforderlich"
        });
    }
    next();
};
module.exports ={checkApiKey}