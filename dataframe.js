var DataFrame = require('dataframe')
 

var data = [
    {   date: '4/21/20',
        time: '5:08 AM',
        author: 'None',
        message: 'Jesuye🙂: Helau there mate' 
    },
    {   date: '4/21/20',
        time: '5:08 AM',
        author: 'TwilioSandboxAccount',
        message: 'You said :Helau there mate.' 
    },
    {   date: '4/21/20',
        time: '5:08 AM',
        author: 'TwilioSandboxAccount',
        message: 'Hello! This is an editable text message. You are free to change it and write whatever you like.' 
    },
    {   date: '4/21/20',
        time: '5:25 AM',
        author: 'TwilioSandboxAccount',
        message: 'Ahoy world!' 
    },
    {   date: '4/21/20',
        time: '6:51 AM',
        author: 'TwilioSandboxAccount',
        message: 'From Jesuye' 
    },
    {   date: '4/21/20',
        time: '6:52 AM',
        author: 'TwilioSandboxAccount',
        message: 'From Jesuye' 
    },
    {   date: '4/21/20',
        time: '6:53 AM',
        author: 'TwilioSandboxAccount',
        message: 'From Jesuye' 
    }
]
 
var dimensions = [
  {value: 'date', title: 'Date'},
  {value: 'time', title: 'Time'},
  {value: 'author', title: 'Author'},
  {value: 'message', title: 'Message'},
]
 
var reduce = function(row, memo) {
  memo.count = (memo.count || 0) + 1
  return memo
}
 
var df = DataFrame({
  rows: data,
  dimensions: dimensions,
  reduce: reduce
})

 
var results = df.calculate({
  dimensions: ['Author', 'Message'],
})
 
console.log('results', results)