interface GoogleKeys {
  clientID: string;
  clientSecret: string;
}
interface Keys {
  google: GoogleKeys;
}

const keys: Keys = {
  google: {
    clientID:
      '343654063563-o188120ns26n835285tdq1chb362p375.apps.googleusercontent.com',
    clientSecret: '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',
  },
};

export default keys;
