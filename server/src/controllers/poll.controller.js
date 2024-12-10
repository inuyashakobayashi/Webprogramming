// src/controllers/poll.controller.js
const crypto = require('crypto');
const Poll = require('../models/poll.model');
const createPollLack = async (req, res) => {
    try {
        // 1. Validiere Request Body
        const { title, options } = req.body;
        console.log('Erhaltene Daten:', { title, options }); // Log der Daten

        if (!title || !options) {
            return res.status(405).json({
                code: 405,
                message: "Invalid input"
            });
        }
        const adminToken = crypto.randomBytes(8).toString('hex');
        const shareToken = crypto.randomBytes(8).toString('hex');
        const newPoll = new Poll({
            title,
            options: options.map(opt => ({
                id: opt.id,
                text: opt.text
            })),
            adminToken,
            shareToken
        });

        // 4. Speichere in Datenbank
        await newPoll.save();


        return res.status(200).json({
            admin: {
                link: "string",
                value: adminToken
            },
            share: {
                link: "string",
                value: shareToken
            }
        });

    } catch (error) {
        console.error('Error in createPollLack:', error);
        res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
};

// Logging beim Export
const getPollStatistik = async (req, res) => {
    try {

        const shareToken = req.params.token;
        const dbShareToken = "";


        const poll = await findPollByToken(token);

        if (!poll) {
            return res.status(404).json({
                code: 404,
                message: "Poll not found"
            });
        }

        if (poll.isDeleted) {
            return res.status(410).json({
                code: 410,
                message: "Poll is gone."
            });
        }
        // if (true) {
        return res.status(200).json({
            "poll": {
                "body": {
                    "title": "What is your favorite color?",
                    "description": "By blue are also meant blue-like colors, like turkish.",
                    "options": [
                        {
                            "id": 0,
                            "text": "string"
                        },
                        {
                            "id": 0,
                            "text": "string"
                        }
                    ],
                    "setting": {
                        "voices": 1,
                        "worst": false,
                        "deadline": "2023-05-29T19:21:39+02:00"
                    },
                    "fixed": [
                        0
                    ]
                },
                "security": {
                    "owner": {
                        "name": "string",
                        "lock": true
                    },
                    "users": [
                        {
                            "name": "string",
                            "lock": true
                        }
                    ],
                    "visibility": "lack"
                },
                "share": {
                    "link": "string",
                    "value": "71yachha3ca48yz7"
                }
            },
            "participants": [
                {
                    "name": "string",
                    "lock": true
                }
            ],
            "options": [
                {
                    "voted": [
                        0
                    ],
                    "worst": [
                        0
                    ]
                }
            ]
        });
        //}
    } catch (error) {

    }
}

module.exports = {
    createPollLack,
    getPollStatistik,
};