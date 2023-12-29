const models = require('../models')
const fs = require('fs/promises')

exports.newPost= async(req, res) => {
    const {title, contents, steps, } = req.body
    const url = req.protocol + '://' + req.get('host')

    try{
        const post = await models.Post.create({
            title,
            contents,
            steps,
            UserId: req.currentUser.id
        })
        if (req.files && Array.isArray(req.files)) {
            await Promise.all(req.files.map(async function (file) {
                const post_img = await models.Post_Image.create({
                    img_uri: '/public/images/' + file.filename,
                    PostId: post.id
                });
            }));
        }
        res.status(200).json({message: "postied"})
    } catch(e) {
        res.status(500).json(e)
        console.log(e)
    }
}

exports.getAllPosts = async (req, res) => {
    try{
        const gitPosts = await models.Post.findAll({
            include: [
                {
                    model: models.User,
                    attributes: { exclude: ['password', 'email']}
                },
                {
                    model: models.Post_Image
                }
            ]
        })
        res.status(200).json(gitPosts)
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.getPost = async (req, res) => {
    try{
        const post = await models.Post.findOne({
            where: {id: req.params.PostId}, 
            include: [
                {
                    model: models.User,
                    attributes: {exclude: ['password', 'email']},
                },
                {
                    model: models.Post_Image
                }
            ]
        })
        res.status(200).json(post)
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.myAllPosts = async(req, res) => {
    try{
        const myPosts = await models.Post.findAll({
            where: {UserId: req.currentUser.id},
            include: [
                {
                    model: models.Post_Image
                }
            ]
        })
        res.status(200).json(myPosts)
    } catch(e) {
        res.status(500).json(e)
    }
}


exports.getMyPost = async (req,res) =>{
    try{
        const myPost = await models.Post.findOne({
            where: {
                UserId: req.currentUser.id,
                id: req.params.PostId
            }
        })
        res.status(200).json(myPost)
    } catch(e) {
        res.status(500).json(e)
    }
}


exports.updateMyPost = async (req, res) => {
    const {title, contents, steps} = req.body
    try {
        const updatePost = await models.Post.update(
            {
                title,
                contents,
                steps
            },
            {
                where: {
                    id: req.params.PostId,
                    UserId: req.currentUser.id
                }
            }
        )
        res.status(200).json({message: 'updated'})
    }catch(e) {
        res.status(500).json(e)
    }
}

exports.deleteMyPost = async (req, res) => {
    const {postId} = req.body;
    try {
        await models.Post_Image.findAll({
            where: {PostId: postId}
        }).then(res => {
            res.map((img) => {
                fs.unlink('.' + img.img_uri, function(err) {
                    if (err) throw err
                })
            })
        })
        await models.Post_Image.destroy({
            where: {PostId: postId}
        });
        await models.Comment.destroy({
            where: {PostId: postId}
        });
        await models.Like.destroy({
            where: {PostId: postId}
        });
        await models.Post.destroy({
            where: {id: postId, UserId: req.currentUser.id}
        })
        res.status(200).json({message: "تم حذف منشورك"})
    } catch(e) {
        res.status(500).json(e)
    }
}