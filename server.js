const express = require('express');
const app = express();
const port = 3001;
require('dotenv').config();

const google = require('googleapis').google;
const node_path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//make URL for the consent screen

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);
var U_ACCESS_TOKEN = "";
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
//generate auth url and
app.get('/getAuthUrl',(req,res)=>{
    //need to change the scope depending on what you want to do
    const scopes=['profile','https://www.googleapis.com/auth/youtube'];
    //using the credential from .env file create appropiate url 
    const url = oAuth2Client.generateAuthUrl({
        access_type:'offline',
        scope:scopes
    });
    res.redirect(url);
})
app.post('/playlist/clear',async (req,res)=>{
    //get the "id" of the playlist from the url
    let playListId;
    try{
        playListId = new URL(req.body.url).searchParams.get("list");

    }catch(err){

        return res.status(400).send("Couldn't Find A Valid PlayList Id!");
    }

    //retrieve the access token if it's already authenticated
    oAuth2Client.getAccessToken((err,acccess_token)=>{
        //error handling
        if(err) return res.status(400).send('No access token available. Ensure you have authenticated.');
        //assign the access toke to the GLOBAL variable so other functions can use it
        U_ACCESS_TOKEN = acccess_token;
    })
    //create a new youtube object to initiate api call to youtube
    const youtube = google.youtube({
        version: 'v3',
        auth: oAuth2Client
    });
    let loops = 0;
    const maxResults = 50;
    //finding out how many songs in the playlist
    try{
        const response = await youtube.playlistItems.list({
            part:'contentDetails',
            maxResults:maxResults,
            playlistId:playListId,
        })
        const {totalResults , resultsPerPage} = response.data.pageInfo;
        loops = Math.ceil(totalResults / resultsPerPage);
    }catch(error){
        console.log("error on finding out playlist item counts!", error);
    }
    console.log(loops);
    let nextPageToken = "";
    do{
        try{
            const response = await youtube.playlistItems.list({
            part:'id',
            playlistId:playListId,
            maxResults:maxResults,
            pageToken:nextPageToken
            });
            //get only the informations of the videos
            const videos = response.data.items;
            //loop over them and request the delete one by one
            for(const video of videos){
                try{
                    await youtube.playlistItems.delete({
                       id:video.id
                    })
                }catch(error){
                    console.log("error on deleting",video.id);
                }
            }
        }catch(error){
            console.log("error on fetching playlist items!",error);
            res.status(500).send("500 Internal Server Error. Something went wrong when fetching playlist items");
        }
    loops-- ;
    console.log("remaining pages:",loops);
    }while(loops > 0)

        
    res.send("Done Clearing The PlayList")

})
//just home page html file to useable in web browser
app.get('/',async(req,res)=>{
    //too lazy to use view engine(i forgor how)
    const options = { 
        root: node_path.join(__dirname)
    }
    res.sendFile("index.html",options); 
}) 
//redirect url from google
app.get('/auth/google/redirect',async (req,res)=>{
    //use the "code" and redeem it for access and refresh code
        //you could just use req.query.code but welp you learn something everyday:P
    const code = new URL('http://localhost:3000'+req.url).searchParams.get('code');
    if (!code) {
        return res.status(400).send('Authorization code not found.');
    }
    const {tokens} = await oAuth2Client.getToken(code);
    //save the access code to ....(prolly to google api idk. it saves)
    oAuth2Client.setCredentials(tokens);
    res.redirect('/');
})  

app.listen(port,()=>{
    console.log(`Listening On ${port}!`);
})