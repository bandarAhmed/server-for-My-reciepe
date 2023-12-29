const { where } = require('sequelize');
const models = require('../models')
const db = require('../models/database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
    const {name, email, password} = req.body;
    try{
        const hashPassword = await bcrypt.hash(password, 10)
        const findEmail = await models.User.findOne({where: {email}})
        if (findEmail === null) {
            const user = await models.User.create({
                name,
                email,
                password: hashPassword
            })
            res.status(200).json({message: "user created"})
        }else{
            res.status().json({message: "email is using before"})
        }
    }catch(e) {
        res.status(500).json(e)
    }
}

exports.login = async(req,res) => {
    const {email, password} = req.body
    try{
        const user = await models.User.findOne({where:{email}})
        if(user === null){
            res.status(401).json({message: "email or password is null"})
        } else {
            const pass = await bcrypt.compare(password, user.password)
            if(pass){
                const token = jwt.sign({
                    id: user.id,
                    email: user.email
                 }, process.env.JWT)
                res.status(200).json({accessToken: token})
            } else {
                res.status(401).json({message: "email or password is null"})
            }
        }
    }catch(e) {
        res.status(500).json(e)
    }
}


exports.getProfile= async (req, res) => {
    try{
        const user = await models.User.findOne({
            where: {id: req.currentUser.id},
            attributes: {exclude: ['password']}
        })

        res.status(200).json(user)
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.uploadUserPhoto = async (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    try{
        const uploadPhoto = await models.User.update(
            {
                img_uri: url+ '/public/images/' + req.file.filename
            }, 
            {where: {id: req.currentUser.id}}
        )
        res.status(200).json({ message: 'upload image'})
    } catch(e) {
        res.status(500).json(e)
    }
}

exports.updateProfile = async(req, res) => {
    const {name, password} = req.body
    try{
        const hashPassword = await bcrypt.hash(password, 10)
        const update = await  models.User.update(
            {
                name,
                password : hashPassword
            },
            {where: {id: req.currentUser.id}}
        );
        res.status(200).json({message: "update"})
    } catch(e) {
        res.status(500).json(e)
    }
}