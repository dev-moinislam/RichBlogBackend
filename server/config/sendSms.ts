
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const sendSMS=(to:string,url:string,txt:string,name:string)=>{

    try{    
        client.messages
        .create({
           body: `${name},${txt}---${url}`,
           from: '+12186836848',
           to: to
         })
         .then((message: { sid: any; }) => console.log(message.sid));
    }catch(err){
        console.log(err)
    }
}

export default sendSMS
