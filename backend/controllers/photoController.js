var PhotoModel = require('../models/photoModel.js');

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
        .sort({ createdAt: -1 })
        .populate('postedBy')
        .populate('comments.postedBy', 'username') // This is correct - we need to populate comment usernames
        .exec(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            
            return res.json(photos);
        });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
    
        PhotoModel.findOne({_id: id})
            .populate('postedBy')
            .populate('comments.postedBy', 'username')
            .exec(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }
    
                if (!photo) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }
    
                return res.json(photo);
            });
    },

    /**
     * photoController.create()
     */
    create: function (req, res) {
        var photo = new PhotoModel({
			name : req.body.name,
			path : "/images/"+req.file.filename,
			postedBy : req.session.userId,
            message : req.body.message,
			views : 0,
			likes : 0
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
			photo.path = req.body.path ? req.body.path : photo.path;
			photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
            photo.message = req.body.message ? req.body.message : photo.message;
			photo.views = req.body.views ? req.body.views : photo.views;
			photo.likes = req.body.likes ? req.body.likes : photo.likes;
			
            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },


    likePhoto: function(req, res){
        if(!req.session || !req.session.userId){
            return res.status(401).json({ error: "User not logged in" });
        }
    
        const userId = req.session.userId;
        
        PhotoModel.findById(req.params.id)
            .then(photo => {
                if(!photo){
                    return res.status(404).json({
                        error: "Photo not found"
                    });
                }
    
                if(!Array.isArray(photo.likedBy)) photo.likedBy = [];
                if(!Array.isArray(photo.dislikedBy)) photo.dislikedBy = [];
    
                if(photo.likedBy.includes(userId)){
                    return res.status(400).json({
                        error: "You already liked this photo"
                    });
                }
    
                const dislikeIndex = photo.dislikedBy.indexOf(userId);
                if(dislikeIndex !== -1){
                    photo.dislikedBy.splice(dislikeIndex, 1);
                    photo.dislikes = Math.max((photo.dislikes || 0) - 1, 0);
                }
    
                // Add like
                photo.likedBy.push(userId);
                photo.likes = (photo.likes || 0) + 1;
    
                return photo.save();
            })
            .then(updatedPhoto => {
                return res.json(updatedPhoto);
            })
            .catch(error => {
                console.error("Server error when liking photo:", error);
                return res.status(500).json({error: error.message || "Server error when liking photo"});
            });
    },
    
    dislikePhoto: function(req, res){
        if(!req.session || !req.session.userId){
            return res.status(401).json({error: "User not logged in"});
        }
        
        const userId = req.session.userId;
        
        PhotoModel.findById(req.params.id)
            .then(photo => {
                if(!photo){
                    return res.status(404).json({
                        error: "Photo not found"
                    });
                }
                
                if(!Array.isArray(photo.likedBy)) photo.likedBy = [];
                if(!Array.isArray(photo.dislikedBy)) photo.dislikedBy = [];
                
                // Check if user already disliked this photo
                if(photo.dislikedBy.includes(userId)){
                    return res.status(400).json({
                        error: "You already disliked this photo"
                    });
                }
                
                // If user previously liked, remove the like
                const likeIndex = photo.likedBy.indexOf(userId);
                if(likeIndex !== -1){
                    photo.likedBy.splice(likeIndex, 1);
                    photo.likes = Math.max((photo.likes || 0) - 1, 0);
                }
                
                // Add dislike
                photo.dislikedBy.push(userId);
                photo.dislikes = (photo.dislikes || 0) + 1;
                
                return photo.save();
            })
            .then(updatedPhoto => {
                return res.json(updatedPhoto);
            })
            .catch(error => {
                console.error("Server error when disliking photo:", error);
                return res.status(500).json({error: error.message || "Server error when disliking photo"});
            });
    },

    

    addComment: function(req, res){
        if(!req.session || !req.session.userId){
            return res.status(401).json({
                error: "You are not logged in"
            });
        }
    
        const myId = req.session.userId;
        const commentText = req.body.text;
        
        if(!commentText || commentText.trim() === '') {
            return res.status(400).json({
                error: "Comment text cannot be empty"
            });
        }
    
        PhotoModel.findById(req.params.id)
            .then(photo => {
                if(!photo){
                    return res.status(404).json({
                        error: "Photo doesn't exist"
                    });
                }
    
                if(!Array.isArray(photo.comments)) photo.comments = [];
                
                photo.comments.push({
                    text: commentText,
                    postedBy: myId
                });
    
                return photo.save();
            })
            .then(updatedPhoto => {
                return PhotoModel.populate(updatedPhoto, {
                    path: 'comments.postedBy',
                    select: 'username'
                });
            })
            .then(populatedPhoto => {
                return res.json(populatedPhoto);
            })
            .catch(error => {
                console.error("Error when commenting", error);
                return res.status(500).json({ error: error.message || "Server error when commenting on photo" });
            });
    },

    reportPhoto: function(req, res) {
        // Check if user is NOT logged in (fixed the condition)
        if(!req.session || !req.session.userId) {
            return res.status(401).json({
                error: "You are not logged in"
            });
        }
        
        const myId = req.session.userId;
        const reportText = req.body.text;
        
        // Fixed variable name - using reportText instead of commentText
        if(!reportText || reportText.trim() === '') {
            return res.status(400).json({
                error: "Report can not be empty"
            });
        }
        
        PhotoModel.findById(req.params.id)
            .then(photo => {
                if (!photo) {
                    return res.status(400).json({
                        error: "Photo doesn't exist"
                    });
                }
                
                if(!Array.isArray(photo.reports)) photo.reports = [];
                
                photo.reports.push({
                    text: reportText,
                    postedBy: myId
                });
                
                return photo.save();
            })
            .then(updatedPhoto => {
                // Populate both comments and reports
                return PhotoModel.populate(updatedPhoto, [
                    {
                        path: 'comments.postedBy',
                        select: 'username'
                    },
                    {
                        path: 'reports.postedBy',
                        select: 'username'
                    }
                ]);
            })
            .then(populatedPhoto => {
                return res.json(populatedPhoto);
            })
            .catch(error => {
                console.error("Error when reporting", error);
                return res.status(500).json({ 
                    error: error.message || "Server error when reporting photo" 
                });
            });
    },

    
   

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    publish: function(req, res){
        return res.render('photo/publish');
    }
};
