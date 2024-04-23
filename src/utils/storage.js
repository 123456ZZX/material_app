import { prefix } from '@/settings';

export default {
/**
 * @description: localStorage存储封装
 * @param {String} name
 * @param {String} value
 * @return: void
 */
  set: (name, value) => {
    localStorage.setItem(prefix + name, value);
  },

  /**
   * @description: localStorage获取封装
   * @param {String} name
   * @return: String
   */
  get: (name) => localStorage.getItem(prefix + name),

  /**
   * @description: 凤翎1.6版本localStorage存储封装
   * @param {String} name
   * @param {String} value
   * @return: void
   */
  set16: (name, value) => {
    localStorage.setItem(name, value);
  },

  /**
   * @description: 凤翎1.6版本localStorage获取封装
   * @param {String} name
   * @return: String
   */
  get16: (name) => localStorage.getItem(name),

  /**
   * @description: localStorage移除封装
   * @param {String} name
   * @param {String} value
   * @return: void
   */
  remove: (name, value) => {
    localStorage.removeItem(prefix + name, value);
  },

  /**
   * @description: localStorage清空封装
   * @param {String} name
   * @return: String
   */
  clear: () => {
    const len = localStorage.length;
    const keys = [];

    /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
    for (let i = 0; i < len; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }

    keys.map((key) => localStorage.removeItem(key));
  },
};
