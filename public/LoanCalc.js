(function(exports){

    exports.getPmt = function(p_princ, p_rate, p_num_pmts){
        var pmt = p_princ / ((Math.pow(1 + p_rate, p_num_pmts)-1 ) / (p_rate * Math.pow(1 + p_rate, p_num_pmts)));

        return pmt
    };

    exports.getPrinc = function(p_pmt, p_rate, p_num_pmts){
        
        var princ = p_pmt * ((Math.pow(1 + p_rate, p_num_pmts)-1 ) / (p_rate * Math.pow(1 + p_rate, p_num_pmts)))

        return princ
    };
    
       exports.test = function(){
        return 'hello my world'
    };

    exports.doOutputLoan = function (parOutputSet,parNumPmts,parCurrBalance,parRate,parRatePer,parStartDate,parMethod,parPmtyear){
        var i,m;
        var numpmts = parNumPmts;
        
        while (parOutputSet.length) {
            parOutputSet.pop();
          }
        
        var currbalance=parCurrBalance;	
        var openbalance,calc_pmt,pmt,int,amort;

        var rate=parRate/100;
        var rateper=parRatePer;
        
        if(rateper == 'Monthly'){rate=rate/12;}
        if(rateper == 'Quarterly'){rate=rate/4;}
        
        var rateadj = 1;
        
        if(parPmtyear == 'Monthly'){rateadj = 12;}
        if(parPmtyear == 'Quarterly'){rateadj = 4;}
        rate=rate/rateadj;

        var dtStep = 1;
        if(parPmtyear == 'Annual'){dtStep = 12;}
        if(parPmtyear == 'Quarterly'){dtStep = 3;}
        
        //alert(dtStep);

        calc_pmt = mymodule.getPmt(currbalance,rate,numpmts);
        
        var buff, mm, dd, yyyy, sDateBuff;
        buff = parStartDate;
        
        var startdate = new Date(buff);
        //var origdate = startdate;
        
        for (i = 0; i < numpmts+1; i++) {
            
            mm=startdate.getMonth()+1;
            dd=startdate.getDate();
            yyyy=startdate.getFullYear();
            sDateBuff=mm+'/'+dd+'/'+yyyy;
        
            if(i == 0){
                    openbalance=0;	
                    pmt=0;
                    int=0;
                    amort=0;
                } 
        
            if(i >= 1){
                openbalance=currbalance;	
                calc_pmt = mymodule.getPmt(currbalance,rate,numpmts-(i-1));
                pmt=calc_pmt;
                int=openbalance*rate;
                amort=pmt-int;
                if(parMethod == 'Constant Amortization'){
                    amort=openbalance/(numpmts-(i-1));
                    pmt=int+amort;
                }

                if(parMethod == 'Interest Only'){
                    amort=0;
                    pmt=int+amort;
                    
                }

                if(parMethod == 'Balloon Payment'){
                    amort=int * (-1);
                    int=0;
                    pmt=0;
                }

                if(i == numpmts){
                    amort=openbalance;
                    pmt=parseFloat(int)+parseFloat(amort);
                }

                currbalance=(openbalance-amort).toFixed(4);
                } 
        
            parOutputSet.push([sDateBuff,openbalance,pmt,int,amort,currbalance]);
            //outputSet.push([sDateBuff,openbalance,pmt,int,amort,currbalance]);
        
            startdate.setMonth(startdate.getMonth() + dtStep);
            }
        }


})(typeof exports === 'undefined'? this['mymodule']={}: exports);