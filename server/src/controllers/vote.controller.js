const Vote = require('../models/vote.model')
const Poll = require('../models/poll.model')
const crypto = require('crypto')
const addVote=async(req,res)=>{
    try {
        const shareToken = req.params.token;
        const {owner,choice} = req.body;
             const poll = await Poll.findOne({ shareToken: shareToken });
        
                // Wenn kein Poll gefunden wurde
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
        if (choice.length > poll.setting.voices) {
            return res.status(405).json({
                code: 405,
                message: "Too many choices selected"
            });
        }

        // Check if worst vote is allowed
        if (!poll.setting.worst && choice.some(c => c.worst)) {
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

        // Save the vote
        await vote.save();

        // Update the poll's options with the new votes
      // Update the poll's options with the new votes
for (const c of choice) {
    const optionIndex = poll.options.findIndex(opt => opt.id === c.id);
    if (optionIndex !== -1) {
        poll.options[optionIndex].votes.push({
            userId: owner.name,
            isWorst: c.worst || false,
            editToken: editToken,  // Hier fehlte der editToken
            votedAt: new Date()
        });
    }
}

        // Save the updated poll
        await poll.save();

        // Return the edit token as specified in the API
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

}

const getVote = async(req,res)=>{
    try {const editToken = req.params.token
        const poll = await Poll.findOne({ 'options.votes.editToken': editToken  });
        
                // Wenn kein Poll gefunden wurde
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
        return res.status(200).json(
                {
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
  "vote": {
    "owner": {
      "name": "string",
      "lock": true
    },
    "choice": [
      {
        "id": 1,
        "worst": false
      }
    ]
  },
  "time": "2023-05-29T19:21:39+02:00"
}

            )
        
    } catch (error) {
        
    }
};

const updateVote = async(req,res)=> {
  try {
    const editToken = req.params.token;
    const {owner,choice} = req.body;
    const poll = await Poll.findOne({'options.votes.editToken':editToken});
    if(!poll){
         return res.status(404).json({
                        code: 404,
                        message: "Poll not found"
                    });
    }
        // Entferne den alten Vote aus den Poll-Optionen
        for (const option of poll.options) {
            option.votes = option.votes.filter(v => v.editToken !== editToken);
        }

        // Füge den neuen Vote zu den Poll-Optionen hinzu
        for (const c of choice) {
            const optionIndex = poll.options.findIndex(opt => opt.id === c.id);
            if (optionIndex !== -1) {
                poll.options[optionIndex].votes.push({
                    userId: owner.name,
                    isWorst: c.worst || false,
                    editToken: editToken,
                    votedAt: new Date()
                });
            }
        }

        // Speichere die Änderungen am Poll
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
  "code": 200,
  "message": "i. O."
})
  } catch (error) {
    
  }
}



const deleteVote = async(req,res) => {
  try {
    const editToken =req.params.token;
    const poll = await Poll.findOne({'options.votes.editToken':editToken});
    if(!poll){
         return res.status(404).json({
                        code: 404,
                        message: "Poll not found"
                    });
    }
        // Entferne den alten Vote aus den Poll-Optionen
        for (const option of poll.options) {
            option.votes = option.votes.filter(v => v.editToken !== editToken);
        }
        await poll.save();
        const vote = await Vote.findOneAndDelete({'editToken':editToken});
        return res.status(200).json({
  "code": 200,
  "message": "i. O."
})

  } catch (error) {
    
  }
}
module.exports={
    addVote,
    getVote,
    updateVote,
    deleteVote
};