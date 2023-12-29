const models = require('../models')


exports.like = async (req, res) => {
    try {
        const userLike = await models.Like.findOne({
            where: {UserId: req.currentUser.id, PostId: req.params.PostId}
        })
        if (userLike) {
            await models.Like.destroy({
                where: {UserId: req.currentUser.id, PostId: req.params.PostId}
            })
            res.status(200).json({message: "desLiked"})
        } else {
            await models.Like.create ({
                UserId: req.currentUser.id,
                PostId: req.params.PostId
            })
            res.status(200).json({message: "liked"})
        }
    } catch(e) {
        res.status(500).json(e)
        console.log(e)
    }
}


exports.likeCount = async(req,res) => {
     try {
        const likes = await models.Like.findAll({
            where: {PostId: req.params.PostId}
        })
        const userLiked = await models.Like.findOne({
            where: {UserId: req.currentUser.id, PostId: req.params.PostId}
        })
        res.status(200).json({
            likes: likes.length,
            userLiked
        })
     } catch(e) {
        res.status(500).json(e)
     }
}