function dtr(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  function rtd(radians) {
    return radians * (180 / Math.PI);
  }
  
  function sqrt(n) {
    return Math.sqrt(n);
  }
  
  function power(base, exp) {
    return Math.pow(base, exp);
  }
  
  function log(n) {
    return Math.log(n);
  }
  
  module.exports = { dtr, rtd, sqrt, power, log };
  