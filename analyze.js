var DataFrame = require('dataframe-js').DataFrame;

function startsWithDateTime(s) {
    const regex = /^(\d{1,2}\/\d{2}\/\d{2}), ((\d{1,2}:\d{2}) (AM|PM)) - /gm;
    const found = s.match(regex);

    if (found) {
        return true
    }
    return false
}
// startsWithDateTime("4/21/20, 7:04 AM - TwilioSandboxAccount: From Jesuye")

function startsWithAuthor(s) {

    var patterns = [
        /([\w]+)(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])*:/gm, // First Name
        /([\w]+[\s]+[\w]+)(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])*:/gm, // First Name + Last Name
        /([\w]+[\s]+[\w]+[\s]+[\w]+)(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])*:/gm, // First Name + Middle Name + Last Name
        /([+]\d{2} \d{5} \d{5}):/gm, // Mobile Number (India)
        /([+]\d{2} \d{3} \d{3} \d{4}):/gm, // Mobile Number (US)
        /([+]\d{2} \d{4} \d{7})/gm // Mobile Number (Europe)
    ]

    var len = patterns.length,
        i = 0;

    for (; i < len; i++) {
        if (s.match(patterns[i])) {
            console.log("true")
            return true;
        }
    }
    console.log("false")
    return false
}
startsWithAuthor("Jesuye🙂: I see u on IG all the time so...")

function getDataPoint(line) {
    splitLine = line.split(' - ')
    dateTime = splitLine[0]

    dateTimeArray = dateTime.split(', ')
    date = dateTimeArray[0]
    time = dateTimeArray[1]

    message = splitLine.slice(1, ).join(" ")

    if (startsWithAuthor(message)) {
        splitMessage = message.split(': ')

        author = splitMessage[0]

        message = splitMessage.slice(1, ).join(" ")

    }
    else {
        author = "None"
    }

    // console.log({date, time, author, message})
    return { date, time, author, message }
}
// getDataPoint("4/21/20, 7:04 AM - TwilioSandboxAccount: From Jesuye")

function parseData(msgs) {
    dataLines = msgs.split("\n")
    parsedData = []
    messageBuffer = []
    date = "None"
    time = "None"
    author = "None"

    for (i = 0; i < dataLines.length; i++) {
        line = dataLines[i].trim()
        if (startsWithDateTime(line)) {
            if (messageBuffer.length > 0) {
                parsedData.push({
                    "date": date,
                    "time": time,
                    "author": author,
                    "message": messageBuffer.join(" ")
                })
            }
            messageBuffer = []
            dtam = getDataPoint(line)
            messageBuffer.push(dtam.message)
        }
        else {
            messageBuffer.push(line)
        }
    }
    return parsedData
}
// parseData("Hello from Lambda! SMa5246f5c74af44f8b92e5312dae8fb9b/21/20, 5:07 AM - Messages to this chat and calls are now secured with end-to-end encryption. TwilioSandboxAccount may use another company to store, read and respond to your messages and calls. Tap for more info.\\n4/21/20, 5:07 AM - This chat is with a business account. Tap for more info.\\n4/21/20, 5:07 AM - Jesuye🙂: join vessels-love\\n4/21/20, 5:07 AM - TwilioSandboxAccount: *Twilio Sandbox*: ✅ You are all set! The sandbox can now send/receive messages from whatsapp:+14155238886. Reply ```stop``` to leave the sandbox any time.\\n4/21/20, 5:08 AM - TwilioSandboxAccount: Your Twilio code is 1238432\\n4/21/20, 5:08 AM - Jesuye🙂: Helau there mate\\n4/21/20, 5:08 AM - TwilioSandboxAccount: You said :Helau there mate.\\n Configure your WhatsApp Sandbox's Inbound URL to change this message.\\n4/21/20, 5:08 AM - TwilioSandboxAccount: Hello! This is an editable text message. You are free to change it and write whatever you like.\\n4/21/20, 5:25 AM - TwilioSandboxAccount: Ahoy world!\\n4/21/20, 6:51 AM - TwilioSandboxAccount: From Jesuye\\n4/21/20, 6:52 AM - TwilioSandboxAccount: From Jesuye\\n4/21/20, 6:53 AM - TwilioSandboxAccount: From Jesuye\\n4/21/20, 6:54 AM - TwilioSandboxAccount: From Jesuye\\n4/21/20, 7:04 AM - TwilioSandboxAccount: From Jesuye\\n4/21/20, 7:08 AM - TwilioSandboxAccount: From Jesuye\\n4/21/20, 7:21 AM - TwilioSandboxAccount: From Jesuye\\n4/21/20, 7:23 AM - TwilioSandboxAccount: From Jesuye\\n4/21/20, 1:17 PM - TwilioSandboxAccount: From Jesuye\\n4/21/20, 3:04 PM - TwilioSandboxAccount: From")

function prettyLizeResult(type, coll) {
    resultString = 'Group ' + type

    for (i = 0; i < coll.length; i++) {
        resultString += '    ' + coll[i].author + ' -> ' + coll[i].aggregation + ' messages'
    }

    return resultString
}

function getResult(msg) {
    parsedJson = parseData(msg)


    var columns = [
        'date', 'time', 'author', 'message'
    ]

    var df = new DataFrame(parsedJson, columns);
    df.show()

    plr = prettyLizeResult('Talkatives', df.groupBy('author').aggregate(group => group.count('author')).toCollection())
    console.log(plr)
    return plr

}
getResult(`12/17/17, 12:00 AM - Messages to this chat and calls are now secured with end-to-end encryption. Tap for more info.
12/17/17, 12:00 AM - Jesuye🙂: Oh hiii
12/17/17, 8:10 AM - Omotee!: hello
4/3/18, 5:48 PM - Jesuye🙂: Hiiii
4/3/18, 5:48 PM - Jesuye🙂: How y been?
4/3/18, 5:49 PM - Jesuye🙂: I just disappeared. Lol I'm sorry
4/3/18, 5:49 PM - Jesuye🙂: Hope ure well tho
4/3/18, 5:49 PM - Jesuye🙂: I see u on IG all the time so...
4/3/18, 5:49 PM - Jesuye🙂: 🙂🙂
4/3/18, 6:10 PM - Omotee!: 🙄🙄🙄
4/3/18, 6:22 PM - Jesuye🙂: Lol are u mad at me?
4/3/18, 10:56 PM - Omotee!: Mad ke?
4/3/18, 10:56 PM - Omotee!: No na
4/4/18, 10:49 AM - Jesuye🙂: Ok. How are u
2/2/19, 1:11 AM - Jesuye🙂: Uhhmmmmm
2/2/19, 1:11 AM - Jesuye🙂: Why?
4/21/20, 5:41 PM - Jesuye🙂: <Media omitted>
4/21/20, 5:41 PM - Jesuye🙂: We are representing out here 😂😂😂
4/21/20, 5:51 PM - Omotee!: 🤣🤣🤣🤣`)
