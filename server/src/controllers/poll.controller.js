const Poll = require('../models/poll.model');
const crypto = require('crypto');

const createPollLack = async (req, res) => {
    try {
        const { title, options } = req.body;
        console.log('Erhaltene Daten:', { title, options });

        // Validierung
        if (!title || !Array.isArray(options) || options.length === 0) {
            return res.status(400).json({
                code: 400,
                message: "Titel und mindestens eine Option sind erforderlich"
            });
        }

        // Tokens generieren
        const adminToken = crypto.randomBytes(8).toString('hex');
        const shareToken = crypto.randomBytes(8).toString('hex');

        // Neuen Poll erstellen
        const newPoll = new Poll({
            title,
            options: options.map(opt => ({
                id: opt.id,
                text: opt.text,
                votes: []
            })),
            setting: {
                voices: 1,
                worst: false
            },
            adminToken,
            shareToken
        });

        // In DB speichern
        const savedPoll = await newPoll.save();
        console.log('Poll erfolgreich gespeichert:', savedPoll);

        // Response
        return res.status(201).json({
            admin: {
                link: `/poll/admin/${adminToken}`,
                value: adminToken
            },
            share: {
                link: `/poll/share/${shareToken}`,
                value: shareToken
            }
        });

    } catch (error) {
        console.error('Error in createPollLack:', error);

        // Mongoose Validierungsfehler
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                code: 400,
                message: error.message
            });
        }

        // Sonstige Fehler
        res.status(500).json({
            code: 500,
            message: "Interner Server-Fehler",
            error: error.message
        });
    }
};

const getPollStatistik = async (req, res) => {
    try {
        const shareToken = req.params.token;

        // Finde den Poll mit dem shareToken
        const poll = await Poll.findOne({ shareToken: shareToken });

        // Wenn kein Poll gefunden wurde
        if (!poll) {
            return res.status(404).json({
                code: 404,
                message: "Poll not found"
            });
        }

        // Wenn Poll gelöscht wurde
        if (poll.isDeleted) {
            return res.status(410).json({
                code: 410,
                message: "Poll is gone."
            });
        }

        // Formatiere die Antwort gemäß der OpenAPI-Spezifikation
        const response = {
            poll: {
                body: {
                    title: poll.title,
                    description: poll.description,
                    options: poll.options.map(opt => ({
                        id: opt.id,
                        text: opt.text
                    })),
                    setting: {
                        voices: poll.setting?.voices || 1,
                        worst: poll.setting?.worst || false,
                        deadline: poll.setting?.deadline
                    }
                },
                security: {
                    visibility: "lack"  // Da wir im lack-Modus sind
                },
                share: {
                    link: `/poll/share/${poll.shareToken}`,
                    value: poll.shareToken
                }
            },
            participants: [], // Array der Teilnehmer
            options: poll.options.map(opt => ({
                voted: opt.votes.filter(v => !v.isWorst).map(v => v.userId),
                worst: opt.votes.filter(v => v.isWorst).map(v => v.userId)
            }))
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error in getPollStatistik:', error);
        res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
};

const updatePoll = async (req, res) => {
    console.log('Update Poll aufgerufen mit Token:', req.params.token);
    console.log('Request Body:', req.body);

    try {
        const adminToken = req.params.token;
        const { description, title, options, setting, fixed } = req.body;

        console.log('Suche Poll mit adminToken:', adminToken);

        const updatedPoll = await Poll.findOneAndUpdate(
            { adminToken },
            {
                $set: {
                    title,
                    description,
                    'setting.voices': setting?.voices,
                    'setting.worst': setting?.worst,
                    'setting.deadline': setting?.deadline,
                    fixed
                },
                options: options.map(opt => ({
                    id: opt.id,
                    text: opt.text,
                    votes: []
                }))
            },
            { new: true }
        );

        console.log('Gefundener/Aktualisierter Poll:', updatedPoll);

        if (!updatedPoll) {
            console.log('Kein Poll gefunden');
            return res.status(404).json({
                code: 404,
                message: "Poll not found"
            });
        }

        console.log('Update erfolgreich');
        res.status(200).json({
            code: 200,
            message: "i. O."
        });

    } catch (error) {
        console.error('Error in updatePoll:', error);
        res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
};
// Debug-Log
console.log('Controller wird exportiert:', { createPollLack, getPollStatistik });
const deletePoll = async (req, res) => {  // Korrigierte Reihenfolge: erst req, dann res
    try {
        const adminToken = req.params.token;

        const updatedPoll = await Poll.findOneAndUpdate(
            { adminToken },  // Suchkriterium
            { isDeleted: true },  // Update-Operation
            { new: true }  // Option um das aktualisierte Dokument zurückzugeben
        );

        if (!updatedPoll) {
            return res.status(404).json({
                code: 404,
                message: "Poll nicht gefunden"
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Poll erfolgreich als gelöscht markiert",
            data: updatedPoll
        });

    } catch (error) {
        console.error('Error in deletePoll:', error);
        return res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
};


const createPollLock = async (req, res) => {
    try {
       
        const { title, options, setting } = req.body;
        
        // Einfache Token-Generierung
        const adminToken = Math.random().toString(36).substring(7);
        const shareToken = Math.random().toString(36).substring(7);

        const newPollLock = new Poll({
            title,
            options: options.map(opt => ({
                id: opt.id,
                text: opt.text,
                votes: []
            })),
            setting: {
                voices: setting.voices,
                worst: false
            },
            adminToken,
            shareToken,
            created: new Date()
        });

        await newPollLock.save();

        return res.status(201).json({
            success: true,
            data: {
                pollId: newPollLock._id,
                shareToken,
                adminToken
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: "Fehler beim Erstellen der Umfrage"
        });
    }
};
//hier naja was ich glaube Unterschide ist wenn visibility von lack ist kann durch entweder lock und lack api aufrufen wenn visibility nur lock ist
// kann das nur über lock aufrufen
// Controller für private Umfragen (lock)
const getPollStatistikByLock = async (req, res) => {
    try {
        

        const shareToken = req.params.token;
        const poll = await Poll.findOne({ shareToken });
        
        if (!poll) {
            return res.status(404).json({
                code: 404,
                message: "Poll not found"
            });
        }

 const response = {
            poll: {
                body: {
                    title: poll.title,
                    description: poll.description,
                    options: poll.options.map(opt => ({
                        id: opt.id,
                        text: opt.text
                    })),
                    setting: {
                        voices: poll.setting?.voices || 1,
                        worst: poll.setting?.worst || false,
                        deadline: poll.setting?.deadline
                    }
                },
                security: {
                    visibility: "lack"
                },
                share: {
                    link: `/poll/share/${poll.shareToken}`,
                    value: poll.shareToken
                }
            },
            participants: [],
            options: poll.options.map(opt => ({
                voted: opt.votes.filter(v => !v.isWorst).map(v => v.userId),
                worst: opt.votes.filter(v => v.isWorst).map(v => v.userId)
            }))
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error in getPollStatistikByLock:', error);
        return res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
};

const updatePollByLock = async(req,res)=>{
  try { 
        const adminToken = req.params.token;
        const { description, title, options, setting, fixed } = req.body;

        console.log('Suche Poll mit adminToken:', adminToken);

        const updatedPoll = await Poll.findOneAndUpdate(
            { adminToken },
            {
                $set: {
                    title,
                    description,
                    'setting.voices': setting?.voices,
                    'setting.worst': setting?.worst,
                    'setting.deadline': setting?.deadline,
                    fixed
                },
                options: options.map(opt => ({
                    id: opt.id,
                    text: opt.text,
                    votes: []
                }))
            },
            { new: true }
        );

        console.log('Gefundener/Aktualisierter Poll:', updatedPoll);

        if (!updatedPoll) {
            console.log('Kein Poll gefunden');
            return res.status(404).json({
                code: 404,
                message: "Poll not found"
            });
        }

        console.log('Update erfolgreich');
        res.status(200).json({
            code: 200,
            message: "i. O."
        });

    } catch (error) {
        console.error('Error in updatePoll:', error);
        res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
}

const deletePollByLock = async(res,req) =>{
     try {
        const adminToken = req.params.token;

        const updatedPoll = await Poll.findOneAndUpdate(
            { adminToken },  // Suchkriterium
            { isDeleted: true },  // Update-Operation
            { new: true }  // Option um das aktualisierte Dokument zurückzugeben
        );

        if (!updatedPoll) {
            return res.status(404).json({
                code: 404,
                message: "Poll nicht gefunden"
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Poll erfolgreich als gelöscht markiert",
            data: updatedPoll
        });

    } catch (error) {
        console.error('Error in deletePoll:', error);
        return res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
}
module.exports = {
    createPollLack,
    getPollStatistik,
    updatePoll,
    deletePoll,
    createPollLock,
    getPollStatistikByLock,//nur lock user kann das sehen
    updatePollByLock,
    deletePollByLock,
};