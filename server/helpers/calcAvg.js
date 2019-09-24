module.exports = function calcAvg(num1, num2) {
    const divider = num1 > num2 ? num1 : num2;
    const preResult = ((num1 - num2) / divider * 100).toFixed(2);
    let str = String(preResult);
    let result = '';
    for (i = 0; i < str.length; i++) {
      if (str[i] == '.') {
        if (str[i + 2] == 0) {
          if (str[i + 1] == 0) {
              result = str.slice(0, -3)
          } else {
              result = str.slice(0, -1)
          }
        } else {
            result = str;
        }
      }
    }
    return +result;
}