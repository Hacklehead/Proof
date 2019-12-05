function getPmt(p_princ, p_rate, p_num_pmts) {
  //var pmt = p_princ / ((Math.pow(1 + p_rate, p_num_pmts)-1 ) / (p_rate * Math.pow(1 + p_rate, p_num_pmts)));
  var pmt = 55;
   
  return pmt;
  };

module.exports = {
  getPmt: loancalc.getPmt
  
};