/*
 * @Author: your name
 * @Date: 2021-05-10 16:08:33
 * @LastEditTime: 2021-05-11 10:03:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \central-system\src\utils\rsa.js
 */
import JSEncrypt from "jsencrypt/bin/jsencrypt";
let publicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCMbMBFpQ03F9hieogGtthehFlF7aCQR8KnUhfgyHp0DnnAwb586W5C/11zZnFqnK4jrUEnZTTLYndCJpfzrh0Bq475NDapAt3o9lpLsCjssJt16wBF5dPobylKL34IBb9FSJ+8QEdA0S6XlghvUn7Rs2vaPuYbIYRq+0tybydxTQIDAQAB";
let privateKey =
  "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIxswEWlDTcX2GJ6iAa22F6EWUXtoJBHwqdSF+DIenQOecDBvnzpbkL/XXNmcWqcriOtQSdlNMtid0Iml/OuHQGrjvk0NqkC3ej2WkuwKOywm3XrAEXl0+hvKUovfggFv0VIn7xAR0DRLpeWCG9SftGza9o+5hshhGr7S3JvJ3FNAgMBAAECgYAejxQQk+iaUrAeTjgH7gaMGxUqaJoGi/dKXk0f98DePMA2OHNxz4LVRalakbKg1tP2o5+IKTgiAp2dYbSzrPJWtN/FlUa4PcFEeNPK1Qthh5nuxotJfTEXAoypRg1PzIOX0IDU3U3s143T4jZq44mr5x1lD9I100F8pu2/WnT4gQJBAOKIrgI2ZOXkj/U8PH4wvl+mAvOwic2L56J65ynm0fw+GD6VYERI910da/gDKrpfWWRN/zMSCufXdCE5dNBbINECQQCesLyehSOdkz7Ck1l02Lj6juCPGASaeovPKgc2uglPMlWj0p5cOdd7RVezhN8I+y99lVOKEH0eS+3nxtkI8oe9AkBf+3l/Bn0JyyYTykn3Tb/b1wM5LXu106l5domrf1lJfyXWnoQDasckdOriUrUv8mZ10XZntSVZxjg2O5n7DiGBAkAuHiLS1tKA6tfkaDopMQqhFoDAVTSRSGf1Lrul9e7aq0AkOgN3vf+XfZF9RHIlBArLLmh2yU/zTBG5uBo+9WzpAkBBhaKkhokyojuVJKD32zecOwcteIap1Oy1g9oNh8xtdirmMj8uoPRkq1E+saauV7P2VhIukJgfID21Bxb6wINV";
export function rsaEncrypt(data) {
  let encryptor = new JSEncrypt(); // 新建JSEncrypt对象
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(data);
}
export function rsaDecrypt(data) {
  let decrypt = new JSEncrypt(); // 新建JSEncrypt对象
  decrypt.setPrivateKey(privateKey);
  return decrypt.decrypt(data);
}
