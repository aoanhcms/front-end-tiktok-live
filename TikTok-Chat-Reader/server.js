require('dotenv').config();
var cors = require('cors')
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { TikTokConnectionWrapper, getGlobalConnectionCount } = require('./connectionWrapper');
const { clientBlocked } = require('./limiter');
const mongoose = require('mongoose')
const app = express();
const httpServer = createServer(app);
mongoose.connect('mongodb://localhost:27017/tiktok-chat')
.then(() => {
    console.log('Database connection successful')
  })
  .catch(err => {
    console.error('Database connection error')
  })
app.use(cors())



let CommentModel = require('./models/Comment')
let UserModel = require('./models/User')
let GiftModel = require('./models/Gift')
let LikeModel = require('./models/Like')
let LiveIdModel = require('./models/LiveId')
let ChanelModel = require('./models/Chanel')
// Enable cross origin resource sharing
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});
app.get('/get_user_lists', async (req, res) => {
    let userModel = await UserModel.find({})
        .populate({
            path: 'liveId',
            populate: {
                path: 'chanelId',
            }
        })
        .sort({commentCount: 'desc'}).limit(100).exec()
    res.json(userModel)
})

app.get('/get_comment_lists', async (req, res) => {
    if(typeof req.query.user_id !== 'undefined'){
        let commentModel = await CommentModel.find({userId: req.query.user_id})
        .populate('userId')
        .limit(100)
        .exec()

        res.json(commentModel)
    }else {
        res.json("Error user_id")
    }
})

io.on('connection', (socket) => {
    let tiktokConnectionWrapper;

    console.info('New connection from origin', socket.handshake.headers['origin'] || socket.handshake.headers['referer']);
    //lay danh sach 100 ng dung
    //lay danh sach message
    socket.on('setUniqueId', async (uniqueId, options) => {
        //save chanel
        let chanelModel = await ChanelModel.findOne({username: uniqueId})
            .exec()
        if(chanelModel === null) {
            //create
            chanelModel = await new ChanelModel({
                username: uniqueId
            }).save()
        }
        // Prohibit the client from specifying these options (for security reasons)
        if (typeof options === 'object') {
            delete options.requestOptions;
            delete options.websocketOptions;
        }

        // Is the client already connected to a stream? => Disconnect
        if (tiktokConnectionWrapper) {
            tiktokConnectionWrapper.disconnect();
        }

        // Check if rate limit exceeded
        if (process.env.ENABLE_RATE_LIMIT && clientBlocked(io, socket)) {
            socket.emit('tiktokDisconnected', 'You have opened too many connections or made too many connection requests. Please reduce the number of connections/requests or host your own server instance. The connections are limited to avoid that the server IP gets blocked by TokTok.');
            return;
        }

        // Connect to the given username (uniqueId)
        try {
            tiktokConnectionWrapper = new TikTokConnectionWrapper(uniqueId, options, true);
            tiktokConnectionWrapper.connect();
        } catch (err) {
            socket.emit('tiktokDisconnected', err.toString());
            return;
        }

        // Redirect wrapper control events once
        let LIVECHATID = await new Promise((resolve, reject) => {
            tiktokConnectionWrapper.once('connected', async state => {
                liveIdModel = await LiveIdModel.findOne({liveId: state.roomId})
                .exec()
                if(liveIdModel === null) {
                    //create
                    liveIdModel = await new LiveIdModel({
                        liveId: state.roomId,
                        chanelId: chanelModel._id
                    }).save()
                }
                resolve(liveIdModel)
                socket.emit('tiktokConnected', state)
            });
        })
        tiktokConnectionWrapper.once('disconnected', reason => socket.emit('tiktokDisconnected', reason));

        // Notify client when stream ends
        tiktokConnectionWrapper.connection.on('streamEnd', () => socket.emit('streamEnd'));

        // Redirect message events
        tiktokConnectionWrapper.connection.on('roomUser', msg => socket.emit('roomUser', msg));
        
        let USERID = await new Promise(async (resolve, reject) => {
            await tiktokConnectionWrapper.connection.on('member', async msg => {
                userModel = await UserModel.findOne({userId: msg.userId})
                    .exec()
                if(userModel === null) {
                    //create
                    userModel = await new UserModel({
                        userId: msg.userId,
                        liveId: LIVECHATID._id,
                        uniqueId: msg.uniqueId,
                        nickname: msg.nickname,
                        image: msg.profilePictureUrl,
                        /*
                        followRole: 1,
                        userBadges: [],
                        isModerator: false,
                        isNewGifter: false,
                        isSubscriber: false,
                        topGifterRank: null,
                        displayType: 'live_room_enter_toast',
                        label: '{0:user} joined'
                        */
                    }).save()
                }
                socket.emit('member', msg)
                resolve(userModel)
            })
        });
        tiktokConnectionWrapper.connection.on('chat', async msg => {
            //create
            await new CommentModel({
                userId: USERID._id,
                comment: msg.comment,
                //"followRole": 0,
                //"userBadges": [],
                //"isModerator": false,
                //"isNewGifter": false,
                //"isSubscriber": false,
                //"topGifterRank": null,
            }).save()
            console.log('comment', msg);
                //cộng comment vào user
            UserModel.findOne({_id: USERID._id}).exec().then( result => {
                result.commentCount++;
                result.save();
            });
            socket.emit('chat', msg)
        });
        tiktokConnectionWrapper.connection.on('gift', async msg => {
            await new GiftModel({
                userId: USERID._id,
            })
            /**
             * 
  giftId: 5655,
  repeatCount: 1,
  userId: '7025547515073512449',
  uniqueId: 'anhs576',
  nickname: 'あらやまはた',
  profilePictureUrl: 'https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/56af45ee6bb967facb3f17b8fae8dc24~c5_100x100.jpeg?x-expires=1657026000&x-signature=t6nbkI%2BYi9euRjZJGY3KwJ4Ci3Y%3D',
  followRole: 0,
  userBadges: [],
  isModerator: false,
  isNewGifter: false,
  isSubscriber: false,
  topGifterRank: null,
  repeatEnd: false,
  gift: { gift_id: 5655, repeat_count: 1, repeat_end: 0, gift_type: 1 },
  describe: 'Sent Rose',
  giftType: 1,
  diamondCount: 1,
  giftName: 'Rose',
  giftPictureUrl: 'https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.png',
  timestamp: 1656854591126,
  receiverUserId: '6868539471827403778',
  extendedGiftInfo: {
    action_type: 0,
    app_id: 0,
    business_text: '',
    color_infos: [],
    combo: true,
    deprecated10: false,
    deprecated11: false,
    deprecated12: 0,
    deprecated14: '',
    deprecated2: false,
    deprecated3: false,
    deprecated4: 0,
    deprecated5: [],
    deprecated6: 0,
    deprecated7: 0,
    deprecated8: 0,
    deprecated9: false,
    describe: 'sent Rose',
    diamond_count: 1,
    duration: 1000,
    event_name: 'livesdk_gift_click',
    for_custom: false,
    for_linkmic: true,
    gift_rank_recommend_info: '',
    gift_scene: 1,
    gold_effect: '',
    gray_scheme_url: '',
    guide_url: '',
    icon: {
      avg_color: '#7C7CA3',
      height: 0,
      image_type: 0,
      is_animated: false,
      open_web_url: '',
      uri: 'webcast-va/eba3a9bb85c33e017f3648eaf88d7189',
      url_list: [Array],
      width: 0
    },
    id: 5655,
    image: {
      avg_color: '#A3897C',
      height: 0,
      image_type: 0,
      is_animated: false,
      open_web_url: '',
      uri: 'webcast-va/eba3a9bb85c33e017f3648eaf88d7189',
      url_list: [Array],
      width: 0
    },
    is_broadcast_gift: false,
    is_displayed_on_panel: true,
    is_effect_befview: false,
    is_gray: false,
    is_random_gift: false,
    item_type: 1,
    lock_info: { lock: false, lock_type: 0 },
    manual: '',
    name: 'Rose',
    notify: false,
    primary_effect_id: 0,
    region: '',
    scheme_url: '',
    special_effects: {},
    tracker_params: {},
    trigger_words: [],
    type: 1
             */
            console.log('gift', msg);
            socket.emit('gift', msg)
        });
        tiktokConnectionWrapper.connection.on('social', async msg => {
            //followed the host
            console.log('social', msg);
            socket.emit('social', msg)
        });
        tiktokConnectionWrapper.connection.on('like', async msg => {
            await new LikeModel({
                userId: USERID._id,
                likeCount: msg.likeCount,
                totalLikeCount: msg.totalLikeCount,
            //   followRole: 1,
            //   userBadges: [],
            //   isModerator: false,
            //   isNewGifter: false,
            //   isSubscriber: false,
            //   topGifterRank: null,
            //   displayType: 'pm_mt_msg_viewer',
            //   label: '{0:user} sent likes to the host'

            })
            console.log('like', msg);
            socket.emit('like', msg)
        });
        tiktokConnectionWrapper.connection.on('questionNew', msg => socket.emit('questionNew', msg));
        tiktokConnectionWrapper.connection.on('linkMicBattle', msg => socket.emit('linkMicBattle', msg));
        tiktokConnectionWrapper.connection.on('linkMicArmies', msg => socket.emit('linkMicArmies', msg));
        tiktokConnectionWrapper.connection.on('liveIntro', msg => socket.emit('liveIntro', msg));
        tiktokConnectionWrapper.connection.on('emote', msg => socket.emit('emote', msg));
        tiktokConnectionWrapper.connection.on('envelope', msg => socket.emit('envelope', msg));
    });

    socket.on('disconnect', () => {
        if (tiktokConnectionWrapper) {
            tiktokConnectionWrapper.disconnect();
        }
    });
});

// Emit global connection statistics
setInterval(() => {
    io.emit('statistic', { globalConnectionCount: getGlobalConnectionCount() });
}, 5000)

// Serve frontend files
app.use(express.static('public'));

// Start http listener
const port = process.env.PORT || 8081;
httpServer.listen(port);
console.info(`Server running! Please visit http://localhost:${port}`);