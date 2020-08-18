var db = require("./dbController.js");
//var db2 = require("./dbController2.js");
var TYPES = require("./tedious").TYPES;
var yahooFinance = require('yahoo-finance');

const deleteLoan = (number,parUID,parLoan,res) => {
  var params = [];

  var sql = "delete from LoanMaster where userid = 'xxxx' and loanid = 'yyyy'";
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parLoan.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parLoan);
  db.queryx(sql, result => {

  console.log(buff1 + '=' + buff2); 
  
  var buff = JSON.stringify(result);
  var n = buff.includes("Yes");

  console.log(n);

  if( JSON.stringify(n) != 'true'){
    //addUserLoan(123,parUID,parLoan,res);
    //getUserLoans(132,parUID,res);
    res.redirect('/NewLoanAdded');
  }
  //else{res.redirect('/LoanMaster');}
  //else{res.redirect('/LoanExists');}
  else{getUserLoans(132,parUID,res);}
  });
}

const getLocalIndexList = () => {
  var params = [];
  var buff;
  var indexbuff;
  // var result;
  
  //var sql = "select indexid from IndexList where userid = '_Master' order by 1";
  var sql = "select distinct indexid from IndexList where userid in (select userid from dbo.CurrLogin) order by 1";

  db.buildParams(params, "number", TYPES.Int, 'parUID');
  db.queryx(sql, result => {
  
    buff = JSON.stringify(result);
    
    if(typeof buff !== "undefined") {
      var result = buff;
      result = cleanString(result,92)
      result = cleanString(result,34)
      result = cleanString(result,39)
      result = result.replace("[","")
      result = result.replace("]","")
      var bracketbuff = result.split("}")
      for (var i = 0; i < bracketbuff.length; i++) {
        var colonbuff = bracketbuff[i].split(":")

        if(colonbuff != undefined){indexbuff = colonbuff[1]}
        
        if(indexbuff != undefined){
          console.log('indexbuff: ' + indexbuff);	    
          //addUserLogin(0,'CleanQuote: '+indexbuff,null);
          yahooFinance.quote({
            symbol: indexbuff ,
            modules: [ 'price', 'summaryDetail'] // see the docs for the full list
            }, function (err, quotes) {
            //var buff = JSON.stringify(result);
            var cleanQuote = JSON.stringify(quotes)
            cleanQuote = cleanString(cleanQuote,92)
            cleanQuote = cleanString(cleanQuote,34)
            cleanQuote = cleanString(cleanQuote,39)
                    
            doIndex(cleanQuote)
            });
        }
      }
      return buff;
    }
  });
    
  console.log('index exit');
    
  return buff;
}

const getLocalIndex = (parIndex) => {
  var buff;
  var indexbuff = parIndex
        
  if(indexbuff != undefined){
    console.log('indexbuff: ' + indexbuff);	    
    yahooFinance.quote({
      symbol: indexbuff ,
      modules: [ 'price', 'summaryDetail'] // see the docs for the full list
      }, function (err, quotes) {
            //var buff = JSON.stringify(result);
      var cleanQuote = JSON.stringify(quotes)
      cleanQuote = cleanString(cleanQuote,92)
      cleanQuote = cleanString(cleanQuote,34)
      cleanQuote = cleanString(cleanQuote,39)
      doIndex(cleanQuote)
      });
    }

  console.log('index exit');
  return buff;
}
const addIndex = (parUID,parIndex) => {
  var params = [];
  var buff;
  
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parIndex.replace(/\"/g, ""); 

  var sql = "insert into IndexList (indexid,userid) values ('xxxx','yyyy')";
  sql = sql.replace('xxxx',buff2);
  sql = sql.replace('yyyy',buff1);
  // console.log('getIndexList' + sql);

  db.executeStatement1(sql);
  
  console.log('index exit');
  
}

const delIndex = (parUID,parIndex) => {
  var params = [];
  var buff;
  
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parIndex.replace(/\"/g, ""); 

  var sql = "delete from IndexList where indexid = 'xxxx' and userid = 'yyyy'";
  sql = sql.replace('xxxx',buff2);
  sql = sql.replace('yyyy',buff1);
  console.log('delete str-' + sql);

  db.executeStatement1(sql);
  
  console.log('index exit');
  
}

const getIndexList = (parUID,res) => {
  var params = [];
  var buff;
  // var result;

  var buff1 = parUID.replace(/\"/g, ""); 
  var sql = "select distinct indexid from IndexList where userid = 'xxxx' order by 1";
  sql = sql.replace('xxxx',buff1);
  // console.log('getIndexList' + sql);

  db.buildParams(params, "number", TYPES.Int, 'parUID');
  db.queryx(sql, result => {
  
    buff = JSON.stringify(result);
    
    if(typeof buff !== "undefined") {
      console.log('output');
        return res.json({
        status: true,
        rows: buff
      });
    }
  });
    
  console.log('index exit');
    
  return buff;
}

const getTechnicalList = (res) => {
  var params = [];
  var buff;
  // var result;
  
  var sql = "select * from TechnicalList order by 1";

  db.buildParams(params, "number", TYPES.Int, 'parUID');
  db.queryx(sql, result => {
  
    buff = JSON.stringify(result);
    
    if(typeof buff !== "undefined") {
      console.log('output');
        return res.json({
        status: true,
        rows: buff
      });
    }
  });
    
  console.log('currency exit');
    
  return buff;
}

const addUserLogin = (number,parUID, res) => {
  var params = [];

  var sql = "exec dbo.AddLogin 'uuuu'";
  
  var buff1 = parUID.replace(/\"/g, ""); 
  
  sql = sql.replace('uuuu',buff1);

  db.executeStatement1(sql);
  
}			

const setRunTime = (parTag,parTime, res) => {
  var params = [];

  var sql = "update dbo.CurrRunTime set runtime = <<uuuu>> where runtag = '<<yyyy>>'";
  
  var buff1 = parTag.replace(/\"/g, ""); 
  var buff2 = parTime.replace(/\"/g, ""); 
  
  sql = sql.replace('<<uuuu>>',buff2);
  sql = sql.replace('<<yyyy>>',buff1);

  db.executeStatement1(sql);
  //console.log('**execute** -' + sql); 
  
}			

const getRunTime = (parTag,parCurr) => {
  var params = [];

  var sql = "select runtime from CurrRunTime where runtag = 'xxxx'";
  var buff1 = parTag.replace(/\"/g, ""); 
  var buff
  var iIncrement = 60

  sql = sql.replace('xxxx',buff1);
  
  //db.buildParams(params, "number", TYPES.Int, parDestLoan);
    db.queryx(sql, result => {
    
    buff = JSON.stringify(result);
    buff = cleanString(buff,91)
    buff = cleanString(buff,93)
    buff = cleanString(buff,123)
    buff = cleanString(buff,125)
    buff = cleanString(buff,34)

    buff = buff.replace('runtime','')
    buff = buff.replace(':','')
    var val = Number(buff)     // / 1000
    //buff++;
    if(parCurr > val){
      getLocalIndexList();
      
      var offset = new Date().getTimezoneOffset();// getting offset to make time in gmt+0 zone (UTC) (for gmt+5 offset comes as -300 minutes)
		  var date = new Date();
		  date.setMinutes ( date.getMinutes() + offset);// date now in UTC time

		  var easternTimeOffset = -240; //for dayLight saving, Eastern time become 4 hours behind UTC thats why its offset is -4x60 = -240 minutes. So when Day light is not active the offset will be -300
		  date.setMinutes ( date.getMinutes() + easternTimeOffset);
		  var iDay = date.getDay()
      var iHours = date.getHours()
    
      if(iDay == 0){iIncrement=600; }
		  if(iDay == 6){iIncrement=600; }
		  if(iDay > 0 && iDay < 6){
			  if(iHours > 16 ){iIncrement=600;}
			  if(iHours < 9 ){iIncrement=600;}
      }
    
      console.log('**blastoff** -' + buff1 + '|' + val + '|' + parCurr + '|' + iDay + '|' + iHours + '|' + iIncrement); 
      var newTime = parCurr + (iIncrement * 1000);
      setRunTime(parTag,newTime.toString());
    }

    return buff;
    })

  console.log('***getRunTime -'); 
}

const getIndexAll_vue = (parUID,res) => {
  var params = [];
  var buff;

  var sql = "SELECT ixf.indexid, indexdesc,quotetype,dtTimestamp, dValue, dHigh, dLow, dOpen, dVolume ";
  var sql = sql + "FROM orange.dbo.IndexFact ixf "
  var sql = sql + "inner join dbo.IndexList ixl on ixf.indexid = ixl.indexid and ixl.userid ='xxxx'"

  var buff1 = parUID.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  //buff1 = parIndex.replace(/\"/g, ""); 
  
  //sql = sql.replace('<<IDX>>',buff1);
    
  //db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
    buff = JSON.stringify(result);
    while(typeof buff === "undefined") {
      console.log( '2e-' + buff ); 
    }
    if(typeof buff !== "undefined") {
      //console.log('output');
      return res.json({
		    status: true,
		    rows: buff
		  });
    }
  });
  
  //console.log('no output');
  //console.log( '2d-' + sql ); 
  return buff;
}

const getIndexOne_vue = (parUID,parIndex,res) => {
  var params = [];
  var buff;

  console.log('index one-' + parIndex);

  var sql = "SELECT ixf.indexid, indexdesc,quotetype,dtTimestamp, dValue, dHigh, dLow, dOpen, dVolume ";
  var sql = sql + "FROM orange.dbo.IndexFact ixf where ixf.indexid = 'xxxx'"
  //var sql = sql + "inner join dbo.IndexList ixl on ixf.indexid = ixl.indexid and ixl.userid ='xxxx'"

  var buff1 = parIndex.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  //buff1 = parIndex.replace(/\"/g, ""); 
  
  //sql = sql.replace('<<IDX>>',buff1);
    
  //db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
    buff = JSON.stringify(result);
    while(typeof buff === "undefined") {
      console.log( '2e-' + buff ); 
    }
    if(typeof buff !== "undefined") {
      //console.log('output');
      return res.json({
		    status: true,
		    rows: buff
		  });
    }
  });
  
  //console.log('no output');
  //console.log( '2d-' + sql ); 
  return buff;
}

const deleteLoan_socket = (number,parUID,parLoan,io) => {
  var params = [];

  var sql = "delete from LoanMaster where userid = 'xxxx' and loanid = 'yyyy'";
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parLoan.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parLoan);
  db.queryx(sql, result => {

  console.log(buff1 + '=' + buff2); 
  
  var buff = JSON.stringify(result);
  var n = buff.includes("Yes");

  console.log(n);

  if( JSON.stringify(n) != 'true'){
    //res.redirect('/NewLoanAdded');
    io.emit('DEL_LOAN', { user: 'me', message: n });
  }
  //else{getUserLoans(132,parUID,res);}
  io.emit('DEL_LOAN', { user: 'me', message: n });
  });
}

const editLoan = (number,userid,sparLoan,sparStartDate,sparPmtYear,sparRate,sparRatePer,sparBalance,sparPmt,sparNumPmt,sparMethod,res) => {
  var params = [];

  var sql = "update LoanMaster set balance = <<bal>>, StartDate = '<<sd>>', Periodicity = '<<per>>', rate = <<rate>>, RatePeriodicity = '<<rateper>>', payment = <<pmt>>, numpmts = <<np>>, Method = '<<meth>>'  ";
  //var sql2 = "update LoanMaster set balance = <<bal>> where userid = 'xxxx' and loanid = 'yyyy'";
  var sqlx = " where userid = 'xxxx' and loanid = 'yyyy'";
  var buff1 = userid.replace(/\"/g, ""); 
  var buff2 = sparLoan.replace(/\"/g, ""); 
  var buff3 = sparBalance.replace(/\"/g, ""); 
  var buff4 = sparStartDate.replace(/\"/g, ""); 
  var buff5 = sparPmtYear.replace(/\"/g, ""); 
  var buff6 = sparRate.replace(/\"/g, ""); 
  var buff7 = sparRatePer.replace(/\"/g, ""); 
  var buff8 = sparPmt.replace(/\"/g, ""); 
  var buff9 = sparNumPmt.replace(/\"/g, ""); 
  var buff10 = sparMethod.replace(/\"/g, ""); 

  sqlx = sqlx.replace('xxxx',buff1);
  sqlx = sqlx.replace('yyyy',buff2);
  sql = sql.replace('<<bal>>',buff3);
  sql = sql.replace('<<sd>>',buff4);
  sql = sql.replace('<<per>>',buff5);
  sql = sql.replace('<<rate>>',buff6);
  sql = sql.replace('<<rateper>>',buff7);
  sql = sql.replace('<<pmt>>',buff8);
  sql = sql.replace('<<np>>',buff9);
  sql = sql.replace('<<meth>>',buff10);
  sql = sql + sqlx;

  db.buildParams(params, "number", TYPES.Int, sparLoan);
  db.queryx(sql, result => {
   
  
    var buff = JSON.stringify(result);
    var n = buff.includes("Yes");

    console.log('buff = ' + buff); 
    console.log(sql);

    if( JSON.stringify(n) != 'true'){
      res.redirect('/NewLoanAdded');
      //getUserLoans(132,userid,res);
      //res.redirect('/NewLoanAdded');
    }
  
    else{
      //res.redirect('/NewLoanAdded');
      getUserLoans(132,userid,res);
    }
    });
  
}

const editLoan_socket = (number,userid,sparLoan,sparStartDate,sparPmtYear,sparRate,sparRatePer,sparBalance,sparPmt,sparNumPmt,sparMethod,io) => {
  var params = [];

  var sql = "update LoanMaster set balance = <<bal>>, StartDate = '<<sd>>', Periodicity = '<<per>>', rate = <<rate>>, RatePeriodicity = '<<rateper>>', payment = <<pmt>>, numpmts = <<np>>, Method = '<<meth>>'  ";
  //var sql2 = "update LoanMaster set balance = <<bal>> where userid = 'xxxx' and loanid = 'yyyy'";
  var sqlx = " where userid = 'xxxx' and loanid = 'yyyy'";
  var buff1 = userid.replace(/\"/g, ""); 
  var buff2 = sparLoan.replace(/\"/g, ""); 
  var buff3 = sparBalance.replace(/\"/g, ""); 
  var buff4 = sparStartDate.replace(/\"/g, ""); 
  var buff5 = sparPmtYear.replace(/\"/g, ""); 
  var buff6 = sparRate.replace(/\"/g, ""); 
  var buff7 = sparRatePer.replace(/\"/g, ""); 
  var buff8 = sparPmt.replace(/\"/g, ""); 
  var buff9 = sparNumPmt.replace(/\"/g, ""); 
  var buff10 = sparMethod.replace(/\"/g, ""); 

  sqlx = sqlx.replace('xxxx',buff1);
  sqlx = sqlx.replace('yyyy',buff2);
  sql = sql.replace('<<bal>>',buff3);
  sql = sql.replace('<<sd>>',buff4);
  sql = sql.replace('<<per>>',buff5);
  sql = sql.replace('<<rate>>',buff6);
  sql = sql.replace('<<rateper>>',buff7);
  sql = sql.replace('<<pmt>>',buff8);
  sql = sql.replace('<<np>>',buff9);
  sql = sql.replace('<<meth>>',buff10);
  sql = sql + sqlx;

  db.buildParams(params, "number", TYPES.Int, sparLoan);
  db.queryx(sql, result => {
   
  
    var buff = JSON.stringify(result);
    var n = buff.includes("Yes");

    console.log('buff = ' + buff); 
    console.log(sql);

    if( JSON.stringify(n) != 'true'){
      io.emit('DEL_LOAN', { user: 'me', message: n });
    }
    else{
      io.emit('DEL_LOAN', { user: 'me', message: n });
    }
    });
  
}

const editLoan_vue = (number,userid,sparLoan,sparStartDate,sparPmtYear,sparRate,sparRatePer,sparBalance,sparPmt,sparNumPmt,sparMethod,res) => {
  var params = [];

  var sql = "update LoanMaster set balance = <<bal>>, StartDate = '<<sd>>', Periodicity = '<<per>>', rate = <<rate>>, RatePeriodicity = '<<rateper>>', payment = <<pmt>>, numpmts = <<np>>, Method = '<<meth>>'  ";
  //var sql2 = "update LoanMaster set balance = <<bal>> where userid = 'xxxx' and loanid = 'yyyy'";
  var sqlx = " where userid = 'xxxx' and loanid = 'yyyy'";
  var buff1 = userid.replace(/\"/g, ""); 
  var buff2 = sparLoan.replace(/\"/g, ""); 
  var buff3 = sparBalance.replace(/\"/g, ""); 
  var buff4 = sparStartDate.replace(/\"/g, ""); 
  var buff5 = sparPmtYear.replace(/\"/g, ""); 
  var buff6 = sparRate.replace(/\"/g, ""); 
  var buff7 = sparRatePer.replace(/\"/g, ""); 
  var buff8 = sparPmt.replace(/\"/g, ""); 
  var buff9 = sparNumPmt.replace(/\"/g, ""); 
  var buff10 = sparMethod.replace(/\"/g, ""); 

  sqlx = sqlx.replace('xxxx',buff1);
  sqlx = sqlx.replace('yyyy',buff2);
  sql = sql.replace('<<bal>>',buff3);
  sql = sql.replace('<<sd>>',buff4);
  sql = sql.replace('<<per>>',buff5);
  sql = sql.replace('<<rate>>',buff6);
  sql = sql.replace('<<rateper>>',buff7);
  sql = sql.replace('<<pmt>>',buff8);
  sql = sql.replace('<<np>>',buff9);
  sql = sql.replace('<<meth>>',buff10);
  sql = sql + sqlx;

  db.buildParams(params, "number", TYPES.Int, sparLoan);
  db.queryx(sql, result => {
   
  
    var buff = JSON.stringify(result);
    var n = buff.includes("Yes");

    //console.log('update buff = ' + sql); 
    //console.log(sql);

    return res.json({ status: true, rows: true });  
    });
}

const editProfile_socket = (number,userid,sparPWD,sparEMail,io) => {
  var params = [];

  var sql = "update LoginControl set password = '<<pwd>>', email = '<<email>>' ";
  var sqlx = " where userid = 'xxxx'";
  var buff1 = userid.replace(/\"/g, ""); 
  var buff2 = sparPWD.replace(/\"/g, ""); 
  var buff3 = sparEMail.replace(/\"/g, ""); 
  
  sqlx = sqlx.replace('xxxx',buff1);
  sql = sql.replace('<<pwd>>',buff2);
  sql = sql.replace('<<email>>',buff3);
  sql = sql + sqlx;

  db.buildParams(params, "number", TYPES.Int, userid);
  db.queryx(sql, result => {
   
  
    var buff = JSON.stringify(result);
    var n = buff.includes("Yes");

    console.log('UPDATE_PROFILE = ' + sql); 
    console.log(sql);

    if( JSON.stringify(n) != 'true'){
      io.emit('UPDATE_PROFILE', { user: 'me', message: n });
    }
    else{
      io.emit('UPDATE_PROFILE', { user: 'me', message: n });
    }
    });
  
}

const getCopyLoanStatus = (number,parUID,parSrceLoan,parDestLoan,res) => {
  var params = [];

  var sql = "select case when count(*) > 0 then 'Yes' else 'No' end as LoanStatus from LoanMaster lc where lc.userid = 'xxxx' and loanid = 'yyyy'";
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parDestLoan.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parDestLoan);
  db.queryx(sql, result => {

  console.log(buff1 + '=' + buff2); 
  
  var buff = JSON.stringify(result);
  var n = buff.includes("Yes");

  //console.log(n);

  if( JSON.stringify(n) != 'true'){
    copyUserLoan(123,parUID,parSrceLoan,parDestLoan,res);
    //getUserLoans(132,parUID,res);
    res.redirect('/NewLoanAdded');
  }
  else{getUserLoans(132,parUID,res);}
  });
  
}

const copyUserLoan = (number,parUID,parSrceLoan,parDestLoan ,res) => {
  var params = [];
  //var sql = "update Logincontrol set logincount=logincount+1, dtTimestamp = getdate() where email = 'xxxx' and [password] = 'yyyy'";
  var sql = "exec dbo.CopyLoan 'yyyy', 'xxxx', 'uuuu'";
  
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parDestLoan.replace(/\"/g, ""); 
  var buff3 = parSrceLoan.replace(/\"/g, ""); 
  
  sql = sql.replace('uuuu',buff1);
  sql = sql.replace('xxxx',buff2);
  sql = sql.replace('yyyy',buff3);

  db.executeStatement1(sql);
  
}			

const copyUserLoan_socket = (number, parUID, parSrceLoan, parDestLoan, io) => {
  var params = [];
  //var sql = "update Logincontrol set logincount=logincount+1, dtTimestamp = getdate() where email = 'xxxx' and [password] = 'yyyy'";
  var sql = "exec dbo.CopyLoan 'yyyy', 'xxxx', 'uuuu'";
  
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parDestLoan.replace(/\"/g, ""); 
  var buff3 = parSrceLoan.replace(/\"/g, ""); 
  
  sql = sql.replace('uuuu',buff1);
  sql = sql.replace('xxxx',buff2);
  sql = sql.replace('yyyy',buff3);

  db.executeStatement1(sql);
  io.emit('COPYLOAN', { user: 'me', message: parDestLoan });

}			

const copyUserLoan_vue = (number, parUID, parSrceLoan, parDestLoan, res) => {
  var params = [];
  //var sql = "update Logincontrol set logincount=logincount+1, dtTimestamp = getdate() where email = 'xxxx' and [password] = 'yyyy'";
  var sql = "exec dbo.CopyLoan 'yyyy', 'xxxx', 'uuuu'";
  
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parDestLoan.replace(/\"/g, ""); 
  var buff3 = parSrceLoan.replace(/\"/g, ""); 
  
  sql = sql.replace('uuuu',buff1);
  sql = sql.replace('xxxx',buff2);
  sql = sql.replace('yyyy',buff3);

  console.log('copy loan' + sql); 
  db.executeStatement1(sql);

  return res.json({ status: true, rows: true });

}			

const deleteLoan_vue = (number,parUID,parLoan,res) => {
  var params = [];

  var sql = "delete from LoanMaster where userid = 'xxxx' and loanid = 'yyyy'";
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parLoan.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parLoan);
  db.queryx(sql, result => {
    console.log(buff1 + '=' + buff2); 
    var buff = JSON.stringify(result);
    var n = buff.includes("Yes");
    console.log(n);

    return res.json({ status: true, rows: true });
    
  });
}

const editProfile_vue = (number,userid,sparPWD,sparEMail,sparAlphaKey,res) => {
  var params = [];

  var sql = "update LoginControl set password = '<<pwd>>', email = '<<email>>', AlphaKey = '<<alpha>>' ";
  var sqlx = " where userid = 'xxxx'";
  var buff1 = userid.replace(/\"/g, ""); 
  var buff2 = sparPWD.replace(/\"/g, ""); 
  var buff3 = sparEMail.replace(/\"/g, ""); 
  var buff4 = sparAlphaKey.replace(/\"/g, ""); 
  
  sqlx = sqlx.replace('xxxx',buff1);
  sql = sql.replace('<<pwd>>',buff2);
  sql = sql.replace('<<email>>',buff3);
  sql = sql.replace('<<alpha>>',buff4);
  sql = sql + sqlx;

  db.buildParams(params, "number", TYPES.Int, userid);
  db.queryx(sql, result => {

    var buff = JSON.stringify(result);
    var n = buff.includes("Yes");

    console.log('UPDATE_PROFILE = ' + sql); 
    console.log(sql);
    return res.json({ status: true, rows: true });
   });
}

const getLoginStatus = (parUID,parPWD,res) => {
  var params = [];
  //var sql = "select AccountStatus from Logincontrol";
  var sql = "select case when count(*) > 0 then 'Yes' else 'No' end  as AccountStatus from Logincontrol lc where lc.userid = 'xxxx' and [password] = 'yyyy'";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
 
  console.log(buff1 + '=' + buff2); 
  
  var buff = JSON.stringify(result);
  var n = buff.includes("Yes");
 
  console.log(n);
 
  if( JSON.stringify(n) == 'true'){setLoginCount(parUID,parPWD,res);}
  
  else{res.redirect('/admin');}
  
  });
  
}

const getUserData = (parUID,parPWD,res) => {
  var params = [];

  var sql = "select userid, password from Logincontrol lc where lc.userid = 'xxxx' and [password] = 'yyyy'";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {

  var buff = JSON.stringify(result);
  buff = buff.replace(/\"/g, ""); 
  buff = buff.replace("[{userid:", ""); 
  buff = buff.replace("}]", ""); 
  buff = buff.replace("password:", ""); 
  //console.log(buff);
  
  res.render('Mainmenu',{dataSet: buff});		
  //res.render('Mainmenu',{dataSet: result});		
  
  });
}

const setLoginCount = (parUID,parPWD,res) => {
  var params = [];
  var sql = "update Logincontrol set logincount=logincount+1, dtTimestamp = getdate() where userid = 'xxxx' and [password] = 'yyyy'";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.executeStatement1(sql);
  getUserData(parUID,parPWD,res);
}

const setupNewAccount = (parUID,paremail,parPWD,res) => {
  var params = [];
  //var sql = "update Logincontrol set logincount=logincount+1, dtTimestamp = getdate() where email = 'xxxx' and [password] = 'yyyy'";
  var sql = "insert LoginControl (userid,email,password,AccountStatus,logincount,dtTimestamp) values('uuuu','xxxx','yyyy','Yes',1,getdate())";
  
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = paremail.replace(/\"/g, ""); 
  buff3 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('uuuu',buff1);
  sql = sql.replace('xxxx',buff2);
  sql = sql.replace('yyyy',buff3);

  db.executeStatement1(sql);
  getUserData(parUID,parPWD,res);
}	

const addNewAccount = (parUID,paremail,parPWD,res) => {
  var params = [];

  var sql = "select case when count(*) > 0 then 'Yes' else 'No' end  as AccountStatus from Logincontrol lc where lc.userid = 'xxxx'"; // and [password] = 'yyyy'";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {

  //console.log(buff1 + '=' + buff2); 
  
  var buff = JSON.stringify(result);
  var n = buff.includes("Yes");

 // console.log(n);
  
  if( JSON.stringify(n) == 'false'){setupNewAccount(parUID,paremail,parPWD,res);}
  
  else{res.redirect('/NewAccountError');}
  
  });
}

const getLoans = (number,res) => {
  var params = [];
  var sql = "select loanid, convert(varchar, StartDate, 101) as StartDate, Method, Periodicity, RatePeriodicity, balance, rate, numpmts, payment, Method from LoanMaster";

  db.buildParams(params, "number", TYPES.Int, number);
  db.queryx(sql, result => {
  //console.log(result);
    res.render('LoanMaster',{dataSet: result});	
  });
}

const getUserLoans = (number,parUID,res) => {
  var params = [];
  var sql = "select loanid, convert(varchar, StartDate, 101) as StartDate, Method, Periodicity, RatePeriodicity, balance, rate, numpmts, payment, Method from LoanMaster where userid = 'xxxx' order by loanid";

  var buff1 = parUID.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  //console.log(sql);
  db.buildParams(params, "number", TYPES.Int, number);
  db.queryx(sql, result => {
  //console.log(result);
    res.render('LoanMaster',{dataSet: result});	
  });
}	

const getUserLoans_vue = (parUID,parPWD,res) => {
  var params = [];
  var buff;

  var sql = "select loanid, convert(varchar, StartDate, 23) as StartDate,convert(varchar, StartDate, 112) as dtStart, Method, Periodicity, RatePeriodicity, balance, rate, numpmts, payment, Method from LoanMaster where userid = 'xxxx' order by loanid";

  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);
  
  console.log('LoanMaster-2:' + sql);
  //db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
    buff = JSON.stringify(result);
    while(typeof buff === "undefined") {
      console.log( '2e-' + buff ); 
    }
    if(typeof buff !== "undefined") {
      console.log('output');
      return res.json({
		    status: true,
		    rows: buff
		  });
    }
  });
  
  console.log('no output');
  console.log( '2d-' + sql ); 
  return buff;
}

const getUserProfile_vue = (parUID,parPWD,res) => {
  var params = [];
  var buff;

  var sql = "select userid,email,password,AccountStatus,AlphaKey from LoginControl where userid = 'xxxx'";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
    buff = JSON.stringify(result);
  
    if(typeof buff !== "undefined") {
      console.log('output');
      return res.json({ status: true, rows: buff});
    }
  });
  
  console.log('no output');
  console.log( '2d-' + buff ); 
  //buff='abc';
  return buff;
}

const getUserLoans_socket = (parUID,parPWD,io) => {
  var params = [];
  var buff;
  //var sql = "select AccountStatus from Logincontrol";
  var sql = "select loanid, convert(varchar, StartDate, 23) as StartDate,convert(varchar, StartDate, 112) as dtStart, Method, Periodicity, RatePeriodicity, balance, rate, numpmts, payment, Method from LoanMaster where userid = 'xxxx' order by loanid";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
 
  buff = JSON.stringify(result);
  
  while(typeof buff === "undefined") {
    console.log( '2e-' + buff ); 
  }

  if(typeof buff !== "undefined") {
    console.log('output');
 
    io.emit('LOADLOANS', { user: 'me', message: buff });
    }
  });
  
  console.log('no output');
  console.log( '2d-' + buff ); 
  //buff='abc';
  return buff;
}

const getUserProfile_socket = (parUID,parPWD,io) => {
  var params = [];
  var buff;
  //var sql = "select AccountStatus from Logincontrol";
  var sql = "select userid,email,password,AccountStatus from LoginControl where userid = 'xxxx'";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
 
  buff = JSON.stringify(result);
  
  while(typeof buff === "undefined") {
    console.log( '2e-' + sql ); 
  }

  if(typeof buff !== "undefined") {
    console.log('output - ' + parUID + '|'+ buff1);
 
    io.emit('LOADPROFILE', { user: 'me', message: buff });
    }
  });
  
  console.log('no output');
  console.log( '2d-' + buff ); 
  //buff='abc';
  return buff;
}

const getLoginStatus_socket = (parUID,parPWD,io) => {
  var params = [];
  //var sql = "select AccountStatus from Logincontrol";
  var sql = "select case when count(*) > 0 then 'Yes' else 'No' end  as AccountStatus from Logincontrol lc where lc.userid = 'xxxx' and [password] = 'yyyy'";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
 
  console.log(buff1 + '=' + buff2); 
  
  var buff = JSON.stringify(result);
  var n = buff.includes("Yes");
 
  console.log('buff-' + n);
  
  io.emit('LOGIN_STATUS', { user: 'me', message: n });
  });
  
}

const getLoginStatus_vue = (parUID,parPWD,res) => {
  var params = [];
  var buff;
  //var sql = "select AccountStatus from Logincontrol";
  var sql = "select case when count(*) > 0 then 'Yes' else 'No' end  as AccountStatus from Logincontrol lc where lc.userid = 'xxxx' and [password] = 'yyyy'";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
  
  buff = JSON.stringify(result);
  
  if(typeof buff !== "undefined") {
    console.log('output');
      return res.json({
	    status: true,
	    rows: buff
	  });
  }
});
  
  console.log('no output');
    
  return buff;
}

const getUIDStatus_vue = (parUID,parPWD,parEMail,parAlphaKey,res) => {
  var params = [];
  //var sql = "select AccountStatus from Logincontrol";
  var sql = "select case when count(*) > 0 then 'Yes' else 'No' end  as AccountStatus from Logincontrol lc where lc.userid = 'xxxx'";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
 
  console.log(buff1 + '=' + buff2); 
  
  var buff = JSON.stringify(result);
  var n = buff.includes("Yes");
  var holder = JSON.stringify(n);
  console.log('buff-' + holder + '-' + parEMail);
  
  if (holder == "false"){ setupNewAccount_socket(parUID,parEMail,parPWD,parAlphaKey);}
    //if (holder == "false"){ console.log('setting up account-' + n);}
    //io.emit('UID_STATUS', { user: 'me', message: n });
  
    return res.json({
      status: 'me',
      rows: n
      });
  });
}

const getUIDStatus_socket = (parUID,parPWD,parEMail,io) => {
  var params = [];
  //var sql = "select AccountStatus from Logincontrol";
  var sql = "select case when count(*) > 0 then 'Yes' else 'No' end  as AccountStatus from Logincontrol lc where lc.userid = 'xxxx'";
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parUID);
  db.queryx(sql, result => {
 
  console.log(buff1 + '=' + buff2); 
  
  var buff = JSON.stringify(result);
  var n = buff.includes("Yes");
  var holder = JSON.stringify(n);
  console.log('buff-' + holder + '-' + parEMail);
  
  if (holder == "false"){ setupNewAccount_socket(parUID,parEMail,parPWD);}
  //if (holder == "false"){ console.log('setting up account-' + n);}
  io.emit('UID_STATUS', { user: 'me', message: n });
  });
}

const setupNewAccount_socket = (parUID,paremail,parPWD) => {
  var params = [];
  //var sql = "update Logincontrol set logincount=logincount+1, dtTimestamp = getdate() where email = 'xxxx' and [password] = 'yyyy'";
  var sql = "insert LoginControl (userid,email,password,AccountStatus,logincount,dtTimestamp) values('uuuu','xxxx','yyyy','Yes',1,getdate())";
  
  buff1 = parUID.replace(/\"/g, ""); 
  buff2 = paremail.replace(/\"/g, ""); 
  buff3 = parPWD.replace(/\"/g, ""); 

  sql = sql.replace('uuuu',buff1);
  sql = sql.replace('xxxx',buff2);
  sql = sql.replace('yyyy',buff3);

  // console.log('setupNewAccount-' + sql);

  db.executeStatement1(sql);
  //getUserData(parUID,parPWD,res);
}	

const getNewLoanStatus = (number,parUID,parLoan,res) => {
  var params = [];

  var sql = "select case when count(*) > 0 then 'Yes' else 'No' end as LoanStatus from LoanMaster lc where lc.userid = 'xxxx' and loanid = 'yyyy'";
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parLoan.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parLoan);
  db.queryx(sql, result => {

  console.log(buff1 + '=' + buff2); 
  
  var buff = JSON.stringify(result);
  var n = buff.includes("Yes");

  console.log(n);

  if( JSON.stringify(n) != 'true'){
    addUserLoan(123,parUID,parLoan,res);
    //getUserLoans(132,parUID,res);
    res.redirect('/NewLoanAdded');
  }
  else{acc.getUserLoans(132,parUID,res);}
  });
}

const getNewLoanStatus_socket = (number,parUID,parLoan,io) => {
  var params = [];

  var sql = "select case when count(*) > 0 then 'Yes' else 'No' end as LoanStatus from LoanMaster lc where lc.userid = 'xxxx' and loanid = 'yyyy'";
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parLoan.replace(/\"/g, ""); 

  sql = sql.replace('xxxx',buff1);
  sql = sql.replace('yyyy',buff2);

  db.buildParams(params, "number", TYPES.Int, parLoan);
  db.queryx(sql, result => {

  console.log(buff1 + '=' + buff2); 
  
  var buff = JSON.stringify(result);
  var n = buff.includes("Yes");

  console.log(n);

  if( JSON.stringify(n) != 'true') { addUserLoan_socket(123,parUID,parLoan); }
   // else{acc.getUserLoans(132,parUID,res);}
   io.emit('NEW_LOAN', { user: 'me', message: n });
   });
}
const addUserLoan_socket = (number,parUID,parLoan ) => {
  var params = [];
  
  var sql = "insert LoanMaster (userid,loanid, balance, rate, numpmts, payment) values('uuuu','xxxx',0,0,0,0)";
  
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parLoan.replace(/\"/g, ""); 
  
  sql = sql.replace('uuuu',buff1);
  sql = sql.replace('xxxx',buff2);

  db.executeStatement1(sql);
}		
const addUserLoan_vue = (number,parUID,parLoan,res ) => {
  var params = [];
  
  var sql = "insert LoanMaster (userid,loanid, balance, rate, numpmts, payment) values('uuuu','xxxx',0,0,0,0)";
  
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parLoan.replace(/\"/g, ""); 
  
  sql = sql.replace('uuuu',buff1);
  sql = sql.replace('xxxx',buff2);

  db.executeStatement1(sql);

  return res.json({ status: true, rows: buff2 });
}		

const addUserLoan = (number,parUID,parLoan ,res) => {
  var params = [];
  
  var sql = "insert LoanMaster (userid,loanid, balance, rate, numpmts, payment) values('uuuu','xxxx',0,0,0,0)";
  
  var buff1 = parUID.replace(/\"/g, ""); 
  var buff2 = parLoan.replace(/\"/g, ""); 
  
  sql = sql.replace('uuuu',buff1);
  sql = sql.replace('xxxx',buff2);

  db.executeStatement1(sql);
  
}	

const cleanString = (parInput, parRemove) => { 
  var source=parInput
  var result = ""

  if(parInput == undefined){return ''; }

  for (var i = 0; i < parInput.length; i++) {
    if(source.charCodeAt(i) !== parRemove){
      result=result+parInput[i];
      }
  }
  return result;
}

const doIndex = (parQuote) => { 
  if(parQuote == undefined){
    console.log('missing index: '+ parQuote);
    return '';
  }
  if(parQuote.length == 0){
    console.log('missing index: '+ parQuote);
    return '';
  }
  var sBuff0 = parQuote
  var sBuff1 = sBuff0.split(":{")
  var sBuff2
  var sBuff3

  if(sBuff1[1] != undefined){sBuff2 = sBuff1[1].split(",")}
  if(sBuff1[2] != undefined){sBuff3 = sBuff1[2].split(",")}
 
  var sCategory
  var sValue
  var sSymbol 
  var sSection 
  var sSectionValue
  var sSectionHigh
  var sSectionLow
  var sSectionVol
  var sSectionOpen
  var sSectionTotalAssets
  var sSection52WeekHigh
  var sSection52WeekLow
  var sSectionYTDROR
  var sSectionTime
  var sQuoteType

  //console.log('quotes: ' + parQuote );	    
  if(sBuff2 != undefined){

    for (var i = 0; i < sBuff2.length; i++) {
      var sBuff4 = sBuff2[i].split(":")
      sCategory = ''
      sValue = ''

      if(sBuff4[0] != undefined){sCategory = sBuff4[0]}
      if(sBuff4[1] != undefined){sValue = sBuff4[1]}

      if(sCategory == "symbol"){sSymbol = sValue}
      if(sCategory == "shortName"){sSection = sValue}
      if(sCategory == "regularMarketPrice"){sSectionValue = sValue;}

      if(sCategory == "regularMarketDayHigh"){sSectionHigh = sValue;}
      if(sCategory == "regularMarketDayLow"){sSectionLow = sValue;}
      if(sCategory == "regularMarketVolume"){sSectionVol = sValue;}
      if(sCategory == "regularMarketOpen"){sSectionOpen = sValue;}

      if(sCategory == "totalAssets"){sSectionTotalAssets = sValue;}
      if(sCategory == "fiftyTwoWeekHigh"){sSection52WeekHigh = sValue;}
      if(sCategory == "fiftyTwoWeekLow"){sSection52WeekLow = sValue;}
      if(sCategory == "ytdReturn"){sSectionYTDROR = sValue;}

      if(sCategory == "quoteType"){sQuoteType = sValue; }
      // console.log('quotes detail: ' + sCategory + '|' + sValue);	    
    }
  }
  if(sBuff3 != undefined){
    for (var i = 0; i < sBuff3.length; i++) {
      var sBuff4 = sBuff3[i].split(":")
      sCategory = ''
      sValue = ''

      if(sBuff4[0] != undefined){sCategory = sBuff4[0]}
      if(sBuff4[1] != undefined){sValue = sBuff4[1]}

      if(sCategory == "symbol"){sSymbol = sValue}
      if(sCategory == "shortName"){sSection = sValue}
      if(sCategory == "regularMarketPrice"){sSectionValue = sValue;}

      if(sCategory == "regularMarketDayHigh"){sSectionHigh = sValue;}
      if(sCategory == "regularMarketDayLow"){sSectionLow = sValue;}
      if(sCategory == "regularMarketVolume"){sSectionVol = sValue;}
      if(sCategory == "regularMarketOpen"){sSectionOpen = sValue;}

      if(sCategory == "totalAssets"){sSectionTotalAssets = sValue;}
      if(sCategory == "fiftyTwoWeekHigh"){sSection52WeekHigh = sValue;}
      if(sCategory == "fiftyTwoWeekLow"){sSection52WeekLow = sValue;}
      if(sCategory == "ytdReturn"){sSectionYTDROR = sValue;}

      if(sCategory == "quoteType"){sQuoteType = sValue; }
      // console.log('quotes detail: ' + sCategory + '|' + sValue);	    
    }
  } 
  if(sSymbol  != undefined){
    var sql = "delete from indexfact where indexid = '" + sSymbol + "'";
    db.executeStatement1(sql);
  
    if(sSectionHigh == undefined){sSectionHigh='null'}
    if(sSectionLow == undefined){sSectionLow='null'}
    if(sSectionVol == undefined){sSectionVol='null'}
    if(sSectionOpen == undefined){sSectionOpen='null'}

    //if(sSectionTotalAssets == undefined){sSectionTotalAssets='null'}
    if(sSection52WeekHigh == undefined){sSection52WeekHigh='null'}
    if(sSection52WeekLow == undefined){sSection52WeekLow='null'}
    if(sSectionYTDROR == undefined){sSectionYTDROR='null'}

    if(sQuoteType == 'MUTUALFUND'){
      sSectionVol = sSectionTotalAssets
      sSectionHigh = sSection52WeekHigh
      sSectionLow = sSection52WeekLow
      sSectionOpen = sSectionYTDROR
      
    }

    var tDate = Date.now();
    var sDateTime = getTimeStamp(tDate)    
    // addUserLogin(0,'Insert Quote: ' + sSymbol, null);
    //var sql = "insert into indexfact (indexid,indexdesc,quotetype,dtTimestamp,dValue,dHigh,dLow,dOpen,dVolume) values('"  + sSymbol + "','" + sSection  + "','" + sQuoteType + "', CONVERT (datetime, GETDATE())," + sSectionValue + "," + sSectionHigh + "," + sSectionLow + "," + sSectionOpen + "," + sSectionVol + ")";
    var sql = "insert into indexfact (indexid,indexdesc,quotetype,dtTimestamp,dValue,dHigh,dLow,dOpen,dVolume) values('"  + sSymbol + "','" + sSection  + "','" + sQuoteType + "','" + sDateTime + "'," + sSectionValue + "," + sSectionHigh + "," + sSectionLow + "," + sSectionOpen + "," + sSectionVol + ")";
    //var sql = "insert into indexfact (indexid,value,high,low,open,volume) values('<<section>>','<<section>>','" + sSectionHigh + "','" + sSectionLow + "','" + sSectionOpen + "','" + sSectionVol + "')";
    //sql = sql.replace('uuuu',buff1);
    db.executeStatement1(sql);
    //console.log('quotes sql: ' + sql);	    
    //db.executeStatement1(sql);
  }
  //console.log('quotes sql: ' + sql);	    
  //console.log('quotes detail: ' + sSection + ' : ' + sSectionValue + ' : ' + sSectionHigh + ' : ' + sSectionLow + ' : ' + sSectionOpen + ' : ' + sSectionVol);	    

 return sBuff2;
}

const getTimeStamp = (parSeconds) => {
  var date = new Date(parSeconds);  
  var offset = new Date().getTimezoneOffset();
  var easternTimeOffset = -240; 
  date.setMinutes ( date.getMinutes() + offset);
  date.setMinutes ( date.getMinutes() + easternTimeOffset);
  
  
  var sYear = date.getYear()+1900
  var iMonth = date.getMonth()+101
  var sMonth = iMonth.toString()
  var iDay = date.getDate()+100
  var sDay = iDay.toString()
  var iHour = date.getHours()+100
  var sHour = iHour.toString()
  var iMinutes = date.getMinutes()+100
  var sMinutes = iMinutes.toString()
  var iSeconds = date.getSeconds()+100
  var sSeconds = iSeconds.toString()

  var sDateStr = sYear + '-' + sMonth.substr(1,2) + '-' + sDay.substr(1,2) + 'T' + sHour.substr(1,2) + ':' + sMinutes.substr(1,2) + ':' + sSeconds.substr(1,2)
  return sDateStr;

}

const getCurrencyList = (res) => {
  var params = [];
  var buff;
  // var result;
  
  var sql = "select * from CurrencyList order by 1";
  //var sql = "select case when count(*) > 0 then 'Yes' else 'No' end  as AccountStatus from Logincontrol lc where lc.userid = 'Hacklehead'";

  db.buildParams(params, "number", TYPES.Int, 'parUID');
  db.queryx(sql, result => {
  
    buff = JSON.stringify(result);
    
    if(typeof buff !== "undefined") {
      console.log('output');
        return res.json({
        status: true,
        rows: buff
      });
    }
  });
    
  console.log('currency exit');
    
  return buff;
}

module.exports = {
  deleteLoan: deleteLoan,
  deleteLoan_socket: deleteLoan_socket,
  deleteLoan_vue: deleteLoan_vue,
  editLoan: editLoan,
  editLoan_socket: editLoan_socket,
  editLoan_vue: editLoan_vue,
  editProfile_socket: editProfile_socket,
  editProfile_vue: editProfile_vue,
  getCopyLoanStatus: getCopyLoanStatus,
  copyUserLoan: copyUserLoan,
  copyUserLoan_socket: copyUserLoan_socket,
  copyUserLoan_vue: copyUserLoan_vue,
  getLoginStatus: getLoginStatus,
  getLoginStatus_socket: getLoginStatus_socket,
  getLoginStatus_vue: getLoginStatus_vue,
  getUIDStatus_socket: getUIDStatus_socket,
  getUIDStatus_vue: getUIDStatus_vue,
  getUserData: getUserData,
  setLoginCount: setLoginCount,
  setupNewAccount: setupNewAccount,
  setupNewAccount_socket: setupNewAccount_socket,
  addNewAccount: addNewAccount,
  getLoans: getLoans,
  getUserLoans: getUserLoans,
  getUserLoans_socket: getUserLoans_socket,
  getUserProfile_socket: getUserProfile_socket,
  getUserLoans_vue: getUserLoans_vue,
  getUserProfile_vue: getUserProfile_vue,
  getNewLoanStatus: getNewLoanStatus,
  addUserLoan: addUserLoan,
  addUserLoan_socket: addUserLoan_socket,
  getIndexList: getIndexList,
  getTechnicalList: getTechnicalList,
  getCurrencyList: getCurrencyList,
  addUserLogin: addUserLogin,
  getIndexAll_vue: getIndexAll_vue,
  getIndexOne_vue: getIndexOne_vue,
  getLocalIndex: getLocalIndex,
  getLocalIndexList: getLocalIndexList,
  doIndex: doIndex,
  addIndex: addIndex,
  delIndex: delIndex,
  setRunTime: setRunTime,
  getRunTime: getRunTime,
  addUserLoan_vue: addUserLoan_vue
};