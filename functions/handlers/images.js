const { db } = require('../util/admin');
// Get any user's Images
exports.getUserImages = (req, res) => {
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then(() => {
      return db
        .collection('images')
        .where('userHandle', '==', req.params.handle)
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then(data => {
      let userImage = [];
      data.forEach(doc => {
        userImage.push({
          imageUrl: doc.data().imageUrl,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          imageId: doc.id
        });
      });
      return res.json(userImage);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
// Fetch one image
exports.getImage = (req, res) => {
  let imageData = {};
  db.doc(`/images/${req.params.imageId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Image not found!' });
      }
      imageData = doc.data();
      imageData.imageId = doc.id;
      return db
        .collection('imageComments')
        .orderBy('createdAt', 'desc')
        .where('imageId', '==', req.params.imageId)
        .get();
    })
    .then(data => {
      imageData.comments = [];
      data.forEach(doc => {
        imageData.comments.push(doc.data());
      });
      return res.json(imageData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
// Like a image
exports.likeImage = (req, res) => {
  const likeImageDocument = db
    .collection('imageLikes')
    .where('userHandle', '==', req.user.handle)
    .where('imageId', '==', req.params.imageId)
    .limit(1);

  const imageDocument = db.doc(`/images/${req.params.imageId}`);

  let imageData = {};

  imageDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        imageData = doc.data();
        imageData.imageId = doc.id;
        return likeImageDocument.get();
      } else {
        return res.status(404).json({ error: 'Image not found!' });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection('imageLikes')
          .add({
            imageId: req.params.imageId,
            userHandle: req.user.handle
          })
          .then(() => {
            imageData.likeCount++;
            return imageDocument.update({ likeCount: imageData.likeCount });
          })
          .then(() => {
            return db
              .collection('imageComments')
              .orderBy('createdAt', 'desc')
              .where('imageId', '==', req.params.imageId)
              .get();
          });
      } else {
        return res.status(400).json({ error: 'Image already liked' });
      }
    })
    .then(data => {
      imageData.comments = [];
      data.forEach(doc => {
        imageData.comments.push(doc.data());
      });
      return res.json(imageData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Unlike a image
exports.unlikeImage = (req, res) => {
  const likeImageDocument = db
    .collection('imageLikes')
    .where('userHandle', '==', req.user.handle)
    .where('imageId', '==', req.params.imageId)
    .limit(1);

  const imageDocument = db.doc(`/images/${req.params.imageId}`);

  let imageData = {};

  imageDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        imageData = doc.data();
        imageData.imageId = doc.id;
        return likeImageDocument.get();
      } else {
        return res.status(404).json({ error: 'Image not found!' });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: 'Image not liked' });
      } else {
        return db
          .doc(`/imageLikes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            imageData.likeCount--;
            return imageDocument.update({ likeCount: imageData.likeCount });
          })
          .then(() => {
            return db
              .collection('imageComments')
              .orderBy('createdAt', 'desc')
              .where('imageId', '==', req.params.imageId)
              .get();
          });
      }
    })
    .then(data => {
      imageData.comments = [];
      data.forEach(doc => {
        imageData.comments.push(doc.data());
      });
      return res.json(imageData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Comment on a image
exports.commentOnImage = (req, res) => {
  if (req.body.body.trim() === '')
    return res.status(400).json({ comment: 'Must not be empty' });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    imageId: req.params.imageId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/images/${req.params.imageId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Image not found' });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection('imageComments').add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
};
