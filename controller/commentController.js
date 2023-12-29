const models = require('../models')


exports.createComment = async (req,res) => {
    const {text} = req.body 
    try {
        const comment = await models.Comment.create({
            text,
            PostId: req.params.PostId,
            UserId: req.currentUser.id
        })
        res.status(200).json({message: "comment created"})
    } catch(e) {
        res.status(500).json(e)
        console.log(e)
    }
}

exports.getComment = async (req, res) => {
    try{
        const getComment = await models.Comment.findAll({
            where: {PostId: req.params.PostId},
            include: [
                {
                    model: models.User,
                    attributes: {exclude: ['password', 'email']}
                }
            ]
        })
        res.status(200).json(getComment)
    } catch(e) {
        res.status(500).json(e)
    }
}

