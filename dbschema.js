let db = {
  users: [
    {
      userId: 'difji',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2019-07-22T04:50:11.034Z',
      imageUrl: 'image/kdscjjfjfkjggkg/fjifjief',
      bio: 'Hello, my name is user',
      website: 'https://user.com',
      location: 'London, Uk'
    }
  ],
  screams: [
    {
      userHandle: 'user',
      body: 'this is the scream body',
      createdAt: '2019-07-22T04:50:11.034Z',
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: 'user',
      screamId: 'jdfjfjfidfffie',
      body: 'nice one mete!',
      createdAt: '2019-07-22T04:50:11.034Z'
    }
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'john',
      read: 'true | false',
      screamId: 'rjiw9k9rkeofkeockfd',
      type: 'like | comment',
      createdAt: '2019-07-22T04:50:11.034Z'
    }
  ]
};

const userDetails = {
  // Redux data
  credentials: {
    userId: 'FU7UDF8UEFHF7YDFDUHCDF788D',
    email: 'user@email.com',
    handle: 'user',
    createdAt: '2019-07-22T04:50:11.034Z',
    imageUrl: 'image/kdscjjfjfkjggkg/fjifjief',
    bio: 'Hello, my name is user, nice to meet you',
    website: 'https://user.com',
    location: 'London, Uk'
  },
  likes: [
    {
      userHandle: 'user',
      screamId: 'j34u84ru485hf5u85'
    },
    {
      userHandle: 'user',
      screamId: 'j34u84njdj8r8r5u85'
    }
  ]
};
