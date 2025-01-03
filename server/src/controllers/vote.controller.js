const Vote = require('../models/vote.model')
const Poll = require('../models/poll.model')
const crypto = require('crypto')

const addVote = async (req, res) => {
    try {
        const shareValue = req.params.token;
        const { owner, choice } = req.body;

        // Finde Poll mit dem neuen share.value Pfad
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
                message: "Poll is gone."
            });
        }

        // Validate the vote against poll settings
        if (choice.length > poll.body.setting.voices) {
            return res.status(405).json({
                code: 405,
                message: "Too many choices selected"
            });
        }

        // Check if worst vote is allowed
        if (!poll.body.setting.worst && choice.some(c => c.worst)) {
            return res.status(405).json({
                code: 405,
                message: "Worst choice not allowed in this poll"
            });
        }

        const editToken = crypto.randomBytes(8).toString('hex');

        // Create new vote document
        const vote = new Vote({
            pollId: poll._id,
            owner: owner,
            choice: choice,
            editToken: editToken,
            time: new Date()
        });

        await vote.save();

        // Update the poll's options with the new votes
        for (const c of choice) {
            const optionIndex = poll.body.options.findIndex(opt => opt.id === c.id);
            if (optionIndex !== -1) {
                poll.body.options[optionIndex].votes = poll.body.options[optionIndex].votes || [];
                poll.body.options[optionIndex].votes.push({
                    userId: owner.name,
                    isWorst: c.worst || false,
                    editToken: editToken,
                    votedAt: new Date()
                });
            }
        }

        await poll.save();

        return res.status(200).json({
            edit: {
                value: editToken
            }
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};

const getVote = async (req, res) => {
    try {
        const editToken = req.params.token;
        const poll = await Poll.findOne({ 'body.options.votes.editToken': editToken });

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

        // Filter options to only include the vote with matching editToken
        const filteredOptions = poll.body.options.map(option => ({
            id: option.id,
            text: option.text,
            votes: option.votes.filter(vote => vote.editToken === editToken)
        })).filter(option => option.votes.length > 0);

        return res.status(200).json({
            title: poll.body.title,
            options: filteredOptions,
            setting: poll.body.setting,
            share: poll.share
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
};

const updateVote = async (req, res) => {
    try {
        const editToken = req.params.token;
        const { owner, choice } = req.body;
        
        const poll = await Poll.findOne({ 'body.options.votes.editToken': editToken });
        
        if (!poll) {
            return res.status(404).json({
                code: 404,
                message: "Poll not found"
            });
        }

        // Entferne den alten Vote aus den Poll-Optionen
        for (const option of poll.body.options) {
            option.votes = option.votes.filter(v => v.editToken !== editToken);
        }

        // Füge den neuen Vote zu den Poll-Optionen hinzu
        for (const c of choice) {
            const optionIndex = poll.body.options.findIndex(opt => opt.id === c.id);
            if (optionIndex !== -1) {
                poll.body.options[optionIndex].votes.push({
                    userId: owner.name,
                    isWorst: c.worst || false,
                    editToken: editToken,
                    votedAt: new Date()
                });
            }
        }

        await poll.save();

        // Update auch den Vote im Vote-Model
        await Vote.findOneAndUpdate(
            { editToken: editToken },
            {
                owner: owner,
                choice: choice,
                time: new Date()
            },
            { new: true }
        );

        return res.status(200).json({
            code: 200,
            message: "i. O."
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
};

const deleteVote = async (req, res) => {
    try {
        const editToken = req.params.token;
        const poll = await Poll.findOne({ 'body.options.votes.editToken': editToken });
        
        if (!poll) {
            return res.status(404).json({
                code: 404,
                message: "Poll not found"
            });
        }

        // Entferne den Vote aus den Poll-Optionen
        for (const option of poll.body.options) {
            option.votes = option.votes.filter(v => v.editToken !== editToken);
        }
        
        await poll.save();
        await Vote.findOneAndDelete({ editToken: editToken });

        return res.status(200).json({
            code: 200,
            message: "i. O."
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
};

module.exports = {
    addVote,
    getVote,
    updateVote,
    deleteVote
};