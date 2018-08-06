module.exports = {
//  okapi: { 'url':'http://folio.k-int.com/okapi-gw', 'tenant':'diku' },
  okapi: { 'url':'http://localhost:9130', 'tenant':'diku' },
  config: {
//     autoLogin: { username: 'diku_admin', password: 'admin' },
//     logCategories: 'core,redux,connect,connect-fetch,substitute,path,mpath,mquery,action,event,perm,interface,xhr,erm',
     logCategories: 'erm',
     logPrefix: 'stripes',
//     logTimestamp: true,
//     showPerms: true,
//     listInvisiblePerms: true,
//     disableAuth: false
     hasAllPerms: true,
//     softLogout: false
  },
  modules: {
    '@folio/users': {},
    '@olf/erm-stripes': {}
  }
};
