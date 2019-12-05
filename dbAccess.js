var db = require("./dbController.js");
//var db2 = require("./dbController2.js");
var TYPES = require("tedious").TYPES;

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

const editProfile_vue = (number,userid,sparPWD,sparEMail,res) => {
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
  
  db.buildParams(params, "number", TYPES.Int, parUID);
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

  var sql = "select userid,email,password,AccountStatus from LoginControl where userid = 'xxxx'";
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
  addUserLoan_vue: addUserLoan_vue
};