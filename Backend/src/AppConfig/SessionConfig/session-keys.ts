// types
interface sessionKey {
  cookieEncryptionKey: string;
}

interface Keys {
  session: sessionKey;
}
const sessoinkeys: Keys = {
  session: {
    cookieEncryptionKey:
      '0587a3e664aef0841e9cf1f602ad74c56e2816265a662d63962d13c4f755708f70a35fa827c2a108c3a7f3d5cdabe1700a694512af8084e3e72fe56c1c70ff61',
  },
};

export default sessoinkeys;
