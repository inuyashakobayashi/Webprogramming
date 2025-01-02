const Poll = require('../models/poll.model');
const crypto = require('crypto');

const createPoll = async (req, res) => {
    try {
        const { title, description, options, setting, fixed } = req.body;

        if (!title || !Array.isArray(options) || options.length === 0) {
            return res.status(400).json({
                code: 400,
                message: "Title and at least one option are required"
            });
        }

        const adminToken = crypto.randomBytes(8).toString('hex');
        const shareValue = crypto.randomBytes(8).toString('hex');

        const newPoll = new Poll({
            body: {
                title,
                description,
                options: options.map(opt => ({
                    id: opt.id,
                    text: opt.text
                })),
                setting: {
                    voices: setting?.voices || 1,
                    worst: setting?.worst || false,
                    deadline: setting?.deadline
                },
                fixed: fixed || []
            },
            security: {
                visibility: 'lack'
            },
            share: {
                link: `/poll/share/${shareValue}`,
                value: shareValue
            },
            adminToken
        });

        const savedPoll = await newPoll.save();

        return res.status(201).json({
            admin: {
                link: `/poll/admin/${adminToken}`,
                value: adminToken
            },
            share: {
                link: `/poll/share/${shareValue}`,
                value: shareValue
            }
        });

    } catch (error) {
        console.error('Error in createPoll:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                code: 400,
                message: error.message
            });
        }
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getPollStatistik = async (req, res) => {
    try {
        const shareValue = req.params.token;
        const poll = await Poll.findOne({ 'share.value': shareValue });

        if (!poll) {
            return res.status(404).json({
                code: 404,
                message: "Poll not found"
            });
        }

        if (poll.isDeleted) {
            return res.status(410).json({
                code: 410,
                message: "Poll is gone"
            });
        }

        const response = {
            poll: {
                body: {
                    title: poll.body.title,
                    description: poll.body.description,
                    options: poll.body.options,
                    setting: poll.body.setting,
                    fixed: poll.body.fixed
                },
                security: {
                    visibility: poll.security.visibility
                },
                share: poll.share
            },
            participants: [],
            options: poll.body.options.map(() => ({
                voted: [],
                worst: []
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
    try {
        const adminToken = req.params.token;
        const { description, title, options, setting, fixed } = req.body;

        const updatedPoll = await Poll.findOneAndUpdate(
            { adminToken },
            {
                $set: {
                    'body.title': title,
                    'body.description': description,
                    'body.setting': setting,
                    'body.fixed': fixed,
                    'body.options': options.map(opt => ({
                        id: opt.id,
                        text: opt.text
                    }))
                }
            },
            { new: true }
        );

        if (!updatedPoll) {
            return res.status(404).json({
                code: 404,
                message: "Poll not found"
            });
        }

        res.status(200).json({
            code: 200,
            message: "Success"
        });

    } catch (error) {
        console.error('Error in updatePoll:', error);
        res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
};

const deletePoll = async (req, res) => {
    try {
        const adminToken = req.params.token;
        const updatedPoll = await Poll.findOneAndUpdate(
            { adminToken },
            { isDeleted: true },
            { new: true }
        );

        if (!updatedPoll) {
            return res.status(404).json({
                code: 404,
                message: "Poll not found"
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Poll marked as deleted",
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

module.exports = {
    createPoll,
    getPollStatistik,
    updatePoll,
    deletePoll
};