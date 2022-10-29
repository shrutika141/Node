const {
    User, Gallery
} = require('../models')
const bcrypt = require('bcrypt')
const Joi = require('@hapi/joi')
const ImageUpload = require('../middleware/middleware')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const path = require("path");
const fs = require("fs-extra");


module.exports = {
    loginPage: (req, res) => {

        const error = req.flash('error')
        const message = req.flash('success')
        const formValue = req.flash('formValue')[0];

        res.render('pages/login', {
            message,
            error,
            formValue
        })
    },

    login: async (req, res) => {
        const reqParam = req.body
        const reqObj = {
            email: Joi.string().required(),
            password: Joi.string().required(),
        }
        const schema = Joi.object(reqObj)
        const {
            error
        } = await schema.validate(reqParam)
        if (error) {
            req.flash('formValue', reqParam);
            req.flash('error', 'please fill the field : ', error.details[0].message);
            return res.redirect(req.header('Referer'))
        } else {
            let user;
            user = await User.findOne({
                where: {
                    email: reqParam.email
                }
            })
            console.log('user', user)
            console.log('userID', user.id)
            if (user) {
                bcrypt.compare(
                    reqParam.password,
                    user.password,
                    async (err, result) => {
                        if (err) {
                            req.flash('formValue', reqParam);
                            req.flash('error', 'Email password not match');
                            return res.redirect(req.header('Referer'))
                        }
                        if (result) {
                            const token = jwt.sign({
                                    email: user.email,
                                    password: user.id
                                },
                                process.env.JWT_KEY, {
                                    expiresIn: "1h"
                                }
                            );
                            console.log('token', token)
                            user.reset_token = token
                            
                            User.update({
                                reset_token: token
                            }, {
                                where: {
                                    email: user.email
                                }
                            }).then(async (updateData) => {
                                if (updateData) {
                                    return res.redirect('/dashboard')
                                } else {
                                    req.flash('formValue', reqParam);
                                    req.flash('error', 'Something went wrong');
                                    return res.redirect(req.header('Referer'))
                                }
                            }, (e) => {
                                req.flash('formValue', reqParam);
                                req.flash('error', 'Internal error');
                                return res.redirect(req.header('Referer'))
                            })
                        } else {
                            req.flash('formValue', reqParam);
                            req.flash('error', 'e-mail/password not match');
                            return res.redirect(req.header('Referer'))
                        }
                        return null
                    }
                )
            } else {
                req.flash('formValue', reqParam);
                req.flash('error', 'Username not exist');
                return res.redirect(req.header('Referer'))
            }
        }
    },

    dashboard: async(req, res) => {
        // console.log(req.headers.authorization.split(' ')[1])
        const error = req.flash('error')
        const message = req.flash('success')
        const formValue = req.flash('formValue')[0];

        const photo = await Gallery.findAll()

        res.render('pages/dashboard', {
            message,
            error,
            formValue,
            photo
        })
    },

    addPhoto: (req, res) => {
        // const reqParam = req.files;
        let photo;

        // console.log(reqParam)
        photo = true;
        const extension = req.files.img.type;
        const imageExtArr = [
            "image/jpg",
            "image/jpeg",
            "image/png",
        ];

        if (req.files && req.files.img && !imageExtArr.includes(extension)) {
            // req.flash('formValue', reqParam);
            req.flash('error', 'Image invalid, required extension (png, jpeg, jpg)');
            return res.redirect(req.header('Referer'))
        }

        const allowed_file_size = 2;
        console.log('req.files.img.size', req.files.img.size);
         if ((req.files.img.size / (1024 * 1024)) > allowed_file_size) {
            //  throw Error('File too large');
            //  req.flash('formValue', reqParam);
             req.flash('error', 'File too large');
             return res.redirect(req.header('Referer'))
         }

        let photoName = photo ? `${req.files.img.name.split(".")[0]}${moment().unix()}${path.extname(req.files.img.name)}` : "";
        // await ImageUpload(req, res, photoName)

            // ImageUpload: (req, res, photoName) => {
                // console.log('photoName', photoName);
                // console.log(req.files.img.path);
                // // console.log('oldPath', oldPath);
                // const newPath = `${path.join("../public/assets/")}${photoName}`;

                // console.log('newPath', newPath);
                // eslint-disable-next-line consistent-return
                // fs.writeFile(newPath,'', err => {
                //     if (err) {
                //         console.log('error', err);
                        // return Response.errorResponseData(
                        //     res,
                        //     res.__("somethingWentWrong"),
                        //     500
                        // );
                    // }
                // });
            // }    


//         console.log('photoName', photoName)
// return
         Gallery.create({
            img: photoName
         }).then(result => {
            return res.redirect(req.header('Referer'))
         }).catch(err => console.log(err)) 

    }
}