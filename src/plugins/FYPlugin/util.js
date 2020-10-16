export function jumpToGJEPCLoginPage() {
  let baseurl = process.env.NODE_ENV === 'production' ? 'http://jhcdms.f3322.net:8098' : 'http://127.0.0.1:8000'
  let jumpUrl = `${ baseurl }/#/login`;
  
  console.log(jumpUrl)
  
  window.location.href = jumpUrl;
}
